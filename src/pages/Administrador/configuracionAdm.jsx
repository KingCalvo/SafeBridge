import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SidebarAdmin";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { supabase } from "../../supabase/client";
import Modal from "../../components/Modal";
import { GoAlert } from "react-icons/go";
import { FaCheck } from "react-icons/fa";

const ConfiguracionAdm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [puentes, setPuentes] = useState([]);
  const [filterPuenteStatus, setFilterPuenteStatus] = useState("");
  const [niveles, setNiveles] = useState([]);
  const [filterNivelTipo, setFilterNivelTipo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingTipo, setEditingTipo] = useState("");

  useEffect(() => {
    fetchPuentes();
    fetchNiveles();
  }, []);

  const fetchPuentes = async () => {
    const { data, error } = await supabase
      .from("catalogo_puentes")
      .select("*")
      .order("id_puente", { ascending: true });
    if (error) console.error(error);
    else setPuentes(data);
  };

  // Fetch Niveles
  const fetchNiveles = async () => {
    const { data, error } = await supabase
      .from("catalogo_niveles_riesgo")
      .select("*")
      .order("id_nivel", { ascending: true });
    if (error) console.error(error);
    else setNiveles(data);
  };

  // Handlers modal
  const openEditModal = (item, tipo) => {
    setEditingItem({ ...item });
    setEditingTipo(tipo);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const saveChanges = async () => {
    if (editingTipo === "puente") {
      const { id_puente, nombre, ubicacion, estado, status } = editingItem;
      const { error } = await supabase
        .from("catalogo_puentes")
        .update({ nombre, ubicacion, estado, status })
        .eq("id_puente", id_puente);
      if (error) console.error(error);
      else fetchPuentes();
    } else {
      const { id_nivel, nombre, descripcion, tipo_riesgo, status } =
        editingItem;
      const { error } = await supabase
        .from("catalogo_niveles_riesgo")
        .update({ nombre, descripcion, tipo_riesgo, status })
        .eq("id_nivel", id_nivel);
      if (error) console.error(error);
      else fetchNiveles();
    }
    closeModal();
  };

  const handleDelete = async (id, tipo) => {
    if (!window.confirm("¿Seguro que quieres eliminar?")) return;
    if (tipo === "puente") {
      const { error } = await supabase
        .from("catalogo_puentes")
        .delete()
        .eq("id_puente", id);
      if (error) console.error(error);
      else fetchPuentes();
    } else {
      const { error } = await supabase
        .from("catalogo_niveles_riesgo")
        .delete()
        .eq("id_nivel", id);
      if (error) console.error(error);
      else fetchNiveles();
    }
  };

  // Filtros combinados
  const filteredPuentes = puentes
    .filter((p) =>
      searchTerm
        ? p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .filter((p) =>
      filterPuenteStatus ? p.status === filterPuenteStatus : true
    );

  const tiposRiesgo = [...new Set(niveles.map((n) => n.tipo_riesgo))];
  const filteredNiveles = niveles
    .filter((n) =>
      searchTerm
        ? n.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.tipo_riesgo.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .filter((n) =>
      filterNivelTipo ? n.tipo_riesgo === filterNivelTipo : true
    );

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          CONFIGURACIÓN
        </h1>
        {/* Buscador */}
        <div className="flex justify-center mb-8">
          <div className="relative w-96">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <IoSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar nombre, tipo de riesgo o ubicación..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla Puentes */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">PUENTES</h2>
          <div className="relative">
            <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
            <select
              className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
              value={filterPuenteStatus}
              onChange={(e) => setFilterPuenteStatus(e.target.value)}
            >
              <option value="">Todos los status</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Reparación">Reparación</option>
            </select>
          </div>
        </div>
        <div className="overflow-auto max-h-[300px] bg-white rounded-lg shadow mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-center text-xs uppercase">ID</th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Nombre
                </th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Ubicación
                </th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Estado
                </th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPuentes.map((p) => (
                <tr key={p.id_puente}>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {p.id_puente}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {p.nombre}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {p.ubicacion}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    <span className="px-3 py-1 rounded-full text-black">
                      {p.estado ? "Abierto" : "Cerrado"}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white font-bold ${
                        p.status === "Activo"
                          ? "bg-green-500"
                          : p.status === "Inactivo"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => openEditModal(p, "puente")}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition cursor-pointer"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id_puente, "puente")}
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

        {/* Sección Niveles de Riesgo */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            NIVELES DE RIESGO
          </h2>
          <div className="relative">
            <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
            <select
              className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
              value={filterNivelTipo}
              onChange={(e) => setFilterNivelTipo(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              {tiposRiesgo.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-auto max-h-[300px] bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-center text-xs uppercase">ID</th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Nombre
                </th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Descripción
                </th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Tipo de Riesgo
                </th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredNiveles.map((n) => (
                <tr key={n.id_nivel}>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {n.id_nivel}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {n.nombre}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {n.descripcion}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {n.tipo_riesgo}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-white text-xs font-bold ${
                        n.status === "Alto" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {n.status === "Alto" ? (
                        <GoAlert className="mr-1" />
                      ) : (
                        <FaCheck className="mr-1" />
                      )}
                      {n.status || "—"}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => openEditModal(n, "nivel")}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition cursor-pointer"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(n.id_nivel, "nivel")}
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

        {/* Modal de edición */}
        {showModal && editingItem && (
          <Modal onClose={closeModal} onSubmit={saveChanges}>
            <h2 className="text-xl font-bold mb-4 text-center">
              {editingTipo === "puente" ? "Editar Puente" : "Editar Nivel"}
            </h2>
            <div className="space-y-4">
              {editingTipo === "puente" ? (
                <>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={editingItem.nombre}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, nombre: e.target.value })
                    }
                  />
                  <label className="block text-sm font-medium text-gray-700">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={editingItem.ubicacion}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        ubicacion: e.target.value,
                      })
                    }
                  />
                  <label className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={editingItem.estado ? "true" : "false"}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        estado: e.target.value === "true",
                      })
                    }
                  >
                    <option value="true">Abierto</option>
                    <option value="false">Cerrado</option>
                  </select>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={editingItem.status}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        status: e.target.value,
                      })
                    }
                  >
                    <option>Activo</option>
                    <option>Inactivo</option>
                    <option>Reparación</option>
                  </select>
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={editingItem.nombre}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, nombre: e.target.value })
                    }
                  />
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={editingItem.descripcion}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        descripcion: e.target.value,
                      })
                    }
                  />
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo de Riesgo
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={editingItem.tipo_riesgo}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        tipo_riesgo: e.target.value,
                      })
                    }
                  />
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={editingItem.status}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        status: e.target.value,
                      })
                    }
                  >
                    <option>Activo</option>
                    <option>Inactivo</option>
                    <option>Reparación</option>
                  </select>
                </>
              )}
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
};

export default ConfiguracionAdm;
