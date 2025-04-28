import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SidebarOperador";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { FaFileMedical } from "react-icons/fa";
import { supabase } from "../../supabase/client";
import { GoAlert } from "react-icons/go";
import { FaCheck } from "react-icons/fa";

const ReportesOpe = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [puentes, setPuentes] = useState([]);
  const [informes, setInformes] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchPuentes();
    fetchInformes();
  }, []);

  const fetchPuentes = async () => {
    const { data, error } = await supabase
      .from("catalogo_puentes")
      .select("*")
      .order("id_puente", { ascending: true });
    if (error) console.error(error);
    else setPuentes(data);
  };

  const fetchInformes = async () => {
    const { data, error } = await supabase
      .from("informes")
      .select(
        `
        id_Informes,
        id_puente,
        id_estaciones,
        fecha_hora,
        descripcion,
        catalogo_estaciones (nombre),
        catalogo_puentes (nombre, ubicacion, status),
        eventos_desbordamiento (
          catalogo_niveles_riesgo (status)
        )
      `
      )
      .order("id_Informes", { ascending: true });

    if (error) console.error(error);
    else setInformes(data);
  };
  const [nivelRiesgoFilter, setNivelRiesgoFilter] = useState("");

  const filteredPuentes = puentes
    .filter((p) =>
      searchTerm
        ? p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .filter((p) => (statusFilter ? p.status === statusFilter : true));

  const filteredInformes = informes
    .filter((i) =>
      searchTerm
        ? (i.catalogo_puentes?.nombre || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (i.catalogo_puentes?.status || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (i.catalogo_puentes?.ubicacion || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (i.fecha_hora || "").toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .filter((i) =>
      nivelRiesgoFilter
        ? i.eventos_desbordamiento?.catalogo_niveles_riesgo?.status ===
          nivelRiesgoFilter
        : true
    );

  const handleGenerarReporte = (idPuente) => {
    console.log("Generar reporte para ID puente:", idPuente);
    // Guardar el idPuente en el localStorage, context, o redireccionar
    // localStorage.setItem("id_puente_reporte", idPuente);
    // navigate("/reportePDF");
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        {/* Titulo principal */}
        <h1 className="text-3xl font-bold uppercase text-gray-800 mb-6 text-center">
          Generar reportes
        </h1>

        {/* Buscador */}
        <div className="flex justify-center mb-8">
          <div className="relative w-96">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <IoSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar Puente, Status, Ubicación o Fecha..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla Puentes */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 uppercase">
            Puentes
          </h2>
          <div className="relative">
            <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
            <select
              className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos los status</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Reparación">Reparación</option>
            </select>
          </div>
        </div>

        <div className="overflow-auto bg-white rounded-lg shadow mb-8 max-h-[300px]">
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
                  Status
                </th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Generar Reporte
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPuentes.map((puente) => (
                <tr key={puente.id_puente}>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {puente.id_puente}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {puente.nombre}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-7002 text-center">
                    {puente.ubicacion}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white font-bold text-xs ${
                        puente.status === "Activo"
                          ? "bg-green-500"
                          : puente.status === "Inactivo"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {puente.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleGenerarReporte(puente.id_puente)}
                      className="p-2 bg-[#e28000] text-white rounded-lg hover:bg-[#BA4A00] transition"
                    >
                      <FaFileMedical />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabla Reportes */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 uppercase">
            Reportes
          </h2>
          <div className="relative">
            <CiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
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
        </div>

        <div className="overflow-auto bg-white rounded-lg shadow max-h-[300px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-center text-xs uppercase">ID</th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Puente
                </th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Ubicación
                </th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Estación
                </th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Tipo de Riesgo
                </th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Fecha y Hora
                </th>
                <th className="px-4 py-2 text-center text-xs uppercase">
                  Descripción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInformes.map((info) => (
                <tr key={info.id_informes}>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {info.id_Informes}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {info.catalogo_puentes?.nombre}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {info.catalogo_puentes?.ubicacion}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {info.catalogo_estaciones?.nombre}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {info.eventos_desbordamiento?.catalogo_niveles_riesgo
                      ?.status === "Alto" ? (
                      <span className="flex items-center justify-center gap-1 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-xs">
                        <GoAlert /> Alto
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1 bg-green-500 text-white font-bold px-3 py-1 rounded-full text-xs">
                        <FaCheck /> Bajo
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {info.fecha_hora}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    {info.descripcion}
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

export default ReportesOpe;
