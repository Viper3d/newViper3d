import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import GarajeVision from "./Garajevision/indexGarajeVision.jsx";
import LoginGarajeVision from "./Garajevision/ComponentsGarajeVision/dashboard/loginGarajeVision.jsx";
import ProtectedRoute from "./Garajevision/ComponentsGarajeVision/ProtectedRoute.jsx";
import Dashboard from "./Garajevision/ComponentsGarajeVision/dashboard/Dashboard.jsx";
import DashboardVotaciones from "./Garajevision/ComponentsGarajeVision/dashboardVotaciones/DashboardVotaciones.jsx";
import Votar from "./Garajevision/ComponentsGarajeVision/votaciones/Votar.jsx";
import VotacionDetalles from "./Garajevision/ComponentsGarajeVision/dashboardVotaciones/VotacionDetalles.jsx";
import GarajeVisionResultadosPage from "./Garajevision/ComponentsGarajeVision/garajevisionResultados/GarajeVisionResultadosPage.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<App />} />

        {/* Home de GarajeVision */}
        <Route path="/GarajeVision" element={<GarajeVision />} />

        {/* Login */}
        <Route path="/login" element={<LoginGarajeVision />} />

        {/* Votación pública */}
        <Route path="/votar/:id" element={<Votar />} />

        {/* Resultados GarajeVision - pública */}
        <Route
          path="/garajevision-resultados"
          element={<GarajeVisionResultadosPage />}
        />

        {/* Dashboard solo para admins */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Votaciones solo para admins */}
        <Route
          path="/dashboardvotaciones"
          element={
            <ProtectedRoute>
              <DashboardVotaciones />
            </ProtectedRoute>
          }
        />

        {/* Detalles de votación solo para admins */}
        <Route
          path="/votacion-detalles/:id"
          element={
            <ProtectedRoute>
              <VotacionDetalles />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </React.StrictMode>
);
