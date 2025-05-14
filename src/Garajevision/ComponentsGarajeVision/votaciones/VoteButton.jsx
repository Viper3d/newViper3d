import React from "react";

const VoteButton = ({ loading, disabled }) => (
  <button
    type="submit"
    className={`w-full max-w-xs px-5 py-2 mt-4 rounded-full inline-flex items-center justify-center gap-2 font-bold text-base shadow-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-200 transition-all duration-200
      ${
        !disabled && !loading
          ? "bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white hover:from-indigo-600 hover:to-cyan-500 hover:scale-105"
          : "bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100 text-gray-400 cursor-not-allowed opacity-60"
      }
    `}
    style={
      !disabled && !loading
        ? { boxShadow: "0 2px 8px 0 rgba(49, 130, 206, 0.12)" }
        : {}
    }
    disabled={loading || disabled}
  >
    <span className="inline-flex items-center justify-center w-full gap-2 tracking-wide text-center">
      <svg
        className="w-4 h-4 opacity-80"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {loading ? (
        <span className="animate-pulse">Enviando…</span>
      ) : (
        <span className="w-full text-center">Votar</span>
      )}
    </span>
  </button>
);

export default VoteButton;
