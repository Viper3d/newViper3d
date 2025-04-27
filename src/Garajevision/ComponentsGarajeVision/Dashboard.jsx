import React, { useEffect, useState } from "react";
import { supabase, supabaseAdmin } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // 1) Listar usuarios
  const fetchUsers = async () => {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });
    if (error) {
      console.error("Error al listar usuarios:", error);
      alert("Error al cargar usuarios");
    } else {
      setUsers(data.users);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2) Crear usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: newEmail,
      password: newPassword,
      email_confirm: true,
    });
    if (error) {
      alert("Error creando usuario: " + error.message);
    } else {
      alert("Usuario creado correctamente");
      setUsers((u) => [...u, data.user]);
      setNewEmail("");
      setNewPassword("");
    }
  };

  // 3) Eliminar usuario
  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) {
      alert("Error al eliminar: " + error.message);
    } else {
      setUsers((u) => u.filter((x) => x.id !== id));
    }
  };

  // 4) Logout
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="relative p-6 min-h-screen bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-500 animate-gradient-xy blur-3xl" />
      <div className="relative z-10 max-w-screen-lg m-auto bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-2xl border-4 border-indigo-900 p-6 space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Dashboard Admin
          </h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:opacity-90"
          >
            Cerrar sesión
          </button>
        </header>

        {/* Crear nuevo usuario */}
        <section className="bg-gray-700 p-6 rounded-2xl space-y-4">
          <h2 className="text-2xl font-bold text-white">Crear nuevo usuario</h2>
          <form
            className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0"
            onSubmit={handleCreateUser}
          >
            <input
              type="email"
              placeholder="Email"
              required
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:scale-105 transform transition"
            >
              Crear usuario
            </button>
          </form>
        </section>

        {/* Tabla de usuarios */}
        <section className="bg-gray-700 p-6 rounded-2xl overflow-x-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            Lista de usuarios
          </h2>
          <table className="w-full text-white table-auto">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Creado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-600 hover:bg-gray-600"
                >
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.id}</td>
                  <td className="px-4 py-2">
                    {new Date(u.created_at).toLocaleString("es-ES")}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:opacity-90"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
