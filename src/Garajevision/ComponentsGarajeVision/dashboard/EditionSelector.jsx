// src/components/EditionSelector.jsx
import React from "react";

const EditionSelector = ({ editions, selectedEdition, onChange }) => (
  <div className="mb-4">
    <label
      htmlFor="edition-select"
      className="block text-white font-semibold mb-2"
    >
      Edición:
    </label>
    <select
      id="edition-select"
      className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      value={selectedEdition?.id || ""}
      onChange={(e) => {
        const ed = editions.find((x) => x.id === e.target.value);
        onChange(ed || null);
      }}
    >
      <option value="">-- Selecciona o escribe una nueva --</option>
      {editions.map((ed) => (
        <option key={ed.id} value={ed.id}>
          {ed.name}
        </option>
      ))}
    </select>
  </div>
);

export default EditionSelector;
