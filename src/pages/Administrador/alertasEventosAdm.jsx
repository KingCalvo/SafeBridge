import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { supabase } from "../../supabase/client";
import Toggle from "../../components/Toggle";
import { GoAlert } from "react-icons/go";
import { FaCheck } from "react-icons/fa";
import { useNotificacion } from "../../components/NotificacionContext";

const AlertasEventosAdm = () => {
  const [alertas, setAlertas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoAlertaFilter, setTipoAlertaFilter] = useState("");
  const [nivelRiesgoFilter, setNivelRiesgoFilter] = useState("");
  const { notify } = useNotificacion();

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
        catalogo_niveles_riesgo ( status )
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
      setAlertas((prevAlertas) =>
        prevAlertas.map((alerta) =>
          alerta.id_alertas === id
            ? { ...alerta, status: currentStatus }
            : alerta
        )
      );
      notify("Error al actualizar alerta: " + error.message, { type: "error" });
    } else {
      const verbo = nuevoStatus === "Activa" ? "activada" : "desactivada";
      notify(`Alerta ${verbo}.`, { type: "success" });
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
      return (e.descripcion || "").toLowerCase().includes(lowerSearch);
    })
    .filter((e) =>
      nivelRiesgoFilter
        ? e.catalogo_niveles_riesgo?.status === nivelRiesgoFilter
        : true
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={1} />
      <div className="ml-64 flex-1">
        <main className="p-8 bg-gray-50">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            HISTORIAL DE ALERTAS Y EVENTOS
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
            <h2 className="text-2xl font-bold text-center text-gray-800 uppercase">
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
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    ID
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Evento
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
                {filteredAlertas.map((alerta) => (
                  <tr key={alerta.id_alertas}>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {alerta.id_alertas}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {alerta.eventos_desbordamiento?.descripcion || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {alerta.catalogo_puentes?.ubicacion || "Desconocida"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {alerta.fecha_hora}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {alerta.tipo_alerta}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <span
                        className={`px-2 py-1 rounded-full text-white font-bold  ${
                          alerta.status === "Activa"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {alerta.status}
                      </span>
                    </td>

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
            <h2 className="text-2xl font-bold text-center text-gray-800 uppercase">
              EVENTOS DE DESBORDAMIENTO
            </h2>
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

          <div className="overflow-auto bg-white rounded-lg shadow max-h-[400px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Evento
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    ID Puente
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
                {filteredEventos.map((evento) => (
                  <tr key={evento.id_evento}>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {evento.descripcion}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {evento.id_puente}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {evento.fecha_hora}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-white text-xs font-bold ${
                          evento.catalogo_niveles_riesgo?.status === "Alto"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      >
                        {evento.catalogo_niveles_riesgo?.status === "Alto" ? (
                          <GoAlert className="mr-1" />
                        ) : (
                          <FaCheck className="mr-1" />
                        )}
                        {evento.catalogo_niveles_riesgo?.status || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AlertasEventosAdm;
