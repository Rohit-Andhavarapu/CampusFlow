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
const key = process.env.GROQ_API_KEY || env.GROQ_API_KEY || '';

const groq = new Groq({ apiKey: key });

async function testGroq() {
  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-20b',
    messages: [
      { role: 'system', content: 'Respond in JSON only.' },
      { role: 'user', content: 'Analyze skills: React, TypeScript, Node.js' }
    ],
    response_format: { type: 'json_object' }
  });
  console.log('✓ Groq SDK output:', completion.choices[0].message.content);
}

testGroq().catch(console.error);
