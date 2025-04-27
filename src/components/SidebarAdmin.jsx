import React from "react";
import { FaHome, FaUser, FaCog, FaUserLock } from "react-icons/fa";
import { MdCrisisAlert } from "react-icons/md";
import { HiOutlineSignal } from "react-icons/hi2";
import { IoIosLogOut } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client.js";

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();

  // Mapeo de roles a texto
  const roleNames = {
    1: "Administrador",
    2: "Operador",
    3: "Protección Civil",
  };

  // Menú basado en el rol del usuario
  const menuItemsByRole = {
    1: [
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
    ],
    2: [
      { label: "Inicio", icon: <FaHome />, path: "/inicioOpe" },
      {
        label: "Monitoreo de Sensores",
        icon: <HiOutlineSignal />,
        path: "/monitoreoSensoresOpe",
      },
      {
        label: "Alertas y Eventos",
        icon: <MdCrisisAlert />,
        path: "/alertasEventosOpe",
      },
    ],
    3: [
      { label: "Inicio", icon: <FaHome />, path: "/inicioPC" },
      {
        label: "Alertas y Eventos",
        icon: <MdCrisisAlert />,
        path: "/alertasEventosPC",
      },
    ],
  };

  const menuItems = menuItemsByRole[userRole] || [];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Ocurrió un error al cerrar sesión");
    } else {
      navigate("/");
    }
  };

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
          <p className="text-xl font-semibold text-black-700">
            {roleNames[userRole]}
          </p>
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

      {/* Botón de Cerrar Sesión */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-gray-700 text-sm font-medium
            rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
          <IoIosLogOut className="text-lg mr-3" />
          CERRAR SESIÓN
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
