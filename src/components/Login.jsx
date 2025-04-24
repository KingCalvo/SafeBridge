import React from "react";
import { FaUserGroup } from "react-icons/fa6";
import { IoLockClosedOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabase/client.js";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // 1) Autenticación
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      alert("Correo o contraseña incorrectos");
      console.error(authError);
      return;
    }

    /*     // 2) DEBUG: lista todos los correos que realmente tiene tu tabla
    const { data: allUsers, error: allErr } = await supabase
      .from("usuario")
      .select("correo, id_rol");
    console.log("ALL USERS:", allUsers, "ERR:", allErr); */

    // 3) Normalizar y buscar case-insensitive
    const normalizedEmail = email.trim().toLowerCase();
    const { data: userData, error: userError } = await supabase
      .from("usuario")
      .select("id_rol")
      .ilike("correo", normalizedEmail)
      .maybeSingle();

    if (userError) {
      alert("Error al consultar la base de datos");
      console.error(userError);
      return;
    }
    if (!userData) {
      alert(`Usuario no encontrado en la base de datos:\n${normalizedEmail}`);
      console.warn(`No existe usuario con correo ${normalizedEmail}`);
      return;
    }

    // 4) Redirigir según rol
    switch (userData.id_rol) {
      case 1:
        navigate("/admin_inicio");
        break;
      case 2:
        navigate("/operador_inicio");
        break;
      case 3:
        navigate("/pc_inicio");
        break;
      default:
        alert("Rol no válido");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8 space-y-6"
      >
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
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <CiMail />
            </span>
            <input
              type="text"
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Iniciar sesión */}
        <button
          type="submit"
          className="w-full bg-white text-orange-400 font-medium py-2 rounded-lg shadow hover:shadow-md transition cursor-pointer"
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
      </form>

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
