import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FaFileDownload, FaSave } from "react-icons/fa";
import { supabase } from "../../supabase/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import { IoMdReturnLeft } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ReportePDF = () => {
  const [sensores, setSensores] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [puenteInfo, setPuenteInfo] = useState(null);
  const navigate = useNavigate();
  const idPuenteSeleccionado = localStorage.getItem("id_puente");
  const [idInforme, setIdInforme] = useState(null);
  const [idEstacion, setIdEstacion] = useState(null);
  const [idSensor, setIdSensor] = useState(null);
  const [idEvento, setIdEvento] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const fechaActual = dayjs().format("YYYY-MM-DD HH:mm:ss");

  useEffect(() => {
    const inicializar = async () => {
      // Obtener último id_Informes
      const { data: ultimo } = await supabase
        .from("informes")
        .select("id_Informes")
        .order("id_Informes", { ascending: false })
        .limit(1)
        .single();

      const nuevoId = (ultimo?.id_Informes || 0) + 1;
      setIdInforme(nuevoId);

      await fetchDatos(); //datos actuales
    };

    inicializar();
  }, []);

  const fetchDatos = async () => {
    const { data: puenteData } = await supabase
      .from("catalogo_puentes")
      .select("*")
      .eq("id_puente", idPuenteSeleccionado)
      .single();
    setPuenteInfo(puenteData);

    const { data: sensoresData } = await supabase
      .from("sensores")
      .select(
        `
        id_sensor,
        status,
        id_puente,
        catalogo_sensores (nombre, tipo, marca, modelo),
        catalogo_puentes (nombre, ubicacion)
      `
      )
      .eq("id_puente", idPuenteSeleccionado);
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
      .eq("id_puente", idPuenteSeleccionado);
    setAlertas(alertasData || []);

    const { data: eventosData } = await supabase
      .from("eventos_desbordamiento")
      .select(
        `
        id_evento,
        id_puente,
        fecha_hora,
        descripcion,
        catalogo_niveles_riesgo (status)
      `
      )
      .eq("id_puente", idPuenteSeleccionado);
    setEventos(eventosData || []);

    const { data: estData } = await supabase
      .from("catalogo_estaciones")
      .select("id_estaciones")
      .eq("id_puente", idPuenteSeleccionado)
      .single();
    setIdEstacion(estData?.id_estaciones || null);
    setIdSensor(sensoresData[0]?.id_sensor ?? null);
    setIdEvento(eventosData[0]?.id_evento ?? null);
  };

  const sensoresActivos = sensores.filter(
    (s) => s.catalogo_sensores?.status === "Activo"
  ).length;

  const statusAlerta =
    alertas.length > 0 ? alertas[0]?.status : "Sin alertas registradas";

  const nivelRiesgo =
    eventos.length > 0
      ? eventos[0]?.catalogo_niveles_riesgo?.status
      : "Sin eventos registrados";

  const handleGuardarInforme = async () => {
    const { error } = await supabase.from("informes").insert([
      {
        id_Informes: idInforme, // <--- usar el nuevo ID calculado
        id_puente: Number(idPuenteSeleccionado),
        id_estaciones: Number(idEstacion),
        id_sensor: Number(idSensor),
        id_evento: Number(idEvento),
        fecha_hora: fechaActual,
        descripcion: descripcion,
      },
    ]);

    if (error) {
      console.error("Error guardando informe:", error);
      alert("Error al guardar el informe.");
    } else {
      alert("Informe guardado correctamente.");
    }
  };

  const handleDescargar = async () => {
    await supabase
      .from("informes")
      .update({ descripcion, fecha_hora: fechaActual })
      .eq("id_Informes", idInforme);

    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(20);
    doc.text(`REPORTE ${idInforme}`, pageWidth / 2, 40, { align: "center" });
    doc.setFontSize(12);
    doc.text(dayjs().format("DD/MM/YYYY HH:mm"), pageWidth - 40, 45, {
      align: "right",
    });

    let y = 70;

    doc.setFontSize(14);
    doc.text(`Puente: ${puenteInfo?.nombre || "No disponible"}`, 40, y);
    y += 20;
    doc.setFontSize(12);
    doc.text(`Número de sensores activos: ${sensoresActivos}`, 40, y);
    doc.text(
      `Estación de atención: ${puenteInfo?.nombre || "Sin estación"}`,
      300,
      y
    );
    y += 20;
    doc.text(`Número de alertas emitidas: ${alertas.length}`, 40, y);
    doc.text(`Status de alerta: ${statusAlerta}`, 300, y);
    y += 20;
    doc.text(`Número de eventos de desbordamiento: ${eventos.length}`, 40, y);
    doc.text(`Nivel de riesgo: ${nivelRiesgo}`, 300, y);
    y += 30;

    const tableStyles = {
      margin: { left: 40, right: 40 },
      tableWidth: pageWidth - 80,
      styles: {
        fontSize: 8,
        cellPadding: 5,
        valign: "middle",
        halign: "center",
        textColor: [40, 40, 40],
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    };

    // SENSORES
    doc.setFontSize(14);
    doc.text("SENSORES", pageWidth / 2, y, { align: "center" });
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
      ...tableStyles,
    });
    y = doc.lastAutoTable.finalY + 30;

    // ALERTAS
    doc.setFontSize(14);
    doc.text("ALERTAS", pageWidth / 2, y, { align: "center" });
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
        a.eventos_desbordamiento?.descripcion || "N/A",
        a.catalogo_puentes?.ubicacion || "N/A",
        a.fecha_hora,
        a.tipo_alerta,
        a.status,
      ]),
      ...tableStyles,
    });
    y = doc.lastAutoTable.finalY + 30;

    // EVENTOS
    doc.setFontSize(14);
    doc.text("EVENTOS DE DESBORDAMIENTO", pageWidth / 2, y, {
      align: "center",
    });
    y += 20;
    autoTable(doc, {
      startY: y,
      head: [["Evento", "ID Puente", "Fecha y Hora", "Nivel de Riesgo"]],
      body: eventos.map((e) => [
        e.descripcion,
        e.id_puente,
        e.fecha_hora,
        e.catalogo_niveles_riesgo?.status || "N/A",
      ]),
      ...tableStyles,
    });
    y = doc.lastAutoTable.finalY + 30;

    doc.setFontSize(14);
    doc.text("Descripción del Reporte:", 40, y);
    y += 20;
    doc.setFontSize(12);
    doc.text(descripcion || "Sin descripción agregada.", 40, y, {
      maxWidth: pageWidth - 80,
    });

    doc.save(`REPORTE_${idInforme}.pdf`);
    localStorage.removeItem("id_informe");
    localStorage.removeItem("id_puente");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={2} />
      <div className="ml-64 flex-1">
        <main className="p-8 py-8 bg-gray-100 flex-1  flex justify-center items-start">
          <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-5xl space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold uppercase text-center mb-8">
                REPORTE {idInforme}
              </h1>
              <p className="text-sm text-gray-500">
                {dayjs().format("DD/MM/YYYY HH:mm")}
              </p>
            </div>

            {/* Información General */}
            {puenteInfo && (
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Puente:</strong> {puenteInfo.nombre}
                </p>
                <p>
                  <strong>Número de sensores activos:</strong>{" "}
                  {sensores.filter((s) => s.status === "Activo").length}
                </p>
                <p>
                  <strong>Estación de atención:</strong>{" "}
                  {sensores[0]?.catalogo_puentes?.nombre || "Sin estación"}
                </p>
                <p>
                  <strong>Número de alertas emitidas:</strong> {alertas.length}
                </p>
                <p>
                  <strong>Status de la alerta:</strong>{" "}
                  {alertas[0]?.status || "N/A"}
                </p>
                <p>
                  <strong>Número de eventos de desbordamiento:</strong>{" "}
                  {eventos.length}
                </p>
                <p>
                  <strong>Nivel de riesgo:</strong>{" "}
                  {eventos[0]?.catalogo_niveles_riesgo?.status || "N/A"}
                </p>
              </div>
            )}

            {/* Tabla Sensores */}
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              SENSORES
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white text-sm text-gray-70">
                <thead className="bg-[#2C2B2B] text-white sticky top-0">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Marca</th>
                    <th>Puente</th>
                    <th>Modelo</th>
                    <th>Ubicación</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sensores.map((s) => (
                    <tr key={s.id_sensor} className="divide-y divide-gray-200">
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

            {/* Tabla Alertas */}
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              ALERTAS
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white text-sm text-gray-70">
                <thead className="bg-[#2C2B2B] text-white sticky top-0">
                  <tr>
                    <th>ID</th>
                    <th>Eventos</th>
                    <th>Ubicación</th>
                    <th>Fecha y Hora</th>
                    <th>Tipo de Alerta</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {alertas.map((a) => (
                    <tr key={a.id_alertas} className="divide-y divide-gray-200">
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

            {/* Tabla Eventos */}
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              EVENTOS DE DESBORDAMIENTO
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white text-sm text-gray-70">
                <thead className="bg-[#2C2B2B] text-white sticky top-0">
                  <tr>
                    <th>Evento</th>
                    <th>ID Puente</th>
                    <th>Fecha y Hora</th>
                    <th>Nivel de Riesgo</th>
                  </tr>
                </thead>
                <tbody>
                  {eventos.map((e) => (
                    <tr key={e.id_evento} className="divide-y divide-gray-200">
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {e.descripcion}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {e.id_puente}
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

            {/* Agregar Descripción */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
                Agregar Descripción
              </h2>
              <div className="flex justify-center">
                <textarea
                  className="w-full border p-4 mt-8 rounded-lg"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Escribe aquí la descripción del reporte..."
                />
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-center gap-4">
              {/* Botón Regresar */}
              <button
                onClick={() => navigate("/reportesOpe")}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
              >
                <IoMdReturnLeft /> REGRESAR
              </button>
              {/* Botón de guardar */}
              <button
                onClick={handleGuardarInforme}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                <FaSave />
                GUARDAR
              </button>

              {/* Botón Descargar */}
              <button
                onClick={handleDescargar}
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

export default ReportePDF;
