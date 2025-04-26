import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SidebarAdmin";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { supabase } from "../../supabase/client";
import Toggle from "../../components/Toggle";

const AlertasEventosAdm = () => {
  const [alertas, setAlertas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoAlertaFilter, setTipoAlertaFilter] = useState("");
  const [nivelRiesgoFilter, setNivelRiesgoFilter] = useState("");

  useEffect(() => {
    fetchAlertas();
    fetchEventos();
  }, []);

  const fetchAlertas = async () => {
    const { data, error } = await supabase
      .from("alertas")
      .select(
        `
      id_alertas,
      fecha_hora,
      tipo_alerta,
      status,
      id_puente,
      eventos_desbordamiento (
        descripcion
      ),
      catalogo_puentes (
        ubicacion
      )
    `
      )
      .order("id_alertas", { ascending: true });
    if (error) console.error("Error cargando alertas:", error);
    else setAlertas(data);
  };

  const fetchEventos = async () => {
    const { data, error } = await supabase.from("eventos_desbordamiento")
      .select(`
      id_evento,
      id_puente,
      fecha_hora,
      descripcion,
      catalogo_niveles_riesgo (
        nombre
      )
    `);

    if (error) console.error("Error cargando eventos:", error);
    else setEventos(data);
  };

  const handleToggle = async (id, currentStatus) => {
    const nuevoStatus = currentStatus === "Activa" ? "Inactiva" : "Activa";

    setAlertas((prevAlertas) =>
      prevAlertas.map((alerta) =>
        alerta.id_alertas === id ? { ...alerta, status: nuevoStatus } : alerta
      )
    );

    const { error } = await supabase
      .from("alertas")
      .update({ status: nuevoStatus })
      .eq("id_alertas", id);

    if (error) {
      console.error("Error actualizando status:", error);
    }
  };

  const filteredAlertas = alertas
    .filter((a) => {
      if (!searchTerm) return true;
      const lowerSearch = searchTerm.toLowerCase();
      return (
        (a.eventos_desbordamiento?.descripcion || "")
          .toLowerCase()
          .includes(lowerSearch) ||
        (a.tipo_alerta || "").toLowerCase().includes(lowerSearch) ||
        (a.catalogo_puentes?.ubicacion || "")
          .toLowerCase()
          .includes(lowerSearch)
      );
    })
    .filter((a) =>
      tipoAlertaFilter ? a.tipo_alerta === tipoAlertaFilter : true
    );

  const filteredEventos = eventos
    .filter((e) => {
      if (!searchTerm) return true;
      const lowerSearch = searchTerm.toLowerCase();
      return (
        (e.descripcion || "").toLowerCase().includes(lowerSearch) ||
        (e.catalogo_niveles_riesgo?.nombre || "")
          .toLowerCase()
          .includes(lowerSearch)
      );
    })
    .filter((e) =>
      nivelRiesgoFilter
        ? e.catalogo_niveles_riesgo?.nombre === nivelRiesgoFilter
        : true
    );

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Historial de Alertas
        </h1>

        {/* Buscador y Filtros */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <IoSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar por evento, tipo de alerta o ubicación..."
              className="w-96 border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Alertas
          </h2>
          <div className="relative">
            <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
            <select
              className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
              value={tipoAlertaFilter}
              onChange={(e) => setTipoAlertaFilter(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="Sonora">Sonora</option>
              <option value="Notificación de Celular">
                Notificación de Celular
              </option>
            </select>
          </div>
        </div>

        {/* Tabla de Alertas */}
        <div className="overflow-auto bg-white rounded-lg shadow mb-6 max-h-[400px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left text-xs uppercase">ID</th>
                <th className="px-4 py-2 text-left text-xs uppercase">
                  Evento
                </th>
                <th className="px-4 py-2 text-left text-xs uppercase">
                  Ubicación
                </th>
                <th className="px-4 py-2 text-left text-xs uppercase">
                  Fecha y Hora
                </th>
                <th className="px-4 py-2 text-left text-xs uppercase">
                  Tipo de Alerta
                </th>
                <th className="px-4 py-2 text-left text-xs uppercase">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAlertas.map((alerta) => (
                <tr key={alerta.id_alertas}>
                  <td className="px-4 py-2">{alerta.id_alertas}</td>
                  <td className="px-4 py-2">
                    {alerta.eventos_desbordamiento?.descripcion || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {alerta.catalogo_puentes?.ubicacion || "Desconocida"}
                  </td>
                  <td className="px-4 py-2">{alerta.fecha_hora}</td>
                  <td className="px-4 py-2">{alerta.tipo_alerta}</td>
                  <td className="px-4 py-2">{alerta.status}</td>
                  <td className="px-4 py-2 text-center">
                    <Toggle
                      isOn={alerta.status === "Activa"}
                      onToggle={() =>
                        handleToggle(alerta.id_alertas, alerta.status)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Eventos de Desbordamiento
          </h2>
          <div className="relative">
            <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
            <select
              className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
              value={nivelRiesgoFilter}
              onChange={(e) => setNivelRiesgoFilter(e.target.value)}
            >
              <option value="">Todos los niveles</option>
              {[
                ...new Set(
                  eventos.map((e) => e.catalogo_niveles_riesgo?.nombre)
                ),
              ].map((nombre) => (
                <option key={nombre} value={nombre}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla de Eventos */}
        <div className="overflow-auto bg-white rounded-lg shadow max-h-[400px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left text-xs uppercase">
                  Evento
                </th>
                <th className="px-4 py-2 text-left text-xs uppercase">
                  ID Puente
                </th>
                <th className="px-4 py-2 text-left text-xs uppercase">
                  Fecha y Hora
                </th>
                <th className="px-4 py-2 text-left text-xs uppercase">
                  Nivel de Riesgo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEventos.map((evento) => (
                <tr key={evento.id_evento}>
                  <td className="px-4 py-2">{evento.descripcion}</td>
                  <td className="px-4 py-2">{evento.id_puente}</td>
                  <td className="px-4 py-2">{evento.fecha_hora}</td>
                  <td className="px-4 py-2">
                    {evento.catalogo_niveles_riesgo?.nombre}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AlertasEventosAdm;
