import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles, allowPublic = false }) => {
  const { user, rol, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  if (!user && allowPublic) return children;

  if (!user) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.includes(rol?.id_rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
