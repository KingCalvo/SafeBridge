import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  try {
    const { user_id } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Eliminar de auth
    const { error: authError } =
      await supabaseAdmin.auth.admin.deleteUser(user_id);

    if (authError) throw authError;

    // Eliminar de tu tabla usuario
    const { error: dbError } = await supabaseAdmin
      .from("usuario")
      .delete()
      .eq("user_id", user_id);

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }
});