import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ----------- Estilos según puntos ----------- */
const getVoteStyle = (points) => {
  if (points === 12) {
    return {
      bg: "bg-gradient-to-r from-yellow-300 via-yellow-100 to-white/30 text-yellow-900 animate-fadeInEpic border-2 border-yellow-400 shadow-xl",
      icon: "🥇",
      glow: "shadow-[0_0_30px_10px_rgba(255,223,70,0.7)]",
    };
  }
  if (points === 10) {
    return {
      bg: "bg-gradient-to-r from-gray-300 via-gray-100 to-white/20 text-gray-900 animate-fadeInEpic border-2 border-gray-400 shadow-xl",
      icon: "🥈",
      glow: "shadow-[0_0_20px_6px_rgba(180,180,180,0.5)]",
    };
  }
  if (points === 8) {
    return {
      bg: "bg-gradient-to-r from-orange-400 via-orange-200 to-white/20 text-orange-900 animate-fadeInEpic border-2 border-orange-400 shadow-lg",
      icon: "🥉",
      glow: "shadow-[0_0_16px_4px_rgba(255,180,80,0.4)]",
    };
  }
  return {
    bg: "bg-gradient-to-r from-blue-900 via-gray-800 to-indigo-900 text-cyan-100 animate-fadeIn border border-blue-700/40",
    icon: null,
    glow: "",
  };
};

/**
 * Devuelve el título del voto:
 * - Si viene en el propio objeto  ➜ use esa string
 * - Si no, lo busca en el array `videos` por `video_id`
 */
const getVoteTitle = (vote, videos) => {
  if (vote.title) return vote.title;
  const vid = videos?.find((v) => v.id === vote.video_id);
  return vid?.title ?? "Título no disponible";
};

/* --------------------------------------------------------- */
/*                      Componente                           */
/* --------------------------------------------------------- */
const VoterVotes = ({
  currentVoteStep, // 1‑4
  votesOfCurrentVoter, // [{ video_id, points, title? }, ...]
  videos, // [{ id, title, ... }, ...]  para resolver títulos
  voterName, // Nombre del jurado
  compact = false,
  showNameZoom, // Added prop
}) => {
  /* --- Filtrar votos según el paso --- */
  const maxPointsByStep = { 1: 7, 2: 8, 3: 10, 4: 12 };
  const allowedMax = maxPointsByStep[currentVoteStep] || 0;

  const votesToShow = votesOfCurrentVoter
    .filter((v) => v.points <= allowedMax) // 1) ≤7, 2) ≤8, 3) ≤10, 4) ≤12
    .sort((a, b) => b.points - a.points); // 12‑10‑8‑7‑…‑1

  return (
    <div className="w-full flex flex-col overflow-hidden h-full max-h-full">
      {/* ----------------- Nombre del jurado ----------------- */}
      <AnimatePresence>
        {showNameZoom && (
          <motion.div
            key="zoomName"
            initial={{ opacity: 0, scale: 0.7, y: 60, filter: "blur(16px)" }}
            animate={{
              opacity: 1,
              scale: compact ? 1.1 : 1.6, // Más compacto en modo compacto
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{ opacity: 0, scale: 0.7, y: -60, filter: "blur(16px)" }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.22 }}
            className="absolute left-0 top-0 w-full h-full flex items-center justify-center z-30 pointer-events-none"
          >
            <span
              className={`${
                compact
                  ? "text-2xl px-3 py-1"
                  : "text-3xl md:text-4xl px-6 py-2"
              } font-extrabold text-green-300 drop-shadow-lg bg-black/60 rounded-3xl border-4 border-green-400/40 shadow-2xl`}
            >
              {voterName || "Final"}
            </span>
          </motion.div>
        )}
        {/* Mostrar 'Final' con el mismo estilo cuando currentVoteStep > 4 */}
        {!showNameZoom && currentVoteStep > 4 && (
          <motion.div
            key="finalZoom"
            initial={{ opacity: 0, scale: 0.7, y: 60, filter: "blur(16px)" }}
            animate={{
              opacity: 1,
              scale: compact ? 1.1 : 1.6, // Más compacto en modo compacto
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{ opacity: 0, scale: 0.7, y: -60, filter: "blur(16px)" }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.22 }}
            className="absolute left-0 top-0 w-full h-full flex items-center justify-center z-30 pointer-events-none"
          >
            <span
              className={`${
                compact
                  ? "text-2xl px-3 py-1"
                  : "text-3xl md:text-4xl px-6 py-2"
              } font-extrabold text-green-300 drop-shadow-lg bg-black/60 rounded-3xl border-4 border-green-400/40 shadow-2xl`}
            >
              Final
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------- Lista de votos ----------------- */}
      {currentVoteStep > 0 && !showNameZoom && (
        <div className="mb-1">
          <h3 className="text-base font-bold mb-1 text-yellow-300 text-center drop-shadow animate-fadeIn">
            Votos revelados:
          </h3>

          <ul className="space-y-1">
            <AnimatePresence>
              {votesToShow.map((vote, idx) => {
                const { bg, icon, glow } = getVoteStyle(vote.points);
                const title = getVoteTitle(vote, videos);

                return (
                  <motion.li
                    layout
                    key={`${vote.video_id}-${vote.points}`}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{
                      duration: 0.44,
                      delay: idx * 0.13,
                      type: "spring",
                      bounce: 0.18,
                      stiffness: 90,
                    }}
                    className={`flex items-center justify-between px-2 py-1 rounded-lg font-bold text-base transition-all duration-700 ${bg} ${glow} relative ${
                      compact ? "min-h-0" : ""
                    }`}
                  >
                    {/* Puntos + icono */}
                    <span className="flex items-center gap-1 text-xl">
                      {icon && (
                        <span className="drop-shadow-lg animate-bounceOnce">
                          {icon}
                        </span>
                      )}
                      <span className="font-extrabold text-xl">
                        {vote.points} pts
                      </span>
                    </span>

                    {/* Título de la canción / vídeo */}
                    <span className="italic text-right w-2/3 truncate font-extrabold text-xl">
                      {title}
                    </span>

                    {/* Destello para podio */}
                    {icon && (
                      <span className="absolute left-0 top-0 w-full h-full pointer-events-none animate-glowFlash" />
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      )}
    </div>
  );
};

export default VoterVotes;
