import React from "react";
import Sidebar from "../../components/SidebarOperador";

const ReportesOpe = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-800">
          Bienvenido a los reportes
        </h1>
      </main>
    </div>
  );
};

export default ReportesOpe;
