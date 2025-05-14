import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

const Scoreboard = ({ rankedVideos, scores }) => {
  // Ref para guardar las puntuaciones anteriores
  const prevScoresRef = useRef(scores);

  // Tras cada render donde scores cambie, actualizamos el ref
  useEffect(() => {
    prevScoresRef.current = scores;
  }, [scores]);

  // Simulación: si hay menos de 17 vídeos, rellenar con vídeos ficticios
  let videos = rankedVideos;

  // Calcular el punto de corte para las columnas
  const mid = Math.ceil(videos.length / 2);
  const leftColumn = videos.slice(0, mid);
  const rightColumn = videos.slice(mid);

  // Componente que pinta los puntos y anima solo si ha subido
  const AnimatedPoints = ({ videoId }) => {
    const ref = useRef();
    const current = scores[videoId] ?? 0;
    const previous = prevScoresRef.current[videoId] ?? 0;
    const hasIncreased = current > previous;

    useEffect(() => {
      if (ref.current && hasIncreased) {
        ref.current.animate(
          [
            { scale: 1, background: "#155e75" },
            { scale: 1.2, background: "#22d3ee" },
            { scale: 1, background: "#155e75" },
          ],
          { duration: 500 }
        );
      }
    }, [current, hasIncreased]);

    return (
      <span
        ref={ref}
        className="text-base md:text-lg font-extrabold px-1 py-0.5 rounded bg-cyan-900/80 text-white shadow-sm inline-block"
      >
        {current} pts
      </span>
    );
  };

  // Renderizamos cada item de la tabla
  const renderItem = (video, index) => {
    const globalIndex = index;
    const isTop3 = globalIndex < 3;
    const bg = isTop3
      ? [
          "bg-gradient-to-r from-yellow-300 via-yellow-100 to-white/20 text-black border-yellow-300/60",
          "bg-gradient-to-r from-gray-300 via-gray-100 to-white/20 text-black border-gray-300/60",
          "bg-gradient-to-r from-orange-400 via-orange-200 to-white/20 text-black border-orange-300/60",
        ][globalIndex]
      : "bg-gray-800/90 text-white border-gray-700/60";
    const medal = isTop3
      ? [
          <span key="gold" className="text-xl mr-1">
            🥇
          </span>,
          <span key="silver" className="text-xl mr-1">
            🥈
          </span>,
          <span key="bronze" className="text-xl mr-1">
            🥉
          </span>,
        ][globalIndex]
      : null;

    return (
      <motion.div
        key={video.id}
        layoutId={`item-${video.id}`}
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{
          layout: { type: "spring", stiffness: 200, damping: 30 },
          opacity: { duration: 0.3 },
          y: { type: "spring", stiffness: 120, damping: 20 },
        }}
        className={`flex justify-between items-center p-2 md:p-2 rounded-lg mb-2 shadow font-semibold text-sm md:text-base border-l-4 ${bg}`}
      >
        <span className="flex items-center gap-1 truncate">
          <span
            className={`w-7 h-7 flex items-center justify-center rounded-full font-extrabold mr-1 text-base md:text-lg ${
              isTop3
                ? "bg-yellow-200 text-yellow-900 border border-yellow-400"
                : "bg-blue-900 text-cyan-300 border border-blue-700"
            }`}
          >
            {globalIndex + 1}
          </span>
          {medal}
          <span className="truncate font-extrabold text-base md:text-lg">
            {video.title}
          </span>
        </span>
        <AnimatedPoints videoId={video.id} />
      </motion.div>
    );
  };

  return (
    <LayoutGroup>
      <motion.div
        layout
        className="w-full max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-1 sm:p-2 md:p-4 rounded-3xl shadow-2xl border-4 border-blue-700/40 backdrop-blur-xl flex flex-col items-start mx-auto"
      >
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold mb-2 md:mb-4 text-center text-cyan-200 drop-shadow-lg tracking-wide">
          Clasificación
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-3 w-full">
          <div className="flex flex-col">
            <AnimatePresence initial={false}>
              {leftColumn.map((video, i) => renderItem(video, i))}
            </AnimatePresence>
          </div>
          <div className="flex flex-col">
            <AnimatePresence initial={false}>
              {rightColumn.map((video, i) => renderItem(video, i + mid))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </LayoutGroup>
  );
};

export default Scoreboard;
