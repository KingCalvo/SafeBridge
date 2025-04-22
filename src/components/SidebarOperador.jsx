import React from "react";
import { FaHome, FaFileSignature } from "react-icons/fa";
import { MdCrisisAlert } from "react-icons/md";
import { HiOutlineSignal } from "react-icons/hi2";
import { PiUserCircleGearFill } from "react-icons/pi";

const Sidebar = () => {
  const menuItems = [
    { label: "Inicio", icon: <FaHome /> },
    { label: "Monitoreo de Sensores", icon: <HiOutlineSignal /> },
    { label: "Eventos", icon: <MdCrisisAlert /> },
    { label: "Generar Reportes", icon: <FaFileSignature /> },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo y título */}
      <div className="px-6 py-8 flex items-center space-x-2">
        <span className="text-4xl font-bold">
          <span className="text-orange-400">Safe</span>Bridge
        </span>
      </div>

      {/* Rol de usuario */}
      <div className="px-6 mb-8 flex items-center justify-between">
        <div>
          <p className="text-xl font-semibold text-black-700">Operador</p>
          <p className="text-xl text-gray-900">Menú</p>
        </div>
        <PiUserCircleGearFill className="text-6xl text-black-500" />
      </div>

      {/* Opciones */}
      <nav className="flex-1 px-2 space-y-1">
        {menuItems.map(({ label, icon }, idx) => (
          <button
            key={idx}
            className={`
              w-full flex items-center px-4 py-2 text-gray-700 text-sm font-medium
              rounded-lg hover:bg-gray-100 transition
            `}
          >
            <span className="text-lg mr-3">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
