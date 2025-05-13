import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { FaRegEdit, FaFileMedical } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { supabase } from "../../supabase/client";
import Modal from "../../components/Modal";
import { GoAlert } from "react-icons/go";
import { FaCheck, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import ModalInfo from "../../components/ModalInfo";
import { useNotificacion } from "../../components/NotificacionContext";
import { useAlerta } from "../../components/AlertaContext";

import {} from "react-icons/fa";
const ConfiguracionAdm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [puentes, setPuentes] = useState([]);
  const [filterPuenteStatus, setFilterPuenteStatus] = useState("");
  const [niveles, setNiveles] = useState([]);
  const [filterNivelTipo, setFilterNivelTipo] = useState("");
  const [sensores, setSensores] = useState([]);
  const [filterSensorStatus, setFilterSensorStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingTipo, setEditingTipo] = useState("");
  const navigate = useNavigate();
  const [addingTipo, setAddingTipo] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState({ status: "", info: "" });
  const { confirmar } = useAlerta();
  const { notify } = useNotificacion();

  useEffect(() => {
    fetchPuentes();
    fetchNiveles();
    fetchSensores();
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

  const fetchSensores = async () => {
    const { data, error } = await supabase
      .from("sensores")
      .select(
        `
      id_sensor,
      id_tipo_sensor,
      status,
      id_puente,
      catalogo_sensores ( nombre, tipo, marca, modelo, info ),
      catalogo_puentes ( nombre, ubicacion )
    `
      )
      .order("id_sensor", { ascending: true });
    if (error) console.error(error);
    else setSensores(data);
  };

  // Handlers modal
  const openEditModal = (item, tipo) => {
    setEditingItem({
      ...item,
      id_tipo_sensor: item.id_tipo_sensor,
    });
    setEditingTipo(tipo);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const openAddModal = (tipo) => {
    setAddingTipo(tipo);
    if (tipo === "puente") {
      setEditingItem({ nombre: "", ubicacion: "", info: "", status: "Activo" });
    } else if (tipo === "nivel") {
      setEditingItem({
        nombre: "",
        descripcion: "",
        tipo_riesgo: "",
        status: "Alto",
      });
    } else if (tipo === "sensor") {
      setEditingItem({
        catalogo_sensores: {
          nombre: "",
          tipo: "",
          marca: "",
          modelo: "",
          info: "",
        },
        id_puente: "",
        catalogo_puentes: { ubicacion: "" },
        status: "Activo",
      });
    }
    setShowModal(true);
  };

  const saveChanges = async () => {
    try {
      //AGREGAR PUENTE
      if (addingTipo === "puente") {
        const lastId = puentes[puentes.length - 1]?.id_puente || 0;
        const nuevoPuente = {
          id_puente: lastId + 1,
          nombre: editingItem.nombre,
          ubicacion: editingItem.ubicacion,
          info: editingItem.info,
          status: editingItem.status,
        };
        const { error: errP } = await supabase
          .from("catalogo_puentes")
          .insert([nuevoPuente]);
        if (errP) throw errP;
        await fetchPuentes();
        notify("Puente agregado correctamente.", { type: "success" });
      }

      //AGREGAR NIVEL
      else if (addingTipo === "nivel") {
        const lastId = niveles[niveles.length - 1]?.id_nivel || 0;
        const nuevoNivel = {
          id_nivel: lastId + 1,
          nombre: editingItem.nombre,
          descripcion: editingItem.descripcion,
          tipo_riesgo: editingItem.tipo_riesgo,
          status: editingItem.status,
        };
        const { error: errN } = await supabase
          .from("catalogo_niveles_riesgo")
          .insert([nuevoNivel]);
        if (errN) throw errN;
        await fetchNiveles();
        notify("Nivel de riesgo editado correctamente.", { type: "success" });
      }

      //AGREGAR SENSOR
      else if (addingTipo === "sensor") {
        const { data: lastCat, error: errLastCat } = await supabase
          .from("catalogo_sensores")
          .select("id_sensor")
          .order("id_sensor", { ascending: false })
          .limit(1)
          .single();
        if (errLastCat) throw errLastCat;
        const nextCatId = (lastCat?.id_sensor || 0) + 1;

        const { nombre, tipo, marca, modelo, info } =
          editingItem.catalogo_sensores;
        const { error: errCatInsert } = await supabase
          .from("catalogo_sensores")
          .insert([
            { id_sensor: nextCatId, nombre, tipo, marca, modelo, info },
          ]);
        if (errCatInsert) throw errCatInsert;

        const { data: lastSens, error: errLastSens } = await supabase
          .from("sensores")
          .select("id_sensor")
          .order("id_sensor", { ascending: false })
          .limit(1)
          .single();
        if (errLastSens) throw errLastSens;
        const nextSensId = (lastSens?.id_sensor || 0) + 1;

        const { error: errSensInsert } = await supabase
          .from("sensores")
          .insert([
            {
              id_sensor: nextSensId,
              id_puente: editingItem.id_puente,
              status: editingItem.status,
              id_tipo_sensor: nextCatId,
            },
          ]);
        if (errSensInsert) throw errSensInsert;

        await fetchSensores();
        notify("Sensor agregado correctamente.", { type: "success" });
      }

      //EDITAR PUENTE
      else if (editingTipo === "puente") {
        const { id_puente, nombre, ubicacion, info, status } = editingItem;
        const { error } = await supabase
          .from("catalogo_puentes")
          .update({ nombre, ubicacion, info, status })
          .eq("id_puente", id_puente);
        if (error) throw error;
        await fetchPuentes();
        notify("Puente editado correctamente.", { type: "success" });
      }

      //EDITAR NIVEL
      else if (editingTipo === "nivel") {
        const { id_nivel, nombre, descripcion, tipo_riesgo, status } =
          editingItem;
        const { error } = await supabase
          .from("catalogo_niveles_riesgo")
          .update({ nombre, descripcion, tipo_riesgo, status })
          .eq("id_nivel", id_nivel);
        if (error) throw error;
        await fetchNiveles();
        notify("Nivel de riesgo editado correctamente.", { type: "success" });
      }

      //EDITAR SENSOR
      else if (editingTipo === "sensor") {
        const {
          catalogo_sensores,
          id_sensor,
          id_puente,
          status,
          id_tipo_sensor,
        } = editingItem;

        const { error: errCatUpd } = await supabase
          .from("catalogo_sensores")
          .update({
            nombre: catalogo_sensores.nombre,
            tipo: catalogo_sensores.tipo,
            marca: catalogo_sensores.marca,
            modelo: catalogo_sensores.modelo,
            info: catalogo_sensores.info,
          })
          .eq("id_sensor", id_tipo_sensor);
        if (errCatUpd) throw errCatUpd;

        const { error: errSensUpd } = await supabase
          .from("sensores")
          .update({ id_puente, status })
          .eq("id_sensor", id_sensor);
        if (errSensUpd) throw errSensUpd;

        await fetchSensores();
        notify("Sensor editado correctamente.", { type: "success" });
      }
    } catch (err) {
      console.error("Error en saveChanges:", err);
    } finally {
      setAddingTipo("");
      setEditingTipo("");
      closeModal();
    }
  };

  const handleDelete = async (id, tipo) => {
    const ok = await confirmar(`el ${tipo} con ID ${id}`);
    if (!ok) {
      notify("Operación cancelada.", { type: "success" });
      return;
    }

    try {
      if (tipo === "puente") {
        await supabase.from("informes").delete().eq("id_puente", id);

        const { data: eventos } = await supabase
          .from("eventos_desbordamiento")
          .select("id_evento")
          .eq("id_puente", id);
        for (let ev of eventos) {
          await supabase.from("alertas").delete().eq("id_evento", ev.id_evento);
        }
        await supabase
          .from("eventos_desbordamiento")
          .delete()
          .eq("id_puente", id);

        const { data: sensList } = await supabase
          .from("sensores")
          .select("id_sensor")
          .eq("id_puente", id);
        for (let s of sensList) {
          await supabase
            .from("catalogo_estaciones")
            .delete()
            .eq("id_sensor", s.id_sensor);
        }
        await supabase.from("sensores").delete().eq("id_puente", id);
        await supabase.from("catalogo_puentes").delete().eq("id_puente", id);
        fetchPuentes();
        notify("Puente eliminado correctamente.", { type: "success" });
      } else if (tipo === "sensor") {
        // --- ELIMINACIÓN PARA SENSORES ---
        const { data: rec, error: errFetch } = await supabase
          .from("sensores")
          .select("id_tipo_sensor")
          .eq("id_sensor", id)
          .single();
        if (errFetch) throw errFetch;

        const { error: errDelSens } = await supabase
          .from("sensores")
          .delete()
          .eq("id_sensor", id);
        if (errDelSens) throw errDelSens;

        const { error: errDelCat } = await supabase
          .from("catalogo_sensores")
          .delete()
          .eq("id_sensor", rec.id_tipo_sensor);
        if (errDelCat) throw errDelCat;

        await fetchSensores();
        notify("Sensor eliminado correctamente.", { type: "success" });
      } else if (tipo === "nivel") {
        const { data: eventos } = await supabase
          .from("eventos_desbordamiento")
          .select("id_evento")
          .eq("id_nivel_riesgo", id);
        for (let ev of eventos) {
          await supabase.from("alertas").delete().eq("id_evento", ev.id_evento);
        }
        await supabase
          .from("eventos_desbordamiento")
          .delete()
          .eq("id_nivel_riesgo", id);
        await supabase
          .from("catalogo_niveles_riesgo")
          .delete()
          .eq("id_nivel", id);
        fetchNiveles();
        notify("Nivel eliminado correctamente.", { type: "success" });
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      notify("Error al eliminar: " + error.message, { type: "error" });
    }
  };

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

  const filteredSensores = sensores
    .filter((s) =>
      searchTerm
        ? s.catalogo_sensores.nombre
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true
    )
    .filter((s) =>
      filterSensorStatus ? s.status === filterSensorStatus : true
    );

  const handleInfo = (sensor) => {
    setSelectedInfo({
      status: sensor.status,
      info: sensor.catalogo_sensores?.info || "Sin información",
    });
    setShowInfoModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={1} />
      <div className="ml-64 flex-1">
        <main className="p-8 bg-gray-50">
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
            <button
              onClick={() => openAddModal("puente")}
              className="flex items-center font-bold space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
            >
              <IoIosAddCircleOutline className="text-2xl" />
              <span>Agregar</span>
            </button>
            <button
              onClick={() => navigate("/reportesPuentesPDF")}
              className="flex items-center space-x-2 px-4 font-bold py-2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer"
            >
              <FaFileMedical className="text-2xl font-bold" />
              <span>GENERAR REPORTE</span>
            </button>
          </div>
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
                      {p.info}
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
            <button
              onClick={() => openAddModal("nivel")}
              className="flex items-center space-x-1 font-bold px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
            >
              <IoIosAddCircleOutline className="text-2xl" />
              <span>Agregar</span>
            </button>
          </div>
          <div className="overflow-auto max-h-[300px] bg-white rounded-lg shadow">
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
                    <td className="px-4 py-2 text-sm text-gray-700 text-justify">
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

          {/* Sección Sensores */}
          <div className="flex items-center justify-center space-x-4 mb-4 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">SENSORES</h2>
            <div className="relative">
              <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
              <select
                className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 appearance-none"
                value={filterSensorStatus}
                onChange={(e) => setFilterSensorStatus(e.target.value)}
              >
                <option value="">Todos los status</option>
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </div>
            <button
              onClick={() => openAddModal("sensor")}
              className="flex items-center space-x-1 font-bold px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
            >
              <IoIosAddCircleOutline className="text-2xl" />
              <span>Agregar</span>
            </button>
          </div>
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
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSensores.map((s) => (
                  <tr key={s.id_sensor}>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {s.id_sensor}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {s.catalogo_sensores.nombre}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {s.catalogo_sensores.tipo}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {s.catalogo_sensores.marca}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {s.catalogo_puentes.nombre}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {s.catalogo_sensores.modelo}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {s.catalogo_puentes.ubicacion}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center flex items-center justify-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-white ${
                          s.status === "Activo" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {s.status}
                      </span>
                      <button
                        onClick={() => handleInfo(s)}
                        className="inline-flex items-center px-2 py-1 bg-[#ffc340] rounded-lg hover:bg-[#ff9800] transition cursor-pointer"
                      >
                        <FaInfoCircle className="mr-1" /> Info
                      </button>
                    </td>
                    <td className="px-2 py-2 text-center space-x-2">
                      <button
                        onClick={() => openEditModal(s, "sensor")}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition cursor-pointer"
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id_sensor, "sensor")}
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
          {showModal && editingItem && (
            <Modal onClose={closeModal} onSubmit={saveChanges}>
              <h2 className="text-xl font-bold mb-4 text-center">
                {addingTipo === "puente" && "Agregar Puente"}
                {addingTipo === "nivel" && "Agregar Nivel"}
                {addingTipo === "sensor" && "Agregar Sensor"}
                {!addingTipo && editingTipo === "puente" && "Editar Puente"}
                {!addingTipo && editingTipo === "nivel" && "Editar Nivel"}
                {!addingTipo && editingTipo === "sensor" && "Editar Sensor"}
              </h2>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {/* PUENTE */}
                {(addingTipo === "puente" || editingTipo === "puente") && (
                  <>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={editingItem.nombre}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          nombre: e.target.value,
                        })
                      }
                    />

                    <label className="block text-sm font-medium text-gray-700">
                      Ubicación
                    </label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={editingItem.ubicacion}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          ubicacion: e.target.value,
                        })
                      }
                    />

                    <label className="block text-sm font-medium text-gray-700">
                      Información
                    </label>
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      value={editingItem.info}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, info: e.target.value })
                      }
                    />

                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
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

                {/* NIVEL */}
                {(addingTipo === "nivel" || editingTipo === "nivel") && (
                  <>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={editingItem.nombre}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          nombre: e.target.value,
                        })
                      }
                    />

                    <label className="block text-sm font-medium text-gray-700">
                      Descripción
                    </label>
                    <textarea
                      className="w-full border rounded px-3 py-2"
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
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={editingItem.tipo_riesgo}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          tipo_riesgo: e.target.value,
                        })
                      }
                    >
                      <option value="">Selecciona tipo</option>
                      {tiposRiesgo.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>

                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={editingItem.status}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          status: e.target.value,
                        })
                      }
                    >
                      <option>Alto</option>
                      <option>Bajo</option>
                    </select>
                  </>
                )}

                {/* SENSOR */}
                {(addingTipo === "sensor" || editingTipo === "sensor") && (
                  <>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={editingItem.catalogo_sensores.nombre}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          catalogo_sensores: {
                            ...editingItem.catalogo_sensores,
                            nombre: e.target.value,
                          },
                        })
                      }
                    />

                    <label className="block text-sm font-medium text-gray-700">
                      Tipo
                    </label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={editingItem.catalogo_sensores.tipo}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          catalogo_sensores: {
                            ...editingItem.catalogo_sensores,
                            tipo: e.target.value,
                          },
                        })
                      }
                    />

                    <label className="block text-sm font-medium text-gray-700">
                      Marca
                    </label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={editingItem.catalogo_sensores.marca}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          catalogo_sensores: {
                            ...editingItem.catalogo_sensores,
                            marca: e.target.value,
                          },
                        })
                      }
                    />

                    <label className="block text-sm font-medium text-gray-700">
                      Puente Asociado
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={editingItem.id_puente}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
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

                    <label className="block text-sm font-medium text-gray-700">
                      Modelo
                    </label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={editingItem.catalogo_sensores.modelo}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          catalogo_sensores: {
                            ...editingItem.catalogo_sensores,
                            modelo: e.target.value,
                          },
                        })
                      }
                    />

                    <label className="block text-sm font-medium text-gray-700">
                      Ubicación
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={editingItem.catalogo_puentes.ubicacion}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          catalogo_puentes: {
                            ...editingItem.catalogo_puentes,
                            ubicacion: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="">Selecciona Ubicación</option>
                      {puentes.map((p) => (
                        <option key={p.id_puente}>{p.ubicacion}</option>
                      ))}
                    </select>

                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
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
                    </select>
                    <label className="block text-sm font-medium text-gray-700">
                      Información del status
                    </label>
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      value={editingItem.catalogo_sensores?.info || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          catalogo_sensores: {
                            ...editingItem.catalogo_sensores,
                            info: e.target.value,
                          },
                        })
                      }
                    />
                  </>
                )}
              </div>
            </Modal>
          )}
          {showInfoModal && (
            <ModalInfo onClose={() => setShowInfoModal(false)}>
              <h2 className="text-xl font-bold mb-4 text-center">
                Información del status
              </h2>
              <div className="space-y-4">
                <p>
                  <strong>Status:</strong> {selectedInfo.status}
                </p>
                <p>
                  <strong>Información:</strong> {selectedInfo.info}
                </p>
              </div>
            </ModalInfo>
          )}
        </main>
      </div>
    </div>
  );
};

export default ConfiguracionAdm;
