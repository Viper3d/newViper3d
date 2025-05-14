import React from "react";

const VoteHeader = ({ edition, votacion, formatDate }) => (
  <header className="text-center relative py-6 mb-4">
    {/* Fondo decorativo con gradiente y blur */}
    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-fuchsia-700/40 via-violet-700/30 to-indigo-900/60 blur-md opacity-80" />
    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-violet-400 to-indigo-400 drop-shadow-lg mb-2 tracking-tight">
      Votación: <span className="text-white/90">{edition.name}</span>
    </h1>
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-2">
      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl shadow-inner backdrop-blur-md">
        <span className="text-xs text-fuchsia-200 font-bold uppercase tracking-wider">
          Inicio
        </span>
        <span className="text-sm text-white font-semibold">
          {formatDate(votacion.start_at)}
        </span>
      </div>
      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl shadow-inner backdrop-blur-md">
        <span className="text-xs text-indigo-200 font-bold uppercase tracking-wider">
          Fin
        </span>
        <span className="text-sm text-white font-semibold">
          {formatDate(votacion.end_at)}
        </span>
      </div>
    </div>
  </header>
);

export default VoteHeader;
