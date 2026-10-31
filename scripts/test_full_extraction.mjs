import fs from 'node:fs';
import { PDFParse } from 'pdf-parse';
import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

function loadEnv() {
  const env = {};
  if (fs.existsSync('.env')) {
    const lines = fs.readFileSync('.env', 'utf8').split('\n');
    for (const l of lines) {
      const idx = l.indexOf('=');
      if (idx !== -1 && !l.trim().startsWith('#')) {
        env[l.slice(0, idx).trim()] = l.slice(idx + 1).trim();
      }
    }
  }
  return env;
}

const env = loadEnv();
const groq = new Groq({ apiKey: env.GROQ_API_KEY });
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SECRET_KEY);

async function run() {
  const buf = fs.readFileSync('server/fixtures/Aarav_Sharma_Resume_2026.pdf');
  const parser = new PDFParse({ data: buf });
  await parser.load();
  const parsed = await parser.getText();
  console.log('✓ Extracted text length:', parsed.text.length);

  const systemPrompt = `You are CampusFlow Resume Intelligence. Output JSON only matching the schema:
{
  "resume_summary": "Concise summary",
  "extracted_skills": [{ "name": "Skill", "category": "Category", "is_explicit": true }],
  "recommended_roles": [{ "role": "Role Title", "why": "Explanation", "supporting_skills": ["..."], "missing_competencies": ["..."], "suggested_next_steps": "Advice" }],
  "skill_gaps": ["Skill 1", "Skill 2"],
  "improvement_suggestions": ["Advice 1", "Advice 2"]
}`;

  const t0 = Date.now();
  const comp = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: parsed.text }
    ],
    response_format: { type: 'json_object' },
    max_tokens: 3000,
    temperature: 0.1
  });
  console.log('✓ Groq completed in', ((Date.now() - t0)/1000).toFixed(2), 's');
  const data = JSON.parse(comp.choices[0].message.content);

  console.log('Summary:', data.resume_summary);
  console.log('Total Skills:', data.extracted_skills?.length);
  console.log('Extracted Skills:', data.extracted_skills?.map(s => s.name));
  console.log('Roles:', data.recommended_roles?.map(r => r.role));

  // Test Job Matching
  const { data: activeJobs } = await supabase
    .from('job_postings')
    .select('id, title, location, companies(name, logo_path), job_eligibility_rules(minimum_cgpa, allowed_branches, required_skills)')
    .eq('status', 'active');

  console.log('\n--- MATCHED JOBS ---');
  const extractedNames = (data.extracted_skills || []).map(s => s.name.toLowerCase());
  activeJobs?.forEach(j => {
    const rules = j.job_eligibility_rules || {};
    const req = rules.required_skills || [];
    const match = req.filter(r => extractedNames.some(en => en.includes(r.toLowerCase()) || r.toLowerCase().includes(en)));
    const pct = req.length > 0 ? Math.round((match.length / req.length) * 100) : 80;
    console.log(`[${pct}% Match] ${j.title} @ ${j.companies?.name} (Required: ${req.join(', ')} | Matched: ${match.join(', ')})`);
  });
}

run().catch(console.error);
