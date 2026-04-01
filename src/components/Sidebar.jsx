import React from "react";
import {
  FaHome,
  FaUser,
  FaCog,
  FaUserLock,
  FaFileSignature,
} from "react-icons/fa";
import { MdCrisisAlert } from "react-icons/md";
import { HiOutlineSignal } from "react-icons/hi2";
import { IoIosLogOut } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client.js";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const { rol } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  // Mapeo de roles a texto
  const roleNames = {
    1: "Administrador",
    2: "Operador",
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
        label: "Monitoreo de Estaciones",
        icon: <HiOutlineSignal />,
        path: "/monitoreoEstacionesAdm",
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
        path: "/eventosOpe",
      },
      {
        label: "Generar Reportes",
        icon: <FaFileSignature />,
        path: "/reportesOpe",
      },
    ],
  };

  const menuItems = menuItemsByRole[userRole] || [];

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("lastRoute");

    navigate("/", { replace: true });
  };

  return (
    <>
      {/* BOTÓN HAMBURGUESA */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-10 left-4 z-50 bg-white p-2 rounded-md shadow-md"
      >
        <FaBars className="text-xl" />
      </button>

      {/* OVERLAY */}
      <div
        onClick={() => setIsOpen(false)}
        className={`
        fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden
        ${isOpen ? "block" : "hidden"}
      `}
      ></div>
      <aside
        className={`
    fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50
    transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
      >
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
              {rol?.nombre || roleNames[userRole]}
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
              onClick={() => setIsOpen(false)}
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

        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-6 right-4 text-xl"
        >
          ✕
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
