// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// — Variables de entorno
const URL         = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY    = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY; // ¡solo en dev!

// — Detectar storage válido para el cliente público
function getAvailableStorage() {
  if (typeof window === "undefined") return undefined;
  try {
    window.localStorage.setItem("__test", "1");
    window.localStorage.removeItem("__test");
    return window.localStorage;
  } catch {
    try {
      window.sessionStorage.setItem("__test", "1");
      window.sessionStorage.removeItem("__test");
      return window.sessionStorage;
    } catch {
      return undefined;
    }
  }
}

// — “No-op” storage para el admin client
const noopStorage = {
  getItem:    (_key)   => null,
  setItem:    (_key, _v) => {},
  removeItem: (_key)   => {},
};

// — Cliente público (anon): para auth y operaciones de vídeos en el Home
export const supabase = createClient(URL, ANON_KEY, {
  auth: {
    detectSessionInUrl: false,
    storage:            getAvailableStorage(),
    persistSession:     !!getAvailableStorage(),
  },
});

// — Cliente “admin” (service role): solo para Dashboard y sin tocar ningún storage
export const supabaseAdmin = createClient(URL, SERVICE_KEY, {
  auth: {
    detectSessionInUrl: false,
    storage:            noopStorage,
    persistSession:     false,
  },
});

// — Logs de comprobación (opcional)
console.log("Supabase URL:", URL);
console.log("Anon Key    :", ANON_KEY);
console.log(
  "Storage público:",
  getAvailableStorage() === window.localStorage ? "localStorage"
    : getAvailableStorage() === window.sessionStorage ? "sessionStorage"
    : "ninguno"
);
console.log("Admin client usa no-op storage para evitar errores de contexto.");
