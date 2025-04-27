// src/components/VideoList.jsx
import React from "react";

const VideoList = ({ videos, onDelete }) => (
  <div className="space-y-4">
    {videos.length === 0 ? (
      <p className="text-gray-300">No hay vídeos para esta edición.</p>
    ) : (
      videos.map((v) => (
        <div
          key={v.id}
          className="bg-gray-700 p-4 rounded flex items-center justify-between"
        >
          <div>
            {/* Mostrar posición si existe */}
            {v.position != null && (
              <p className="text-gray-400 text-sm mb-1">
                Posición: {v.position}
              </p>
            )}
            <p className="font-semibold text-white">{v.title}</p>
            {v.authors?.length > 0 && (
              <p className="text-gray-400 text-sm">
                Autor{v.authors.length > 1 ? "es" : ""}: {v.authors.join(", ")}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <a
              href={v.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-indigo-500 text-white rounded hover:opacity-90"
            >
              Ver
            </a>
            <button
              onClick={() => onDelete(v)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:opacity-90"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))
    )}
  </div>
);

export default VideoList;
