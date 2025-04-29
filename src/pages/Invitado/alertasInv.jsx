import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SidebarInvitado";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { supabase } from "../../supabase/client";

const AlertasInv = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoAlertaFilter, setTipoAlertaFilter] = useState("");
  const [tipoEstacionFilter, setTipoEstacionFilter] = useState("");
  const [alertas, setAlertas] = useState([]);
  const [estaciones, setEstaciones] = useState([]);

  useEffect(() => {
    fetchAlertas();
    fetchEstaciones();
  }, []);

  const fetchAlertas = async () => {
    const { data, error } = await supabase
      .from("alertas")
      .select(
        `id_alertas, tipo_alerta, fecha_hora, status, id_puente, eventos_desbordamiento ( descripcion ), catalogo_puentes ( ubicacion )`
      );
    if (!error) setAlertas(data || []);
  };

  const fetchEstaciones = async () => {
    const { data, error } = await supabase
      .from("catalogo_estaciones")
      .select("id_estaciones, nombre, tipo_estacion, ubicacion");
    if (!error) setEstaciones(data || []);
  };

  const filteredAlertas = alertas.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      (a.tipo_alerta?.toLowerCase().includes(term) ||
        a.status?.toLowerCase().includes(term) ||
        a.eventos_desbordamiento?.descripcion?.toLowerCase().includes(term) ||
        a.catalogo_puentes?.ubicacion?.toLowerCase().includes(term)) &&
      (tipoAlertaFilter ? a.tipo_alerta === tipoAlertaFilter : true)
    );
  });

  const filteredEstaciones = estaciones.filter((e) => {
    const term = searchTerm.toLowerCase();
    return (
      (e.tipo_estacion?.toLowerCase().includes(term) ||
        e.nombre?.toLowerCase().includes(term) ||
        e.ubicacion?.toLowerCase().includes(term)) &&
      (tipoEstacionFilter ? e.tipo_estacion === tipoEstacionFilter : true)
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1">
        <main className="p-8">
          <h1 className="text-3xl font-bold uppercase text-gray-800 text-center mb-6">
            ALERTAS Y ESTACIONES
          </h1>

          {/* Buscador general */}
          <div className="flex justify-center mb-8">
            <div className="relative w-96">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <IoSearch />
              </span>
              <input
                type="text"
                placeholder="Buscar estación, tipo de alerta, status o ubicación..."
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Título ALERTAS + filtro */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 uppercase">
              ALERTAS
            </h2>
            <div className="relative">
              <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
              <select
                className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
                value={tipoAlertaFilter}
                onChange={(e) => setTipoAlertaFilter(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {[...new Set(alertas.map((a) => a.tipo_alerta))].map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabla Alertas */}
          <div className="overflow-auto max-h-[400px] bg-white rounded-lg shadow mb-12">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
                <tr>
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
                {filteredAlertas.map((a) => (
                  <tr key={a.id_alertas}>
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
                        className={`px-3 py-1 rounded-full text-white font-bold ${
                          a.status === "Activa" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Título ESTACIONES + filtro */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 uppercase">
              ESTACIONES
            </h2>
            <div className="relative">
              <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
              <select
                className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
                value={tipoEstacionFilter}
                onChange={(e) => setTipoEstacionFilter(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {[...new Set(estaciones.map((e) => e.tipo_estacion))].map(
                  (tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Tabla Estaciones */}
          <div className="overflow-auto max-h-[400px] bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Nombre
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Tipo
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Ubicación
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEstaciones.map((e) => (
                  <tr key={e.id_estaciones}>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {e.nombre}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {e.tipo_estacion}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-center">
                      {e.ubicacion}
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

export default AlertasInv;
