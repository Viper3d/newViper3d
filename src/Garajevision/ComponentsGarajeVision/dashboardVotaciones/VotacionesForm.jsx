// src/Garajevision/ComponentsGarajeVision/dashboardVotaciones/VotacionesForm.jsx
import React from "react";
import EditionSelector from "../dashboard/EditionSelector";

const VotacionesForm = ({
  editVotacion,
  handleCreateVotacion,
  handleUpdateVotacion,
  editions,
  selectedEdition,
  setSelectedEdition,
  startAt,
  setStartAt,
  endAt,
  setEndAt,
  loading,
  setEditVotacion,
}) => {
  return (
    <section className="bg-gray-700 p-6 rounded-2xl space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-white">
        {editVotacion ? "Editar votación" : "Crear nueva votación"}
      </h2>
      <form
        onSubmit={editVotacion ? handleUpdateVotacion : handleCreateVotacion}
        className="space-y-4"
      >
        <EditionSelector
          editions={editions}
          selectedEdition={selectedEdition}
          onChange={setSelectedEdition}
        />
        <div>
          <label className="block text-white mb-1">
            Fecha y hora de inicio
          </label>
          <input
            type="datetime-local"
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-white mb-1">Fecha y hora de fin</label>
          <input
            type="datetime-local"
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:scale-105 transform transition disabled:opacity-50"
          >
            {loading
              ? editVotacion
                ? "Actualizando..."
                : "Creando..."
              : editVotacion
              ? "Actualizar Votación"
              : "Crear Votación"}
          </button>
          {editVotacion && (
            <button
              type="button"
              onClick={() => {
                setEditVotacion(null);
                setStartAt("");
                setEndAt("");
                setSelectedEdition(null);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:opacity-90"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default VotacionesForm;
