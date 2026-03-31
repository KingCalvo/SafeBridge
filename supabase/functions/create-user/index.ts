import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  try {
    const body = await req.json();

    const {
      email,
      password,
      nombre,
      apellido_paterno,
      apellido_materno,
      curp,
      tel,
      id_rol,
    } = body;

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 🔐 Crear usuario en Auth
    const { data: userData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) throw authError;

    const userId = userData.user.id;

    // 🧱 Insertar en tu tabla usuario
    const { error: dbError } = await supabaseAdmin.from("usuario").insert([
      {
        user_id: userId,
        nombre,
        apellido_paterno,
        apellido_materno,
        curp,
        tel,
        correo: email,
        id_rol,
      },
    ]);

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Error interno" }),
      { status: 400 }
    );
  }
});