import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client.js";
import { useNotificacion } from "../components/NotificacionContext.jsx";
import PageTitle from "../components/PageTitle";
import LogoSafe from "../assets/LogoSafeP.png";
import LogoSB from "../assets/LogoSBP.png";

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    curp: "",
    tel: "",
    correo: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [stage, setStage] = useState("form");
  const { notify } = useNotificacion();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.correo.trim())) {
      return notify("Ingresa un correo electrónico válido.", { type: "error" });
    }

    if (form.password !== form.confirm) {
      return notify("Las contraseñas no coinciden.", { type: "error" });
    }

    if (form.password.length < 6) {
      return notify("La contraseña debe tener al menos 6 caracteres.", {
        type: "error",
      });
    }

    const emailClean = form.correo.trim().toLowerCase();
    const curpClean = form.curp.trim().toUpperCase();

    try {
      // Crear usuario en Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: emailClean,
        password: form.password,
      });

      if (authError) throw authError;

      const userId = data.user.id;

      // Guardar en la tabla usuario
      const { error: perfilErr } = await supabase.from("usuario").insert([
        {
          user_id: userId,
          nombre: form.nombre.trim(),
          apellido_paterno: form.apellido_paterno.trim(),
          apellido_materno: form.apellido_materno.trim(),
          curp: curpClean,
          tel: form.tel.trim(),
          correo: emailClean,
          id_rol: 3, // invitado por defecto
        },
      ]);

      if (perfilErr) throw perfilErr;

      notify("Usuario creado con éxito", { type: "success" });
      setStage("success");
    } catch (err) {
      console.error(err);
      notify(err.message || "Error al crear la cuenta", { type: "error" });
    }
  };
  if (stage === "success") {
    return (
      <div className="min-h-screen bg-[#214543] text-white flex flex-col items-center justify-center p-4">
        <PageTitle title="SignUp" />
        <img src={LogoSB} alt="logo" className="h-40" />
        <h2 className="text-xl font-semibold mb-4 text-center">
          ¡Gracias por registrarte!
        </h2>
        <p className="mb-6 text-center">
          Un administrador asignará un rol a tu cuenta. <br />
          Dudas o contacto a través de{" "}
          <a
            href="https://mail.google.com/mail/?view=cm&to=enriquecalvo.dev@gmail.com"
            className="text-orange-500"
          >
            enriquecalvo.dev@gmail.com
          </a>
          <br />
          <br />
          Puedes iniciar sesión con tu cuenta; accederás temporalmente en modo
          invitado mientras se asignan tus permisos.
        </p>
        <button
          onClick={() => navigate("/graficosInv")}
          className="px-6 py-2 bg-orange-400 text-white rounded hover:bg-orange-500 cursor-pointer"
        >
          Iniciar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#214543] flex flex-col items-center justify-center p-4">
      <PageTitle title="Sign Up" />
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 space-y-4"
      >
        <div className="flex justify-center items-center h-40 mb-4">
          <img
            src={LogoSafe}
            alt="SafeBridge logo"
            className="h-56 object-contain"
          />
        </div>
        <h1 className="text-2xl text-gray-600 font-bold uppercase text-center">
          Crear Cuenta
        </h1>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Nombre
          </label>
          <input
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            required
            maxLength="30"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Apellido Paterno */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Apellido Paterno
          </label>
          <input
            name="apellido_paterno"
            type="text"
            value={form.apellido_paterno}
            onChange={handleChange}
            required
            maxLength="30"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Apellido Materno */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Apellido Materno
          </label>
          <input
            name="apellido_materno"
            type="text"
            value={form.apellido_materno}
            onChange={handleChange}
            required
            maxLength="30"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* CURP */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            CURP
          </label>
          <input
            name="curp"
            type="text"
            value={form.curp}
            onChange={handleChange}
            required
            maxLength="18"
            pattern="[A-Z0-9]{18}"
            title="La CURP debe tener exactamente 18 caracteres en mayúsculas y números"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 uppercase"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Teléfono
          </label>
          <input
            name="tel"
            type="tel"
            value={form.tel}
            onChange={handleChange}
            required
            maxLength="10"
            pattern="[0-9]{10}"
            title="El teléfono debe contener exactamente 10 dígitos"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Correo */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Correo
          </label>
          <input
            name="correo"
            type="email"
            value={form.correo}
            onChange={handleChange}
            required
            maxLength="40"
            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
            title="Ingresa un correo válido (ej: ejemplo@gmail.com)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <input
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-orange-400 text-white font-medium py-2 rounded-lg hover:bg-orange-500"
        >
          CREAR CUENTA
        </button>

        <div className="text-center text-sm">
          <span className="text-gray-600">¿Ya tienes una cuenta? </span>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-orange-400 font-medium hover:underline"
          >
            Ingresa aquí
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
