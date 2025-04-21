import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import GarajeVision from "./Garajevision/indexGarajeVision.jsx";
import LoginGarajeVision from "./Garajevision/ComponentsGarajeVision/loginGarajeVision";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<App />} />
        {/* Nueva ruta de Más Información */}
        <Route path="/GarajeVision" element={<GarajeVision />} />
        {/* Nueva ruta Login */}
        <Route path="/LoginGarajeVision" element={<LoginGarajeVision />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
