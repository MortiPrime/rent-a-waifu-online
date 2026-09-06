import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json(401, { error: "No autorizado" });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData.user) return json(401, { error: "Sesión inválida" });

    const callerId = userData.user.id;

    // Verificar que quien llama es admin
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return json(403, { error: "Solo un administrador puede eliminar usuarios" });

    const { userId } = await req.json();
    if (!userId || typeof userId !== "string") return json(400, { error: "userId requerido" });

    if (userId === callerId) {
      return json(400, { error: "No puedes eliminar tu propia cuenta" });
    }

    // No permitir eliminar a otro administrador
    const { data: targetAdmin } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (targetAdmin) {
      return json(400, { error: "No puedes eliminar a otro administrador" });
    }

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;

    console.log(`[ADMIN-DELETE-USER] ${callerId} eliminó a ${userId}`);
    return json(200, { success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[ADMIN-DELETE-USER] Error:", message);
    return json(500, { error: message });
  }
});
