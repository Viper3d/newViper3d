// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Estas vars vienen de tu .env (las VITE_… son accesibles en el cliente)
const supabaseUrl       = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey   = import.meta.env.VITE_SUPABASE_ANON_KEY;


// src/lib/supabaseClient.js
console.log("URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("AnonKey:", import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log("ServiceKey:", import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY);


// Esta var no empieza con VITE_, y sólo vive en el bundle si la importas
// La usamos para supabaseAdmin — ¡cuidado de no usarla en producción!
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Cliente público para auth “normal”
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente “admin” para llamadas directas al Admin API (sólo desarrollo)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);


