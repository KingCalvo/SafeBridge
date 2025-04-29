import React from "react";
import Sidebar from "../../components/Sidebar";

const InicioPC = () => {
  return (
    <div className="flex">
      <Sidebar userRole={3} />
      <div className="ml-64 flex-1">
        <main className="p-8 bg-gray-50">
          <h1 className="text-2xl font-semibold text-gray-800">
            Bienvenido al inicio
          </h1>
        </main>
      </div>
    </div>
  );
};

export default InicioPC;
