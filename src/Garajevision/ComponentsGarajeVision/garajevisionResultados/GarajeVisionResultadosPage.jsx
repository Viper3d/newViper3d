import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GarajeVisionResults from "./GarajeVisionResults";
import { supabase } from "../../../lib/supabaseClient";

// Página principal de resultados GarajeVision
const GarajeVisionResultadosPage = () => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [videos, setVideos] = useState([]);
  const [edition, setEdition] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResultados = async () => {
      setLoading(true);
      setError("");
      // Obtener la edición más reciente
      const { data: editionData, error: editionErr } = await supabase
        .from("editions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (editionErr || !editionData) {
        setError("No se pudo cargar la edición");
        setLoading(false);
        return;
      }
      setEdition(editionData);
      // Obtener vídeos de la edición
      const { data: vids, error: vidsErr } = await supabase
        .from("videos")
        .select("id, title")
        .eq("edition_id", editionData.id);
      if (vidsErr) {
        setError("No se pudieron cargar los vídeos");
        setLoading(false);
        return;
      }
      setVideos(vids);
      // Obtener sesiones de voto
      const { data: sessionsData, error: sessErr } = await supabase
        .from("voting_sessions")
        .select("id, user_id, created_at")
        .eq("edition_id", editionData.id);
      if (sessErr) {
        setError("No se pudieron cargar las sesiones de voto");
        setLoading(false);
        return;
      }
      // Obtener perfiles
      const userIds = [...new Set(sessionsData.map((s) => s.user_id))];
      let profiles = [];
      if (userIds.length > 0) {
        const { data: profData, error: profErr } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);
        if (!profErr && profData) {
          profiles = profData;
        }
      }
      // Obtener puntuaciones
      const sessionIds = sessionsData.map((s) => s.id);
      let puntuacionesMap = {};
      if (sessionIds.length > 0) {
        const { data: puntos, error: puntosErr } = await supabase
          .from("puntuaciones")
          .select("session_id, video_id, points")
          .in("session_id", sessionIds);
        if (!puntosErr && puntos) {
          puntuacionesMap = puntos.reduce((acc, p) => {
            if (!acc[p.session_id]) acc[p.session_id] = [];
            acc[p.session_id].push(p);
            return acc;
          }, {});
        }
      }
      // Merge sesiones + perfiles + votos
      const sessionsWithDetails = sessionsData.map((s) => {
        const profile = profiles.find((p) => p.id === s.user_id);
        const fullName = profile?.full_name || null;
        const votos = (puntuacionesMap[s.id] || []).sort(
          (a, b) => b.points - a.points
        );
        return { ...s, fullName, votos };
      });
      setSessions(sessionsWithDetails);
      setLoading(false);
    };
    fetchResultados();
  }, []);

  if (loading) {
    return <div className="text-white">Cargando resultados...</div>;
  }
  if (error) {
    return <div className="text-red-400 ">{error}</div>;
  }
  return (
    <div className=" bg-gradient-to-br from-violet-900 via-indigo-900 to-gray-900">
      <div className="flex flex-row w-full h-full gap-8 max-w-none">
        <GarajeVisionResults
          sessions={sessions}
          videos={videos}
          edition={edition}
          onClose={() => navigate("/dashboardvotaciones")}
        />
      </div>
    </div>
  );
};

export default GarajeVisionResultadosPage;
