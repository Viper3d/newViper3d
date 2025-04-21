import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";

const supabaseUrl = "https://ukennwbkjxebotrdfrbo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZW5ud2JranhlYm90cmRmcmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3Mzg0MzAsImV4cCI6MjA1MzMxNDQzMH0.ZfCRGHRhZeLxcav_XQ2SilR4cDKTUjJ0PMkR1KCsrkw";
const supabase = createClient(supabaseUrl, supabaseKey);

const LoginGarajeVision = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signIn({ email, password });
    if (error) setError(error.message);
    else setError(null);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-500 animate-gradient-xy blur-3xl"></div>
      <div className="relative z-10 flex flex-col items-center w-full max-w-md p-6 space-y-6 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-2xl border-4 border-indigo-900">
        <header className="w-40 h-40">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-full transform transition-all duration-500 hover:scale-110"
            />
          </Link>
        </header>
        <div className="w-full space-y-6">
          <h2 className="text-2xl font-bold text-center text-white">Login</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm transform transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginGarajeVision;
