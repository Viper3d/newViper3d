// src/Garajevision/ComponentsGarajeVision/EditionForm.jsx
import React, { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

const EditionForm = ({ onEditionAdded }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("El nombre de la edición no puede estar vacío.");
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("editions")
        .insert([{ name: name.trim() }])
        .select();

      if (error) throw error;

      if (data) {
        alert("Edición creada correctamente!");
        setName("");
        if (onEditionAdded) {
          onEditionAdded(data[0]);
        }
      }
    } catch (err) {
      console.error("Error al crear edición:", err);
      alert("Error al crear la edición: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-700 p-6 rounded-2xl space-y-4"
    >
      <h2 className="text-2xl font-bold text-white">Crear Nueva Edición</h2>
      <input
        type="text"
        placeholder="Nombre de la nueva edición"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:scale-105 transform transition disabled:opacity-50"
      >
        {loading ? "Creando..." : "Crear Edición"}
      </button>
    </form>
  );
};

export default EditionForm;
