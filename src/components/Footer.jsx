import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logoSB.png";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="bg-[#0f172a] text-white pt-12"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {/* Logo + descripción */}
        <div>
          <img src={logo} alt="SafeBridge" className="w-32 mb-4" />

          <p className="text-sm text-gray-300 leading-6">
            SafeBridge es un sistema inteligente que previene inundaciones en
            puentes mediante sensores en tiempo real, activando alertas y
            barreras automáticas para proteger vidas, reducir accidentes y
            optimizar la respuesta de las autoridades ante emergencias.
          </p>

          {/* Redes */}
          <div className="flex gap-4 mt-5 text-xl">
            <a href="https://github.com/KingCalvo" target="_blank">
              <FaGithub className="hover:text-[#fb923c] transition" />
            </a>
            <a
              href="https://www.linkedin.com/in/enrique-calvo-garcia-022151168/"
              target="_blank"
            >
              <FaLinkedin className="hover:text-[#fb923c] transition" />
            </a>
            <a href="https://www.instagram.com/enriquecalvog/" target="_blank">
              <FaInstagram className="hover:text-[#fb923c] transition" />
            </a>
          </div>
        </div>

        {/* Enlaces */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-[#fb923c]">Enlaces</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link to="/inicio" className="hover:text-white">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/servicios" className="hover:text-white">
                Servicios
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white">
                WebApp
              </Link>
            </li>
          </ul>
        </div>

        {/* Información */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-[#fb923c]">
            Información
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link to="/about" className="hover:text-white">
                Acerca de
              </Link>
            </li>
            <li>
              <a
                href="https://wa.me/7351241139"
                target="_blank"
                className="hover:text-white"
              >
                Contacto
              </a>
            </li>
            <li>
              <a
                href="https://mail.google.com/mail/?view=cm&to=enriquecalvo.dev@gmail.com"
                className="hover:text-white"
              >
                Correo electrónico
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Línea */}
      <div className="border-t border-gray-700 mt-10"></div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-400 py-6">
        © Enrique Calvo Garcia 2025. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
