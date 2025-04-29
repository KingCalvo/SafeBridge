import React from "react";
import Sidebar from "../../components/Sidebar";

const AdminInicio = () => {
  return (
    <div className="flex">
      <Sidebar userRole={1} />
      <div className="ml-64 flex-1">
        <main className="p-8 bg-gray-50"></main>
      </div>
    </div>
  );
};

export default AdminInicio;
