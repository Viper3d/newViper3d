import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import VideoCard from "./VideoCard";

// Helper function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;
  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // Example: "10 de mayo de 2025 a las 14:30"
  return (
    date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    " a las " +
    date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
};

const EdicionCard = ({
  edicion,
  isOpen,
  onToggle,
  onPlay,
  isVotingActive,
  relevantVotingStartDate,
  relevantVotingEndDate,
}) => {
  const [shuffledAndSortedVideos, setShuffledAndSortedVideos] = useState([]);
  const [showFullGrid, setShowFullGrid] = useState(isOpen);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  // Handler para el botón de votar
  const handleVotar = async () => {
    // 1. Comprobar si el usuario está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      // Redirigir a login y guardar la edición para volver después
      navigate("/login", { state: { from: `/votar/${edicion.id}` } });
    } else {
      // Redirigir directamente a la página de votación
      navigate(`/votar/${edicion.id}`);
    }
  };

  useEffect(() => {
    // Separate videos with and without position
    const positionedVideos = edicion.videos.filter((v) => v.position != null);
    const unpositionedVideos = edicion.videos.filter((v) => v.position == null);

    // Sort positioned videos by position
    positionedVideos.sort((a, b) => a.position - b.position);

    // Shuffle unpositioned videos
    const shuffledUnpositionedVideos = shuffleArray([...unpositionedVideos]); // Create a new array before shuffling

    // Combine them: positioned first, then shuffled unpositioned
    const allVideosInOrder = [
      ...positionedVideos,
      ...shuffledUnpositionedVideos,
    ];
    setShuffledAndSortedVideos(allVideosInOrder);
  }, [edicion.videos]); // Recalculate when edicion.videos changes

  useEffect(() => {
    if (isOpen) {
      setShowFullGrid(true);
      setTimeout(() => setAnimating(true), 10); // Pequeño delay para asegurar el render
    } else if (showFullGrid) {
      setAnimating(false); // Inicia animación de cierre
      const timeout = setTimeout(() => setShowFullGrid(false), 350); // Espera a que termine la animación
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const buttonGlow = "hover:shadow-[0_0_24px_rgba(255,255,255,0.8)]";

  let tooltipMessage = "";
  const now = new Date();

  if (!isVotingActive) {
    const startDate = relevantVotingStartDate
      ? new Date(relevantVotingStartDate)
      : null;
    const endDate = relevantVotingEndDate
      ? new Date(relevantVotingEndDate)
      : null;

    if (startDate && startDate > now) {
      tooltipMessage = `La votación comienza el ${formatDate(
        relevantVotingStartDate
      )}.`;
    } else if (endDate && endDate < now) {
      tooltipMessage = `La votación terminó el ${formatDate(
        relevantVotingEndDate
      )}.`;
    } else {
      tooltipMessage = "La votación no está activa en este momento.";
    }
  }

  return (
    <div className="bg-indigo-900 bg-opacity-90 rounded-2xl overflow-hidden shadow-lg transition-shadow duration-500 hover:shadow-2xl">
      {/* Header con Flexbox para alinear título y botón */}
      <div className="flex justify-between items-center p-4">
        {/* Título de la Edición */}
        <h3 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-500 to-purple-900 [text-shadow:0_0_5px_rgba(192,132,252,0.5),_0_0_10px_rgba(192,132,252,0.3)] transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-[1.02] mr-4">
          {edicion.name}
        </h3>

        {/* Grupo del Botón Votar y Tooltip (ahora parte del flujo flex) */}
        <div className="relative group flex-shrink-0">
          <button
            className={`px-4 py-1.5 rounded-full inline-flex items-center gap-2 font-bold text-base shadow-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-200 transition-all duration-200
              ${
                isVotingActive
                  ? "bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white hover:from-indigo-600 hover:to-cyan-500 hover:scale-105"
                  : "bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100 text-gray-400 cursor-not-allowed opacity-60"
              }
            `}
            style={
              isVotingActive
                ? { boxShadow: "0 2px 8px 0 rgba(49, 130, 206, 0.12)" }
                : {}
            }
            disabled={!isVotingActive}
            onClick={isVotingActive ? handleVotar : undefined}
          >
            <svg
              className="w-4 h-4 opacity-80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Votar
          </button>
          {!isVotingActive && tooltipMessage && (
            <div
              className="absolute right-0 mt-2 z-20 // Asegurar que el tooltip esté por encima
                         w-max max-w-[200px] sm:max-w-xs md:max-w-sm
                         p-2 bg-gray-800 text-white text-xs rounded-md shadow-xl
                         opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
                         transition-opacity duration-300
                         pointer-events-none"
            >
              {tooltipMessage}
            </div>
          )}
        </div>
      </div>

      {/* Grid cerrado: solo 3 vídeos, sin animación */}
      {!showFullGrid && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {shuffledAndSortedVideos.slice(0, 3).map((v) => (
            <VideoCard key={v.id} video={v} onPlay={onPlay} />
          ))}
        </div>
      )}

      {/* Grid abierto/cerrando: animación de scale y opacidad */}
      {showFullGrid && (
        <div
          className={`p-4 grid grid-cols-1 sm:grid-cols-3 gap-6 transform-gpu origin-top transition-all duration-350
            ${animating ? "scale-y-100 opacity-100" : "scale-y-75 opacity-0"}`}
        >
          {shuffledAndSortedVideos.map((v) => (
            <VideoCard key={v.id} video={v} onPlay={onPlay} />
          ))}
        </div>
      )}
      <div className="p-4 text-center">
        <button
          onClick={onToggle}
          className={`
            mt-2 px-4 py-2
            bg-black text-white font-semibold rounded-md
            transition-shadow duration-300
            ${buttonGlow}
          `}
        >
          {isOpen ? "Cerrar" : "Ver todas las canciones"}
        </button>
      </div>
    </div>
  );
};

export default EdicionCard;
