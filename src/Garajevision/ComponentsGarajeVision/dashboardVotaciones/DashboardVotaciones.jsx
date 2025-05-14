// src/Garajevision/ComponentsGarajeVision/dashboardVotaciones/DashboardVotaciones.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import EditionSelector from "../dashboard/EditionSelector";
import { useNavigate } from "react-router-dom";
import VotacionesForm from "./VotacionesForm";
import VotacionesTable from "./VotacionesTable";

const DashboardVotaciones = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [editions, setEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState(null);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [votaciones, setVotaciones] = useState([]);
  const [editVotacion, setEditVotacion] = useState(null);

  // Protección de ruta: solo admins
  useEffect(() => {
    const protect = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();
      if (error || !profile?.is_admin) {
        navigate("/GarajeVision");
      } else {
        setIsAdmin(true);
      }
    };
    protect();
  }, [navigate]);

  // Cargar ediciones
  useEffect(() => {
    const fetchEditions = async () => {
      const { data, error } = await supabase
        .from("editions")
        .select("id, name")
        .order("created_at", { ascending: false });
      if (!error) setEditions(data);
    };
    fetchEditions();
  }, []);

  // Cargar votaciones
  const fetchVotaciones = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("votaciones")
        .select("id, edition_id, start_at, end_at, editions(name)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching votaciones:", error);
        alert("Error al cargar las votaciones: " + error.message);
        setVotaciones([]);
      } else {
        setVotaciones(data || []);
      }
    } catch (err) {
      console.error("Unexpected error in fetchVotaciones:", err);
      alert("Error inesperado al cargar las votaciones: " + err.message);
      setVotaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchVotaciones();
    } else {
      setVotaciones([]); // Clear votaciones if not admin
    }
  }, [isAdmin]); // Re-fetch when isAdmin status changes

  // Crear votación
  const handleCreateVotacion = async (e) => {
    e.preventDefault();
    if (!selectedEdition || !startAt || !endAt) {
      alert("Debes seleccionar edición, fecha de inicio y fin.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("votaciones").insert({
        edition_id: selectedEdition.id,
        start_at: startAt,
        end_at: endAt,
      });
      if (error) throw error;
      setStartAt("");
      setEndAt("");
      setSelectedEdition(null);
      fetchVotaciones();
      alert("Votación creada correctamente");
    } catch (err) {
      alert("Error al crear la votación: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar votación
  const handleDeleteVotacion = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta votación?")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("votaciones").delete().eq("id", id);
      if (error) throw error;
      fetchVotaciones();
      alert("Votación eliminada correctamente");
    } catch (err) {
      alert("Error al eliminar la votación: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Editar votación (rellena el formulario con los datos de la votación seleccionada)
  const handleEditVotacion = (v) => {
    setEditVotacion(v);
    setSelectedEdition(editions.find((e) => e.id === v.edition_id) || null);
    setStartAt(v.start_at ? v.start_at.slice(0, 16) : "");
    setEndAt(v.end_at ? v.end_at.slice(0, 16) : "");
  };

  // Ver votación
  const handleViewVotacion = (v) => {
    navigate(`/votacion-detalles/${v.id}`);
  };

  // Actualizar votación
  const handleUpdateVotacion = async (e) => {
    e.preventDefault();
    console.log("[EDITAR] selectedEdition:", selectedEdition);
    console.log("[EDITAR] startAt:", startAt, "endAt:", endAt);
    if (!selectedEdition || !startAt || !endAt) {
      alert("Debes seleccionar edición, fecha de inicio y fin.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from("votaciones")
        .update({
          edition_id: selectedEdition.id,
          start_at: startAt,
          end_at: endAt,
        })
        .eq("id", editVotacion.id);
      console.log("[EDITAR] update error:", error);
      setStartAt("");
      setEndAt("");
      setSelectedEdition(null);
      setEditVotacion(null);
      await fetchVotaciones();
      alert("Votación actualizada correctamente");
    } catch (err) {
      console.error("[EDITAR] catch error:", err);
      alert("Error al actualizar la votación: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-500 animate-gradient-xy blur-3xl" />
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-2xl border-4 border-indigo-900 space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">
            Dashboard Votaciones
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:opacity-90"
            >
              Ir a Home
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:opacity-90"
            >
              Volver a Dashboard
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/login");
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:opacity-90"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <VotacionesForm
          editVotacion={editVotacion}
          handleCreateVotacion={handleCreateVotacion}
          handleUpdateVotacion={handleUpdateVotacion}
          editions={editions}
          selectedEdition={selectedEdition}
          setSelectedEdition={setSelectedEdition}
          startAt={startAt}
          setStartAt={setStartAt}
          endAt={endAt}
          setEndAt={setEndAt}
          loading={loading}
          setEditVotacion={setEditVotacion}
        />

        <VotacionesTable
          votaciones={votaciones}
          handleEditVotacion={handleEditVotacion}
          handleViewVotacion={handleViewVotacion}
          handleDeleteVotacion={handleDeleteVotacion}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DashboardVotaciones;
