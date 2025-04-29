import React from "react";
import Sidebar from "../../components/SidebarInvitado";

const GraficosInv = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1">
        <main className="p-8 bg-gray-50">
          <h1 className="text-2xl font-semibold text-gray-800">
            Bienvenido a los graficos de sensores
          </h1>
        </main>
      </div>
    </div>
  );
};

export default GraficosInv;
