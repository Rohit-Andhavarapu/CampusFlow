const Groq = require('groq-sdk');
const fs = require('fs');

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
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || env.GROQ_API_KEY || '' });

async function test(model) {
  try {
    const systemPrompt = `You are CampusFlow Resume Intelligence. You MUST output a valid JSON object.
Schema:
{
  "resume_summary": "string",
  "extracted_skills": [{ "name": "string", "category": "string", "evidence": "string", "is_explicit": true }],
  "projects": [{ "name": "string", "technologies": ["string"], "description": "string", "impact": "string" }],
  "experience": [{ "role": "string", "company": "string", "duration": "string", "responsibilities": ["string"] }],
  "certifications": ["string"],
  "recommended_roles": [{ "role": "string", "why": "string", "supporting_skills": ["string"], "supporting_projects": ["string"], "missing_competencies": ["string"], "suggested_next_steps": "string" }],
  "strengths": ["string"],
  "skill_gaps": ["string"],
  "improvement_suggestions": ["string"],
  "analysis_warnings": []
}`;
    const userPrompt = `Candidate resume text:
Aarav Sharma - Computer Science and Engineering
CGPA 8.85
Technical Skills: React, TypeScript, Node.js, Python, PostgreSQL, Redis, Docker, AWS, Git, REST APIs, Tailwind CSS
Projects: CampusFlow Recruitment Portal - Real-time job matching and interview scheduler
Experience: Software Engineering Intern at NovaTech Systems
Certifications: AWS Certified Cloud Practitioner, Docker Certified Associate`;

    const res = await groq.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2500,
      temperature: 0.2
    });
    console.log(model, '-> SUCCESS! Response length:', res.choices[0].message.content.length);
    const parsed = JSON.parse(res.choices[0].message.content);
    console.log('  Summary:', parsed.resume_summary);
    console.log('  Skills extracted:', parsed.extracted_skills?.length);
    console.log('  Recommended roles:', parsed.recommended_roles?.map(r => r.role));
  } catch (err) {
    console.error(model, '-> ERROR:', err.message);
  }
}

(async () => {
  await test('openai/gpt-oss-20b');
  await test('openai/gpt-oss-120b');
  await test('llama-3.3-70b-versatile');
})();
