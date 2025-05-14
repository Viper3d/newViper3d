// src/components/EditVideoForm.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

const EditVideoForm = ({ video, onCancel, onSaved, users }) => {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [position, setPosition] = useState("");
  const [rating, setRating] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (video) {
      setTitle(video.title || "");
      setAuthors((video.authors || []).join(", "));
      setPosition(video.position?.toString() || "");
      setRating(video.rating?.toString() || "");
      setBannedUsers(video.banned_users || []);
      setFile(null);
      setPreview(null);
    }
  }, [video]);

  const handleBannedUserChange = (userId) => {
    setBannedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authorsArray = authors
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a);
      const posValue = position.trim() === "" ? null : parseInt(position, 10);
      const ratingValue = rating.trim() === "" ? null : parseInt(rating, 10);

      const updateData = {
        title: title.trim(),
        authors: authorsArray,
        position: posValue,
        rating: ratingValue,
        banned_users: bannedUsers,
      };

      // Reemplazo vídeo principal
      if (file) {
        await supabase.storage.from("videos").remove([video.file_path]);
        const [dir] = video.file_path.split("/");
        const name = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
        const path = `${dir}/${name}`;
        await supabase.storage.from("videos").upload(path, file);
        const { data: mainUrlData } = supabase.storage
          .from("videos")
          .getPublicUrl(path);
        updateData.file_path = path;
        updateData.video_url = mainUrlData.publicUrl;
      }

      // Reemplazo preview
      if (preview) {
        if (video.preview_path) {
          await supabase.storage.from("videos").remove([video.preview_path]);
        }
        const [dir] = (video.preview_path || video.file_path).split("/");
        const name = `${Date.now()}_preview_${preview.name.replace(
          /\s+/g,
          "_"
        )}`;
        const path = `${dir}/${name}`;
        await supabase.storage.from("videos").upload(path, preview);
        const { data: prevUrlData } = supabase.storage
          .from("videos")
          .getPublicUrl(path);
        updateData.preview_path = path;
        updateData.preview_url = prevUrlData.publicUrl;
      }

      await supabase.from("videos").update(updateData).eq("id", video.id);
      onSaved();
    } catch (err) {
      console.error("Error al editar vídeo:", err);
      alert("Error al actualizar el vídeo: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-700 p-6 rounded-2xl space-y-4"
    >
      <h2 className="text-2xl font-bold text-white">Editar vídeo</h2>

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

      <div>
        <label className="block text-gray-300 mb-1">
          Reemplazar Vídeo Principal
        </label>
        <input
          type="file"
          accept="video/*"
          className="w-full p-2 rounded bg-gray-800 text-white"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-1">
          Reemplazar Vídeo Previa (10s)
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

export default EditVideoForm;
