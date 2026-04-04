import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import PageTitle from "../../components/PageTitle";

const Servicios = () => {
  useScrollAnimation();

  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    empresa: "",
    mensaje: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validación
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limpiar mensajes
    setError("");
    setSuccess("");

    if (name === "nombre" || name === "apellidos") {
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;
    }

    // Telefono solo números y max 10 dígitos
    if (name === "telefono") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    if (name === "mensaje") {
      if (value.length > 700) return;
    }

    setForm({ ...form, [name]: value });
  };

  // Validación al enviar
  const handleSubmit = () => {
    setError("");
    setSuccess("");

    if (!form.nombre.trim())
      return setError("El nombre es obligatorio y solo debe contener letras.");

    if (!form.apellidos.trim())
      return setError(
        "Los apellidos son obligatorios y solo deben contener letras.",
      );

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.correo))
      return setError("Ingresa un correo electrónico válido.");

    if (!/^\d{10}$/.test(form.telefono))
      return setError("El teléfono debe tener exactamente 10 dígitos.");

    if (!form.empresa.trim()) return setError("La empresa es obligatoria.");

    setSuccess("Tu mensaje fue enviado, te contestamos en breve.");
    setTimeout(() => {
      setOpenModal(false);
      setSuccess("");
    }, 2500);

    setForm({
      nombre: "",
      apellidos: "",
      correo: "",
      telefono: "",
      empresa: "",
      mensaje: "",
    });
  };

  return (
    <div className="font-landing bg-[#3a8075] text-white">
      <PageTitle title="Servicios" />
      <Header />
      <section className="py-28 text-center px-6 fade-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Planes de <span className="text-[#fb923c]">Safe</span>Bridge
        </h1>

        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades y comienza a
          monitorear puentes en tiempo real con tecnología inteligente.
        </p>
      </section>

      {/* Cards*/}
      <section className="pb-32 px-6 flex flex-col md:flex-row gap-14 justify-center items-center">
        {/* Gratis */}
        <div className="fade-up w-80 h-[29rem] p-8 bg-white text-center rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-black font-semibold text-2xl">Invitado</h2>

            <p className="pt-2">
              <span className="text-black text-3xl font-semibold">$0</span>
              <span className="text-gray-400"> / mes</span>
            </p>

            <hr className="mt-4" />

            <div className="pt-8 text-left space-y-4">
              <p className="text-gray-600">✔ Consulta de estado de puentes</p>
              <p className="text-gray-600">✔ Visualización de datos básicos</p>
              <p className="text-gray-600">✔ Acceso limitado a la plataforma</p>
            </div>
          </div>

          <a
            href="/login"
            className="block w-full py-3 bg-[#fb923c] mt-6 rounded-xl text-white font-medium hover:bg-[#f97316] transition-all duration-300 hover:scale-105"
          >
            Acceder gratis
          </a>
        </div>

        {/* Premium */}
        <div className="fade-up w-80 h-[28rem] p-8 bg-[#214543] text-center rounded-3xl text-white shadow-xl border-2 border-[#fb923c] transform scale-105 relative flex flex-col justify-between">
          <div>
            <h2 className="font-semibold text-2xl">Profesional</h2>

            <p className="pt-2">
              <span className="text-3xl font-semibold">$200</span>
              <span className="text-gray-300"> / mes</span>
            </p>

            <hr className="mt-4 border-gray-600" />

            <div className="pt-8 text-left space-y-4 text-gray-300">
              <p>✔ Monitoreo en tiempo real</p>
              <p>✔ Alertas automáticas</p>
              <p>✔ Acceso completo a la plataforma</p>
              <p>✔ Análisis y reportes avanzados</p>
            </div>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="w-full py-3 bg-[#fb923c] mt-6 rounded-xl text-white font-medium hover:bg-[#f97316] transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            Contratar plan
          </button>

          <div className="absolute top-2 right-4">
            <span className="bg-[#fb923c] px-3 py-1 rounded-full text-xs font-semibold">
              Recomendado
            </span>
          </div>
        </div>
      </section>

      {/* Modal */}
      {openModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="bg-white text-gray-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-3 text-[#3a8075]">
              ¿Listo para contratar nuestro servicio?
            </h2>

            <p className="text-gray-600 mb-6">
              Déjanos tus datos y nuestro equipo se pondrá en contacto contigo
              para brindarte toda la información necesaria y ayudarte a integrar
              SafeBridge en tu entorno de forma rápida y eficiente.
            </p>

            {/* Form */}
            <div className="space-y-4 text-left">
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fb923c] focus:border-transparent"
              />

              <input
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                placeholder="Apellidos"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fb923c] focus:border-transparent"
              />

              <input
                name="correo"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                placeholder="Correo electrónico"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fb923c] focus:border-transparent"
              />

              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fb923c] focus:border-transparent"
              />

              <input
                name="empresa"
                value={form.empresa}
                onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                placeholder="Empresa"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fb923c] focus:border-transparent"
              />

              <textarea
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                placeholder="Tu mensaje (opcional)"
                className="w-full border rounded-lg px-4 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-[#fb923c] focus:border-transparent"
              />

              <p className="text-xs text-gray-400 text-right">
                {form.mensaje.length}/700
              </p>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setOpenModal(false)}
                className="w-full bg-gray-200 py-3 rounded-xl font-medium hover:bg-gray-300 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="w-full bg-[#fb923c] text-white py-3 rounded-xl font-semibold hover:bg-[#f97316] transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                Enviar solicitud
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
            )}

            {success && (
              <p className="text-[#3a8075] text-sm mt-4 text-center font-medium">
                {success}
              </p>
            )}
          </div>
        </div>
      )}

      <Footer />

      {/* Animación */}
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

export default Servicios;
