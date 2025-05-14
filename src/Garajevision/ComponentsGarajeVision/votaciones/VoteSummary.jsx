import React from "react";
import { Link } from "react-router-dom";

const getBgAndMedal = (points) => {
  if (points === 12) {
    return {
      bg: "bg-gradient-to-r from-yellow-300 via-yellow-200 to-white/20",
      medal: <span className="text-lg mr-1">🥇</span>,
      text: "text-black",
    };
  } else if (points === 10) {
    return {
      bg: "bg-gradient-to-r from-gray-300 via-gray-100 to-white/20",
      medal: <span className="text-lg mr-1">🥈</span>,
      text: "text-black",
    };
  } else if (points === 8) {
    return {
      bg: "bg-gradient-to-r from-orange-400 via-orange-200 to-white/20",
      medal: <span className="text-lg mr-1">🥉</span>,
      text: "text-black",
    };
  } else if (points === 7) {
    return {
      bg: "bg-gradient-to-r from-blue-600 via-indigo-500 to-white/10",
      medal: null,
      text: "text-black",
    };
  } else if (points === 6) {
    return {
      bg: "bg-gradient-to-r from-blue-500 via-indigo-400 to-white/10",
      medal: null,
      text: "text-black",
    };
  } else if (points === 5) {
    return {
      bg: "bg-gradient-to-r from-blue-400 via-indigo-300 to-white/10",
      medal: null,
      text: "text-black",
    };
  } else if (points === 4) {
    return {
      bg: "bg-gradient-to-r from-blue-300 via-indigo-200 to-white/10",
      medal: null,
      text: "text-black",
    };
  } else if (points === 3) {
    return {
      bg: "bg-gradient-to-r from-blue-200 via-indigo-100 to-white/10",
      medal: null,
      text: "text-black",
    };
  } else if (points === 2) {
    return {
      bg: "bg-gradient-to-r from-blue-100 via-indigo-50 to-white/10",
      medal: null,
      text: "text-black",
    };
  } else if (points === 1) {
    return {
      bg: "bg-gradient-to-r from-blue-50 via-gray-100 to-white/10",
      medal: null,
      text: "text-black",
    };
  }
  return { bg: "bg-gray-700", medal: null, text: "text-black" };
};

const VoteSummary = ({ resumenVoto, videos, fechaVoto }) => (
  <>
    <h2 className="text-2xl font-bold text-white text-center mb-4">
      Tus votos
    </h2>
    {fechaVoto && (
      <div className="text-center text-gray-300 text-sm mb-2">
        Votaste el{" "}
        {new Date(fechaVoto).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        a las{" "}
        {new Date(fechaVoto).toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    )}
    <div className="grid grid-cols-1 gap-1 mb-2">
      {resumenVoto
        .sort((a, b) => b.points - a.points)
        .map((voto) => {
          const video = videos.find((vid) => vid.id === voto.video_id);
          const { bg, medal, text } = getBgAndMedal(voto.points);
          return (
            <div
              key={voto.video_id}
              className={`flex flex-col items-center justify-center px-2 py-1 ${bg} rounded-md shadow-sm backdrop-blur-sm min-h-[32px]`}
            >
              <div className="flex items-center gap-1 min-w-[56px] justify-center w-full">
                {medal}
                <span
                  className={`font-bold text-xl ${text} text-center`}
                  style={{ textShadow: "0 1px 4px #fff8" }}
                >
                  {voto.points}
                </span>
                <span className={`ml-1 text-sm font-bold ${text} text-center`}>
                  pts
                </span>
              </div>
              <span
                className={`font-bold mt-1 ${text} text-center w-full text-lg`}
              >
                {video ? video.title : "(Vídeo eliminado)"}
              </span>
            </div>
          );
        })}
    </div>
    <div className="text-green-400 text-center font-bold text-lg mt-4">
      ¡Gracias por votar!
    </div>
    <div className="flex justify-center mt-6">
      <Link
        to="/GarajeVision"
        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white font-extrabold text-lg rounded-full shadow-xl hover:from-indigo-600 hover:to-cyan-500 hover:scale-105 transition-all duration-300 border-2 border-white/30 focus:outline-none focus:ring-4 focus:ring-cyan-300"
        style={{ boxShadow: "0 4px 24px 0 rgba(49, 130, 206, 0.25)" }}
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
          />
        </svg>
        Volver a la Home
      </Link>
    </div>
  </>
);

export default VoteSummary;
