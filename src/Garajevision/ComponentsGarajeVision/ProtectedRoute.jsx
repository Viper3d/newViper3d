import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Navigate } from "react-router-dom";

const adminEmails = ["mendo@calvo.com", "admin@garajevision.com"];

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const email = session?.user?.email;
      setIsAdmin(email ? adminEmails.includes(email) : false);
      setLoading(false);
    });
  }, []);

  if (loading) return null; // o un spinner
  if (!isAdmin) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
