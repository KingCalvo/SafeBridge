import { Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
//Rutas del Admin:
import InicioAdm from "../pages/Administrador/inicioAdm.jsx";
import GestionUserAdm from "../pages/Administrador/gestionUserAdm.jsx";
import MonitoreoSensoresAdm from "../pages/Administrador/monitoreoSensoresAdm.jsx";
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
    <Routes>
      <Route path="/" element={<Login />} />
      {/* Rutas del Administrador */}
      <Route path="/inicioAdm" element={<InicioAdm />} />
      <Route path="/gestionUserAdm" element={<GestionUserAdm />} />
      <Route path="/monitoreoSensoresAdm" element={<MonitoreoSensoresAdm />} />
      <Route path="/alertasEventosAdm" element={<AlertasEventosAdm />} />
      <Route path="/configuracionAdm" element={<ConfiguracionAdm />} />
      <Route path="/reportesPuentesPDF" element={<ReportesPuentesPDF />} />

      {/* Rutas del Invitado */}
      <Route path="/alertasInv" element={<AlertasInv />} />
      <Route path="/graficosInv" element={<GraficosInv />} />
      <Route path="/puentesInv" element={<PuentesInv />} />

      {/* Rutas del Operador */}
      <Route path="/eventosOpe" element={<EventosOpe />} />
      <Route path="/inicioOpe" element={<InicioOpe />} />
      <Route path="/monitoreoSensoresOpe" element={<MonitoreoSensoresOpe />} />
      <Route path="/reportesOpe" element={<ReportesOpe />} />
      <Route path="/reportePDF" element={<ReportePDF />} />
    </Routes>
  );
};

export default App;
