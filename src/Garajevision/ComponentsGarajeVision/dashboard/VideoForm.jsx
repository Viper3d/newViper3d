// src/components/VideoForm.jsx
import React, { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

const VideoForm = ({ editions, onVideoAdded, selectedEdition, users }) => {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [position, setPosition] = useState("");
  const [rating, setRating] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [bannedUsers, setBannedUsers] = useState([]); // New state for banned users
  const [loading, setLoading] = useState(false);

  const handleBannedUserChange = (userId) => {
    setBannedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEdition || !title.trim() || !file) {
      alert("Debes seleccionar una edición, título y archivo principal.");
      return;
    }
    setLoading(true);

    try {
      const editionId = selectedEdition.id;
      const slug = selectedEdition.name
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9\s-]/g, "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

      // Subir archivo principal
      const mainName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const mainPath = `${slug}/${mainName}`;
      const { error: upErr } = await supabase.storage
        .from("videos")
        .upload(mainPath, file);
      if (upErr) throw upErr;
      const { data: mainUrlData } = supabase.storage
        .from("videos")
        .getPublicUrl(mainPath);

      // Subir preview si existe
      let previewPath = null;
      let previewUrl = null;
      if (preview) {
        const prevName = `${Date.now()}_preview_${preview.name.replace(
          /\s+/g,
          "_"
        )}`;
        previewPath = `${slug}/${prevName}`;
        const { error: prevErr } = await supabase.storage
          .from("videos")
          .upload(previewPath, preview);
        if (prevErr) throw prevErr;
        const { data: prevUrlData } = supabase.storage
          .from("videos")
          .getPublicUrl(previewPath);
        previewUrl = prevUrlData.publicUrl;
      }

      const authorsArray = authors
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a);
      const posValue = position.trim() === "" ? null : parseInt(position, 10);
      const ratingValue = rating.trim() === "" ? null : parseInt(rating, 10);

      const { error: insertError } = await supabase.from("videos").insert({
        edition_id: editionId,
        title: title.trim(),
        authors: authorsArray,
        position: posValue,
        rating: ratingValue,
        video_url: mainUrlData.publicUrl,
        file_path: mainPath,
        preview_url: previewUrl,
        preview_path: previewPath,
        banned_users: bannedUsers, // Add banned_users to the insert object
      });
      if (insertError) throw insertError;

      // Limpiar formulario
      setTitle("");
      setAuthors("");
      setPosition("");
      setRating("");
      setFile(null);
      setPreview(null);
      setBannedUsers([]); // Reset banned users
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
      <div>
        <label className="block text-gray-300 mb-1">Edición</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={selectedEdition ? selectedEdition.name : ""}
          disabled
        />
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
        type="number"
        placeholder="Rating total (0–10000, opcional)"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />
      <input
        type="file"
        accept="video/*"
        className="w-full p-2 rounded bg-gray-800 text-white"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <div>
        <label className="block text-gray-300 mb-1">
          Vídeo de previa (10s, opcional)
        </label>
        <input
          type="file"
          accept="video/mp4,video/*"
          className="w-full p-2 rounded bg-gray-800 text-white"
          onChange={(e) => setPreview(e.target.files[0])}
        />
      </div>

      {/* Banned Users Checkboxes */}
      <div>
        <label className="block text-gray-300 mb-2 font-semibold">
          Vetar usuarios para votar este vídeo:
        </label>
        <div className="max-h-40 overflow-y-auto bg-gray-800 p-3 rounded-md space-y-2">
          {users && users.length > 0 ? (
            users.map((user) => (
              <label
                key={user.id}
                className="flex items-center space-x-2 text-white hover:bg-gray-600 p-1 rounded-md"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-500 rounded focus:ring-indigo-500"
                  checked={bannedUsers.includes(user.id)}
                  onChange={() => handleBannedUserChange(user.id)}
                />
                <span>{user.full_name || user.email}</span>
              </label>
            ))
          ) : (
            <p className="text-gray-400">No hay usuarios para seleccionar.</p>
          )}
        </div>
      </div>

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
