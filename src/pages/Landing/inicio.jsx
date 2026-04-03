import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import puente from "../../assets/puente.png";

// IMPORTA TUS IMÁGENES DEL CARRUSEL
import img1 from "../../assets/camino.png";
import img2 from "../../assets/puente.png";
import img3 from "../../assets/puente2.png";

const Inicio = () => {
  return (
    <div className="font-landing bg-[#3a8075] text-gray-800">
      <Header />

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center">
        <img
          src={puente}
          alt="Puente"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative text-center text-white px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Ciudades más seguras empiezan con{" "}
            <span className="text-[#fb923c]">Safe</span>Bridge
          </h1>

          <p className="text-lg md:text-xl leading-relaxed">
            Sistema inteligente que monitorea inundaciones en tiempo real,
            previene accidentes y protege vidas mediante alertas automáticas y
            gestión eficiente.
          </p>
        </div>
      </section>

      {/* SECCIÓN: PROBLEMA */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-[#fb923c]">
            El problema que resolvemos
          </h2>

          <p className="text-white leading-7 text-justify">
            En muchas ciudades, los puentes y pasos a desnivel carecen de
            monitoreo en tiempo real. Esto provoca que conductores crucen zonas
            inundadas sin conocer el riesgo, generando accidentes, pérdidas
            materiales y situaciones críticas.
          </p>

          <p className="text-white leading-7 mt-4 text-justify">
            SafeBridge elimina la incertidumbre al proporcionar información
            precisa y oportuna, permitiendo actuar antes de que ocurra una
            tragedia.
          </p>
        </div>

        {/* ESPACIO PARA IMAGEN */}
        <div className="h-80 bg-gray-200 rounded-xl flex items-center justify-center">
          <span className="text-gray-500">Imagen aquí</span>
        </div>
      </section>

      {/* SECCIÓN: CÓMO FUNCIONA */}
      <section className="py-20 bg-[#add6bc] px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">¿Cómo funciona?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-3">
                Monitoreo en tiempo real
              </h3>
              <p className="text-gray-600">
                Detecta niveles de agua y condiciones críticas en puentes.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-3">
                Alertas automáticas
              </h3>
              <p className="text-gray-600">
                Notifica a usuarios y autoridades de manera inmediata.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-3">Prevención activa</h3>
              <p className="text-gray-600">
                Reduce accidentes mediante acciones automatizadas y datos en
                vivo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN WEBAPP */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">
            Plataforma <span className="text-[#fb923c]">Safe</span>Bridge
          </h2>

          <p className="text-white mt-4 max-w-2xl mx-auto">
            Nuestra webapp permite visualizar datos en tiempo real, consultar el
            estado de los puentes, analizar alertas y tomar decisiones
            informadas. Diseñada para autoridades, operadores y público general.
          </p>
        </div>

        {/* CARRUSEL SIMPLE */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {[img1, img2, img3].map((img, i) => (
            <img
              key={i}
              src={img}
              alt="dashboard"
              className="w-[300px] rounded-xl shadow"
            />
          ))}
        </div>
      </section>

      {/* SECCIÓN BENEFICIOS */}
      <section className="py-20 bg-[#add6bc] px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* IMAGEN */}
          <div className="h-80 bg-gray-200 rounded-xl flex items-center justify-center">
            <span className="text-gray-500">Imagen aquí</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">
              ¿Por qué contratar SafeBridge?
            </h2>

            <ul className="space-y-4 text-gray-700">
              <li>✔ Reducción de accidentes y riesgos</li>
              <li>✔ Información en tiempo real</li>
              <li>✔ Optimización de respuesta ante emergencias</li>
              <li>✔ Mayor seguridad para ciudadanos</li>
            </ul>

            <a
              href="/servicios"
              className="inline-block mt-6 bg-[#fb923c] text-white px-6 py-3 rounded-full font-medium hover:bg-[#f97316] transition"
            >
              Contratar servicio
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Inicio;
