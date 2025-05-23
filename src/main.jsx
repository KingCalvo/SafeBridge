import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./components/App.jsx";

import { NotificacionContext } from "./components/NotificacionContext.jsx";
import { AlertaProvider } from "./components/AlertaContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificacionContext>
      <AlertaProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AlertaProvider>
    </NotificacionContext>
  </StrictMode>
);
