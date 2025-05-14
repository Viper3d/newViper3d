// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { supabase, supabaseAdmin } from "../../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

import EditionSelector from "./EditionSelector";
import VideoForm from "./VideoForm";
import VideoList from "./VideoList";
import EditVideoForm from "./EditVideoForm";
import EditUserForm from "./EditUserForm";
import EditionForm from "./EditionForm";
import EditEditionForm from "./EditEditionForm";

const Dashboard = () => {
  const navigate = useNavigate();
  // Estado para saber si es admin
  const [isAdmin, setIsAdmin] = useState(false);

  // Protección de ruta: solo admins pueden entrar
  useEffect(() => {
    const protect = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      const { data: profile, error: profError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();
      if (profError || !profile?.is_admin) {
        navigate("/GarajeVision");
      } else {
        setIsAdmin(true);
      }
    };
    protect();
  }, [navigate]);

  // ==== Estados de Usuarios ====
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newIsAdmin, setNewIsAdmin] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // ==== Estados de Vídeos ====
  const [editions, setEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  // ==== Estados de Ediciones ====
  const [editingEdition, setEditingEdition] = useState(null);
  const [showEditionForm, setShowEditionForm] = useState(false);

  // Fetch usuarios + perfiles
  const fetchUsers = async () => {
    console.log("[Dashboard] 👉 listUsers admin…");
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 100 });
    console.log("[Dashboard] authData", authData, "authError", authError);
    if (authError) return;

    console.log("[Dashboard] 👉 fetching profiles…");
    const { data: profiles, error: profError } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, is_admin");
    console.log("[Dashboard] profiles", profiles, "profError", profError);
    if (profError) return;

    const merged = authData.users.map((u) => {
      const p = profiles.find((x) => x.id === u.id) || {};
      return {
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        full_name: p.full_name || "",
        is_admin: p.is_admin || false,
      };
    });
    setUsers(merged);
  };

  // Crear usuario + perfil
  const handleCreateUser = async (e) => {
    e.preventDefault();
    console.log("[Dashboard] 👉 Creando usuario", {
      newName,
      newEmail,
      newIsAdmin,
    });
    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: newEmail,
        password: newPassword,
        email_confirm: true,
      });
      console.log("[Dashboard] createUser", data, error);
      if (error) throw error;

      const { error: profErr } = await supabaseAdmin.from("profiles").insert({
        id: data.user.id,
        full_name: newName.trim(),
        is_admin: newIsAdmin,
      });
      console.log("[Dashboard] insertProfile", profErr);
      if (profErr) throw profErr;

      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewIsAdmin(false);
      fetchUsers();
      alert("Usuario creado correctamente");
    } catch (err) {
      console.error("[Dashboard] Error creando usuario", err);
      alert("Error: " + err.message);
    }
  };

  // Eliminar usuario + perfil
  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Eliminar usuario y perfil?")) return;
    console.log("[Dashboard] 👉 Eliminando", id);
    try {
      const { error: profErr } = await supabaseAdmin
        .from("profiles")
        .delete()
        .eq("id", id);
      console.log("[Dashboard] deleteProfileErr", profErr);
      if (profErr) throw profErr;

      const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(id);
      console.log("[Dashboard] deleteUserErr", authErr);
      if (authErr) throw authErr;

      fetchUsers();
    } catch (err) {
      console.error("[Dashboard] Error eliminando usuario", err);
      alert("Error al eliminar: " + err.message);
    }
  };

  // Edición de usuario
  const handleEditUser = (user) => setEditingUser(user);
  const handleSaveUser = () => {
    setEditingUser(null);
    fetchUsers();
  };
  const handleCancelEdit = () => setEditingUser(null);

  // Fetch ediciones
  const fetchEditions = async () => {
    const { data, error } = await supabase
      .from("editions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setEditions(data);
  };

  // Crear edición
  const handleEditionAdded = (edition) => {
    setShowEditionForm(false);
    fetchEditions();
  };

  // Editar edición
  const handleEditEdition = (edition) => setEditingEdition(edition);
  const handleSaveEdition = () => {
    setEditingEdition(null);
    fetchEditions();
  };
  const handleCancelEditEdition = () => setEditingEdition(null);

  // Eliminar edición
  const handleDeleteEdition = async (edition) => {
    if (!window.confirm(`¿Eliminar edición "${edition.name}"?`)) return;
    try {
      const { error } = await supabase
        .from("editions")
        .delete()
        .eq("id", edition.id);
      if (error) throw error;
      fetchEditions();
      if (selectedEdition?.id === edition.id) setSelectedEdition(null);
    } catch (err) {
      alert("Error al eliminar la edición: " + err.message);
    }
  };

  // Fetch vídeos de la edición
  const fetchVideos = async (edition) => {
    if (!edition) {
      setVideos([]);
      return;
    }
    setLoadingVideos(true);
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("edition_id", edition.id)
      .order("position", { ascending: true, nulls: "last" })
      .order("created_at", { ascending: false });
    if (!error) setVideos(data);
    setLoadingVideos(false);
  };

  // Eliminar vídeo (principal + preview)
  const handleDeleteVideo = async (video) => {
    if (!window.confirm(`¿Eliminar "${video.title}"?`)) return;

    // 1) Borrar archivos del bucket
    const paths = [video.file_path];
    if (video.preview_path) paths.push(video.preview_path);
    const { error: removeError } = await supabase.storage
      .from("videos")
      .remove(paths);
    if (removeError) {
      console.error("Error al borrar archivos del bucket:", removeError);
      alert("No se pudo borrar los archivos de vídeo.");
      return;
    }

    // 2) Borrar registro de la tabla
    const { error: deleteError } = await supabase
      .from("videos")
      .delete()
      .eq("id", video.id);
    if (deleteError) {
      console.error("Error al borrar registro:", deleteError);
      alert("No se pudo borrar el registro de la base de datos.");
      return;
    }

    // 3) Refrescar lista
    fetchVideos(selectedEdition);
  };

  // Editar vídeo
  const handleEditVideo = (v) => setEditingVideo(v);
  const handleSaveVideo = () => {
    setEditingVideo(null);
    fetchVideos(selectedEdition);
  };
  const handleCancelVideo = () => setEditingVideo(null);

  // Logout
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Effects
  useEffect(() => {
    fetchUsers();
    fetchEditions();
  }, []);

  useEffect(() => {
    fetchVideos(selectedEdition);
  }, [selectedEdition]);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-500 animate-gradient-xy blur-3xl" />
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-2xl border-4 border-indigo-900 space-y-8">
        {/* HEADER */}
        <header className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Dashboard Admin</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:opacity-90"
            >
              Ir a Home
            </button>
            {isAdmin && (
              <button
                onClick={() => navigate("/dashboardvotaciones")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:opacity-90"
              >
                Dashboard Votaciones
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:opacity-90"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* wrap create user and user list in grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CREAR / EDITAR USUARIO */}
          <section className="bg-gray-700 p-6 rounded-2xl space-y-4">
            {editingUser ? (
              <EditUserForm
                user={editingUser}
                onCancel={handleCancelEdit}
                onSaved={handleSaveUser}
              />
            ) : (
              <form onSubmit={handleCreateUser} className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                  Crear nuevo usuario
                </h2>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  required
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <label className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    checked={newIsAdmin}
                    onChange={(e) => setNewIsAdmin(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>¿Es administrador?</span>
                </label>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:scale-105 transform transition"
                >
                  Crear usuario
                </button>
              </form>
            )}
          </section>

          {/* LISTA DE USUARIOS */}
          <section
            aria-labelledby="user-list-heading"
            className="bg-gray-700 p-6 rounded-2xl overflow-x-auto"
          >
            <h2
              id="user-list-heading"
              className="text-2xl font-bold text-white mb-4"
            >
              Lista de usuarios
            </h2>
            <table className="w-full text-white table-auto">
              <caption className="sr-only">Lista de usuarios</caption>
              <thead>
                <tr className="border-b border-gray-600">
                  <th scope="col" className="px-4 py-2 text-left">
                    Nombre
                  </th>
                  <th scope="col" className="px-4 py-2 text-left">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-2 text-left">
                    Admin
                  </th>
                  <th scope="col" className="px-4 py-2 text-left">
                    ID
                  </th>
                  <th scope="col" className="px-4 py-2 text-left">
                    Creado
                  </th>
                  <th scope="col" className="px-4 py-2 text-left">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-600 hover:bg-gray-600"
                  >
                    <td className="px-4 py-2">{u.full_name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.is_admin ? "Sí" : "No"}</td>
                    <td className="px-4 py-2">{u.id}</td>
                    <td className="px-4 py-2">
                      {new Date(u.created_at).toLocaleString("es-ES")}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                        <button
                          onClick={() => handleEditUser(u)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:opacity-90"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:opacity-90"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* GESTIÓN DE EDICIONES */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-white">
            Gestión de Ediciones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-700 p-6 rounded-2xl">
              {editingEdition ? (
                <EditEditionForm
                  edition={editingEdition}
                  onCancel={handleCancelEditEdition}
                  onSaved={handleSaveEdition}
                />
              ) : showEditionForm ? (
                <EditionForm onEditionAdded={handleEditionAdded} />
              ) : (
                <button
                  onClick={() => setShowEditionForm(true)}
                  className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:scale-105 transform transition"
                >
                  Crear nueva edición
                </button>
              )}
            </div>
            <div className="bg-gray-700 p-6 rounded-2xl overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Lista de Ediciones
              </h3>
              <table className="w-full text-white table-auto">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="px-4 py-2 text-left">Nombre</th>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {editions.map((ed) => (
                    <tr
                      key={ed.id}
                      className="border-b border-gray-600 hover:bg-gray-600"
                    >
                      <td className="px-4 py-2">{ed.name}</td>
                      <td className="px-4 py-2">{ed.id}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                          <button
                            onClick={() => handleEditEdition(ed)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:opacity-90"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteEdition(ed)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:opacity-90"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* GESTIÓN DE VÍDEOS */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-white">Gestión de Vídeos</h2>
          <EditionSelector
            editions={editions}
            selectedEdition={selectedEdition}
            onChange={setSelectedEdition}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {editingVideo ? (
                <EditVideoForm
                  video={editingVideo}
                  users={users} // Pass users list
                  onCancel={handleCancelVideo}
                  onSaved={handleSaveVideo}
                />
              ) : (
                <VideoForm
                  editions={editions}
                  selectedEdition={selectedEdition}
                  users={users} // Pass users list
                  onVideoAdded={() => {
                    fetchEditions();
                    fetchVideos(selectedEdition);
                  }}
                />
              )}
            </div>
            <div className="bg-gray-700 p-6 rounded-2xl overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Vídeos de "{selectedEdition?.name || "—"}"
              </h3>
              {loadingVideos ? (
                <p className="text-gray-300">Cargando vídeos...</p>
              ) : (
                <VideoList
                  videos={videos}
                  onDelete={handleDeleteVideo}
                  onEdit={handleEditVideo}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
