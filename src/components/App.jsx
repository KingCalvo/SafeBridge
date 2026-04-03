import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RouteTracker from "./RouteTracker";

//Rutas de la Landing Page:
import Inicio from "../pages/Landing/inicio.jsx";

//Rutas del Admin:
import InicioAdm from "../pages/Administrador/inicioAdm.jsx";
import GestionUserAdm from "../pages/Administrador/gestionUserAdm.jsx";
import MonitoreoEstacionesAdm from "../pages/Administrador/monitoreoEstacionesAdm.jsx";
import AlertasEventosAdm from "../pages/Administrador/alertasEventosAdm.jsx";
import ConfiguracionAdm from "../pages/Administrador/configuracionAdm.jsx";
import ReportesPuentesPDF from "../pages/Administrador/reportesPuentesPDF.jsx";

//Rutas del Invitado:
import AlertasInv from "../pages/Invitado/alertasInv";
import GraficosInv from "../pages/Invitado/graficosInv.jsx";
import PuentesInv from "../pages/Invitado/puentesInv.jsx";

//Rutas del Operador:
import EventosOpe from "../pages/Operador/eventosOpe.jsx";
import InicioOpe from "../pages/Operador/inicioOpe.jsx";
import MonitoreoSensoresOpe from "../pages/Operador/monitoreoSensoresOpe.jsx";
import ReportesOpe from "../pages/Operador/reportesOpe.jsx";
import ReportePDF from "../pages/Operador/reportePDF.jsx";

const App = () => {
  return (
    <>
      <RouteTracker />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Rutas del Administrador */}
        <Route
          path="/inicioAdm"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <InicioAdm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gestionUserAdm"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <GestionUserAdm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitoreoEstacionesAdm"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <MonitoreoEstacionesAdm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alertasEventosAdm"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <AlertasEventosAdm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/configuracionAdm"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <ConfiguracionAdm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportesPuentesPDF"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <ReportesPuentesPDF />
            </ProtectedRoute>
          }
        />

        {/* Invitado */}
        <Route
          path="/graficosInv"
          element={
            <ProtectedRoute allowedRoles={[3]} allowPublic={true}>
              <GraficosInv />
            </ProtectedRoute>
          }
        />

        <Route
          path="/puentesInv"
          element={
            <ProtectedRoute allowedRoles={[3]} allowPublic={true}>
              <PuentesInv />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alertasInv"
          element={
            <ProtectedRoute allowedRoles={[3]} allowPublic={true}>
              <AlertasInv />
            </ProtectedRoute>
          }
        />

        {/* Operador */}
        <Route
          path="/inicioOpe"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <InicioOpe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/eventosOpe"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <EventosOpe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitoreoSensoresOpe"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <MonitoreoSensoresOpe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportesOpe"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <ReportesOpe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportePDF"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <ReportePDF />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
