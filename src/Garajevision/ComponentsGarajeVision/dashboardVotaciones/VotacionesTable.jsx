// src/Garajevision/ComponentsGarajeVision/dashboardVotaciones/VotacionesTable.jsx
import React from "react";

const VotacionesTable = ({
  votaciones,
  handleEditVotacion,
  handleViewVotacion,
  handleDeleteVotacion,
  loading,
}) => {
  return (
    <section className="bg-gray-700 p-6 rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-4">
        Votaciones existentes
      </h2>
      <table className="w-full text-white table-auto">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="px-4 py-2 text-left">Edición</th>
            <th className="px-4 py-2 text-left">Inicio</th>
            <th className="px-4 py-2 text-left">Fin</th>
            <th className="px-4 py-2 text-left">Estado</th>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {votaciones.map((v) => {
            const now = new Date();
            const start = new Date(v.start_at);
            const end = new Date(v.end_at);
            let estado = "";
            if (now < start) {
              estado = "No empezada";
            } else if (now >= start && now <= end) {
              estado = "En curso";
            } else {
              estado = "Finalizada";
            }
            return (
              <tr
                key={v.id}
                className="border-b border-gray-600 hover:bg-gray-600"
              >
                <td className="px-4 py-2">
                  {v.editions?.name || v.edition_id}
                </td>
                <td className="px-4 py-2">
                  {new Date(v.start_at).toLocaleString("es-ES")}
                </td>
                <td className="px-4 py-2">
                  {new Date(v.end_at).toLocaleString("es-ES")}
                </td>
                <td
                  className={`px-4 py-2 font-bold ${
                    estado === "No empezada"
                      ? "text-blue-400"
                      : estado === "En curso"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {estado}
                </td>
                <td className="px-4 py-2">{v.id}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:opacity-90"
                    onClick={() => handleEditVotacion(v)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:opacity-90"
                    onClick={() => handleViewVotacion(v)}
                  >
                    Ver
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:opacity-90"
                    onClick={() => handleDeleteVotacion(v.id)}
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default VotacionesTable;
