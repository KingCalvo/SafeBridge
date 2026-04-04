import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import puente from "../../assets/puente.png";
// IMÁGENES DEL CARRUSEL
import img1 from "../../assets/camino.png";
import img2 from "../../assets/puente.png";
import img3 from "../../assets/puente2.png";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

import { useState, useEffect } from "react";

const Inicio = () => {
  useScrollAnimation();

  const images = [img1, img2, img3];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let interval;

    const start = () => {
      interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 4000);
    };

    start();

    return () => clearInterval(interval);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

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
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Ciudades más seguras empiezan con{" "}
          </h1>
          <h1 className="text-4xl md:text-6xl font-bold mb-14">
            <span className="text-[#fb923c] text-6xl">Safe</span>
            Bridge
          </h1>

          <p className="text-lg md:text-xl leading-relaxed">
            Sistema inteligente que monitorea inundaciones en tiempo real,
            previene accidentes y protege vidas mediante alertas automáticas y
            gestión eficiente.
          </p>
        </div>
      </section>

      {/* SECCIÓN: PROBLEMA */}
      <section className="py-32 items-center px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        <div className="fade-up max-w-7xl mx-auto w-full">
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

      <section className="py-32 bg-[#add6bc] flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6">
          {/* Título */}
          <div className="text-center max-w-3xl mx-auto mb-20 fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Cómo funciona SafeBridge?
            </h2>
            <p className="text-gray-700 text-lg">
              Un sistema inteligente que combina monitoreo, análisis y respuesta
              inmediata para prevenir riesgos en tiempo real.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-24 fade-up">
            <div>
              <span className="text-orange-500 font-semibold text-sm">
                PASO 01
              </span>

              <h3 className="text-2xl font-bold mt-2 mb-4">
                Monitoreo en tiempo real
              </h3>

              <p className="text-gray-700 leading-7">
                SafeBridge supervisa continuamente el estado de los puentes,
                detectando cambios críticos en el entorno y generando datos
                precisos que permiten anticiparse a situaciones de riesgo.
              </p>
            </div>

            <div className="h-80 bg-gray-200 rounded-2xl flex items-center justify-center">
              Imagen aquí
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-24 fade-up">
            <div className="h-80 bg-gray-200 rounded-2xl flex items-center justify-center order-2 md:order-1">
              Imagen aquí
            </div>

            <div className="order-1 md:order-2">
              <span className="text-orange-500 font-semibold text-sm">
                PASO 02
              </span>

              <h3 className="text-2xl font-bold mt-2 mb-4">
                Alertas automáticas
              </h3>

              <p className="text-gray-700 leading-7">
                Cuando se detecta un riesgo, el sistema emite alertas inmediatas
                a usuarios y autoridades, permitiendo una reacción rápida y
                coordinada ante cualquier emergencia.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center fade-up">
            <div>
              <span className="text-orange-500 font-semibold text-sm">
                PASO 03
              </span>

              <h3 className="text-2xl font-bold mt-2 mb-4">
                Prevención activa
              </h3>

              <p className="text-gray-700 leading-7">
                SafeBridge permite tomar decisiones en tiempo real, reduciendo
                accidentes y optimizando la respuesta ante situaciones críticas,
                protegiendo tanto a conductores como a peatones.
              </p>
            </div>

            <div className="h-80 bg-gray-200 rounded-2xl flex items-center justify-center">
              Imagen aquí
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN WEBAPP */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
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

        <div className="relative max-w-4xl mx-auto aspect-video overflow-hidden rounded-xl group">
          <img
            src={images[current]}
            className="w-full h-full object-cover transition duration-700"
          />

          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 
               bg-black/40 hover:bg-black/60 text-white 
               w-10 h-10 rounded-full flex items-center justify-center
               opacity-0 group-hover:opacity-100 transition"
          >
            ‹
          </button>

          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 
               bg-black/40 hover:bg-black/60 text-white 
               w-10 h-10 rounded-full flex items-center justify-center
               opacity-0 group-hover:opacity-100 transition"
          >
            ›
          </button>

          {/* Indicadores (dots) */}
          <div className="absolute bottom-3 w-full flex justify-center gap-2">
            {images.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition ${
                  i === current ? "bg-[#fb923c]" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-white mb-6 text-lg">
            Explora la plataforma y visualiza el estado de los puentes en tiempo
            real.
          </p>

          <a
            href="/login"
            className="inline-block bg-[#fb923c] text-white px-8 py-3 rounded-full font-semibold text-lg tracking-wide hover:bg-[#f97316] transition shadow-lg hover:scale-105"
          >
            Probar plataforma
          </a>
        </div>
      </section>

      {/* SECCIÓN BENEFICIOS */}
      <section className="py-32 flex items-center bg-[#add6bc] px-6">
        <div className="fade-up max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center">
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
