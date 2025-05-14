import React, { useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

const VoterInfo = ({
  currentVoterSession,
  currentVoterIndex,
  sessions,
  currentVoteStep,
  handlePreviousStep,
  handleNextStep,
  revealedVotesForCurrentVoter,
  votesOfCurrentVoter,
  videos,
}) => {
  const [showNameZoom, setShowNameZoom] = useState(currentVoteStep === 0);

  useEffect(() => {
    if (currentVoteStep === 0) {
      setShowNameZoom(true);
      const t = setTimeout(() => setShowNameZoom(false), 1200); // Duration of name zoom animation
      return () => clearTimeout(t);
    }
    setShowNameZoom(false);
  }, [currentVoteStep]);

  return (
    <div className="flex-1 min-w-0 w-full max-w-full md:max-w-[28vw] bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-3 sm:p-4 md:p-10 rounded-3xl shadow-2xl border-4 border-blue-700/40 backdrop-blur-xl flex flex-col mx-auto max-h-full md:max-h-[92vh] relative">
      {currentVoterSession ? (
        <>
          <p className="text-base text-cyan-200 mb-1 text-center font-semibold">
            Ronda de votación: {currentVoterIndex + 1} / {sessions.length}
          </p>
          <h2
            className={`text-3xl md:text-4xl font-extrabold mb-2 text-green-300 drop-shadow-2xl text-center tracking-wide leading-tight transition-opacity duration-300 ${
              showNameZoom ? "opacity-0" : "opacity-100"
            }`}
          >
            {currentVoterSession.fullName ||
              `Usuario ${currentVoterSession.user_id.substring(0, 8)}...`}
          </h2>
          {/* Votos y resumen - Compacto, sin scroll */}
          <div className="flex-1 min-h-0 py-0">
            <VoterVotes
              currentVoteStep={currentVoteStep}
              revealedVotesForCurrentVoter={revealedVotesForCurrentVoter}
              votesOfCurrentVoter={votesOfCurrentVoter}
              videos={videos}
              voterName={
                currentVoterSession.fullName ||
                `Usuario ${currentVoterSession.user_id.substring(0, 8)}...`
              }
              compact={true}
              showNameZoom={showNameZoom}
            />
          </div>
          <div className="h-12" /> {/* Espacio reducido para el footer */}
          <div className="absolute left-0 bottom-0 w-full flex justify-center items-center bg-gradient-to-t from-gray-900/95 via-blue-900/80 to-transparent pt-2 pb-2 px-2 z-20 rounded-b-3xl border-t border-blue-700/50 min-h-[48px] h-12">
            <button
              onClick={handlePreviousStep}
              disabled={currentVoterIndex === 0 && currentVoteStep === 0}
              className="mx-1 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out flex items-center justify-center "
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextStep}
              disabled={currentVoteStep > 4}
              className="mx-1 p-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-full font-bold shadow-lg transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-300 text-center text-lg font-semibold">
          No hay sesiones de votación para mostrar o todas las votaciones han
          finalizado.
        </p>
      )}
    </div>
  );
};

import VoterVotes from "./VoterVotes";
export default VoterInfo;
