import React, { useRef } from "react";

const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

const VideoCard = ({ video, onPlay }) => {
  const videoRef = useRef(null);
  const pos = video.position;

  /* …tus clases de badge y glow sin cambios… */

  const handleLoadedData = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isiOS) {
      // Truco: que avance un poquito para pintar fotograma,
      // luego pausamos y dejamos el tiempo en 0
      setTimeout(() => {
        vid.pause();
        vid.currentTime = 0;
      }, 150);
    } else {
      vid.pause(); // Android / desktop
    }

    // Lo mantenemos silenciado hasta que el usuario interactúe
    vid.muted = true;
  };

  const handlePlay = () => {
    const vid = videoRef.current;
    if (vid) vid.muted = false; // Se vuelve a activar el audio al reproducir
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
        poster={video.poster_url} /* <- opcional, ver método 1 */
        preload="metadata" /* menos carga, suficiente para miniatura */
        autoPlay /* dispara playback sin sonido */
        muted /* requisito para autoplay en iOS */
        playsInline /* evita fullscreen forzado */
        controls /* tus controles normales */
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
