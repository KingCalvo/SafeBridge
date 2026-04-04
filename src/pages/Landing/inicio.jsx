import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import puente from "../../assets/puenteR.png";
import puenteD from "../../assets/PuenteDestruido2.webp";
import zona from "../../assets/zonaR.png";
import SafeFondo from "../../assets/BridgeFondo.png";
// IMÁGENES DEL CARRUSEL
import img1 from "../../assets/SafeBridge-Login.png";
import img2 from "../../assets/SafeBridge-InicioInv.png";
import img3 from "../../assets/SafeBridge-PuentesInv.png";
import img4 from "../../assets/SafeBridge-AlertasInv.png";
import img5 from "../../assets/SafeBridge-InicioAdm.png";
import img6 from "../../assets/SafeBridge-PanelAdm.png";
import img7 from "../../assets/SafeBridge-EstacionesAdm.png";
import img8 from "../../assets/SafeBridge-AlertasEventosAdm.png";
import img9 from "../../assets/SafeBridge-ConfiguraciónAdm.png";
import img10 from "../../assets/SafeBridge-InicioOpe.png";
import img11 from "../../assets/SafeBridge-SensoresOpe.png";
import img12 from "../../assets/SafeBridge-AlertasEventosOpe.png";
import img13 from "../../assets/SafeBridge-ReportesOpe.png";

import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import PageTitle from "../../components/PageTitle";
import { useState, useEffect } from "react";

const Inicio = () => {
  useScrollAnimation();
  const [openViewer, setOpenViewer] = useState(false);
  const images = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
    img13,
  ];
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
      <PageTitle title="Inicio" />
      <Header />
      <section className="relative h-screen flex items-center justify-center">
        <img
          src={puente}
          alt="Puente"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative text-center text-white px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">
            Ciudades más seguras empiezan con{" "}
          </h1>
          <h1 className="text-5xl md:text-7xl font-bold mb-14">
            <span className="text-[#fb923c] text-5xl md:text-7xl">Safe</span>
            Bridge
          </h1>

          <p className="text-lg md:text-xl leading-relaxed">
            Sistema inteligente que monitorea inundaciones en tiempo real,
            previene accidentes y protege vidas mediante alertas automáticas y
            gestión eficiente.
          </p>
        </div>
      </section>

      {/* Sección: Problema */}
      <section className="py-32 items-center px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        <div className="fade-up max-w-7xl mx-auto w-full">
          <h2 className="text-3xl font-bold mb-6 text-white text-center md:text-left">
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

        <div className="md:h-80 rounded-xl flex items-center justify-center bg-transparent overflow-hidden">
          <img
            src={puenteD}
            className="w-full h-auto md:h-full object-contain md:object-contain rounded-xl shadow-2xl"
          />
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

            <div className="md:h-74 rounded-2xl flex items-center justify-center bg-transparent overflow-hidden">
              <img
                src={img11}
                className="w-full h-auto md:h-full object-contain rounded-2xl"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-24 fade-up">
            <div className="md:h-74 rounded-2xl flex items-center justify-center order-2 md:order-1 bg-transparent overflow-hidden">
              <img
                src={img4}
                className="w-full h-auto md:h-full object-contain rounded-2xl"
              />
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
              <img
                src={zona}
                className="w-full h-full object-cover bg-gray-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sección webapp */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">
            Plataforma <span className="text-[#fb923c]">Safe</span>Bridge
          </h2>

          <p className="text-white mt-4 max-w-2xl mx-auto">
            Nuestra aplicación web de escritorio permite visualizar datos en
            tiempo real, consultar el estado de los puentes, analizar alertas y
            tomar decisiones informadas. Diseñada para autoridades, operadores y
            público general.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto aspect-video overflow-hidden rounded-xl group">
          <img
            src={images[current]}
            onClick={() => setOpenViewer(true)}
            className="w-full h-full transition duration-700 cursor-zoom-in"
          />

          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 
            bg-white/10 backdrop-blur-md border border-white/20
            hover:bg-[#fb923c] text-white 
            w-12 h-12 rounded-full flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
          >
            <span className="text-xl font-bold">‹</span>
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 
            bg-white/10 backdrop-blur-md border border-white/20
            hover:bg-[#fb923c] text-white 
            w-12 h-12 rounded-full flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
          >
            <span className="text-xl font-bold">›</span>
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

      {/* Sección beneficios */}
      <section className="py-32 flex items-center bg-[#add6bc] px-6">
        <div className="fade-up max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-88 rounded-2xl overflow-hidden shadow-2xl">
            <img src={SafeFondo} className="w-full h-full object-cover" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
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

      {/* Modal de imagen */}
      {openViewer && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={() => setOpenViewer(false)}
        >
          <div
            className="relative w-full h-full flex items-center justify-center px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-7xl w-full">
              <img
                src={images[current]}
                className="w-full max-w-[95vw] object-contain rounded-xl shadow-2xl"
              />

              {/* Botón cerrar */}
              <button
                onClick={() => setOpenViewer(false)}
                className="absolute -top-14 -right-14 
              bg-[#f10202] text-white 
                w-14 h-14 rounded-full flex items-center justify-center
                shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
              >
                <span className="text-lg font-bold">×</span>
              </button>
            </div>

            <button
              onClick={prev}
              className="absolute left-52 top-1/2 -translate-y-1/2 
            bg-white/10 backdrop-blur-md border border-white/20
            hover:bg-[#fb923c] text-white 
              w-14 h-14 rounded-full flex items-center justify-center
              transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
            >
              <span className="text-xl font-bold">‹</span>
            </button>

            <button
              onClick={next}
              className="absolute right-52 top-1/2 -translate-y-1/2 
            bg-white/10 backdrop-blur-md border border-white/20
            hover:bg-[#fb923c] text-white 
              w-14 h-14 rounded-full flex items-center justify-center
              transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
            >
              <span className="text-xl font-bold">›</span>
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Inicio;
