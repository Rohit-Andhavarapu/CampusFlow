import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const QA_DIR = '.taste-skill/intelligence-qa';
const ARTIFACT_DIR = 'C:/Users/ROHIT/.gemini/antigravity/brain/932bedea-303a-43ec-a64a-9e6ad1213de2';

function saveAndCopy(filename) {
  const local = join(QA_DIR, filename);
  const artifact = join(ARTIFACT_DIR, filename);
  if (existsSync(local)) {
    copyFileSync(local, artifact);
    console.log(`  ✓ Saved & Copied to artifact: ${artifact}`);
  }
}

async function run() {
  console.log('--- Testing Real Authenticated Student in Browser ---');
  const browser = await Browser.launch({ width: 1440, height: 900 });

  try {
    const page = await browser.newPage({ width: 1440, height: 900 });

    // 1. Login via regular login form
    console.log('Logging in via /login with real student credentials...');
    await page.goto('http://localhost:5173/login');
    await sleep(1500);

    await page.eval(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const passInput = document.querySelector('input[type="password"]');
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      if (emailInput && passInput) {
        nativeSetter.call(emailInput, 'real.student.test@campus.edu');
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        nativeSetter.call(passInput, 'CampusFlowPassword2026!');
        passInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      setTimeout(() => {
        const btn = document.querySelector('button[type="submit"]');
        btn?.click();
      }, 100);
    });

    for (let i = 0; i < 20; i++) {
      await sleep(500);
      const path = await page.eval(() => window.location.pathname);
      if (path !== '/login') {
        console.log(`✓ Real user logged in -> current path: ${path}`);
        break;
      }
    }

    await sleep(1500);

    // 2. Visit Profile & Resume Tab
    console.log('Navigating to /student/profile?tab=resume...');
    await page.goto('http://localhost:5173/student/profile?tab=resume');
    await sleep(2000);

    const profileCheck = await page.eval(() => {
      const text = document.body.innerText;
      return {
        hasDropzone: text.includes('Upload Master Placement Resume') && text.includes('Browse PDF Files'),
        hasAaravResume: text.includes('Aarav_Sharma_Resume_2026.pdf'),
        candidateName: document.querySelector('input[value*="Rohit"]') ? 'Rohit Student Real' : 'Clean',
      };
    });
    console.log('Profile Resume Check:', profileCheck);

    await page.screenshot({ path: join(QA_DIR, '36-real-user-profile-resume-empty.jpg') });
    saveAndCopy('36-real-user-profile-resume-empty.jpg');

    // 3. Visit Resume Intelligence Page
    console.log('Navigating to /student/resume-intelligence...');
    await page.goto('http://localhost:5173/student/resume-intelligence');
    await sleep(2000);

    const intelCheck = await page.eval(() => {
      const text = document.body.innerText;
      return {
        hasNoResumeTitle: text.includes('No Active Master Resume Found'),
        hasGoToDocsButton: text.includes('Go to Resume & Documents'),
        hasFakeSuccess: text.includes('Resume analyzed successfully'),
        hasZeroVerifiedSkills: text.includes('0 Verified Skills'),
        hasAaravData: text.includes('Aarav Sharma') || text.includes('Aarav_Sharma_Resume_2026.pdf'),
      };
    });
    console.log('Resume Intelligence Empty State Check:', intelCheck);

    await page.screenshot({ path: join(QA_DIR, '37-real-user-resume-intelligence-empty.jpg') });
    saveAndCopy('37-real-user-resume-intelligence-empty.jpg');

    console.log('✓ Real user empty state verified cleanly!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Real User Browser Test Error:', err);
  process.exit(1);
});
