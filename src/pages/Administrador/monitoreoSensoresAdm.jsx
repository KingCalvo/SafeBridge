import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SidebarAdmin";
import { HiOutlineSignal } from "react-icons/hi2";
import { FaRegEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { supabase } from "../../supabase/client";
import Modal from "../../components/Modal";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";

const MonitoreoSensoresAdm = () => {
  const [estaciones, setEstaciones] = useState([]);
  const [puentes, setPuentes] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEstacion, setEditingEstacion] = useState(null);
  const [sensorInfo, setSensorInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStation, setFilterStation] = useState("");

  useEffect(() => {
    fetchEstaciones();
    fetchPuentes();
  }, []);

  const fetchEstaciones = async () => {
    const { data, error } = await supabase.from("catalogo_estaciones").select(`
      id_estaciones,
      nombre,
      tipo_estacion,
      ubicacion,
      id_puente,
      id_sensor,
      catalogo_puentes ( nombre ),
      sensores ( status )
    `);
    if (error) console.error("Error al cargar estaciones:", error);
    else setEstaciones(data);
  };

  const fetchPuentes = async () => {
    const { data, error } = await supabase
      .from("catalogo_puentes")
      .select("id_puente, nombre");
    if (error) console.error("Error al cargar puentes:", error);
    else setPuentes(data);
  };

  const handleEdit = (est) => {
    setEditingEstacion({ ...est });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta estación?")) return;
    const { error } = await supabase
      .from("catalogo_estaciones")
      .delete()
      .eq("id_estaciones", id);
    if (error) console.error("Error borrando:", error);
    else fetchEstaciones();
  };

  const handleInfo = async (est) => {
    // Obtener sensores ligados al puente de la estación
    const { data: sensoresPuente, error: errorSensores } = await supabase
      .from("sensores")
      .select("id_sensor")
      .eq("id_puente", est.id_puente)
      .limit(1);
    if (errorSensores) {
      console.error("Error al cargar sensores:", errorSensores);
      setSensorInfo(null);
      return;
    }
    if (!sensoresPuente.length) {
      setSensorInfo([]);
      return;
    }
    const sensorId = sensoresPuente[0].id_sensor;
    const { data: detalle, error: errorDetalle } = await supabase
      .from("catalogo_sensores")
      .select("id_sensor, nombre, tipo, descripcion, marca, modelo")
      .eq("id_sensor", sensorId)
      .single();
    if (errorDetalle) {
      console.error("Error al cargar detalle de sensor:", errorDetalle);
      setSensorInfo(null);
    } else {
      setSensorInfo(detalle);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingEstacion(null);
  };

  const saveChanges = async () => {
    const { id_estaciones, nombre, tipo_estacion, ubicacion, id_puente } =
      editingEstacion;
    const { error } = await supabase
      .from("catalogo_estaciones")
      .update({ nombre, tipo_estacion, ubicacion, id_puente })
      .eq("id_estaciones", id_estaciones);
    if (error) console.error("Error guardando:", error);
    else {
      closeEditModal();
      fetchEstaciones();
    }
  };

  const filteredEstaciones = estaciones
    .filter((est) => (filterStation ? est.nombre === filterStation : true))
    .filter((est) =>
      searchTerm
        ? est.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        {/* Título */}
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-3xl font-bold uppercase text-gray-800 mr-2">
            Estaciones
          </h1>
          <HiOutlineSignal className="text-3xl text-gray-800" />
        </div>
        <div className="flex items-center justify-center space-x-4 mb-6">
          {/* Buscador */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <IoSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar Estación"
              className="w-64 border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtro */}
          <div className="relative w-64">
            <CiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
            <select
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
              value={filterStation}
              onChange={(e) => setFilterStation(e.target.value)}
            >
              <option value="">Todos</option>
              {filteredEstaciones.map((est) => (
                <option key={est.id_estaciones} value={est.nombre}>
                  {est.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Tabla de estaciones*/}
        <div className="overflow-auto h-[60vh] bg-white rounded-lg shadow mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2C2B2B] text-white sticky top-0">
              <tr>
                <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                  ID
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                  Puente
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                  Ubicación
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                  Nombre
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                  Tipo
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                  Sensor
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEstaciones.map((est) => (
                <tr key={est.id_estaciones}>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {est.id_estaciones}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {est.catalogo_puentes?.nombre || "Sin asignar"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {est.ubicacion}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {est.nombre}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {est.tipo_estacion}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleInfo(est)}
                      className="inline-flex items-center px-2 py-1 bg-[#ffc340] rounded-lg hover:bg-[#ff9800] transition cursor-pointer"
                    >
                      <FaRegEdit className="mr-1" /> Info
                    </button>
                  </td>
                  <td className="px-4 py-2 text-sm text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white font-bold ${
                        est.sensores?.status === "Activo"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {est.sensores?.status || "Desconocido"}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(est)}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition cursor-pointer"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(est.id_estaciones)}
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

        {/* Tabla de Información de sensor*/}
        {sensorInfo && (
          <div className="overflow-auto w-full max-w-md mx-auto p-4">
            <h2 className="text-xl font-bold mb-4 text-center">
              Información del sensor
            </h2>
            <table className="w-full table-fixed border-collapse border border-gray-500">
              <tbody>
                {Object.entries(sensorInfo).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <td className="w-1/3 font-semibold text-gray-800 uppercase py-2 px-2 border-r border-gray-500 text-center">
                      {key.replace("_", " ")}
                    </td>
                    <td className="w-2/3 text-gray-800 py-2 px-2 text-center">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de edición */}
        {showEditModal && editingEstacion && (
          <Modal onClose={closeEditModal} onSubmit={saveChanges}>
            <h2 className="text-xl font-bold mb-4 text-center">
              EDITAR ESTACIÓN
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={editingEstacion.nombre}
                  onChange={(e) =>
                    setEditingEstacion({
                      ...editingEstacion,
                      nombre: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Estación
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={editingEstacion.tipo_estacion}
                  onChange={(e) =>
                    setEditingEstacion({
                      ...editingEstacion,
                      tipo_estacion: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ubicación
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={editingEstacion.ubicacion}
                  onChange={(e) =>
                    setEditingEstacion({
                      ...editingEstacion,
                      ubicacion: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Puente asociado
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={editingEstacion.id_puente}
                  onChange={(e) =>
                    setEditingEstacion({
                      ...editingEstacion,
                      id_puente: Number(e.target.value),
                    })
                  }
                >
                  <option value="">Selecciona Puente</option>
                  {puentes.map((p) => (
                    <option key={p.id_puente} value={p.id_puente}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
};

export default MonitoreoSensoresAdm;
