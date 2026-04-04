import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import PageTitle from "../../components/PageTitle";
import SafeFondo from "../../assets/SafeBridgeFondo.png";

const About = () => {
  useScrollAnimation();

  return (
    <div className="font-landing bg-[#3a8075] text-white">
      <PageTitle title="Acerca de" />
      <Header />
      <section className="py-32 px-6 flex justify-center fade-up">
        <div className="relative max-w-4xl w-full text-center">
          {/* Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#fb923c] to-[#f9d423] blur-2xl opacity-30 rounded-3xl"></div>

          {/* Contenedor */}
          <div className="relative bg-[#214543]/80 backdrop-blur-md rounded-3xl p-12 border border-white/10 shadow-xl">
            {/* Badge */}
            <span className="inline-block mb-4 px-4 py-1 text-sm bg-[#fb923c] text-white rounded-full font-medium">
              Innovación tecnológica
            </span>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre <span className="text-[#fb923c]">Safe</span>Bridge
            </h1>

            <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
              Transformamos la seguridad urbana mediante tecnología inteligente,
              permitiendo anticipar riesgos, optimizar decisiones y proteger
              vidas en tiempo real.
            </p>

            {/* Línea decorativa */}
            <div className="w-20 h-1 bg-[#fb923c] mx-auto mt-8 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* about us */}
      <section className="pb-32 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="fade-up">
          <h2 className="text-3xl font-bold mb-6 text-[#fb923c]">
            ¿Qué es SafeBridge?
          </h2>

          <p className="leading-7 text-justify">
            SafeBridge es una solución tecnológica enfocada en la prevención de
            riesgos en puentes y pasos a desnivel. Nuestro objetivo es anticipar
            situaciones peligrosas mediante monitoreo en tiempo real y brindar
            información clave para la toma de decisiones.
          </p>

          <p className="leading-7 mt-4 text-justify">
            A través de nuestra plataforma, usuarios, autoridades y
            organizaciones pueden acceder a datos confiables que permiten actuar
            antes de que ocurra una emergencia.
          </p>
        </div>

        <div className="h-88 bg-gray-200 rounded-xl flex items-center justify-center">
          <img src={SafeFondo} className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-32 bg-[#add6bc] px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="fade-up bg-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#fb923c]"></div>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Nuestra misión
            </h2>

            <p className="text-gray-700 leading-7 text-justify">
              Proteger vidas y reducir riesgos mediante tecnología inteligente,
              proporcionando herramientas que permitan prevenir accidentes y
              mejorar la respuesta ante situaciones críticas en entornos
              urbanos.
            </p>
          </div>
          <div className="fade-up bg-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#fb923c]"></div>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Nuestra visión
            </h2>

            <p className="text-gray-700 leading-7 text-justify">
              Convertirnos en un referente global en soluciones inteligentes
              para ciudades, impulsando infraestructuras más seguras, conectadas
              y resilientes a través de la innovación tecnológica.
            </p>
          </div>
        </div>
      </section>

      {/* Qué hacemos */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 fade-up">
          <h2 className="text-4xl font-bold mb-6">¿Qué hacemos?</h2>

          <p className="text-white/80 max-w-2xl mx-auto">
            SafeBridge integra monitoreo, análisis y visualización de datos para
            prevenir riesgos en tiempo real y mejorar la seguridad en entornos
            urbanos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-20">
          <div className="fade-up bg-white text-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-3 text-center">
              Monitoreo inteligente
            </h3>
            <p className="text-justify">
              Supervisamos continuamente condiciones críticas para anticipar
              riesgos y generar información confiable.
            </p>
          </div>

          <div className="fade-up bg-white text-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-3 text-center">
              Alertas en tiempo real
            </h3>
            <p className="text-justify">
              Notificamos de forma inmediata a usuarios y autoridades para
              actuar con rapidez ante cualquier situación.
            </p>
          </div>

          <div className="fade-up bg-white text-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-3 text-center">
              Plataforma digital
            </h3>
            <p className="text-justify">
              Ofrecemos una plaforma intuitiva que permite visualizar datos,
              analizar la información y tomar mejores decisiones informadas.
            </p>
          </div>
        </div>
        <div className="text-center fade-up mt-20">
          <div className="bg-gradient-to-r from-[#214543] to-[#3a8075] p-10 rounded-3xl shadow-xl max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Conecta con <span className="text-[#fb923c]">Safe</span>Bridge
            </h2>

            <p className="text-white/80 mb-8">
              Estamos construyendo el futuro de la seguridad urbana. Si quieres
              colaborar, conocer más o implementar nuestra solución, estaremos
              encantados de hablar contigo.
            </p>

            <div className="flex justify-center gap-6 text-3xl">
              <a
                href="https://github.com/KingCalvo"
                target="_blank"
                className="bg-white/10 p-3 rounded-full hover:bg-[#fb923c] transition-all duration-300 hover:scale-110"
              >
                <FaGithub />
              </a>

              <a
                href="https://www.linkedin.com/in/enrique-calvo-garcia-022151168/"
                target="_blank"
                className="bg-white/10 p-3 rounded-full hover:bg-[#fb923c] transition-all duration-300 hover:scale-110"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://www.instagram.com/enriquecalvog/"
                target="_blank"
                className="bg-white/10 p-3 rounded-full hover:bg-[#fb923c] transition-all duration-300 hover:scale-110"
              >
                <FaInstagram />
              </a>

              <a
                href="mailto:enriquecalvo.dev@gmail.com"
                className="bg-white/10 p-3 rounded-full hover:bg-[#fb923c] transition-all duration-300 hover:scale-110"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
