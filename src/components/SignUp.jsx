import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client.js";

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    //Validaciones básicas
    if (!form.correo.includes("@")) {
      setError("El correo debe contener '@'.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const emailClean = form.correo.trim().toLowerCase();

    //Crear usuario en Auth
    const { error: authError } = await supabase.auth.signUp({
      email: emailClean,
      password: form.password,
    });
    if (authError) {
      setError("Error al crear usuario en autenticación: " + authError.message);
      return;
    }

    //Insertar usuario en tabla "usuario"
    const { error: perfilErr } = await supabase.from("usuario").insert([
      {
        nombre: form.nombre,
        apellido_paterno: form.apellido_paterno,
        apellido_materno: form.apellido_materno,
        curp: form.curp,
        tel: form.tel,
        correo: emailClean,
      },
    ]);
    if (perfilErr) {
      setError("Error al guardar tu perfil: " + perfilErr.message);
      return;
    }

    setStage("success");
  };

  if (stage === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <img src="/src/assets/logo.png" alt="logo" className="h-32 mb-6" />
        <h2 className="text-xl font-semibold mb-4 text-center">
          ¡Gracias por registrarte!
        </h2>
        <p className="mb-6 text-center">
          Un administrador asignará un rol a tu cuenta. <br />
          Dudas o contacto a través de{" "}
          <a href="mailto:enriquecalvo75@gmail.com" className="text-orange-500">
            enriquecalvo75@gmail.com
          </a>
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
        >
          Volver al Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 space-y-4"
      >
        <div className="flex justify-center mb-4">
          <img
            src="/src/assets/logo.png"
            alt="SafeBridge logo"
            className="h-32 w-auto"
          />
        </div>
        <h1 className="text-2xl font-bold uppercase text-center">
          Crear Cuenta
        </h1>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        {/* Campos de usuario */}
        {[
          { label: "Nombre", name: "nombre" },
          { label: "Apellido Paterno", name: "apellido_paterno" },
          { label: "Apellido Materno", name: "apellido_materno" },
          { label: "CURP", name: "curp" },
          { label: "Teléfono", name: "tel" },
          { label: "Correo", name: "correo", type: "email" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              name={name}
              type={type || "text"}
              value={form[name]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        ))}

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
            onClick={() => navigate("/")}
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
