// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// — Variables de entorno
const URL      = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SRV_KEY  = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY; // ¡solo dev!

// — Forzamos siempre sessionStorage (no localStorage)
const storage = typeof window !== "undefined" ? window.sessionStorage : undefined;

// — Cliente público (anon) — lee / sube vídeos, maneja sesión en sessionStorage
export const supabase = createClient(URL, ANON_KEY, {
  auth: {
    detectSessionInUrl: false,
    storage,            // usamos sessionStorage
    persistSession: true,
    autoRefreshToken: true, // mantiene el token activo
  },
});

// — Cliente admin (service role) — NO guarda nada de sesión
export const supabaseAdmin = createClient(URL, SRV_KEY, {
  auth: {
    detectSessionInUrl: false,
    storage: undefined,     // no lee/escribe sessionStorage
    persistSession: false,  // no persiste sesión
    autoRefreshToken: false // no intenta refrescar tokens
  },
});


