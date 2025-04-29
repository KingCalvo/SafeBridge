import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { IoIosAddCircleOutline, IoIosFlashOff } from "react-icons/io";
import { FaRegEdit, FaCheck } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { GoAlert } from "react-icons/go";
import { supabase } from "../../supabase/client";
import Modal from "../../components/Modal";

const EventosOpe = () => {
  const [eventos, setEventos] = useState([]);
  const [puentes, setPuentes] = useState([]);
  const [nivelesRiesgo, setNivelesRiesgo] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNivel, setFilterNivel] = useState("");
  const [alertas, setAlertas] = useState([]);
  const [filtroRiesgoAlerta, setFiltroRiesgoAlerta] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEvento, setEditingEvento] = useState(null);
  const [formData, setFormData] = useState({
    id_puente: "",
    descripcion: "",
    fecha_hora: "",
    ubicacion: "",
    id_nivel_riesgo: "",
  });

  useEffect(() => {
    fetchEventos();
    fetchPuentes();
    fetchNivelesRiesgo();
    fetchAlertas();
  }, []);

  const fetchEventos = async () => {
    const { data, error } = await supabase
      .from("eventos_desbordamiento")
      .select(
        `
        id_evento,
        id_puente,
        id_nivel_riesgo,
        fecha_hora,
        descripcion,
        catalogo_puentes ( nombre, ubicacion ),
        catalogo_niveles_riesgo ( status )
      `
      )
      .order("id_evento", { ascending: true });

    if (!error) setEventos(data || []);
  };
  const fetchAlertas = async () => {
    const { data, error } = await supabase.from("alertas").select(`
      id_alertas,
      tipo_alerta,
      fecha_hora,
      status,
      id_puente,
      eventos_desbordamiento ( descripcion ),
      catalogo_puentes ( ubicacion )
    `);

    if (!error) setAlertas(data || []);
    else console.error("Error cargando alertas:", error);
  };

  // Armo un map { Alto: algúnId, Bajo: algúnId }
  const statusMap = useMemo(() => {
    const m = {};
    nivelesRiesgo.forEach((n) => {
      if (!m[n.status]) m[n.status] = n.id_nivel;
    });
    return m;
  }, [nivelesRiesgo]);

  // Función que genera solo dos <option>
  const renderStatusOptions = () => {
    if (!editingEvento) {
      return ["Alto", "Bajo"].map((st) => (
        <option key={st} value={statusMap[st]}>
          {st}
        </option>
      ));
    }

    const actualId = formData.id_nivel_riesgo;
    const actualStatus = nivelesRiesgo.find(
      (n) => n.id_nivel === actualId
    )?.status;
    const contrario = actualStatus === "Alto" ? "Bajo" : "Alto";

    return [
      // opción actual: *usamos su mismo id*
      <option key={actualId} value={actualId}>
        {actualStatus}
      </option>,
      // opción opuesta
      <option key={contrario} value={statusMap[contrario]}>
        {contrario}
      </option>,
    ];
  };

  const fetchPuentes = async () => {
    const { data, error } = await supabase
      .from("catalogo_puentes")
      .select("id_puente, nombre, ubicacion");
    if (!error) setPuentes(data || []);
  };

  const fetchNivelesRiesgo = async () => {
    const { data, error } = await supabase
      .from("catalogo_niveles_riesgo")
      .select("id_nivel, status");

    if (!error) setNivelesRiesgo(data || []);
  };

  const openAddModal = () => {
    setEditingEvento(null);
    setFormData({
      id_puente: "",
      descripcion: "",
      fecha_hora: "",
      ubicacion: "",
      id_nivel_riesgo: "",
    });
    setShowModal(true);
  };

  const openEditModal = (evento) => {
    const fechaFormateada = evento.fecha_hora
      ? new Date(evento.fecha_hora).toISOString().slice(0, 16)
      : "";

    setEditingEvento(evento.id_evento);
    setFormData({
      id_puente: evento.id_puente,
      descripcion: evento.descripcion,
      fecha_hora: fechaFormateada,
      ubicacion: evento.catalogo_puentes?.ubicacion || "",
      id_nivel_riesgo: evento.id_nivel_riesgo || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleModalSubmit = async () => {
    const payload = {
      id_puente: formData.id_puente,
      descripcion: formData.descripcion,
      fecha_hora: formData.fecha_hora,
      id_nivel_riesgo: Number(formData.id_nivel_riesgo),
    };

    if (editingEvento) {
      await supabase
        .from("eventos_desbordamiento")
        .update(payload)
        .eq("id_evento", editingEvento);
    } else {
      await supabase.from("eventos_desbordamiento").insert([payload]);
    }

    fetchEventos();
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este evento?")) return;
    await supabase.from("eventos_desbordamiento").delete().eq("id_evento", id);
    fetchEventos();
  };

  const filteredEventos = eventos
    .filter((e) => {
      const search = searchTerm.toLowerCase();
      return (
        (e.catalogo_puentes?.nombre || "").toLowerCase().includes(search) ||
        (e.catalogo_puentes?.ubicacion || "").toLowerCase().includes(search) ||
        (e.descripcion || "").toLowerCase().includes(search)
      );
    })
    .filter((e) =>
      filterNivel ? e.catalogo_niveles_riesgo?.status === filterNivel : true
    );

  const desactivarAlerta = async (id) => {
    const { error } = await supabase
      .from("alertas")
      .update({ status: "Inactiva" })
      .eq("id_alertas", id);

    if (!error) fetchAlertas();
  };

  return (
    <div className="flex">
      <Sidebar userRole={2} />
      <div className="ml-64 flex-1">
        <main className="p-8 bg-gray-50">
          {/* Título */}
          <h1 className="text-3xl font-bold uppercase text-gray-800 mb-6 text-center">
            Alertas y Eventos
          </h1>

          {/* Buscador */}
          <div className="flex justify-center mb-8">
            <div className="relative w-96">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <IoSearch />
              </span>
              <input
                type="text"
                placeholder="Buscar evento, ubicación, puente o tipo de alerta..."
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 mb-6">
            {/* Título */}
            <h2 className="text-2xl font-bold text-center text-gray-800 uppercase">
              Eventos de desbordamiento
            </h2>
            {/* Filtro */}
            <div className="relative">
              <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
              <select
                className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
                value={filterNivel}
                onChange={(e) => setFilterNivel(e.target.value)}
              >
                <option value="">Todos los riesgos</option>
                <option value="Alto">Alto</option>
                <option value="Bajo">Bajo</option>
              </select>
            </div>

            {/* Botón Agregar */}
            <button
              onClick={openAddModal}
              className="flex items-center space-x-2 px-4 font-bold py-2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer"
            >
              <IoIosAddCircleOutline className="text-2xl font-bold" />
              <span>Agregar Evento</span>
            </button>
          </div>

          {/* Tabla */}
          <div className="overflow-auto max-h-[400px] bg-white rounded-lg shadow">
            {filteredEventos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay eventos registrados.
              </div>
            ) : (
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
                      Ubicación
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase">
                      Nivel de Riesgo
                    </th>
                    <th className="px-4 py-2 text-center text-xs uppercase ">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEventos.map((e) => (
                    <tr key={e.id_evento}>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {e.descripcion}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {e.catalogo_puentes?.nombre || "—"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {e.fecha_hora}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {e.catalogo_puentes?.ubicacion || "—"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-white text-xs font-bold ${
                            e.catalogo_niveles_riesgo?.status === "Alto"
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        >
                          {e.catalogo_niveles_riesgo?.status === "Alto" ? (
                            <GoAlert className="mr-1" />
                          ) : (
                            <FaCheck className="mr-1" />
                          )}
                          {e.catalogo_niveles_riesgo?.status || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => openEditModal(e)}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition cursor-pointer"
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(e.id_evento)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-500 transition cursor-pointer"
                        >
                          <FaDeleteLeft />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/*TABLA DE ALERTAS */}
          <div className="flex items-center justify-center space-x-4 mt-12 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 uppercase">
              Alertas
            </h2>
            <div className="relative">
              <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
              <select
                className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
                value={filtroRiesgoAlerta}
                onChange={(e) => setFiltroRiesgoAlerta(e.target.value)}
              >
                <option value="">Todos los Status</option>
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            </div>
          </div>
          <div className="overflow-auto max-h-[400px] bg-white rounded-lg shadow">
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
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {alertas
                  .filter((a) =>
                    a.tipo_alerta
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .filter((a) =>
                    filtroRiesgoAlerta ? a.status === filtroRiesgoAlerta : true
                  )

                  .map((a) => (
                    <tr key={a.id_alertas}>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {a.id_alertas}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {a.eventos_desbordamiento?.descripcion || "—"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {a.catalogo_puentes?.ubicacion || "—"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {a.fecha_hora}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {a.tipo_alerta}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-xs font-bold ${
                            a.status === "Activa"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {a.status === "Activa" && (
                          <button
                            onClick={() => desactivarAlerta(a.id_alertas)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
                          >
                            <IoIosFlashOff />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {showModal && (
            <Modal onClose={closeModal} onSubmit={handleModalSubmit}>
              <h2 className="text-xl font-bold text-center mb-4">
                {editingEvento ? "Editar Evento" : "Agregar Evento"}
              </h2>
              <div className="space-y-4">
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
                  <option value="">Selecciona Puente</option>
                  {puentes.map((p) => (
                    <option key={p.id_puente} value={p.id_puente}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Descripción del evento"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                />
                {/* Fecha y Hora */}
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.fecha_hora}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_hora: e.target.value })
                  }
                />

                {/* Nivel de Riesgo */}
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.id_nivel_riesgo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id_nivel_riesgo: Number(e.target.value),
                    })
                  }
                >
                  <option value="">Selecciona Nivel de Riesgo</option>
                  {renderStatusOptions()}
                </select>
              </div>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
};

export default EventosOpe;
