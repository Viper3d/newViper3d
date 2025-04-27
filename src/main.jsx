import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import GarajeVision from "./Garajevision/indexGarajeVision.jsx";
import LoginGarajeVision from "./Garajevision/ComponentsGarajeVision/loginGarajeVision.jsx";
import ProtectedRoute from "./Garajevision/ComponentsGarajeVision/ProtectedRoute.jsx";
import Dashboard from "./Garajevision/ComponentsGarajeVision/Dashboard.jsx";
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

        {/* Dashboard solo para admins */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </React.StrictMode>
);
