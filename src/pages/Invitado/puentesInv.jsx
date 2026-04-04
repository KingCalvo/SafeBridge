import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SidebarInvitado";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { supabase } from "../../supabase/client";
import ApexChartPuentes from "../../components/ApexChartPuentes";

const PuentesInv = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [puentes, setPuentes] = useState([]);
  const [loadingPuentes, setLoadingPuentes] = useState(true);

  useEffect(() => {
    fetchPuentes();
  }, []);

  const fetchPuentes = async () => {
    setLoadingPuentes(true);

    const { data, error } = await supabase.from("catalogo_puentes").select("*");
    if (error) console.error("Error al obtener puentes:", error);
    else setPuentes(data);

    setTimeout(() => setLoadingPuentes(false), 100);
  };

  const filteredPuentes = puentes.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      p.nombre?.toLowerCase().includes(term) ||
      p.status?.toLowerCase().includes(term) ||
      p.ubicacion?.toLowerCase().includes(term);
    const matchFilter = filterStatus ? p.status === filterStatus : true;
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <main className="p-4 sm:p-6 lg:p-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase text-gray-800 mb-6 text-center">
            PUENTES DISPONIBLES
          </h1>

          {/* Buscador y filtro */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3 mb-6">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <IoSearch />
              </span>
              <input
                type="text"
                placeholder="Buscar por nombre o ubicación..."
                className="w-full sm:w-80 border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
              <select
                className="w-full sm:w-auto border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Todos los status</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Reparación">Reparación</option>
              </select>
            </div>
          </div>

          {/* Tabla de puentes */}
          <div className="overflow-x-auto bg-white rounded-lg shadow mb-6 max-h-[500px] overflow-y-auto">
            <table className="min-w-[600px] w-full divide-y divide-gray-200">
              <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
                <tr>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loadingPuentes ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredPuentes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No hay puentes
                    </td>
                  </tr>
                ) : (
                  filteredPuentes.map((p) => (
                    <tr key={p.id_puente}>
                      <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 text-center">
                        {p.nombre}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 text-center">
                        {p.ubicacion}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 text-center">
                        {p.info}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 text-center">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-white font-bold text-xs sm:text-sm ${
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Gráfica */}
          <div className="mt-8 bg-white p-4 sm:p-6 rounded-2xl shadow overflow-x-auto">
            <ApexChartPuentes />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PuentesInv;
