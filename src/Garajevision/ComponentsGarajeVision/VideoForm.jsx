// src/components/VideoForm.jsx
import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// Convierte un texto en un slug seguro
const slugify = (str) =>
  str
    .toString()
    .normalize("NFD") // descompone acentos
    .replace(/[\u0300-\u036f]/g, "") // quita marcas diacríticas
    .replace(/[^a-zA-Z0-9\s-]/g, "") // quita caracteres no alfanuméricos (salvo espacios)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-"); // espacios → guiones

const VideoForm = ({ editions, onVideoAdded }) => {
  const [editionName, setEditionName] = useState("");
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [position, setPosition] = useState(""); // Nuevo estado para posición
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1) Obtener o crear la edición por nombre
  const getOrCreateEdition = async (name) => {
    const { data: existing, error: fetchError } = await supabase
      .from("editions")
      .select("id")
      .eq("name", name)
      .maybeSingle();
    if (fetchError) throw fetchError;
    if (existing) return existing.id;

    const { data: inserted, error: insertError } = await supabase
      .from("editions")
      .insert({ name })
      .single();
    if (insertError) throw insertError;
    return inserted.id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editionName.trim() || !title.trim() || !file) {
      alert("Edición, título y archivo son obligatorios.");
      return;
    }
    setLoading(true);

    try {
      // 1) ID de edición
      const editionId = await getOrCreateEdition(editionName.trim());

      // 2) Generar paths seguros para Storage
      const editionSlug = slugify(editionName.trim());
      const safeFileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const filePath = `${editionSlug}/${safeFileName}`;

      // 3) Subir el archivo a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // 4) Obtener URL pública del vídeo
      const { data: urlData, error: urlError } = supabase.storage
        .from("videos")
        .getPublicUrl(filePath);
      if (urlError) throw urlError;
      const publicUrl = urlData.publicUrl;

      // 5) Preparar array de autores
      const authorsArray = authors
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      // 6) Parsear posición (opcional)
      const posValue =
        position.trim() === "" ? null : parseInt(position.trim(), 10);

      // 7) Insertar registro en la tabla "videos"
      const { error: insertError } = await supabase.from("videos").insert({
        edition_id: editionId,
        title: title.trim(),
        authors: authorsArray,
        position: posValue, // <-- posición opcional
        video_url: publicUrl,
        file_path: filePath, // <-- ruta para borrado futuro
      });
      if (insertError) throw insertError;

      // 8) Limpiar formulario y notificar al componente padre
      setEditionName("");
      setTitle("");
      setAuthors("");
      setPosition("");
      setFile(null);
      onVideoAdded();
    } catch (err) {
      console.error("Error al subir vídeo:", err);
      alert("Error al subir el vídeo: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-700 p-6 rounded-2xl space-y-4"
    >
      <h2 className="text-2xl font-bold text-white">Añadir vídeo</h2>

      {/* Edición: input libre + desplegable de ediciones existentes */}
      <div>
        <label className="block text-gray-300 mb-1">Edición</label>
        <input
          list="editions-list"
          placeholder="Escribe o elige una edición"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={editionName}
          onChange={(e) => setEditionName(e.target.value)}
        />
        <datalist id="editions-list">
          {editions.map((ed) => (
            <option key={ed.id} value={ed.name} />
          ))}
        </datalist>
      </div>

      <input
        type="text"
        placeholder="Título de la canción"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Autores (separados por comas)"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={authors}
        onChange={(e) => setAuthors(e.target.value)}
      />

      <input
        type="number"
        placeholder="Posición (opcional)"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
      />

      <input
        type="file"
        accept="video/*"
        className="w-full p-2 rounded bg-gray-800 text-white"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:scale-105 transform transition disabled:opacity-50"
      >
        {loading ? "Subiendo..." : "Subir vídeo"}
      </button>
    </form>
  );
};

export default VideoForm;
