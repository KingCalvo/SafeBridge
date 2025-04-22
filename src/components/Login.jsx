import React from "react";
import { FaRegUser, FaUserGroup } from "react-icons/fa6";
import { IoLockClosedOutline } from "react-icons/io5";

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8 space-y-6">
        <div className="flex justify-center mb-4">
          <img
            src="/src/assets/logo.png"
            alt="SafeBridge logo"
            className="h-52 w-auto"
          />
        </div>

        <div className="space-y-4">
          {/* Usuario */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <FaRegUser />
            </span>
            <input
              type="text"
              placeholder="NOMBRE DE USUARIO"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
          {/* Contraseña */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <IoLockClosedOutline />
            </span>
            <input
              type="password"
              placeholder="CONTRASEÑA"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>

        {/* Iniciar sesión */}
        <button
          type="submit"
          className="w-full bg-white text-orange-400 font-medium py-2 rounded-lg shadow hover:shadow-md transition"
        >
          INICIAR SESIÓN
        </button>

        {/* Auxiliares */}
        <div className="flex justify-end text-sm">
          <a href="#" className="text-gray-500 hover:underline">
            ¿Olvidaste contraseña?
          </a>
        </div>
        <div className="text-center text-sm">
          <span className="text-gray-600">¿No tengo una cuenta? </span>
          <a href="#" className="text-orange-400 font-medium hover:underline">
            Regístrate aquí
          </a>
        </div>
      </div>

      {/* Botón continuar como invitado */}
      <button
        type="button"
        className="mt-6 bg-white rounded-2xl shadow-lg flex items-center justify-center space-x-2 px-6 py-3 w-full max-w-sm hover:shadow-md transition"
      >
        <FaUserGroup className="text-gray-500" />
        <span className="text-gray-700 font-medium">
          CONTINUAR COMO INVITADO
        </span>
      </button>
    </div>
  );
};

export default Login;
