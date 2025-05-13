import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { FaFileMedical } from "react-icons/fa";
import { supabase } from "../../supabase/client";
import { GoAlert } from "react-icons/go";
import { FaCheck } from "react-icons/fa";
import Modal from "../../components/Modal";
import { FaRegEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { useNotificacion } from "../../components/NotificacionContext";
import { useAlerta } from "../../components/AlertaContext";

const ReportesOpe = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [puentes, setPuentes] = useState([]);
  const [informes, setInformes] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [nivelRiesgoFilter, setNivelRiesgoFilter] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingInforme, setEditingInforme] = useState(null);
  const [estaciones, setEstaciones] = useState([]);
  const [formData, setFormData] = useState({
    id_puente: "",
    id_estaciones: "",
    fecha_hora: "",
    descripcion: "",
  });
  const { confirmar } = useAlerta();
  const { notify } = useNotificacion();

  useEffect(() => {
    fetchPuentes();
    fetchInformes();
    fetchEstaciones();
    fetchInformes();
  }, []);

  const fetchPuentes = async () => {
    // Traer puentes
    const { data: puentesData, error: errorPuentes } = await supabase
      .from("catalogo_puentes")
      .select("*")
      .order("id_puente", { ascending: true });

    // Traer estaciones
    const { data: estacionesData, error: errorEstaciones } = await supabase
      .from("catalogo_estaciones")
      .select("id_puente, nombre");

    if (errorPuentes || errorEstaciones) {
      console.error("Error en fetchPuentes:", errorPuentes || errorEstaciones);
      return;
    }

    // Unir datos manualmente
    const puentesConEstaciones = puentesData.map((puente) => {
      const estacion = estacionesData.find(
        (e) => e.id_puente === puente.id_puente
      );
      return {
        ...puente,
        estacion_nombre: estacion ? estacion.nombre : "Sin estación",
      };
    });

    setPuentes(puentesConEstaciones);
  };

  const fetchInformes = async () => {
    const { data, error } = await supabase
      .from("informes")
      .select(
        `
        id_Informes,
        id_puente,
        id_estaciones,
        fecha_hora,
        descripcion,
        catalogo_estaciones (nombre),
        catalogo_puentes (nombre, ubicacion, status),
        eventos_desbordamiento (
          catalogo_niveles_riesgo (status)
        )
      `
      )
      .order("id_Informes", { ascending: true });

    if (error) console.error(error);
    else setInformes(data);
  };

  const fetchEstaciones = async () => {
    const { data, error } = await supabase
      .from("catalogo_estaciones")
      .select("id_estaciones, nombre")
      .order("id_estaciones", { ascending: true });

    if (error) {
      console.error("Error al traer estaciones:", error);
    } else {
      setEstaciones(data);
    }
  };

  const handleGenerarReporte = (idPuente) => {
    // Sólo guardamos el ID puente y navegamos
    localStorage.setItem("id_puente", idPuente);
    navigate("/reportePDF");
  };

  const filteredPuentes = puentes
    .filter((p) =>
      searchTerm
        ? p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .filter((p) => (statusFilter ? p.status === statusFilter : true));

  const filteredInformes = informes
    .filter((i) =>
      searchTerm
        ? (i.catalogo_puentes?.nombre || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (i.catalogo_puentes?.status || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (i.catalogo_puentes?.ubicacion || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (i.fecha_hora || "").toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .filter((i) =>
      nivelRiesgoFilter
        ? i.eventos_desbordamiento?.catalogo_niveles_riesgo?.status ===
          nivelRiesgoFilter
        : true
    );

  const openEditModal = (informe) => {
    const fechaFormateada = informe.fecha_hora
      ? new Date(informe.fecha_hora).toISOString().slice(0, 16)
      : "";

    setEditingInforme(informe.id_Informes);
    setFormData({
      id_puente: informe.id_puente,
      id_estaciones: informe.id_estaciones,
      fecha_hora: fechaFormateada,
      descripcion: informe.descripcion || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleModalSubmit = async () => {
    try {
      const payload = {
        id_puente: formData.id_puente,
        id_estaciones: formData.id_estaciones,
        fecha_hora: formData.fecha_hora,
        descripcion: formData.descripcion,
      };

      const { error } = await supabase
        .from("informes")
        .update(payload)
        .eq("id_Informes", editingInforme);

      if (error) throw error;

      notify("Reporte actualizado con éxito.", { type: "success" });
      fetchInformes();
      setShowModal(false);
    } catch (err) {
      console.error("Error actualizando informe:", err);
      notify("Error al actualizar reporte: " + err.message, { type: "error" });
    }
  };

  const handleDeleteInforme = async (idInforme) => {
    const ok = await confirmar(`el informe con ID ${idInforme}`);
    if (!ok) {
      notify("Operación cancelada.", { type: "success" });
      return;
    }

    const { error } = await supabase
      .from("informes")
      .delete()
      .eq("id_Informes", idInforme);

    if (error) {
      console.error("Error al eliminar informe:", error);
      notify("Error al eliminar reporte: " + error.message, { type: "error" });
    } else {
      notify("Reporte eliminado con éxito.", { type: "success" });
      fetchInformes();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={2} />
      <div className="ml-64 flex-1">
        <main className="p-8 bg-gray-50">
          {/* Titulo principal */}
          <h1 className="text-3xl font-bold uppercase text-gray-800 mb-6 text-center">
            Generar reportes
          </h1>

          {/* Buscador */}
          <div className="flex justify-center mb-8">
            <div className="relative w-96">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <IoSearch />
              </span>
              <input
                type="text"
                placeholder="Buscar Puente, Status, Ubicación o Fecha..."
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tabla Puentes */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 uppercase">
              Puentes
            </h2>
            <div className="relative">
              <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
              <select
                className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos los status</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Reparación">Reparación</option>
              </select>
            </div>
          </div>

          <div className="overflow-auto bg-white rounded-lg shadow mb-8 max-h-[300px]">
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
                    Estación
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Status
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Generar Reporte
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPuentes.map((puente) => (
                  <tr key={puente.id_puente}>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {puente.id_puente}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {puente.nombre}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-7002 text-center">
                      {puente.ubicacion}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {puente.estacion_nombre}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-white font-bold text-xs ${
                          puente.status === "Activo"
                            ? "bg-green-500"
                            : puente.status === "Inactivo"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {puente.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleGenerarReporte(puente.id_puente)}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition cursor-pointer"
                      >
                        <FaFileMedical />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tabla Reportes */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 uppercase">
              Reportes
            </h2>
            <div className="relative">
              <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
              <div className="relative">
                <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
                <select
                  className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
                  value={nivelRiesgoFilter}
                  onChange={(e) => setNivelRiesgoFilter(e.target.value)}
                >
                  <option value="">Todos los riesgos</option>
                  <option value="Alto">Alto</option>
                  <option value="Bajo">Bajo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-auto bg-white rounded-lg shadow max-h-[300px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    ID
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Puente
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Ubicación
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Estación
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Tipo de Riesgo
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Fecha y Hora
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Descripción
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInformes.map((info) => (
                  <tr key={info.id_Informes}>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {info.id_Informes}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {info.catalogo_puentes?.nombre}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {info.catalogo_puentes?.ubicacion}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {info.catalogo_estaciones?.nombre}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {info.eventos_desbordamiento?.catalogo_niveles_riesgo
                        ?.status === "Alto" ? (
                        <span className="flex items-center justify-center gap-1 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-xs">
                          <GoAlert /> Alto
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1 bg-green-500 text-white font-bold px-3 py-1 rounded-full text-xs">
                          <FaCheck /> Bajo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {info.fecha_hora}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {info.descripcion}
                    </td>
                    <td className="px-2 py-2 text-center space-x-2">
                      <button
                        onClick={() => openEditModal(info)}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition cursor-pointer"
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteInforme(info.id_Informes)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-500 transition cursor-pointer"
                      >
                        <FaDeleteLeft />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showModal && (
            <Modal onClose={closeModal} onSubmit={handleModalSubmit}>
              <h2 className="text-xl font-bold text-center mb-4">
                Editar Reporte
              </h2>
              <div className="space-y-4">
                {/* Puente */}
                <label className="block text-sm font-medium text-gray-700">
                  Puente
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.id_puente}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id_puente: Number(e.target.value),
                    })
                  }
                >
                  <option value="">-- Selecciona un puente --</option>
                  {puentes.map((p) => (
                    <option key={p.id_puente} value={p.id_puente}>
                      {p.nombre}
                    </option>
                  ))}
                </select>

                {/* Estación */}
                <label className="block text-sm font-medium text-gray-700">
                  Estación
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.id_estaciones}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id_estaciones: Number(e.target.value),
                    })
                  }
                >
                  <option value="">-- Selecciona una estación --</option>
                  {estaciones.map((e) => (
                    <option key={e.id_estaciones} value={e.id_estaciones}>
                      {e.nombre}
                    </option>
                  ))}
                </select>

                {/* Fecha y hora */}
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.fecha_hora}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_hora: e.target.value })
                  }
                />

                {/* Descripción */}
                <textarea
                  placeholder="Descripción"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                />
              </div>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReportesOpe;
