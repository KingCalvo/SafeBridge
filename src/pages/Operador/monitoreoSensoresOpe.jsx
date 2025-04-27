import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SidebarOperador";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { supabase } from "../../supabase/client";

const MonitoreoSensoresOpe = () => {
  const [detalles, setDetalles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchDetallesSensores();
  }, []);

  const fetchDetallesSensores = async () => {
    const { data, error } = await supabase
      .from("sensores")
      .select(
        `
        id_sensor,
        id_puente,
        status,
        catalogo_sensores (
          nombre,
          tipo,
          marca,
          modelo
        ),
        catalogo_puentes (
          nombre,
          ubicacion
        )
      `
      )
      .order("id_sensor", { ascending: true });
    if (error) console.error("Error cargando detalles:", error);
    else setDetalles(data);
  };

  const filteredDetalles = detalles
    .filter((d) => {
      if (!searchTerm) return true;
      const lower = searchTerm.toLowerCase();
      return (
        d.catalogo_puentes?.nombre?.toLowerCase().includes(lower) ||
        d.catalogo_sensores?.tipo?.toLowerCase().includes(lower) ||
        d.catalogo_sensores?.modelo?.toLowerCase().includes(lower) ||
        d.catalogo_puentes?.ubicacion?.toLowerCase().includes(lower)
      );
    })
    .filter((d) => (statusFilter ? d.status === statusFilter : true))
    .sort((a, b) => a.id_sensor - b.id_sensor);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        {/* Título principal */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 uppercase">
          Monitoreo de Sensores
        </h1>

        {/* Buscador */}
        <div className="flex justify-center mb-6">
          <div className="relative w-96">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <IoSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar puente, tipo de sensor o ubicación..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Título tabla y filtro */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 uppercase">
            información de los Sensores
          </h2>
          <div className="relative">
            <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
            <select
              className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos los Status</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-auto max-h-[400px] bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-center text-xs uppercase">ID</th>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDetalles.map((d) => (
                <tr key={d.id_sensor}>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {d.id_sensor}
                  </td>
                  <td className="ppx-4 py-2 text-sm text-gray-700 text-center">
                    {d.catalogo_sensores?.nombre || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {d.catalogo_sensores?.tipo || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {d.catalogo_sensores?.marca || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {d.catalogo_puentes?.nombre || "Sin Puente"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {d.catalogo_sensores?.modelo || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {d.catalogo_puentes?.ubicacion || "Desconocida"}
                  </td>
                  <td className="ppx-4 py-2 text-sm text-gray-700 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-bold ${
                        d.status === "Activo" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {d.status}
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

export default MonitoreoSensoresOpe;
