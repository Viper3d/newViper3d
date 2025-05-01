// src/components/HomeGarajeVision.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import logo from "../../assets/logo.svg";

const HomeGarajeVision = () => {
  const [ediciones, setEdiciones] = useState([]);
  const [openEdicion, setOpenEdicion] = useState(null);

  // Carga ediciones + vídeos
  useEffect(() => {
    const fetchEdiciones = async () => {
      const { data, error } = await supabase
        .from("editions")
        .select("id, name, videos(*)")
        .order("position", {
          foreignTable: "videos",
          ascending: true,
          nulls: "last",
        })
        .order("name", { ascending: false });

      if (error) {
        console.error("Error al cargar ediciones:", error);
      } else {
        setEdiciones(data);
      }
    };
    fetchEdiciones();
  }, []);

  // Pausar todos los vídeos salvo el que se está reproduciendo
  const handlePlay = (id) => {
    document.querySelectorAll("video").forEach((v) => {
      if (v.dataset.id !== String(id)) v.pause();
    });
  };

  return (
    <div className="relative p-6 min-h-screen bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-500 animate-gradient-xy blur-3xl" />
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-2xl border-4 border-indigo-900 p-6 space-y-8">
        <header className="flex items-center justify-between">
          <Link to="/">
            <img
              src={logo}
              alt="Logo GarajeVision"
              className="h-20 transition-transform duration-500 hover:scale-110"
            />
          </Link>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            GarajeVision
          </h1>
        </header>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Ediciones</h2>
          <div className="space-y-6">
            {ediciones.map((ed) => (
              <EdicionCard
                key={ed.id}
                edicion={ed}
                isOpen={openEdicion === ed.id}
                onToggle={() =>
                  setOpenEdicion(openEdicion === ed.id ? null : ed.id)
                }
                onPlay={handlePlay}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const VideoCard = ({ video, onPlay }) => {
  // Determinar estilos de badge y glow según posición
  const pos = video.position;
  const badgeClasses =
    pos === 1
      ? "bg-yellow-300 text-yellow-800"
      : pos === 2
      ? "bg-gray-300 text-gray-800"
      : pos === 3
      ? "bg-orange-500 text-orange-100"
      : "bg-black text-white";

  const glowClass =
    pos === 1
      ? "hover:shadow-[0_0_64px_rgba(255,215,0,0.8)]"
      : pos === 2
      ? "hover:shadow-[0_0_64px_rgba(192,192,192,0.8)]"
      : pos === 3
      ? "hover:shadow-[0_0_64px_rgba(205,127,50,0.8)]"
      : "hover:shadow-[0_0_64px_rgba(0,255,255,0.6)]";

  return (
    <div
      className={`
        relative
        bg-gradient-to-br from-gray-700 to-black
        rounded-xl p-4 flex flex-col items-center space-y-3
        shadow-md transition-shadow duration-300
        ${glowClass}
      `}
    >
      {pos != null && (
        <div
          className={`${badgeClasses} absolute top-2 right-2 rounded-full px-2 text-xs font-bold`}
        >
          {pos}º
        </div>
      )}

      <video
        data-id={video.id}
        src={video.video_url}
        controls
        preload="metadata"
        onPlay={() => onPlay(video.id)}
        className="w-full h-full object-cover rounded-md"
      >
        Tu navegador no soporta el elemento <code>video</code>.
      </video>

      <h4 className="text-lg font-semibold text-white">{video.title}</h4>
      {video.authors?.length > 0 && (
        <p className="text-gray-200 text-sm">
          Autor{video.authors.length > 1 ? "es" : ""}:{" "}
          {video.authors.join(", ")}
        </p>
      )}
    </div>
  );
};

const EdicionCard = ({ edicion, isOpen, onToggle, onPlay }) => {
  const videosToShow = isOpen ? edicion.videos : edicion.videos.slice(0, 3);

  return (
    <div className="bg-indigo-700 bg-opacity-90 rounded-2xl overflow-hidden shadow-lg transition-shadow duration-500 hover:shadow-2xl">
      <div className="p-4">
        <h3 className="text-2xl font-bold text-white">{edicion.name}</h3>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {videosToShow.map((v) => (
          <VideoCard key={v.id} video={v} onPlay={onPlay} />
        ))}
      </div>
      <div className="p-4 text-center">
        <button
          onClick={onToggle}
          className="mt-2 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md transition-shadow duration-300 hover:shadow-lg"
        >
          {isOpen ? "Cerrar" : "Ver todas las canciones"}
        </button>
      </div>
    </div>
  );
};

export default HomeGarajeVision;
