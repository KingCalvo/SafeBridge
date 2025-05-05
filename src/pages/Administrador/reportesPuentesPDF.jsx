import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { FaFileDownload } from "react-icons/fa";
import { IoMdReturnLeft } from "react-icons/io";
import { supabase } from "../../supabase/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

const ReportesPuentesPDF = () => {
  const [puentes, setPuentes] = useState([]);
  const [sensores, setSensores] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const { data: puentesData } = await supabase
      .from("catalogo_puentes")
      .select("*");
    setPuentes(puentesData || []);

    const { data: sensoresData } = await supabase
      .from("sensores")
      .select(
        `
        id_sensor,
        status,
        catalogo_sensores (nombre, tipo, marca, modelo),
        catalogo_puentes (nombre, ubicacion)
      `
      )
      .order("id_sensor", { ascending: true });
    setSensores(sensoresData || []);

    const { data: alertasData } = await supabase
      .from("alertas")
      .select(
        `
        id_alertas,
        tipo_alerta,
        fecha_hora,
        status,
        eventos_desbordamiento (descripcion),
        catalogo_puentes (ubicacion)
      `
      )
      .order("id_alertas", { ascending: true });
    setAlertas(alertasData || []);

    const { data: eventosData } = await supabase.from("eventos_desbordamiento")
      .select(`
        descripcion,
        catalogo_puentes ( nombre ),
        fecha_hora,
        catalogo_niveles_riesgo (status)
      `);
    setEventos(eventosData || []);
  };

  const handleDescargarPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");

    // Título principal y fecha
    doc.setFontSize(20);
    doc.text("REPORTE DE TODOS LOS PUENTES", 40, 40);
    doc.setFontSize(12);
    doc.text(dayjs().format("DD/MM/YYYY HH:mm"), 450, 45);
    let y = 70;

    // — PUENTES —
    doc.setFontSize(16);
    doc.text("PUENTES", 40, y);
    y += 20;
    autoTable(doc, {
      startY: y,
      head: [["ID", "Nombre", "Ubicación", "Información", "Status"]],
      body: puentes.map((p) => [
        p.id_puente,
        p.nombre,
        p.ubicacion,
        p.info,
        p.status,
      ]),
      styles: { fontSize: 8, halign: "center", cellPadding: 5 },
      headStyles: { fillColor: [44, 43, 43], textColor: [255, 255, 255] },
    });
    y = doc.lastAutoTable.finalY + 30;

    // — SENSORES —
    doc.setFontSize(16);
    doc.text("SENSORES", 40, y);
    y += 20;
    autoTable(doc, {
      startY: y,
      head: [
        [
          "ID",
          "Nombre",
          "Tipo",
          "Marca",
          "Puente",
          "Modelo",
          "Ubicación",
          "Status",
        ],
      ],
      body: sensores.map((s) => [
        s.id_sensor,
        s.catalogo_sensores?.nombre,
        s.catalogo_sensores?.tipo,
        s.catalogo_sensores?.marca,
        s.catalogo_puentes?.nombre,
        s.catalogo_sensores?.modelo,
        s.catalogo_puentes?.ubicacion,
        s.status,
      ]),
      styles: { fontSize: 8, halign: "center", cellPadding: 5 },
      headStyles: { fillColor: [44, 43, 43], textColor: [255, 255, 255] },
    });
    y = doc.lastAutoTable.finalY + 30;

    // — ALERTAS —
    doc.setFontSize(16);
    doc.text("ALERTAS", 40, y);
    y += 20;
    autoTable(doc, {
      startY: y,
      head: [
        [
          "ID",
          "Eventos",
          "Ubicación",
          "Fecha y Hora",
          "Tipo de Alerta",
          "Status",
        ],
      ],
      body: alertas.map((a) => [
        a.id_alertas,
        a.eventos_desbordamiento?.descripcion,
        a.catalogo_puentes?.ubicacion,
        a.fecha_hora,
        a.tipo_alerta,
        a.status,
      ]),
      styles: { fontSize: 8, halign: "center", cellPadding: 5 },
      headStyles: { fillColor: [44, 43, 43], textColor: [255, 255, 255] },
    });
    y = doc.lastAutoTable.finalY + 30;

    // — EVENTOS DE DESBORDAMIENTO —
    doc.setFontSize(16);
    doc.text("EVENTOS DE DESBORDAMIENTO", 40, y);
    y += 20;
    autoTable(doc, {
      startY: y,
      head: [["Evento", "Puente", "Fecha y Hora", "Nivel de Riesgo"]],
      body: eventos.map((e) => [
        e.descripcion,
        e.catalogo_puentes?.nombre,
        e.fecha_hora,
        e.catalogo_niveles_riesgo?.status,
      ]),
      styles: { fontSize: 8, halign: "center", cellPadding: 5 },
      headStyles: { fillColor: [44, 43, 43], textColor: [255, 255, 255] },
    });

    // Guardar PDF
    doc.save("REPORTE_PUENTES.pdf");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={1} />
      <div className="ml-64 flex-1">
        <main className="p-8 bg-gray-100 flex justify-center items-start">
          <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-5xl space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold uppercase text-gray-800">
                REPORTE DE TODOS LOS PUENTES
              </h1>
              <p className="text-sm text-gray-500">
                {dayjs().format("DD/MM/YYYY HH:mm")}
              </p>
            </div>

            {/* Puentes */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              PUENTES
            </h2>
            <div className="overflow-auto max-h-[300px] bg-white rounded-lg shadow mb-8">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      ID
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Nombre
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Ubicación
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Información
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {puentes.map((p) => (
                    <tr key={p.id_puente}>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {p.id_puente}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {p.nombre}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {p.ubicacion}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {p.info}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {p.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sensores */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              SENSORES
            </h2>
            <div className="overflow-auto max-h-[300px] bg-white rounded-lg shadow mb-8">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      ID
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Nombre
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Tipo
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Marca
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Puente
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Modelo
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Ubicación
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sensores.map((s) => (
                    <tr key={s.id_sensor}>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {s.id_sensor}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {s.catalogo_sensores?.nombre}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {s.catalogo_sensores?.tipo}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {s.catalogo_sensores?.marca}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {s.catalogo_puentes?.nombre}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {s.catalogo_sensores?.modelo}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {s.catalogo_puentes?.ubicacion}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {s.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Alertas */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              ALERTAS
            </h2>
            <div className="overflow-auto max-h-[300px] bg-white rounded-lg shadow mb-8">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      ID
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Eventos
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Ubicación
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Fecha y Hora
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Tipo de Alerta
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {alertas.map((a) => (
                    <tr key={a.id_alertas}>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {a.id_alertas}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {a.eventos_desbordamiento?.descripcion}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {a.catalogo_puentes?.ubicacion}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {a.fecha_hora}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {a.tipo_alerta}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {a.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Eventos de Desbordamiento */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              EVENTOS DE DESBORDAMIENTO
            </h2>
            <div className="overflow-auto max-h-[300px] bg-white rounded-lg shadow mb-8">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Evento
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Puente
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Fecha y Hora
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Nivel de Riesgo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {eventos.map((e, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {e.descripcion}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {e.catalogo_puentes?.nombre}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {e.fecha_hora}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {e.catalogo_niveles_riesgo?.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Botones Regresar y Descargar */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => navigate("/configuracionAdm")}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
              >
                <IoMdReturnLeft /> REGRESAR
              </button>
              <button
                onClick={handleDescargarPDF}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
              >
                <FaFileDownload /> DESCARGAR
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportesPuentesPDF;
