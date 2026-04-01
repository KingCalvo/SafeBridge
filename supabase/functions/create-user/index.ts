import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // obtener token
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // cliente con usuario
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    );

    // validar usuario
    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Token inválido" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // validar rol ADMIN
    const { data: perfil } = await supabaseUser
      .from("usuario")
      .select("id_rol")
      .eq("user_id", user.id)
      .single();

    if (!perfil || perfil.id_rol !== 1) {
      return new Response(JSON.stringify({ error: "Solo admin" }), {
        status: 403,
        headers: corsHeaders,
      });
    }

    // 🧾 5. body
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

    // cliente admin (service role)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 👤 crear usuario en auth
    const { data: userData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) throw authError;

    const userId = userData.user.id;

    // insertar en tabla usuario
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
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({ error: err.message || "Error interno" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
