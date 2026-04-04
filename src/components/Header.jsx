import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-[#214543] shadow-md py-3" : "bg-transparent py-5"
        }`}
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          {/* Logo */}
          <Link to="/inicio" className="text-xl font-semibold">
            <span className="text-[#fb923c] font-bold">Safe</span>
            <span className="text-white">Bridge</span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex gap-8 text-white font-medium">
            <Link to="/inicio" className="hover:text-[#fb923c] transition">
              Inicio
            </Link>
            <Link to="/servicios" className="hover:text-[#fb923c] transition">
              Servicios
            </Link>
            <Link to="/login" className="hover:text-[#fb923c] transition">
              WebApp
            </Link>
            <Link to="/about" className="hover:text-[#fb923c] transition">
              Acerca de
            </Link>
          </nav>

          {/* Botón Desktop */}
          <Link
            to="/login"
            className="hidden md:block bg-[#fb923c] text-white px-5 py-2 rounded-full font-medium hover:bg-[#f97316] transition"
          >
            Iniciar sesión
          </Link>

          {/* Botón Hamburguesa (Móvil) */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(true)}
          >
            <FaBars />
          </button>
        </div>
      </header>

      {/* Menú movil */}
      <div
        className={`fixed inset-0 z-50 bg-[#214543] transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <div className="flex flex-col h-full px-6 py-6 text-white">
          {/* Header del menú */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">
              <span className="text-[#fb923c] font-bold">Safe</span>
              Bridge
            </span>

            <button onClick={() => setMenuOpen(false)} className="text-2xl">
              <FaTimes />
            </button>
          </div>

          {/* Línea */}
          <div className="border-t border-gray-400 my-6"></div>

          {/* Links */}
          <nav className="flex flex-col gap-6 text-lg font-medium">
            <Link to="/inicio" onClick={() => setMenuOpen(false)}>
              Inicio
            </Link>
            <Link to="/servicios" onClick={() => setMenuOpen(false)}>
              Servicios
            </Link>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              WebApp
            </Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              Acerca de
            </Link>
          </nav>

          {/* Botón abajo */}
          <div className="mt-auto">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-center bg-[#fb923c] text-white py-3 rounded-full font-medium hover:bg-[#f97316] transition"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
