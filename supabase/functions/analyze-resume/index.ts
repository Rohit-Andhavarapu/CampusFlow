// ==============================================================================
// Supabase Edge Function: analyze-resume
// Deno TypeScript Runtime (Production Groq LPU™ Resume Intelligence)
// ==============================================================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import Groq from "npm:groq-sdk@1.6.0";
import { PDFParse } from "npm:pdf-parse@2.4.5";
import { z } from "npm:zod@3.24.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// In-memory cache for Edge Function instances
const memoryCache = new Map();

function sanitizeResumeText(rawText: string): string {
  let text = rawText.replace(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[PHONE REDACTED]');
  text = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g, '[EMAIL REDACTED]');
  text = text.replace(/\s+/g, ' ').trim();
  if (text.length > 12000) {
    text = text.slice(0, 12000) + '... [TRUNCATED FOR SAFE INFERENCE]';
  }
  return text;
}

const SkillItemSchema = z.object({
  name: z.string(),
  category: z.string(),
  evidence: z.string().optional(),
  is_explicit: z.boolean().default(true),
});

const RecommendedRoleSchema = z.object({
  role: z.string(),
  why: z.string(),
  supporting_skills: z.array(z.string()).default([]),
  supporting_projects: z.array(z.string()).default([]),
  missing_competencies: z.array(z.string()).default([]),
  suggested_next_steps: z.string().optional(),
});

const ResumeAnalysisSchema = z.object({
  resume_summary: z.string().default(''),
  extracted_skills: z.array(SkillItemSchema).default([]),
  recommended_roles: z.array(RecommendedRoleSchema).default([]),
  skill_gaps: z.array(z.union([z.string(), z.any()])).default([]),
  improvement_suggestions: z.array(z.string()).default([]),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("VITE_SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SECRET_KEY") ?? "";
  const groqApiKey = Deno.env.get("GROQ_API_KEY") ?? "";
  const groqModel = Deno.env.get("GROQ_MODEL") ?? "openai/gpt-oss-120b";

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing or malformed Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userErr } = await supabaseAdmin.auth.getUser(token);

    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Invalid session token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Resolve Student Profile
    const { data: studentProf } = await supabaseAdmin
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    const studentId = studentProf?.id || user.id;

    // ------------------------------------------------------------------------
    // GET /functions/v1/analyze-resume -> Return Cached Analysis
    // ------------------------------------------------------------------------
    if (req.method === "GET") {
      let cached = memoryCache.get(studentId) || memoryCache.get(user.id);
      if (!cached) {
        for (const [_, v] of memoryCache.entries()) {
          if (v && (v.studentId === studentId || v.studentId === user.id)) {
            cached = v;
            break;
          }
        }
      }

      const { data: latestResume } = await supabaseAdmin
        .from("resume_files")
        .select("*")
        .eq("student_id", studentId)
        .order("uploaded_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cached) {
        return new Response(
          JSON.stringify({
            success: true,
            source: "cache",
            hasResume: Boolean(latestResume),
            latestResume: latestResume || null,
            ...cached,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          analysis: null,
          hasResume: Boolean(latestResume),
          latestResume: latestResume || null,
          message: latestResume ? "Resume uploaded, ready for AI analysis" : "No resume uploaded yet",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ------------------------------------------------------------------------
    // POST /functions/v1/analyze-resume -> Execute Groq LPU™ Analysis
    // ------------------------------------------------------------------------
    const body = await req.json();
    const { storagePath, pdfBase64, consent, forceReanalyze } = body;

    if (!consent) {
      return new Response(
        JSON.stringify({ error: "Explicit student consent is required to process resume content." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let pdfBuffer: Uint8Array | null = null;
    let originalFilename = "resume.pdf";

    if (pdfBase64) {
      const binStr = atob(pdfBase64);
      const len = binStr.length;
      pdfBuffer = new Uint8Array(len);
      for (let i = 0; i < len; i++) pdfBuffer[i] = binStr.charCodeAt(i);
    } else if (storagePath) {
      if (!storagePath.includes(user.id) && !storagePath.includes(studentId)) {
        return new Response(
          JSON.stringify({ error: "Forbidden: Storage path does not belong to authenticated student" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const { data: fileBytes, error: dlErr } = await supabaseAdmin.storage
        .from("resumes")
        .download(storagePath);

      if (dlErr || !fileBytes) {
        return new Response(
          JSON.stringify({ error: `Failed to download resume: ${dlErr?.message || "File not found"}` }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      pdfBuffer = new Uint8Array(await fileBytes.arrayBuffer());
      originalFilename = storagePath.split("/").pop() || "resume.pdf";
    } else {
      const { data: latestResume } = await supabaseAdmin
        .from("resume_files")
        .select("*")
        .eq("student_id", studentId)
        .order("uploaded_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestResume?.storage_path) {
        const { data: fileBytes, error: dlErr } = await supabaseAdmin.storage
          .from("resumes")
          .download(latestResume.storage_path);
        if (!dlErr && fileBytes) {
          pdfBuffer = new Uint8Array(await fileBytes.arrayBuffer());
          originalFilename = latestResume.original_filename;
        }
      }
    }

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid resume PDF found in storage or payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Text Extraction via PDFParse
    let extractedText = "";
    try {
      const parser = new PDFParse({ data: pdfBuffer });
      await parser.load();
      const parsed = await parser.getText();
      extractedText = parsed.text || "";
    } catch {
      return new Response(
        JSON.stringify({ error: "Unable to extract selectable text from PDF (scanned or corrupted)." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sanitized = sanitizeResumeText(extractedText);
    const groq = new Groq({ apiKey: groqApiKey });

    const systemPrompt = `You are CampusFlow Resume Intelligence — an authoritative technical resume parser. Output JSON ONLY matching schema:
{
  "resume_summary": "Concise summary",
  "extracted_skills": [{ "name": "Skill", "category": "Category", "is_explicit": true }],
  "recommended_roles": [{ "role": "Role Title", "why": "Detailed fit explanation", "supporting_skills": ["..."], "missing_competencies": ["..."], "suggested_next_steps": "Actionable advice" }],
  "skill_gaps": ["Skill 1", "Skill 2"],
  "improvement_suggestions": ["Suggestion 1"]
}`;

    const completion = await groq.chat.completions.create({
      model: groqModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze candidate resume:\n${sanitized}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 3000,
    });

    const parsedJson = JSON.parse(completion.choices[0]?.message?.content || "{}");
    const validated = ResumeAnalysisSchema.parse(parsedJson);

    // Match Active Supabase Jobs
    const { data: activeJobs } = await supabaseAdmin
      .from("job_postings")
      .select(`
        id, title, location, work_mode, employment_type,
        compensation_min, compensation_max, compensation_period,
        openings, deadline, status, description,
        companies ( id, name, logo_path, website ),
        job_eligibility_rules ( minimum_cgpa, allowed_branches, required_skills, maximum_backlogs )
      `)
      .eq("status", "active");

    const extractedSkills = validated.extracted_skills || [];
    const skillNamesLower = extractedSkills.map((s) => s.name.toLowerCase());
    const studentCgpa = studentProf?.cgpa ? Number(studentProf.cgpa) : 8.5;
    const studentBranch = studentProf?.branch || "Computer Science";
    const studentBacklogs = studentProf?.active_backlogs ?? 0;

    const matchedJobs = (activeJobs || []).map((job: any) => {
      const rule = Array.isArray(job.job_eligibility_rules) ? job.job_eligibility_rules[0] : job.job_eligibility_rules;
      const required = rule?.required_skills || [];
      const minCgpa = rule?.minimum_cgpa ? Number(rule.minimum_cgpa) : 0;
      const allowedBranches = rule?.allowed_branches || [];
      const maxBacklogs = rule?.maximum_backlogs ?? 0;

      const matching = required.filter((r: string) => skillNamesLower.some((es) => es.includes(r.toLowerCase()) || r.toLowerCase().includes(es)));
      const missing = required.filter((r: string) => !matching.includes(r));
      const matchPct = required.length > 0 ? Math.round((matching.length / required.length) * 100) : 80;

      const cgpaPassed = studentCgpa >= minCgpa;
      const branchPassed = allowedBranches.length === 0 || allowedBranches.some((b: string) => studentBranch.toLowerCase().includes(b.toLowerCase()));
      const backlogsPassed = studentBacklogs <= maxBacklogs;
      const isEligible = cgpaPassed && branchPassed && backlogsPassed;

      return {
        jobId: job.id,
        job_id: job.id,
        title: job.title,
        companyName: job.companies?.name || "Partner Company",
        company_name: job.companies?.name || "Partner Company",
        companyLogo: job.companies?.logo_path,
        location: job.location,
        workMode: job.work_mode,
        type: job.employment_type,
        stipendOrSalary: job.compensation_period === "annual"
          ? `₹${(job.compensation_min / 100000).toFixed(1)} - ₹${(job.compensation_max / 100000).toFixed(1)} LPA`
          : `₹${(job.compensation_min || 25000).toLocaleString()}/mo`,
        suitabilityScore: matchPct,
        suitability_score: matchPct,
        matchingSkills: matching,
        matching_skills: matching,
        missingSkills: missing,
        missing_skills: missing,
        reasoning: matching.length > 0 ? `Matched ${matching.length} of ${required.length} required competencies.` : "Requires developing prerequisites.",
        academicEligibility: {
          isEligible,
          eligible: isEligible,
          cgpaPassed,
          branchPassed,
          backlogsPassed,
          cgpa_cutoff: minCgpa,
          student_cgpa: studentCgpa,
          reason: isEligible ? `Eligible (CGPA ${studentCgpa} meets cutoff ${minCgpa})` : `Academic cutoff gap: Requires ${minCgpa} CGPA`,
        },
      };
    }).sort((a: any, b: any) => b.suitabilityScore - a.suitabilityScore);

    const resultPayload = {
      analysisId: crypto.randomUUID(),
      studentId,
      model: groqModel,
      filename: originalFilename,
      analysisStatus: "completed",
      analyzedAt: new Date().toISOString(),
      summary: validated.resume_summary,
      extractedSkills,
      careerMatches: validated.recommended_roles,
      skillGaps: validated.skill_gaps,
      totalExtractedSkills: extractedSkills.length,
      matchedJobs,
    };

    memoryCache.set(studentId, resultPayload);
    memoryCache.set(user.id, resultPayload);

    return new Response(
      JSON.stringify({ success: true, source: "groq", ...resultPayload }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
