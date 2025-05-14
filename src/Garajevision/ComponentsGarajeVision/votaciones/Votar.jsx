import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import VoteHeader from "./VoteHeader";
import VoteForm from "./VoteForm";
import VoteSummary from "./VoteSummary";

const POINTS = [12, 10, 8, 7, 6, 5, 4, 3, 2, 1];
const PLACEHOLDER_POSTER = "/logo.svg";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    " a las " +
    date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  );
}

const Votar = () => {
  const { id: editionId } = useParams();
  const [edition, setEdition] = useState(null);
  const [videos, setVideos] = useState([]);
  const [votacion, setVotacion] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const carouselRef = useRef(null);
  const [user, setUser] = useState(null);
  const [resumenVoto, setResumenVoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [fechaVoto, setFechaVoto] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      const { data: ed, error: edErr } = await supabase
        .from("editions")
        .select("id, name, videos(*), votaciones(*)")
        .eq("id", editionId)
        .maybeSingle();
      if (edErr || !ed) {
        setError("No se pudo cargar la edición");
        setLoading(false);
        return;
      }
      const shuffledVideos = (ed.videos || [])
        .slice()
        .sort(() => Math.random() - 0.5);
      setEdition(ed);
      setVideos(shuffledVideos);
      let userId = user?.id;
      let resumen = null;
      let fechaVoto = null;
      if (userId) {
        const { data: session, error: sessionErr } = await supabase
          .from("voting_sessions")
          .select("id, created_at")
          .eq("user_id", userId)
          .eq("edition_id", editionId)
          .maybeSingle();
        if (session && session.id) {
          const { data: puntuaciones, error: puntErr } = await supabase
            .from("puntuaciones")
            .select("video_id, points")
            .eq("session_id", session.id);
          if (puntErr) {
            setError("Error al cargar tu votación");
            setLoading(false);
            return;
          }
          resumen = puntuaciones;
          fechaVoto = session.created_at;
        }
      }
      setResumenVoto(resumen);
      setFechaVoto(fechaVoto);
      const now = new Date();
      const vot = (ed.votaciones || []).find(
        (v) => new Date(v.start_at) <= now && new Date(v.end_at) >= now
      );
      setVotacion(vot || null);
      setLoading(false);
    };
    fetchData();
  }, [editionId, user]);

  useEffect(() => {
    setShowVideo(false);
  }, [carouselIndex, editionId]);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    };
    getUser();
  }, []);

  const handleSelect = (point, videoId) => {
    setAssignments((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((k) => {
        if (updated[k] === videoId) updated[k] = null;
      });
      updated[point] = videoId;
      return { ...updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    const selected = Object.values(assignments).filter(Boolean);
    if (selected.length !== POINTS.length) {
      setError("Debes asignar todos los puntos a vídeos distintos.");
      setSubmitting(false);
      return;
    }
    if (!user) {
      setError("Debes iniciar sesión para votar.");
      setSubmitting(false);
      return;
    }
    try {
      let sessionId;
      const { data: existingSession, error: sessionErr } = await supabase
        .from("voting_sessions")
        .select("id")
        .eq("user_id", user.id)
        .eq("edition_id", editionId)
        .maybeSingle();
      if (sessionErr) throw sessionErr;
      if (existingSession && existingSession.id) {
        sessionId = existingSession.id;
      } else {
        const { data: newSession, error: newSessionErr } = await supabase
          .from("voting_sessions")
          .insert({
            user_id: user.id,
            edition_id: editionId,
            votacion_id: votacion.id,
          })
          .select()
          .maybeSingle();
        if (newSessionErr || !newSession)
          throw (
            newSessionErr || new Error("No se pudo crear la sesión de votación")
          );
        sessionId = newSession.id;
      }
      await supabase.from("puntuaciones").delete().eq("session_id", sessionId);
      const puntuaciones = Object.entries(assignments).map(([pt, videoId]) => ({
        session_id: sessionId,
        video_id: videoId,
        points: parseInt(pt, 10),
      }));
      const { error: puntErr } = await supabase
        .from("puntuaciones")
        .insert(puntuaciones);
      if (puntErr) throw puntErr;
      setSuccess("¡Has votado, nos vemos en la gala!");
      // Refrescar resumen para bloquear el formulario
      setResumenVoto(
        puntuaciones.map((p) => ({ video_id: p.video_id, points: p.points }))
      );
    } catch (err) {
      setError("Error al guardar tu voto. Intenta de nuevo.");
      console.error("[VOTAR] Error al guardar votación:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const goToPrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
    setShowVideo(false);
  };
  const goToNext = () => {
    setCarouselIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
    setShowVideo(false);
  };

  if (loading) {
    return <div className="text-white p-8 text-center">Cargando…</div>;
  }
  if (error) {
    return <div className="text-red-400 p-8 text-center">{error}</div>;
  }
  if (!edition || !votacion) {
    return (
      <div className="text-white p-8 text-center">
        No hay votación activa para esta edición.
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-4xl bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-2xl border-4 border-indigo-900 p-6 space-y-8 shadow-xl">
        <VoteHeader
          edition={edition}
          votacion={votacion}
          formatDate={formatDate}
        />
        {resumenVoto ? (
          <VoteSummary
            resumenVoto={resumenVoto}
            videos={videos}
            fechaVoto={fechaVoto}
          />
        ) : (
          <VoteForm
            edition={edition}
            votacion={votacion}
            videos={videos}
            assignments={assignments}
            handleSelect={handleSelect}
            handleSubmit={handleSubmit}
            error={error}
            success={success}
            carouselIndex={carouselIndex}
            goToPrev={goToPrev}
            goToNext={goToNext}
            showVideo={showVideo}
            setShowVideo={setShowVideo}
            PLACEHOLDER_POSTER={PLACEHOLDER_POSTER}
            user={user}
            loading={submitting}
          />
        )}
      </div>
    </div>
  );
};

export default Votar;
