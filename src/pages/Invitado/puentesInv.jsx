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

  useEffect(() => {
    fetchPuentes();
  }, []);

  const fetchPuentes = async () => {
    const { data, error } = await supabase.from("catalogo_puentes").select("*");
    if (error) console.error("Error al obtener puentes:", error);
    else setPuentes(data);
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
      <div className="ml-64 flex-1">
        <main className="p-8">
          <h1 className="text-3xl font-bold uppercase text-gray-800 mr-2 mb-6 text-center">
            PUENTES DISPONIBLES
          </h1>

          {/* Buscador y filtro */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <IoSearch />
              </span>
              <input
                type="text"
                placeholder="Buscar por nombre o ubicación..."
                className="w-80 border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
              <select
                className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
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
          <div className="overflow-auto bg-white rounded-lg shadow mb-6 max-h-[500px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Nombre
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Ubicación
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    +Información
                  </th>
                  <th className="px-4 py-2 text-center text-xs uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPuentes.map((p) => (
                  <tr key={p.id_puente}>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Gráfica */}
          <div className="mt-8 bg-white p-6 rounded-2xl shadow">
            <ApexChartPuentes />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PuentesInv;
