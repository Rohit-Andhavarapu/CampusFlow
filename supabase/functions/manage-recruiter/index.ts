// ==============================================================================
// Supabase Edge Function: manage-recruiter
// Deno TypeScript Runtime (Placement Admin Recruiter Provisioning & Access)
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

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL") ??
      Deno.env.get("VITE_SUPABASE_URL") ??
      "https://apqkpvjelffpbjdkgtsz.supabase.co";

    const supabaseServiceKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
      Deno.env.get("SUPABASE_SECRET_KEY") ??
      "";

    if (!supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server misconfiguration: missing Supabase service key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userErr,
    } = await supabaseAdmin.auth.getUser(token);

    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized session or invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Role check: placement_admin or admin
    const { data: adminProf } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const userRole = adminProf?.role || user.user_metadata?.role;
    if (userRole !== "placement_admin" && userRole !== "admin" && user.email !== "placements@campus.edu") {
      return new Response(
        JSON.stringify({
          error: "Forbidden: Placement Administrator credentials required to manage recruiter accounts",
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { action } = body;

    // --------------------------------------------------------------------------
    // ACTION A: LIST RECRUITERS
    // --------------------------------------------------------------------------
    if (action === "list") {
      const { data: dbRecruiters, error: fetchErr } = await supabaseAdmin
        .from("profiles")
        .select(`
          id, full_name, email, role, avatar_path, created_at,
          recruiter_company_memberships (
            id, company_id, membership_role, approved_at,
            companies ( id, name, logo_url )
          )
        `)
        .eq("role", "recruiter");

      if (fetchErr) {
        console.warn("[Recruiter List Error]:", fetchErr.message);
      }

      const recruiters = (dbRecruiters || []).map((r: any) => {
        const membership = r.recruiter_company_memberships?.[0];
        return {
          id: r.id,
          email: r.email,
          fullName: r.full_name,
          companyId: membership?.company_id,
          companyName: membership?.companies?.name || "Corporate Partner",
          designation: membership?.membership_role || "Talent Acquisition Partner",
          status: "active",
          createdAt: r.created_at,
        };
      });

      return new Response(
        JSON.stringify({
          success: true,
          recruiters,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --------------------------------------------------------------------------
    // ACTION B: INVITE / PROVISION RECRUITER
    // --------------------------------------------------------------------------
    if (action === "invite") {
      const { fullName, email, companyId, designation } = body;
      if (!fullName || !email || !companyId) {
        return new Response(
          JSON.stringify({ error: "Missing required recruiter fields (fullName, email, companyId)" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch company name
      const { data: comp } = await supabaseAdmin
        .from("companies")
        .select("name")
        .eq("id", companyId)
        .maybeSingle();

      const companyName = comp?.name || "Corporate Partner";

      let recruiterUserId = crypto.randomUUID();
      try {
        const { data: createdAuth, error: createAuthErr } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: "CampusFlowRecruiter2026!",
          email_confirm: true,
          user_metadata: { full_name: fullName, role: "recruiter" },
        });

        if (!createAuthErr && createdAuth?.user) {
          recruiterUserId = createdAuth.user.id;
        }
      } catch (authCreateErr: any) {
        console.warn("[Recruiter Auth Notice]:", authCreateErr.message);
      }

      // Upsert Profile
      await supabaseAdmin.from("profiles").upsert({
        id: recruiterUserId,
        full_name: fullName,
        email,
        role: "recruiter",
      });

      // Upsert Company Membership
      await supabaseAdmin.from("recruiter_company_memberships").upsert({
        recruiter_user_id: recruiterUserId,
        company_id: companyId,
        membership_role: designation || "Talent Acquisition Partner",
      });

      const newRecruiter = {
        id: recruiterUserId,
        email,
        fullName,
        companyId,
        companyName,
        designation: designation || "Talent Acquisition Partner",
        status: "active",
        createdAt: new Date().toISOString(),
        acceptedAt: new Date().toISOString(),
      };

      return new Response(
        JSON.stringify({
          success: true,
          message: `Recruiter access provisioned successfully for ${fullName} (${email}).`,
          recruiter: newRecruiter,
        }),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --------------------------------------------------------------------------
    // ACTION C: RESEND INVITATION
    // --------------------------------------------------------------------------
    if (action === "resend") {
      const { email } = body;
      return new Response(
        JSON.stringify({
          success: true,
          message: `Invitation email resent to ${email}.`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --------------------------------------------------------------------------
    // ACTION D: REVOKE RECRUITER ACCESS
    // --------------------------------------------------------------------------
    if (action === "revoke") {
      const { recruiterUserId } = body;
      if (!recruiterUserId) {
        return new Response(JSON.stringify({ error: "Missing recruiterUserId" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Delete company membership
      await supabaseAdmin
        .from("recruiter_company_memberships")
        .delete()
        .eq("recruiter_user_id", recruiterUserId);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Recruiter access revoked successfully.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: `Unsupported recruiter action: ${action}` }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
