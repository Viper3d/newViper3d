import React from "react";

const VideoCard = ({ video, onPlay }) => {
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
      className={`relative bg-gradient-to-br from-gray-700 to-black rounded-xl p-2 sm:p-4 flex flex-col items-center space-y-3 shadow-md transition-shadow duration-300 ${glowClass}`}
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
        Tu navegador no soporta el elemento, dale porculo al Mendo{" "}
        <code>video</code>.
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
