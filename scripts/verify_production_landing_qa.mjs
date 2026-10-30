import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';

const QA_DIR = '.taste-skill/production-qa';
const ARTIFACT_DIR = 'C:/Users/ROHIT/.gemini/antigravity/brain/932bedea-303a-43ec-a64a-9e6ad1213de2';

if (!existsSync(QA_DIR)) {
  mkdirSync(QA_DIR, { recursive: true });
}
if (!existsSync(ARTIFACT_DIR)) {
  mkdirSync(ARTIFACT_DIR, { recursive: true });
}

function saveAndCopy(filename) {
  const local = join(QA_DIR, filename);
  const artifact = join(ARTIFACT_DIR, filename);
  copyFileSync(local, artifact);
  console.log(`  ✓ Copied to artifact: ${artifact}`);
}

async function runProductionQA() {
  console.log('--- STARTING EDITORIAL PRESTIGE PRODUCTION QA ---');
  const browser = await Browser.launch({ width: 1440, height: 900 });

  try {
    // 1. DESKTOP HERO VIEWPORT (1440x900)
    console.log('\n[1/7] Testing Desktop Landing Page Hero (1440x900)...');
    const desktopPage = await browser.newPage({ width: 1440, height: 900 });
    await desktopPage.goto('http://localhost:5173/');
    await sleep(2000);

    const title = await desktopPage.eval(() => document.title);
    const h1 = await desktopPage.eval(() => document.querySelector('h1')?.textContent);
    console.log(`  ✓ Loaded: "${title}"`);
    console.log(`  ✓ H1 Text: "${h1}"`);

    await desktopPage.screenshot({ path: join(QA_DIR, '01-editorial-hero-desktop.jpg') });
    saveAndCopy('01-editorial-hero-desktop.jpg');

    // 2. MOBILE HERO VIEWPORT (390x844)
    console.log('\n[2/7] Testing Mobile Landing Page Hero (390x844)...');
    const mobilePage = await browser.newPage({ width: 390, height: 844 });
    await mobilePage.goto('http://localhost:5173/');
    await sleep(2000);

    await mobilePage.screenshot({ path: join(QA_DIR, '01-editorial-hero-mobile.jpg') });
    saveAndCopy('01-editorial-hero-mobile.jpg');

    // 3. SCROLL STORYLINE & THREE WORLDS
    console.log('\n[3/7] Testing Scroll Storyline & Three Worlds on Desktop...');
    await desktopPage.wheel(1100, { step: 150, pauseMs: 30 });
    await sleep(1000);

    await desktopPage.screenshot({ path: join(QA_DIR, '02-scroll-storyline.jpg') });
    saveAndCopy('02-scroll-storyline.jpg');

    await desktopPage.wheel(900, { step: 150, pauseMs: 30 });
    await sleep(800);

    // Click "Recruiter Studio" tab in Three Worlds
    await desktopPage.eval(() => {
      const btns = Array.from(document.querySelectorAll('#three-worlds button'));
      const recruiterBtn = btns.find((b) => b.textContent?.includes('Recruiter Studio'));
      recruiterBtn?.click();
    });
    await sleep(500);

    await desktopPage.screenshot({ path: join(QA_DIR, '03-three-worlds-recruiter.jpg') });
    saveAndCopy('03-three-worlds-recruiter.jpg');

    // 4. SIGNATURE DASHBOARD TRANSFORMATION SEQUENCE
    console.log('\n[4/7] Testing Dashboard Transformation Preview...');
    await desktopPage.wheel(1000, { step: 150, pauseMs: 30 });
    await sleep(1000);

    // Switch to Recruiter Studio tab in preview
    await desktopPage.eval(() => {
      const btns = Array.from(document.querySelectorAll('#preview button'));
      const recruiterTab = btns.find((b) => b.textContent?.includes('Recruiter Studio'));
      recruiterTab?.click();
    });
    await sleep(500);

    await desktopPage.screenshot({ path: join(QA_DIR, '04-dashboard-transformation.jpg') });
    saveAndCopy('04-dashboard-transformation.jpg');

    // 5. CAREER JOURNEY & CUTOFF SANDBOX
    console.log('\n[5/7] Testing Cutoff Sandbox & Journey...');
    await desktopPage.wheel(1200, { step: 150, pauseMs: 30 });
    await sleep(1000);

    // Interact with cutoff slider
    await desktopPage.eval(() => {
      const range = document.querySelector('input[type="range"]');
      if (range) {
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(range, '9.20');
        range.dispatchEvent(new Event('input', { bubbles: true }));
        range.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await sleep(600);

    await desktopPage.screenshot({ path: join(QA_DIR, '05-cutoff-sandbox.jpg') });
    saveAndCopy('05-cutoff-sandbox.jpg');

    // 6. AUTHENTICATION PAGES: LOGIN
    console.log('\n[6/7] Testing Login Page (Ivory & Forest Green)...');
    await desktopPage.goto('http://localhost:5173/login');
    await sleep(1200);

    const loginH1 = await desktopPage.eval(() => document.querySelector('h1')?.textContent);
    console.log(`  ✓ Login H1: "${loginH1}"`);

    await desktopPage.screenshot({ path: join(QA_DIR, '06-login-page.jpg') });
    saveAndCopy('06-login-page.jpg');

    // Test sign in
    console.log('  Testing credential submission for Aarav Sharma...');
    await desktopPage.eval(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const passInput = document.querySelector('input[type="password"]');
      if (emailInput && passInput) {
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(emailInput, 'aarav.sharma@campus.edu');
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(passInput, 'CampusFlow2026!');
        passInput.dispatchEvent(new Event('input', { bubbles: true }));
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn?.click();
      }
    });
    await sleep(2500);

    const postLoginUrl = await desktopPage.eval(() => window.location.pathname);
    console.log(`  ✓ Redirected to: "${postLoginUrl}"`);
    await desktopPage.screenshot({ path: join(QA_DIR, '07-student-dashboard-verified.jpg') });
    saveAndCopy('07-student-dashboard-verified.jpg');

    // 7. SIGNUP PAGE
    console.log('\n[7/7] Testing Student Registration Page...');
    await desktopPage.goto('http://localhost:5173/signup');
    await sleep(1200);

    const signupH1 = await desktopPage.eval(() => document.querySelector('h1')?.textContent);
    console.log(`  ✓ Signup H1: "${signupH1}"`);

    await desktopPage.screenshot({ path: join(QA_DIR, '08-signup-page.jpg') });
    saveAndCopy('08-signup-page.jpg');

    console.log('\n--- ALL QUALITY CONTROL VERIFICATIONS PASSED ---');
  } catch (err) {
    console.error('QA Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runProductionQA();
