import React, { useRef } from "react";

const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

const VideoCard = ({ video, onPlay }) => {
  const videoRef = useRef(null);
  const pos = video.position;

  /* --- CLASES PARA BADGE / GLOW SIN CAMBIOS --- */
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

  /* ---------- NUEVO HANDLER iOS ---------- */
  const handleLoadedData = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isiOS) {
      // Reproducimos en silencio → cuando llegue el 1er frame pausamos
      const paintFirstFrame = () => {
        vid.pause();
        vid.currentTime = 0; // Rebobinamos
        vid.removeEventListener("timeupdate", paintFirstFrame);
      };

      vid.addEventListener("timeupdate", paintFirstFrame);
      vid.play().catch(() => {
        /* rara vez el autoplay falla por política; si pasa, al menos tenemos póster */
      });
    } else {
      // Android / escritorio: lo de siempre
      vid.pause();
    }
  };

  const handlePlay = () => {
    const vid = videoRef.current;
    if (vid) vid.muted = false; // Activa el sonido al pulsar Play
    onPlay(video.id);
  };

  return (
    <div
      className={`
        relative bg-gradient-to-br from-gray-700 to-black
        rounded-xl p-2 sm:p-4 flex flex-col items-center space-y-3
        shadow-md transition-shadow duration-300 ${glowClass}
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
        ref={videoRef}
        data-id={video.id}
        src={video.video_url}
        poster={video.poster_url /* si no tienes miniatura, deja null */}
        preload="metadata"
        autoPlay // necesita muted + playsInline
        muted
        playsInline // React genera playsinline OK
        webkit-playsinline="true" /* modelos antiguos */
        controls
        onLoadedData={handleLoadedData}
        onPlay={handlePlay}
        className="w-full h-full object-cover rounded-md"
      >
        Tu navegador no soporta vídeo HTML5.
      </video>

      <h4 className="text-lg font-semibold text-white">{video.title}</h4>

      {video.authors?.length > 0 && (
        <p className="text-gray-200 text-sm">
          Autor{video.authors.length > 1 ? "es" : ""}:{" "}
          {video.authors.join(", ")}
        </p>
      )}

      {video.rating != null && (
        <div className="absolute bottom-2 right-2 bg-blue-300 text-black rounded-full px-2 text-xs font-bold">
          {video.rating}
        </div>
      )}
    </div>
  );
};

export default VideoCard;
