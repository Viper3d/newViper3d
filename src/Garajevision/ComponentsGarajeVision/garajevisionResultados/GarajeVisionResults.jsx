import React, { useState, useEffect, useCallback } from "react";
import { Rnd } from "react-rnd";
import Scoreboard from "./Scoreboard";
import VoterInfo from "./VoterInfo";
import PanelMovible from "./PanelMovible";
import confetti from "canvas-confetti";

const GarajeVisionResults = ({ sessions, videos, edition, onClose }) => {
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [currentVoteStep, setCurrentVoteStep] = useState(0); // 0: initial, 1: 12pts, 2: 10pts, 3: 8pts, 4: 7-1pts, 5: summary
  const [scores, setScores] = useState({}); // { videoId: points }
  const [rankedVideos, setRankedVideos] = useState([]);
  const [revealedVotesForCurrentVoter, setRevealedVotesForCurrentVoter] =
    useState([]); // Stores { videoId, points, title }

  // Initialize scores and ranked videos
  useEffect(() => {
    const initialScores = {};
    videos.forEach((video) => {
      initialScores[video.id] = 0;
    });
    setScores(initialScores);
    // Initial random sort or sort by title
    setRankedVideos([...videos].sort(() => Math.random() - 0.5));
  }, [videos]);

  // Calcular scores sincronizados con los pasos de revelado EXACTAMENTE como VoterVotes (primero 7-1, luego 8, luego 10, luego 12)
  const syncedScores = React.useMemo(() => {
    const scores = {};
    videos.forEach((video) => {
      scores[video.id] = 0;
    });
    // Sumar todos los votos de los votantes anteriores
    for (let i = 0; i < currentVoterIndex; i++) {
      sessions[i]?.votos.forEach((vote) => {
        scores[vote.video_id] += vote.points;
      });
    }
    // Sumar solo los votos del votante actual según el paso (orden: 7-1, 8, 10, 12)
    if (sessions[currentVoterIndex]) {
      const votos = sessions[currentVoterIndex].votos.sort(
        (a, b) => b.points - a.points
      );
      if (currentVoteStep > 0) {
        // Paso 1: solo 7-1 puntos
        if (currentVoteStep >= 1) {
          votos.forEach((v) => {
            if (v.points <= 7 && v.points >= 1) {
              scores[v.video_id] += v.points;
            }
          });
        }
        // Paso 2: 7-1 y 8 puntos
        if (currentVoteStep >= 2) {
          const v8 = votos.find((v) => v.points === 8);
          if (v8) scores[v8.video_id] += v8.points;
        }
        // Paso 3: 7-1, 8 y 10 puntos
        if (currentVoteStep >= 3) {
          const v10 = votos.find((v) => v.points === 10);
          if (v10) scores[v10.video_id] += v10.points;
        }
        // Paso 4: 7-1, 8, 10 y 12 puntos
        if (currentVoteStep >= 4) {
          const v12 = votos.find((v) => v.points === 12);
          if (v12) scores[v12.video_id] += v12.points;
        }
      }
    }
    return scores;
  }, [videos, sessions, currentVoterIndex, currentVoteStep]);

  // Ordenar los vídeos por puntuación actual (mayor a menor) para el Scoreboard
  const sortedRankedVideos = React.useMemo(() => {
    return [...rankedVideos].sort(
      (a, b) => (syncedScores[b.id] || 0) - (syncedScores[a.id] || 0)
    );
  }, [rankedVideos, syncedScores]);

  // Reset scores and revealed votes when changing voter or reiniciando
  useEffect(() => {
    // Calcular los scores acumulados hasta el votante y paso actual
    const newScores = {};
    videos.forEach((video) => {
      newScores[video.id] = 0;
    });
    for (let i = 0; i < sessions.length; i++) {
      if (i < currentVoterIndex) {
        // Sumar todos los votos de los votantes anteriores
        sessions[i].votos.forEach((vote) => {
          newScores[vote.video_id] += vote.points;
        });
      } else if (i === currentVoterIndex) {
        // Sumar solo los votos revelados hasta el paso actual
        const votos = sessions[i].votos.sort((a, b) => b.points - a.points);
        if (currentVoteStep > 0) {
          // 12 puntos
          if (currentVoteStep >= 1) {
            const v12 = votos.find((v) => v.points === 12);
            if (v12) newScores[v12.video_id] += v12.points;
          }
          // 10 puntos
          if (currentVoteStep >= 2) {
            const v10 = votos.find((v) => v.points === 10);
            if (v10) newScores[v10.video_id] += v10.points;
          }
          // 8 puntos
          if (currentVoteStep >= 3) {
            const v8 = votos.find((v) => v.points === 8);
            if (v8) newScores[v8.video_id] += v8.points;
          }
          // 7-1 puntos
          if (currentVoteStep >= 4) {
            votos.forEach((v) => {
              if (v.points <= 7 && v.points >= 1) {
                newScores[v.video_id] += v.points;
              }
            });
          }
        }
      }
    }
    setScores(newScores);
    // Reset revealed votes for current voter
    const revealed = [];
    if (sessions[currentVoterIndex]) {
      const votos = sessions[currentVoterIndex].votos.sort(
        (a, b) => b.points - a.points
      );
      if (currentVoteStep > 0) {
        if (currentVoteStep >= 1) {
          const v12 = votos.find((v) => v.points === 12);
          if (v12)
            revealed.push({
              ...v12,
              title:
                videos.find((v) => v.id === v12.video_id)?.title ||
                "Unknown Video",
            });
        }
        if (currentVoteStep >= 2) {
          const v10 = votos.find((v) => v.points === 10);
          if (v10)
            revealed.push({
              ...v10,
              title:
                videos.find((v) => v.id === v10.video_id)?.title ||
                "Unknown Video",
            });
        }
        if (currentVoteStep >= 3) {
          const v8 = votos.find((v) => v.points === 8);
          if (v8)
            revealed.push({
              ...v8,
              title:
                videos.find((v) => v.id === v8.video_id)?.title ||
                "Unknown Video",
            });
        }
        if (currentVoteStep >= 4) {
          votos.forEach((v) => {
            if (v.points <= 7 && v.points >= 1) {
              revealed.push({
                ...v,
                title:
                  videos.find((vid) => vid.id === v.video_id)?.title ||
                  "Unknown Video",
              });
            }
          });
        }
      }
    }
    setRevealedVotesForCurrentVoter(revealed);
  }, [currentVoterIndex, currentVoteStep, sessions, videos]);

  const currentVoterSession = sessions[currentVoterIndex];
  const votesOfCurrentVoter =
    currentVoterSession?.votos.sort((a, b) => b.points - a.points) || []; // Ensure votes are sorted

  const applyVote = useCallback(
    (vote) => {
      setScores((prevScores) => ({
        ...prevScores,
        [vote.video_id]: (prevScores[vote.video_id] || 0) + vote.points,
      }));
      const videoTitle =
        videos.find((v) => v.id === vote.video_id)?.title || "Unknown Video";
      setRevealedVotesForCurrentVoter((prev) => [
        ...prev,
        { ...vote, title: videoTitle },
      ]);
    },
    [videos]
  );

  const handleNextStep = useCallback(() => {
    if (
      !currentVoterSession &&
      sessions.length > 0 &&
      currentVoterIndex >= sessions.length
    ) {
      // Ya estamos en la pantalla de resultados finales, no hacer nada (o podrías reiniciar si quieres)
      setCurrentVoteStep(5);
      return;
    }
    if (currentVoteStep === 0) {
      // Initial state for voter, reveal 12 points
      const twelvePointsVote = votesOfCurrentVoter.find((v) => v.points === 12);
      if (twelvePointsVote) applyVote(twelvePointsVote);
      setCurrentVoteStep(1);
    } else if (currentVoteStep === 1) {
      // Reveal 10 points
      const tenPointsVote = votesOfCurrentVoter.find((v) => v.points === 10);
      if (tenPointsVote) applyVote(tenPointsVote);
      setCurrentVoteStep(2);
    } else if (currentVoteStep === 2) {
      // Reveal 8 points
      const eightPointsVote = votesOfCurrentVoter.find((v) => v.points === 8);
      if (eightPointsVote) applyVote(eightPointsVote);
      setCurrentVoteStep(3);
    } else if (currentVoteStep === 3) {
      // Reveal 7-1 points
      votesOfCurrentVoter.forEach((vote) => {
        if (vote.points <= 7 && vote.points >= 1) {
          applyVote(vote);
        }
      });
      setCurrentVoteStep(4); // Move to summary for this voter
    } else if (currentVoteStep === 4) {
      // Move to next voter
      if (currentVoterIndex < sessions.length - 1) {
        setCurrentVoterIndex((prev) => prev + 1);
        setCurrentVoteStep(0);
        setRevealedVotesForCurrentVoter([]);
      } else {
        // All voters finished
        setCurrentVoteStep(5); // End of all voting
      }
    } else if (currentVoteStep === 5) {
      // Si ya estamos en el final, mantenernos ahí
      setCurrentVoteStep(5);
    }
  }, [
    currentVoterSession,
    currentVoteStep,
    votesOfCurrentVoter,
    applyVote,
    currentVoterIndex,
    sessions.length,
  ]);

  const handlePreviousStep = useCallback(() => {
    // Si ya estamos en el primer paso del primer votante, no hacer nada
    if (currentVoterIndex === 0 && currentVoteStep === 0) return;

    // Si estamos en el estado de votación completada, volver al resumen del último votante
    if (currentVoteStep === 5) {
      // Restaurar los votos del último votante
      const lastVoterSession = sessions[currentVoterIndex];
      const lastVotes =
        lastVoterSession?.votos.sort((a, b) => b.points - a.points) || [];
      setCurrentVoteStep(4);
      setRevealedVotesForCurrentVoter(
        lastVotes.map((vote) => ({
          ...vote,
          title:
            videos.find((v) => v.id === vote.video_id)?.title ||
            "Unknown Video",
        }))
      );
      // No tocar scores porque ya están bien en el paso final
      return;
    }

    // Si estamos en pasos > 0 del votante actual, deshacer el paso correspondiente
    if (currentVoteStep > 0 && currentVoteStep <= 4) {
      let votesToUndo = [];
      if (currentVoteStep === 1) {
        votesToUndo = votesOfCurrentVoter.filter((v) => v.points === 12);
      } else if (currentVoteStep === 2) {
        votesToUndo = votesOfCurrentVoter.filter((v) => v.points === 10);
      } else if (currentVoteStep === 3) {
        votesToUndo = votesOfCurrentVoter.filter((v) => v.points === 8);
      } else if (currentVoteStep === 4) {
        votesToUndo = votesOfCurrentVoter.filter(
          (v) => v.points <= 7 && v.points >= 1
        );
      }
      setScores((prevScores) => {
        const newScores = { ...prevScores };
        votesToUndo.forEach((vote) => {
          newScores[vote.video_id] =
            (newScores[vote.video_id] || 0) - vote.points;
        });
        return newScores;
      });
      setRevealedVotesForCurrentVoter((prev) => {
        // Elimina los votos de este paso
        const toRemove = new Set(
          votesToUndo.map((v) => v.video_id + "-" + v.points)
        );
        return prev.filter((v) => !toRemove.has(v.video_id + "-" + v.points));
      });
      setCurrentVoteStep((prev) => prev - 1);
      return;
    }

    // Si estamos en el paso 0 pero no en el primer votante, retroceder al anterior votante en su resumen
    if (currentVoteStep === 0 && currentVoterIndex > 0) {
      // Quitar los votos del votante actual (por si acaso)
      revealedVotesForCurrentVoter.forEach((vote) => {
        setScores((prevScores) => ({
          ...prevScores,
          [vote.video_id]: (prevScores[vote.video_id] || 0) - vote.points,
        }));
      });
      // Cargar los votos del votante anterior
      const prevVoterIndex = currentVoterIndex - 1;
      const prevVoterSession = sessions[prevVoterIndex];
      const prevVotes =
        prevVoterSession?.votos.sort((a, b) => b.points - a.points) || [];
      let tempScores = { ...scores };
      prevVotes.forEach((vote) => {
        tempScores[vote.video_id] =
          (tempScores[vote.video_id] || 0) + vote.points;
      });
      setScores(tempScores);
      setCurrentVoterIndex(prevVoterIndex);
      setCurrentVoteStep(4); // Ir al resumen del votante anterior
      setRevealedVotesForCurrentVoter(
        prevVotes.map((vote) => ({
          ...vote,
          title:
            videos.find((v) => v.id === vote.video_id)?.title ||
            "Unknown Video",
        }))
      );
    }
  }, [
    currentVoterSession,
    currentVoteStep,
    currentVoterIndex,
    revealedVotesForCurrentVoter,
    votesOfCurrentVoter,
    sessions,
    scores,
    videos,
  ]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        handleNextStep();
      } else if (event.key === "ArrowLeft") {
        handlePreviousStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNextStep, handlePreviousStep]);

  if (
    !currentVoterSession &&
    sessions.length > 0 &&
    currentVoterIndex >= sessions.length
  ) {
    return (
      <FinalResults
        edition={edition}
        rankedVideos={rankedVideos}
        scores={scores}
        onBack={() => {
          setCurrentVoterIndex(sessions.length - 1);
          setCurrentVoteStep(4);
        }}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="w-full items-start">
      {/* Header compacto solo con el nombre de la edición y fondo decorativo visible */}
      <header
        className="text-center relative  mx-auto flex items-center justify-center min-h-[100px] md:min-h-[140px] overflow-visible"
        onClick={() => {
          // Lanzar confeti en varias tandas para que dure más y caiga hacia abajo
          const duration = 6 * 1000; // 2.5 segundos
          const animationEnd = Date.now() + duration;
          const defaults = {
            angle: 90, // hacia abajo
            spread: 1200,
            startVelocity: 60,
            gravity: 1.2,
            ticks: 600,
            origin: { y: 0 },
            zIndex: 9999,
          };
          function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
          }
          const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
              clearInterval(interval);
              return;
            }
            confetti({
              ...defaults,
              particleCount: randomInRange(80, 120),
              colors: [
                "#f0abfc", // fucsia
                "#a5b4fc", // violeta
                "#818cf8", // azul
                "#f472b6", // rosa
                "#facc15", // amarillo
              ],
            });
          }, 250);
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-2xl bg-gradient-to-br from-fuchsia-700/60 via-violet-700/40 to-indigo-900/80 blur-xl opacity-95 pointer-events-none"
          style={{ zIndex: 0 }}
        />
        <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-violet-400 to-indigo-400 drop-shadow-lg tracking-tight m-0 relative z-10">
          {edition?.name} - GarajeVision
        </h1>
      </header>
      <div className="w-full relative min-h-screen">
        <PanelMovible
          title="Scoreboard"
          defaultSize={{ width: 400, height: 580, x: 50, y: 10 }}
          minWidth={280}
          minHeight={300}
          bounds="parent"
          dragHandleClassName="drag-handle-scoreboard"
          dragAxis="both"
        >
          <Scoreboard rankedVideos={sortedRankedVideos} scores={syncedScores} />
        </PanelMovible>
        <PanelMovible
          title="Votaciones"
          defaultSize={{ width: 450, height: 450, x: 480, y: 10 }}
          minWidth={320}
          minHeight={250}
          bounds="parent"
          dragHandleClassName="drag-handle-voterinfo"
          dragAxis="both"
        >
          {currentVoteStep <= 4 && (
            <VoterInfo
              currentVoterSession={currentVoterSession}
              currentVoterIndex={currentVoterIndex}
              sessions={sessions}
              currentVoteStep={currentVoteStep}
              handlePreviousStep={handlePreviousStep}
              handleNextStep={handleNextStep}
              revealedVotesForCurrentVoter={revealedVotesForCurrentVoter}
              votesOfCurrentVoter={votesOfCurrentVoter}
              videos={videos}
            />
          )}
        </PanelMovible>
      </div>
    </div>
  );
};

export default GarajeVisionResults;
