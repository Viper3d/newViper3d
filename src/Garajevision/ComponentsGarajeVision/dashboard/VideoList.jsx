// src/components/VideoList.jsx
import React from "react";

const VideoList = ({ videos, onDelete, onEdit }) => (
  <div className="space-y-4">
    {videos.length === 0 ? (
      <p className="text-gray-300">No hay vídeos para esta edición.</p>
    ) : (
      videos.map((v) => (
        <div
          key={v.id}
          className="bg-gray-700 p-4 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0"
        >
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Preview opcional */}
            {v.preview_url && (
              <video
                src={v.preview_url}
                controls
                className="w-32 h-32 object-cover rounded"
                preload="metadata"
              >
                Tu navegador no soporta el elemento <code>video</code>.
              </video>
            )}
            <div>
              {v.position != null && (
                <p className="text-gray-400 text-sm mb-1">
                  Posición: {v.position}
                </p>
              )}
              <p className="font-semibold text-white">{v.title}</p>
              {v.authors?.length > 0 && (
                <p className="text-gray-400 text-sm">
                  Autor{v.authors.length > 1 ? "es" : ""}:{" "}
                  {v.authors.join(", ")}
                </p>
              )}
              {v.rating != null && (
                <p className="text-yellow-300 text-sm mt-1">
                  Puntuación: {v.rating}
                </p>
              )}
            </div>
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
              onClick={() => onEdit(v)}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:opacity-90"
            >
              Editar
            </button>
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
