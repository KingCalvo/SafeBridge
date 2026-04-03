import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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

        {/* Menu */}
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

        {/* Botón */}
        <Link
          to="/login"
          className="bg-[#fb923c] text-white px-5 py-2 rounded-full font-medium hover:bg-[#f97316] transition"
        >
          Iniciar sesión
        </Link>
      </div>
    </header>
  );
};

export default Header;
