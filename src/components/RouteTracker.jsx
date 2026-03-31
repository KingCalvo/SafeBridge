import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const publicRoutes = [
      "/",
      "/signup",
      "/graficosInv",
      "/puentesInv",
      "/alertasInv",
    ];

    // NO guardar rutas públicas
    if (!publicRoutes.includes(location.pathname)) {
      localStorage.setItem("lastRoute", location.pathname);
    }
  }, [location]);

  return null;
};

export default RouteTracker;
