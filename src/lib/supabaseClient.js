import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ukennwbkjxebotrdfrbo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZW5ud2JranhlYm90cmRmcmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3Mzg0MzAsImV4cCI6MjA1MzMxNDQzMH0.ZfCRGHRhZeLxcav_XQ2SilR4cDKTUjJ0PMkR1KCsrkw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
