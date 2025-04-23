import React from "react";
import Sidebar from "../../components/SidebarAdmin";

const AdminInicio = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-800">
          Bienvenido al Panel de Administración
        </h1>
      </main>
    </div>
  );
};

export default AdminInicio;
