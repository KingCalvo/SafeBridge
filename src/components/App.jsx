import { Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import AdminInicio from "../pages/Administrador/admin_inicio.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin_inicio" element={<AdminInicio />} />
    </Routes>
  );
};

export default App;
