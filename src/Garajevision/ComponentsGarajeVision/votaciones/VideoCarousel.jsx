import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const VideoCarousel = ({
  videos,
  carouselIndex,
  goToPrev,
  goToNext,
  showVideo,
  setShowVideo,
  PLACEHOLDER_POSTER,
}) => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative w-44 h-80 flex items-center justify-center">
        <div className="absolute inset-0 z-0 rounded-2xl bg-gradient-to-br from-indigo-700/40 via-purple-700/30 to-black/80 blur-2xl scale-110" />
        <button
          type="button"
          aria-label="Anterior"
          onClick={goToPrev}
          className="absolute left-0 z-20 bg-black/70 hover:bg-indigo-600 text-white rounded-full w-11 h-11 flex items-center justify-center top-1/2 -translate-y-1/2 shadow-xl border-2 border-indigo-400 transition-all duration-200 hover:scale-110 hover:shadow-[0_0_16px_4px_rgba(99,102,241,0.5)]"
          style={{ left: "-26px" }}
        >
          <ChevronLeftIcon className="w-7 h-7 text-indigo-300 group-hover:text-white transition" />
        </button>
        {videos.length > 0 && (
          <div className="relative w-44 h-80 bg-gradient-to-br from-gray-800 to-black rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center border-4 border-indigo-700 transition-all duration-500">
            {videos[carouselIndex].position != null && (
              <div className="absolute top-2 right-2 bg-yellow-300 text-yellow-800 rounded-full px-2 text-xs font-bold z-10 shadow-md">
                {videos[carouselIndex].position}º
              </div>
            )}
            <video
              key={videos[carouselIndex].id}
              src={
                videos[carouselIndex].preview_url
                  ? videos[carouselIndex].preview_url
                  : videos[carouselIndex].video_url
              }
              className="absolute top-0 left-0 w-full h-full object-cover object-center transition-all duration-500"
              style={{ aspectRatio: "9/16" }}
              preload="metadata"
              controls
              poster={videos[carouselIndex].preview_path || PLACEHOLDER_POSTER}
              onPlay={(e) => {
                document.querySelectorAll("video").forEach((videoEl) => {
                  if (videoEl !== e.target) videoEl.pause();
                });
              }}
            />
          </div>
        )}
        <button
          type="button"
          aria-label="Siguiente"
          onClick={goToNext}
          className="absolute right-0 z-20 bg-black/70 hover:bg-indigo-600 text-white rounded-full w-11 h-11 flex items-center justify-center top-1/2 -translate-y-1/2 shadow-xl border-2 border-indigo-400 transition-all duration-200 hover:scale-110 hover:shadow-[0_0_16px_4px_rgba(99,102,241,0.5)]"
          style={{ right: "-26px" }}
        >
          <ChevronRightIcon className="w-7 h-7 text-indigo-300 group-hover:text-white transition" />
        </button>
      </div>
      {/* Título y autores */}
      {videos.length > 0 && (
        <>
          <span
            className="text-base font-semibold text-white mt-3 text-center truncate w-44 drop-shadow"
            title={videos[carouselIndex].title}
          >
            {videos[carouselIndex].title}
          </span>
          {videos[carouselIndex].authors &&
            videos[carouselIndex].authors.length > 0 && (
              <span className="text-xs text-indigo-200 text-center w-44 truncate drop-shadow">
                Autor{videos[carouselIndex].authors.length > 1 ? "es" : ""}:{" "}
                {videos[carouselIndex].authors.join(", ")}
              </span>
            )}
        </>
      )}
      {/* Indicadores de posición animados */}
      <div className="flex justify-center gap-2 mt-3">
        {videos.map((_, idx) => (
          <span
            key={idx}
            className={`inline-block w-3 h-3 rounded-full transition-all duration-300 border-2 ${
              carouselIndex === idx
                ? "bg-indigo-400 border-indigo-300 scale-125 shadow-lg"
                : "bg-gray-600 border-gray-500 opacity-60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCarousel;
