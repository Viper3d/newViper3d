// src/components/HomeGarajeVision.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Header from "./homeComponents/Header";
import EdicionCard from "./homeComponents/EdicionCard";
import EdicionCardSkeleton from "./homeComponents/EdicionCardSkeleton"; // Import new skeleton
import ModalViper3D from "./homeComponents/ModalViper3D"; // Import ModalViper3D

const HomeGarajeVision = () => {
  const [ediciones, setEdiciones] = useState([]);
  const [openEdicion, setOpenEdicion] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [showPresentationModal, setShowPresentationModal] = useState(false); // State for the modal

  // Carga ediciones + vídeos con logs de depuración
  useEffect(() => {
    const fetchEdiciones = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("editions")
        .select("id, name, videos(*), votaciones(start_at, end_at)") // Include votaciones data
        .order("position", {
          foreignTable: "videos",
          ascending: true,
          nulls: "last",
        })
        .order("name", { ascending: false });

      if (error) {
        console.error("Error al cargar ediciones:", error);
        setEdiciones([]); // Set to empty or handle error appropriately
      } else {
        const now = new Date(); // Current date and time
        const processedEdiciones = data.map((edicion) => {
          let isActive = false;
          let relevantVotingStartDate = null;
          let relevantVotingEndDate = null;

          if (edicion.votaciones && edicion.votaciones.length > 0) {
            const votingPeriods = edicion.votaciones
              .map((v) => ({
                start: v.start_at ? new Date(v.start_at) : null,
                end: v.end_at ? new Date(v.end_at) : null,
              }))
              .filter((v) => v.start && v.end) // Ensure both dates are valid
              .sort((a, b) => a.start - b.start); // Sort by start date ascending

            for (const period of votingPeriods) {
              if (now >= period.start && now <= period.end) {
                isActive = true;
                // For active periods, we don't need to show a 'why disabled' tooltip,
                // so relevant dates can remain null or be set to the active period.
                // Let's keep them null for simplicity as they are for the 'disabled' state.
                break;
              }
            }

            if (!isActive) {
              const upcomingPeriods = votingPeriods.filter(
                (p) => p.start > now
              );
              if (upcomingPeriods.length > 0) {
                // Earliest upcoming period
                relevantVotingStartDate = upcomingPeriods[0].start;
                relevantVotingEndDate = upcomingPeriods[0].end; // Store end date too
              } else {
                // If no upcoming, check for the most recent past period
                const pastPeriods = votingPeriods.filter((p) => p.end < now);
                if (pastPeriods.length > 0) {
                  pastPeriods.sort((a, b) => b.end - a.end); // Sort by end date descending
                  relevantVotingStartDate = pastPeriods[0].start; // Store start date too
                  relevantVotingEndDate = pastPeriods[0].end;
                }
              }
            }
          }
          return {
            ...edicion,
            isVotingActive: isActive,
            relevantVotingStartDate,
            relevantVotingEndDate,
          };
        });

        setEdiciones(processedEdiciones);
      }
      setIsLoading(false);
    };

    fetchEdiciones();
  }, []);

  // Pausar todos los vídeos salvo el que se está reproduciendo
  const handlePlay = (id) => {
    document.querySelectorAll("video").forEach((v) => {
      if (v.dataset.id !== String(id)) v.pause();
    });
  };

  const handleOpenPresentationModal = () => {
    setShowPresentationModal(true);
  };

  const handleClosePresentationModal = () => {
    setShowPresentationModal(false);
  };

  return (
    <div className="relative p-2 sm:p-4 md:p-6 min-h-screen bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-500 animate-gradient-xy blur-3xl" />
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-2xl border-4 border-indigo-900 p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-8">
        <Header onOpenModal={handleOpenPresentationModal} />{" "}
        {/* Pass the handler to Header */}
        <section className="text-center">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-500 to-emerald-600 py-3 mb-8 sm:mb-10 [text-shadow:0_0_5px_rgba(72,209,204,0.5),_0_0_10px_rgba(72,209,204,0.3)] transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-[1.02]">
            Ediciones
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {isLoading ? ( // Conditional rendering based on loading state
              <>
                {/* Render a few EdicionCardSkeleton cards */}
                {[...Array(2)].map((_, index) => (
                  <EdicionCardSkeleton key={index} />
                ))}
              </>
            ) : (
              ediciones.map((ed) => (
                <EdicionCard
                  key={ed.id}
                  edicion={ed}
                  isVotingActive={ed.isVotingActive} // Pass the calculated status
                  relevantVotingStartDate={ed.relevantVotingStartDate} // Pass relevant start date
                  relevantVotingEndDate={ed.relevantVotingEndDate} // Pass relevant end date
                  isOpen={openEdicion === ed.id}
                  onToggle={() =>
                    setOpenEdicion(openEdicion === ed.id ? null : ed.id)
                  }
                  onPlay={handlePlay}
                />
              ))
            )}
          </div>
        </section>
      </div>
      {/* Render ModalViper3D here */}
      <ModalViper3D
        open={showPresentationModal}
        onClose={handleClosePresentationModal}
      />
    </div>
  );
};

export default HomeGarajeVision;
