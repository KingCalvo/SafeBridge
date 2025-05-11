import React, { useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { IoLockClosedOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { supabase } from "../supabase/client.js";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    try {
      // 1) Traer hash de contraseña e id_rol de la tabla usuario
      const { data: user, error: fetchError } = await supabase
        .from("usuario")
        .select("pass, id_rol")
        .ilike("correo", normalizedEmail)
        .maybeSingle();

      if (fetchError) {
        console.error(fetchError);
        alert("Error al consultar la base de datos.");
        return;
      }

      if (!user) {
        alert("Usuario no encontrado o correo incorrecto.");
        return;
      }

      // 2) Comparar contraseña con el hash
      const match = await bcrypt.compare(password, user.pass || "");
      if (!match) {
        alert("Correo o contraseña incorrectos.");
        return;
      }

      // 3) Redirigir según rol
      switch (user.id_rol) {
        case 1:
          navigate("/inicioAdm");
          break;
        case 2:
          navigate("/inicioOpe");
          break;
        case 3:
          navigate("/inicioPC");
          break;
        default:
          alert("Rol no válido.");
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error inesperado.");
    }
  };

  const handleGuestAccess = () => {
    navigate("/graficosInv");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8 mt-0 space-y-6"
      >
        <div className="flex justify-center mb-3">
          <img
            src="/src/assets/logo.png"
            alt="SafeBridge logo"
            className="h-52 w-auto"
          />
        </div>

        <div className="space-y-4">
          {/* Correo */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <CiMail />
            </span>
            <input
              type="email"
              placeholder="CORREO"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Iniciar sesión */}
        <button
          type="submit"
          className="w-full bg-white text-orange-400 font-medium py-2 rounded-lg shadow hover:shadow-md transition cursor-pointer border border-gray-300"
        >
          INICIAR SESIÓN
        </button>

        {/* Auxiliares */}
        <div className="flex justify-end text-sm">
          <a href="#" className="text-gray-500 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <div className="text-center text-sm">
          <span className="text-gray-600">¿No tengo una cuenta? </span>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-orange-400 font-medium hover:underline focus:outline-none"
          >
            Regístrate aquí
          </button>
        </div>

        {/* Botón continuar como invitado */}
        <button
          onClick={handleGuestAccess}
          type="button"
          className="mt-6 bg-white rounded-2xl shadow-lg flex items-center justify-center space-x-2 px-6 py-3 w-full max-w-sm hover:shadow-md transition cursor-pointer border border-gray-300"
        >
          <FaUserGroup className="text-gray-500" />
          <span className="text-gray-700 font-medium">
            CONTINUAR COMO INVITADO
          </span>
        </button>
      </form>
    </div>
  );
};

export default Login;
