import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import GarajeVisionResults from "../garajevisionResultados/GarajeVisionResults"; // Import the renamed component

const VotacionDetalles = () => {
  const { id } = useParams(); // id de la votación
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [videos, setVideos] = useState([]);
  const [edition, setEdition] = useState(null);
  const [error, setError] = useState("");
  const [showNames, setShowNames] = useState({}); // { sessionId: true/false }
  const [showGarajevisionResults, setShowGarajevisionResults] = useState(false); // New state

  useEffect(() => {
    const fetchDetalles = async () => {
      setLoading(true);
      setError("");
      console.log("[VOTACION DETALLES] id de la votación:", id);

      // 1. Obtener la votación y edición
      const { data: votacion, error: votErr } = await supabase
        .from("votaciones")
        .select("id, edition_id, editions(name), start_at, end_at")
        .eq("id", id)
        .maybeSingle();
      console.log("[VOTACION DETALLES] votacion:", votacion, "error:", votErr);
      if (votErr || !votacion) {
        setError("No se pudo cargar la votación");
        setLoading(false);
        return;
      }
      setEdition(votacion.editions);

      // 2. Obtener vídeos de la edición
      const { data: vids, error: vidsErr } = await supabase
        .from("videos")
        .select("id, title")
        .eq("edition_id", votacion.edition_id);
      console.log("[VOTACION DETALLES] videos:", vids, "error:", vidsErr);
      if (vidsErr) {
        setError("No se pudieron cargar los vídeos");
        setLoading(false);
        return;
      }
      setVideos(vids);

      // 3. Obtener sesiones de voto (sin embed)
      const { data: sessionsData, error: sessErr } = await supabase
        .from("voting_sessions")
        .select("id, user_id, created_at")
        .eq("edition_id", votacion.edition_id);
      console.log(
        "[VOTACION DETALLES] sessionsData:",
        sessionsData,
        "error:",
        sessErr
      );
      if (sessErr) {
        setError("No se pudieron cargar las sesiones de voto");
        setLoading(false);
        return;
      }

      // 4. Obtener datos de los usuarios que votaron (solo full_name)
      const userIds = [...new Set(sessionsData.map((s) => s.user_id))];
      let profiles = [];
      if (userIds.length > 0) {
        const { data: profData, error: profErr } = await supabase
          .from("profiles")
          .select("id, full_name") // email eliminado
          .in("id", userIds);
        console.log(
          "[VOTACION DETALLES] profiles:",
          profData,
          "error:",
          profErr
        );
        if (!profErr && profData) {
          profiles = profData;
        }
      }

      // 5. Obtener puntuaciones de cada sesión
      const sessionIds = sessionsData.map((s) => s.id);
      let puntuacionesMap = {};
      if (sessionIds.length > 0) {
        const { data: puntos, error: puntosErr } = await supabase
          .from("puntuaciones")
          .select("session_id, video_id, points")
          .in("session_id", sessionIds);
        console.log(
          "[VOTACION DETALLES] puntuaciones:",
          puntos,
          "error:",
          puntosErr
        );
        if (!puntosErr && puntos) {
          puntuacionesMap = puntos.reduce((acc, p) => {
            if (!acc[p.session_id]) acc[p.session_id] = [];
            acc[p.session_id].push(p);
            return acc;
          }, {});
        }
      }

      // 6. Merge: sesiones + full_name + votos ordenados
      const sessionsWithDetails = sessionsData.map((s) => {
        const profile = profiles.find((p) => p.id === s.user_id);
        const fullName = profile?.full_name || null;
        const votos = (puntuacionesMap[s.id] || []).sort(
          (a, b) => b.points - a.points
        );
        return { ...s, fullName, votos };
      });

      console.log(
        "[VOTACION DETALLES] sessionsWithDetails:",
        sessionsWithDetails
      );
      setSessions(sessionsWithDetails);
      setLoading(false);
    };

    fetchDetalles();
  }, [id]);

  if (showGarajevisionResults) {
    return (
      <GarajeVisionResults
        sessions={sessions}
        videos={videos}
        edition={edition}
        onClose={() => setShowGarajevisionResults(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:opacity-90"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:opacity-80"
            onClick={() => navigate("/garajevision-resultados")}
            disabled={loading || error || sessions.length === 0}
          >
            Resultados
          </button>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Detalles de la votación
        </h1>
        {edition && (
          <h2 className="text-xl text-gray-300 mb-6">
            Edición: {edition.name}
          </h2>
        )}

        {loading ? (
          <div className="text-white">Cargando...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="space-y-8">
            {sessions.length === 0 ? (
              <div className="text-gray-300">Nadie ha votado aún.</div>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.id}
                  className="bg-gray-700 rounded-lg p-4 shadow-md"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <span className="font-bold text-white">
                      Votante: {s.user_id}
                      {s.fullName && (
                        <>
                          {showNames[s.id] ? (
                            <span className="ml-2 text-green-300">
                              {s.fullName}
                            </span>
                          ) : null}
                          <button
                            className="ml-2 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500"
                            onClick={() =>
                              setShowNames((prev) => ({
                                ...prev,
                                [s.id]: !prev[s.id],
                              }))
                            }
                          >
                            {showNames[s.id]
                              ? "Ocultar nombre"
                              : "Mostrar nombre"}
                          </button>
                        </>
                      )}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Fecha: {new Date(s.created_at).toLocaleString("es-ES")}
                    </span>
                  </div>
                  <div className="ml-2">
                    <ul className="list-disc pl-4">
                      {s.votos.length === 0 ? (
                        <li className="text-gray-400">
                          No hay votos registrados.
                        </li>
                      ) : (
                        s.votos.map((v) => {
                          const video = videos.find(
                            (vid) => vid.id === v.video_id
                          );
                          return (
                            <li key={v.video_id} className="text-white">
                              <span className="font-bold text-indigo-300">
                                {v.points} pts
                              </span>{" "}
                              a{" "}
                              <span className="font-semibold">
                                {video ? video.title : "(Vídeo eliminado)"}
                              </span>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VotacionDetalles;
