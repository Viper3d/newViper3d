// src/components/EditUserForm.jsx
import React, { useState, useEffect } from "react";
import { supabaseAdmin } from "../../../lib/supabaseClient";

const EditUserForm = ({ user, onCancel, onSaved }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
      setIsAdmin(!!user.is_admin);
      setPassword("");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("[EditUser] Iniciando actualización:", {
        id: user.id,
        fullName,
        email,
        isAdmin,
        passwordProvided: password !== "",
      });

      // 1) Upsert perfil: inserta o actualiza según exista o no
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from("profiles")
        .upsert(
          { id: user.id, full_name: fullName.trim(), is_admin: isAdmin },
          { onConflict: "id" }
        );
      console.log("[EditUser] Resultado upsert perfil:", {
        profileData,
        profileError,
      });
      if (profileError) throw profileError;

      // 2) Actualizar email/password si cambian
      if (email !== user.email || password.trim() !== "") {
        const payload = { email: email.trim() };
        if (password.trim() !== "") payload.password = password.trim();

        console.log("[EditUser] Payload auth update:", payload);
        const { data: authData, error: authError } =
          await supabaseAdmin.auth.admin.updateUserById(user.id, payload);
        console.log("[EditUser] Resultado auth:", { authData, authError });
        if (authError) throw authError;
      }

      alert("Usuario actualizado correctamente");
      onSaved();
    } catch (err) {
      console.error("[EditUser] Error al actualizar usuario:", err);
      alert("Error al actualizar usuario: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-700 p-6 rounded-2xl space-y-4"
    >
      <h2 className="text-2xl font-bold text-white">Editar usuario</h2>

      <input
        type="text"
        placeholder="Nombre completo"
        required
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        required
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Nueva contraseña (dejar vacío para no cambiar)"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className="flex items-center space-x-2 text-white">
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
          className="h-4 w-4"
        />
        <span>¿Es administrador?</span>
      </label>

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

export default EditUserForm;
