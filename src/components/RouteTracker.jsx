import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const publicRoutes = [
      "/",
      "/servicios",
      "/about",
      "/login",
      "/signup",
      "/graficosInv",
      "/puentesInv",
      "/alertasInv",
    ];
    if (location.pathname === "/inicioPC") return;
    if (location.pathname === "/login") return;
    // NO guardar rutas públicas
    if (!publicRoutes.includes(location.pathname)) {
      localStorage.setItem("lastRoute", location.pathname);
    }
  }, [location]);

  return null;
};

export default RouteTracker;
