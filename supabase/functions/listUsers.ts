// supabase/functions/listUsers.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabaseAdmin = createClient(url, key);

  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify({ users: data.users }), { status: 200 });
});
