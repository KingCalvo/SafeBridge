import React, { useState, useEffect } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { IoLockClosedOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client.js";
import { useNotificacion } from "./NotificacionContext.jsx";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import PageTitle from "../components/PageTitle";

const Login = () => {
  const navigate = useNavigate();
  const { user, rol } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { notify } = useNotificacion();
  const [openModal, setOpenModal] = useState(false);

  const [recoveryForm, setRecoveryForm] = useState({
    nombre: "",
    correo: "",
  });

  const [errorRecovery, setErrorRecovery] = useState("");
  const [successRecovery, setSuccessRecovery] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    try {
      // Login con Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password,
      });

      if (error) {
        notify("Correo o contraseña incorrectos.", { type: "error" });
        return;
      }

      const userId = data.user.id;

      // Obtener rol desde la tabla usuario
      const { data: userData, error: fetchError } = await supabase
        .from("usuario")
        .select("id_rol")
        .eq("user_id", userId)
        .single();

      if (fetchError || !userData) {
        notify("No se encontró el perfil del usuario.", { type: "error" });
        return;
      }

      // Redirección según rol
      switch (userData.id_rol) {
        case 1:
          notify("¡Has iniciado sesión correctamente!", { type: "success" });
          navigate("/inicioAdm");
          break;
        case 2:
          notify("¡Has iniciado sesión correctamente!", { type: "success" });
          navigate("/inicioOpe");
          break;
        case 3:
          notify("¡Has iniciado sesión correctamente!", { type: "success" });
          navigate("/graficosInv");
          break;
        default:
          notify("Rol no válido.", { type: "error" });
      }
    } catch (err) {
      console.error(err);
      notify("Ocurrió un error inesperado.", { type: "error" });
    }
  };
  const handleRecoveryChange = (e) => {
    const { name, value } = e.target;

    setErrorRecovery("");
    setSuccessRecovery("");

    if (name === "nombre") {
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;
    }

    setRecoveryForm({ ...recoveryForm, [name]: value });
  };

  const handleRecoverySubmit = () => {
    setErrorRecovery("");
    setSuccessRecovery("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!recoveryForm.nombre.trim())
      return setErrorRecovery("El nombre completo es obligatorio.");

    if (!emailRegex.test(recoveryForm.correo))
      return setErrorRecovery("Ingresa un correo electrónico válido.");

    // TODO BIEN
    setSuccessRecovery(
      "Solicitud enviada. El administrador se pondrá en contacto contigo.",
    );

    setRecoveryForm({
      nombre: "",
      correo: "",
    });

    setTimeout(() => {
      setOpenModal(false);
      setSuccessRecovery("");
    }, 2500);
  };

  const location = useLocation();

  useEffect(() => {
    if (!user || !rol) return;

    if (location.pathname !== "/login") return;

    const lastRoute = localStorage.getItem("lastRoute");

    const validRoutes = [
      "/inicioAdm",
      "/gestionUserAdm",
      "/monitoreoEstacionesAdm",
      "/alertasEventosAdm",
      "/configuracionAdm",
      "/reportesPuentesPDF",
      "/inicioOpe",
      "/eventosOpe",
      "/monitoreoSensoresOpe",
      "/reportesOpe",
      "/reportePDF",
      "/graficosInv",
      "/puentesInv",
      "/alertasInv",
    ];

    if (lastRoute && validRoutes.includes(lastRoute)) {
      navigate(lastRoute, { replace: true });
      return;
    }

    switch (rol.id_rol) {
      case 1:
        navigate("/inicioAdm", { replace: true });
        break;
      case 2:
        navigate("/inicioOpe", { replace: true });
        break;
      case 3:
        navigate("/graficosInv", { replace: true });
        break;
    }
  }, [user, rol, location.pathname]);

  const handleGuestAccess = () => {
    navigate("/graficosInv");
  };

  return (
    <div className="min-h-screen bg-[#214543] flex flex-col items-center justify-center p-4">
      <PageTitle title="Login" />
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
          <button
            type="button"
            onClick={() => setOpenModal(true)}
            className="text-gray-500 hover:underline cursor-pointer"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <div className="text-center text-sm">
          <span className="text-gray-600">¿No tienes una cuenta? </span>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-orange-400 font-medium hover:underline focus:outline-none cursor-pointer"
          >
            Regístrate aquí
          </button>
        </div>
        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-orange-400 font-medium hover:underline focus:outline-none cursor-pointer"
          >
            Conoce SafeBridge →
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

      {openModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-3 text-[#214543] text-center">
              ¿Olvidaste tu contraseña?
            </h2>

            <p className="text-gray-600 mb-6 text-justify">
              No te preocupes, contacta con el administrador ingresando tus
              datos y te ayudaremos a recuperar el acceso.
            </p>

            {/* FORM */}
            <div className="space-y-4">
              <input
                name="nombre"
                value={recoveryForm.nombre}
                onChange={handleRecoveryChange}
                placeholder="Nombre completo"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
              />

              <input
                name="correo"
                value={recoveryForm.correo}
                onChange={(e) =>
                  setRecoveryForm({ ...recoveryForm, correo: e.target.value })
                }
                placeholder="Correo electrónico"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
              />
            </div>

            {/* BOTONES */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setOpenModal(false)}
                className="w-full bg-gray-200 py-3 rounded-xl font-medium hover:bg-gray-300 transition cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={handleRecoverySubmit}
                className="w-full bg-[#fb923c] text-white py-3 rounded-xl font-semibold hover:bg-[#f97316] transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                Enviar
              </button>
            </div>

            {/* MENSAJES */}
            {errorRecovery && (
              <p className="text-red-500 text-sm mt-4 text-center">
                {errorRecovery}
              </p>
            )}

            {successRecovery && (
              <p className="text-[#3a8075] text-sm mt-4 text-center font-medium">
                {successRecovery}
              </p>
            )}
          </div>
        </div>
      )}

      <style>
        {`
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.25s ease;
    }
  `}
      </style>
    </div>
  );
};

export default Login;
