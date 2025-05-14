// src/Garajevision/ComponentsGarajeVision/EditEditionForm.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

const EditEditionForm = ({ edition, onCancel, onSaved }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (edition) {
      setName(edition.name || "");
    }
  }, [edition]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: name.trim(),
      };

      await supabase.from("editions").update(updateData).eq("id", edition.id);
      onSaved();
    } catch (err) {
      console.error("Error al editar edición:", err);
      alert("Error al actualizar la edición: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-700 p-6 rounded-2xl space-y-4"
    >
      <h2 className="text-2xl font-bold text-white">Editar Edición</h2>

      <input
        type="text"
        placeholder="Nombre de la edición"
        required
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:opacity-90"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:scale-105 transform transition disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
};

export default EditEditionForm;
