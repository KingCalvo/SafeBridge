import React from "react";
import { FaHome, FaUser, FaCog, FaUserLock } from "react-icons/fa";
import { MdCrisisAlert } from "react-icons/md";
import { HiOutlineSignal } from "react-icons/hi2";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { label: "Inicio", icon: <FaHome />, path: "/inicioAdm" },
    {
      label: "Gestión de Usuario",
      icon: <FaUser />,
      path: "/gestionUserAdm",
    },
    {
      label: "Monitoreo de Sensores",
      icon: <HiOutlineSignal />,
      path: "/monitoreoSensoresAdm",
    },
    {
      label: "Alertas y Eventos",
      icon: <MdCrisisAlert />,
      path: "/alertasEventosAdm",
    },
    {
      label: "Configuración del Sistema",
      icon: <FaCog />,
      path: "/configuracionAdm",
    },
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
          <p className="text-xl font-semibold text-black-700">Administrador</p>
          <p className="text-xl text-gray-900">Menú</p>
        </div>
        <FaUserLock className="text-5xl text-black-500" />
      </div>

      {/* Opciones */}
      <nav className="flex-1 px-2 space-y-1">
        {menuItems.map(({ label, icon, path }, idx) => (
          <NavLink
            key={idx}
            to={path}
            className={({ isActive }) => `
              w-full flex items-center px-4 py-2 text-gray-700 text-sm font-medium
              rounded-lg hover:bg-gray-100 transition
              ${isActive ? "bg-gray-100 font-semibold" : ""}
            `}
          >
            <span className="text-lg mr-3">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
