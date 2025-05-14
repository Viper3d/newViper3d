import React, { useEffect } from "react";

const PointsTable = ({ POINTS, videos, assignments, handleSelect, user }) => {
  // Limpiar asignaciones vetadas si el usuario está baneado para alguna canción ya seleccionada
  useEffect(() => {
    if (!user || !user.id) return;
    POINTS.forEach((pt) => {
      const videoId = assignments[pt];
      if (!videoId) return;
      const video = videos.find((v) => v.id === videoId);
      if (video && video.banned_users && Array.isArray(video.banned_users)) {
        if (video.banned_users.includes(user.id)) {
          // Si está baneado, limpiar la selección
          handleSelect(pt, "");
        }
      }
    });
    // eslint-disable-next-line
  }, [user, videos, assignments]);

  return (
    <div className="grid grid-cols-1 gap-2 mb-4">
      {POINTS.map((pt) => {
        let bg = "";
        let medal = null;
        if (pt === 12) {
          bg = "bg-gradient-to-r from-yellow-300 via-yellow-200 to-white/20";
          medal = <span className="text-lg mr-1">🥇</span>;
        } else if (pt === 10) {
          bg = "bg-gradient-to-r from-gray-300 via-gray-100 to-white/20";
          medal = <span className="text-lg mr-1">🥈</span>;
        } else if (pt === 8) {
          bg = "bg-gradient-to-r from-orange-400 via-orange-200 to-white/20";
          medal = <span className="text-lg mr-1">🥉</span>;
        } else if (pt === 7) {
          bg = "bg-gradient-to-r from-blue-600 via-indigo-500 to-white/10";
        } else if (pt === 6) {
          bg = "bg-gradient-to-r from-blue-500 via-indigo-400 to-white/10";
        } else if (pt === 5) {
          bg = "bg-gradient-to-r from-blue-500 via-indigo-300 to-white/10";
        } else if (pt === 4) {
          bg = "bg-gradient-to-r from-blue-300 via-indigo-200 to-white/10";
        } else if (pt === 3) {
          bg = "bg-gradient-to-r from-blue-200 via-indigo-100 to-white/10";
        } else if (pt === 2) {
          bg = "bg-gradient-to-r from-gray-300 via-indigo-50 to-white/10";
        } else if (pt === 1) {
          bg = "bg-gradient-to-r from-gray-300 via-gray-100 to-white/10";
        }
        return (
          <div
            key={pt}
            className={`flex items-center px-3 py-2 ${bg} rounded-lg shadow-md backdrop-blur-sm min-h-[40px]`}
            style={{ fontSize: "1rem", minHeight: "40px" }}
          >
            <div className="flex items-center gap-1 min-w-[56px] justify-end w-16">
              {medal}
              <span
                className="font-extrabold text-2xl text-gray-900 text-right w-8"
                style={{ textShadow: "0 1px 4px #fff8" }}
              >
                {pt}
              </span>
            </div>
            <select
              className="ml-2 flex-1 p-1 rounded bg-gray-900/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-indigo-700/60 shadow-sm transition-all duration-150 backdrop-blur-md min-w-0"
              value={assignments[pt] || ""}
              onChange={(e) => {
                const videoId = e.target.value;
                const video = videos.find((v) => v.id === videoId);
                let isVetado = false;
                if (
                  user &&
                  user.id &&
                  video &&
                  Array.isArray(video?.banned_users)
                ) {
                  isVetado = video.banned_users.includes(user.id);
                }
                if (!isVetado) {
                  handleSelect(pt, videoId);
                } else {
                  // Si intenta seleccionar una vetada, no hacer nada
                  alert("No puedes votar por esta canción, estás vetado.");
                }
              }}
              required
            >
              <option value="">-- Canción --</option>
              {videos.map((v) => {
                let isVetado = false;
                if (user && user.id && Array.isArray(v.banned_users)) {
                  isVetado = v.banned_users.includes(user.id);
                  if (isVetado) {
                    console.log(
                      `[PointsTable] Usuario vetado: user.id=${user.id} en video.id=${v.id}, banned_users=`,
                      v.banned_users
                    );
                  }
                } else {
                  if (user && user.id) {
                    console.log(
                      `[PointsTable] user.id=${user.id} video.id=${v.id} banned_users=`,
                      v.banned_users
                    );
                  }
                }
                const isDisabled =
                  (Object.values(assignments).includes(v.id) &&
                    assignments[pt] !== v.id) ||
                  isVetado;
                return (
                  <option key={v.id} value={v.id} disabled={isDisabled}>
                    {v.title}
                    {isVetado ? " (no disponible)" : ""}
                  </option>
                );
              })}
            </select>
          </div>
        );
      })}
    </div>
  );
};

export default PointsTable;
