import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SidebarOperador";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { supabase } from "../../supabase/client";
import { GoAlert } from "react-icons/go";
import { FaCheck } from "react-icons/fa";

const InicioOpe = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sensores, setSensores] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [alertas, setAlertas] = useState([]);

  const [statusFilter, setStatusFilter] = useState("");
  const [nivelRiesgoFilter, setNivelRiesgoFilter] = useState("");
  const [tipoAlertaFilter, setTipoAlertaFilter] = useState("");

  useEffect(() => {
    fetchSensores();
    fetchEventos();
    fetchAlertas();
  }, []);

  const fetchSensores = async () => {
    const { data, error } = await supabase
      .from("alertas")
      .select(`id_alertas, tipo_alerta, status, catalogo_puentes (nombre)`);
    if (!error) setSensores(data);
    else console.error(error);
  };

  const fetchEventos = async () => {
    const { data, error } = await supabase
      .from("eventos_desbordamiento")
      .select(
        `id_evento, id_puente, fecha_hora, descripcion, catalogo_niveles_riesgo (status)`
      );
    if (!error) setEventos(data);
    else console.error(error);
  };

  const fetchAlertas = async () => {
    const { data, error } = await supabase.from("alertas").select(`
        id_alertas,
        fecha_hora,
        tipo_alerta,
        status,
        eventos_desbordamiento (descripcion),
        catalogo_puentes (ubicacion)
      `);
    if (!error) setAlertas(data);
    else console.error(error);
  };

  // Filtros combinados
  const filteredSensores = sensores
    .filter((s) =>
      searchTerm
        ? s.catalogo_puentes?.nombre
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          s.tipo_alerta.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .filter((s) => (statusFilter ? s.status === statusFilter : true))
    .sort((a, b) => a.id_alertas - b.id_alertas);

  const filteredEventos = eventos
    .filter((e) =>
      searchTerm
        ? e.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .filter((e) =>
      nivelRiesgoFilter
        ? e.catalogo_niveles_riesgo?.status === nivelRiesgoFilter
        : true
    )
    .sort((a, b) => a.id_evento - b.id_evento);

  const filteredAlertas = alertas
    .filter((a) =>
      searchTerm
        ? a.eventos_desbordamiento?.descripcion
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          a.tipo_alerta.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.catalogo_puentes?.ubicacion
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true
    )
    .filter((a) =>
      tipoAlertaFilter ? a.tipo_alerta === tipoAlertaFilter : true
    )
    .sort((a, b) => a.id_alertas - b.id_alertas);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        {/* Título Principal */}
        <h1 className="text-3xl font-bold uppercase text-gray-800 mb-6 text-center">
          Bienvenido Operador
        </h1>

        {/* Buscador General */}
        <div className="flex justify-center mb-8">
          <div className="relative w-96">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <IoSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar Puente, Evento o Tipo de Alerta..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla Sensores */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 uppercase">
            Sensores
          </h2>
          <div className="relative">
            <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
            <select
              className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos los status</option>
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
            </select>
          </div>
        </div>
        <div className="overflow-auto bg-white rounded-lg shadow mb-8 max-h-[300px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-xs uppercase">ID</th>
                <th className="px-4 py-2 text-xs uppercase">Puente</th>
                <th className="px-4 py-2 text-xs uppercase">Tipo</th>
                <th className="px-4 py-2 text-xs uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSensores.map((sensor) => (
                <tr key={sensor.id_alertas}>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {sensor.id_alertas}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {sensor.catalogo_puentes?.nombre}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {sensor.tipo_alerta}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white font-bold text-xs ${
                        sensor.status === "Activa"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {sensor.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabla Eventos */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 uppercase">
            Eventos
          </h2>
          <div className="relative">
            <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
            <select
              className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
              value={nivelRiesgoFilter}
              onChange={(e) => setNivelRiesgoFilter(e.target.value)}
            >
              <option value="">Todos los niveles</option>
              <option value="Alto">Alto</option>
              <option value="Bajo">Bajo</option>
            </select>
          </div>
        </div>
        <div className="overflow-auto bg-white rounded-lg shadow mb-8 max-h-[300px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-xs uppercase">Evento</th>
                <th className="px-4 py-2 text-xs uppercase">ID Puente</th>
                <th className="px-4 py-2 text-xs uppercase">Fecha y Hora</th>
                <th className="px-4 py-2 text-xs uppercase">Nivel de Riesgo</th>
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

        {/* Tabla Alertas */}
        <div className="flex items-center justify-center space-x-4 mb-4">
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
        <div className="overflow-auto bg-white rounded-lg shadow max-h-[300px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-xs uppercase">ID</th>
                <th className="px-4 py-2 text-xs uppercase">Evento</th>
                <th className="px-4 py-2 text-xs uppercase">Ubicación</th>
                <th className="px-4 py-2 text-xs uppercase">Fecha y Hora</th>
                <th className="px-4 py-2 text-xs uppercase">Tipo de Alerta</th>
                <th className="px-4 py-2 text-xs uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAlertas.map((alerta) => (
                <tr key={alerta.id_alertas}>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {alerta.id_alertas}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {alerta.eventos_desbordamiento?.descripcion}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {alerta.catalogo_puentes?.ubicacion}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {alerta.fecha_hora}
                  </td>
                  <td className="ppx-4 py-2 text-sm text-gray-700 text-center">
                    {alerta.tipo_alerta}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white font-bold text-xs ${
                        alerta.status === "Activa"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {alerta.status}
                    </span>
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

export default InicioOpe;
