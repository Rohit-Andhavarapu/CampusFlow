// ==============================================================================
// Supabase Edge Function: analyze-resume
// Deno TypeScript Runtime
// ==============================================================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const groqApiKey = Deno.env.get("GROQ_API_KEY") ?? "";

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userErr } = await supabaseAdmin.auth.getUser(token);

    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { resumeFileId, storagePath, pdfBase64, consent } = await req.json();

    if (!consent) {
      return new Response(
        JSON.stringify({ error: "Explicit student consent is required to process resume content." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Edge function delegates to local server or runs in Deno environment
    return new Response(
      JSON.stringify({
        message: "CampusFlow Resume Intelligence Edge Function",
        user_id: user.id,
        status: "ready",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
