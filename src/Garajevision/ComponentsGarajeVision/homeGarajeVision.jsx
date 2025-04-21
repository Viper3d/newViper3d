import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient"; // ← import único
import logo from "../../assets/logo.svg";

const HomeGarajeVision = () => {
  const [ediciones, setEdiciones] = useState([]);
  const [openEdicion, setOpenEdicion] = useState(null);

  useEffect(() => {
    // TODO: en el futuro, podrías hacer:
    // const fetch = async () => {
    //   let { data, error } = await supabase
    //     .from("ediciones")
    //     .select("anio, videos(*)");
    //   if (!error) setEdiciones(data);
    // };
    // fetch();
    // Por ahora, simulamos:
    setEdiciones([
      {
        anio: "2024",
        videos: [
          {
            id: 1,
            titulo: "Canción 1",
            url: "https://via.placeholder.com/150",
            descripcion: "Video de la Canción 1",
          },
          {
            id: 2,
            titulo: "Canción 2",
            url: "https://via.placeholder.com/150",
            descripcion: "Video de la Canción 2",
          },
          {
            id: 5,
            titulo: "Canción 3",
            url: "https://via.placeholder.com/150",
            descripcion: "Video de la Canción 3",
          },
          {
            id: 6,
            titulo: "Canción 4",
            url: "https://via.placeholder.com/150",
            descripcion: "Video de la Canción 4",
          },
        ],
      },
      {
        anio: "2023",
        videos: [
          {
            id: 3,
            titulo: "Canción A",
            url: "https://via.placeholder.com/150",
            descripcion: "Video de la Canción A",
          },
          {
            id: 4,
            titulo: "Canción B",
            url: "https://via.placeholder.com/150",
            descripcion: "Video de la Canción B",
          },
          {
            id: 7,
            titulo: "Canción C",
            url: "https://via.placeholder.com/150",
            descripcion: "Video de la Canción C",
          },
          {
            id: 8,
            titulo: "Canción D",
            url: "https://via.placeholder.com/150",
            descripcion: "Video de la Canción D",
          },
        ],
      },
    ]);
  }, []);

  return (
    <div className="relative p-6 min-h-screen bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-500 animate-gradient-xy blur-3xl"></div>
      <div className="relative z-10 w-full max-w-screen-2xl m-auto bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-2xl border-4 border-indigo-900 p-6 space-y-8">
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

        {/* Sección de Ediciones */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Ediciones</h2>
          <div className="space-y-6">
            {ediciones.map((edicion) => (
              <EdicionCard
                key={edicion.anio}
                edicion={edicion}
                isOpen={openEdicion === edicion.anio}
                onToggle={() =>
                  setOpenEdicion(
                    openEdicion === edicion.anio ? null : edicion.anio
                  )
                }
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const VideoCard = ({ video, index, showBadge }) => (
  <div className="relative bg-indigo-600 rounded-lg p-3 flex flex-col items-center space-y-2 transition-transform duration-300 hover:scale-105">
    {showBadge && (
      <div className="absolute top-2 right-2 bg-white text-indigo-600 rounded-full px-2 text-xs font-bold">
        {index + 1}º
      </div>
    )}
    <img
      src={video.url}
      alt={video.titulo}
      className="w-24 h-24 object-cover rounded-md"
    />
    <h4 className="text-xl font-semibold text-white">{video.titulo}</h4>
    <p className="text-gray-200 text-sm">{video.descripcion}</p>
  </div>
);

const EdicionCard = ({ edicion, isOpen, onToggle }) => {
  const videosToShow = isOpen ? edicion.videos : edicion.videos.slice(0, 3);

  return (
    <div className="bg-indigo-700 bg-opacity-90 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl">
      <div className="p-4">
        <h3 className="text-2xl font-bold text-white">
          Edición {edicion.anio}
        </h3>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {videosToShow.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            index={index}
            showBadge={index < 3}
          />
        ))}
      </div>
      <div className="p-4 text-center">
        <button
          onClick={onToggle}
          className="mt-2 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md transition-transform duration-500 hover:scale-105"
        >
          {isOpen ? "Cerrar" : "Ver canciones"}
        </button>
      </div>
    </div>
  );
};

export default HomeGarajeVision;
