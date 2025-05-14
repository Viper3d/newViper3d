// src/Garajevision/ComponentsGarajeVision/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = async () => {
      // 1) Obtenemos sesión
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // 2) Consultamos la tabla profiles
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (error || !profile?.is_admin) {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
      setLoading(false);
    };

    checkAdmin();
  }, []);

  // Mientras comprueba la sesión/perfil…
  if (loading) return <div className="text-white p-4">Cargando…</div>;

  // Si no es admin, le mandamos al login
  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si es admin, renderiza el contenido (Dashboard)
  return <>{children}</>;
}
