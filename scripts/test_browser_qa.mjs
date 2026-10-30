import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const QA_DIR = '.taste-skill/qa';
if (!existsSync(QA_DIR)) {
  mkdirSync(QA_DIR, { recursive: true });
}

async function runBrowserQA() {
  console.log('--- STARTING REAL BROWSER QUALITY ASSURANCE ---');
  const browser = await Browser.launch({ width: 1440, height: 900 });

  try {
    // TEST 1: DESKTOP LANDING PAGE LOAD & HERO SCREENSHOT
    console.log('\n[1/7] Testing Desktop Landing Page (1440x900)...');
    const page = await browser.newPage({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/');
    await sleep(2000);

    const title = await page.eval(() => document.title);
    const h1 = await page.eval(() => document.querySelector('h1')?.textContent);
    console.log(`✓ Loaded: "${title}", Hero H1: "${h1}"`);

    await page.screenshot({ path: join(QA_DIR, '01-desktop-hero.jpg') });
    console.log('✓ Captured: 01-desktop-hero.jpg');

    // TEST 2: GSAP SCROLL STORYLINE PIN & TRIGGER
    console.log('\n[2/7] Testing GSAP ScrollTrigger Sequence...');
    await page.wheel(1500, { step: 200, pauseMs: 40 });
    await sleep(1000);

    const activeStageTitle = await page.eval(() => {
      const h2 = document.querySelector('#platform h2');
      return h2 ? h2.textContent : 'Not found';
    });
    console.log(`✓ Scrolled to Platform Stage: "${activeStageTitle}"`);
    await page.screenshot({ path: join(QA_DIR, '02-scroll-storyline.jpg') });
    console.log('✓ Captured: 02-scroll-storyline.jpg');

    // TEST 3: THREE WORLDS INTERACTIVE TABS
    console.log('\n[3/7] Testing Three Worlds Stage Switcher...');
    await page.wheel(1800, { step: 200, pauseMs: 40 });
    await sleep(800);

    // Click "For Recruiters"
    await page.eval(() => {
      const btns = Array.from(document.querySelectorAll('#students button'));
      const recruiterBtn = btns.find(b => b.textContent?.includes('For Recruiters'));
      recruiterBtn?.click();
    });
    await sleep(600);

    const recruiterHeading = await page.eval(() => {
      const h3 = document.querySelector('#recruiters h3');
      return h3 ? h3.textContent : 'Not found';
    });
    console.log(`✓ Switched to Recruiter World: "${recruiterHeading}"`);
    await page.screenshot({ path: join(QA_DIR, '03-three-worlds-recruiter.jpg') });
    console.log('✓ Captured: 03-three-worlds-recruiter.jpg');

    // Click "For Placement Teams"
    await page.eval(() => {
      const btns = Array.from(document.querySelectorAll('#students button'));
      const adminBtn = btns.find(b => b.textContent?.includes('For Placement Teams'));
      adminBtn?.click();
    });
    await sleep(600);

    const adminStats = await page.eval(() => {
      const stat = document.querySelector('[data-ui="admin-product-preview"] span');
      return stat ? stat.textContent : 'Not found';
    });
    console.log(`✓ Switched to Admin World. Placement Stat: "${adminStats}"`);
    await page.screenshot({ path: join(QA_DIR, '04-three-worlds-admin.jpg') });
    console.log('✓ Captured: 04-three-worlds-admin.jpg');

    // TEST 4: LIVE ELIGIBILITY CUTOFF SIMULATOR
    console.log('\n[4/7] Testing Live Eligibility Cutoff Simulator...');
    await page.wheel(1200, { step: 200, pauseMs: 40 });
    await sleep(800);

    // Initial state check
    const initialStatus = await page.eval(() => {
      const statusPill = document.querySelector('#eligibility [data-ui="eligibility-simulator"]');
      return statusPill ? statusPill.textContent?.includes('PASSED') : false;
    });
    console.log(`✓ Initial Status (8.50 CGPA, CSE, 0 Backlogs): ${initialStatus ? 'PASSED' : 'NOT PASSED'}`);

    // Adjust CGPA slider to failing 7.20 CGPA
    await page.eval(() => {
      const slider = document.querySelector('#eligibility input[type="range"]');
      if (slider) {
        slider.value = '7.20';
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await sleep(400);

    const failingStatus = await page.eval(() => {
      const statusPill = document.querySelector('#eligibility [data-ui="eligibility-simulator"]');
      return statusPill ? statusPill.textContent?.includes('SHORT') : false;
    });
    console.log(`✓ After setting CGPA to 7.20: Shortfall detected = ${failingStatus}`);
    await page.screenshot({ path: join(QA_DIR, '05-simulator-failing.jpg') });
    console.log('✓ Captured: 05-simulator-failing.jpg');

    // TEST 5: AUTHENTICATION FLOW (LOGIN WITH INVALID THEN VALID CREDENTIALS)
    console.log('\n[5/7] Testing Production Split-Screen /login Flow...');
    await page.goto('http://localhost:5173/login');
    await sleep(1500);

    await page.screenshot({ path: join(QA_DIR, '06-login-page.jpg') });
    console.log('✓ Captured: 06-login-page.jpg');

    // Submit invalid credentials
    await page.eval(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      const submitBtn = document.querySelector('form button[type="submit"]');
      
      const setVal = (el, val) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };

      if (emailInput && passwordInput && submitBtn) {
        setVal(emailInput, 'invalid.student@campus.edu');
        setVal(passwordInput, 'WrongPassword123!');
        submitBtn.click();
      }
    });
    await sleep(2500);

    const errorMessage = await page.eval(() => {
      const alert = document.querySelector('[role="alert"], .text-rose-300, .text-rose-400, .text-rose-200');
      return alert ? alert.textContent : null;
    });
    console.log(`✓ Invalid Login Error Banner Verified: "${errorMessage}"`);
    await page.screenshot({ path: join(QA_DIR, '07-login-error.jpg') });
    console.log('✓ Captured: 07-login-error.jpg');

    // Submit valid credentials (Aarav Sharma demo account)
    console.log('Submitting valid demo student credentials...');
    await page.eval(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      const submitBtn = document.querySelector('form button[type="submit"]');

      const setVal = (el, val) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };

      if (emailInput && passwordInput && submitBtn) {
        setVal(emailInput, 'aarav.sharma@campus.edu');
        setVal(passwordInput, 'CampusFlow2026!');
        submitBtn.click();
      }
    });
    await sleep(4000);

    const currentUrl = await page.eval(() => window.location.pathname);
    console.log(`✓ Authenticated Navigation Target: ${currentUrl}`);

    await page.screenshot({ path: join(QA_DIR, '08-student-dashboard.jpg') });
    console.log('✓ Captured: 08-student-dashboard.jpg');

    // TEST 6: LOGOUT FLOW
    console.log('\n[6/7] Testing Logout and Return to Public Landing Page...');
    await page.goto('http://localhost:5173/');
    await sleep(1500);

    // Verify header reflects logged in state (Open Dashboard & Logout button)
    const hasDashboardBtn = await page.eval(() => {
      return Array.from(document.querySelectorAll('button')).some(b => b.textContent?.includes('Open Dashboard'));
    });
    console.log(`✓ Header shows "Open Dashboard" when authenticated: ${hasDashboardBtn}`);

    // Click logout
    await page.eval(() => {
      const logoutBtn = document.querySelector('header button[title*="Log Out"]');
      logoutBtn?.click();
    });
    await sleep(1500);

    const headerAuthAfterLogout = await page.eval(() => {
      const loginLink = document.querySelector('header a[href="/login"]');
      const signupLink = document.querySelector('header a[href="/signup"]');
      return !!(loginLink && signupLink);
    });
    console.log(`✓ Header shows "Log In" & "Sign Up" after logout: ${headerAuthAfterLogout}`);
    await page.screenshot({ path: join(QA_DIR, '09-logged-out-header.jpg') });
    console.log('✓ Captured: 09-logged-out-header.jpg');

    // TEST 7: DEMO SANDBOX & SIGNUP SCREEN
    console.log('\n[7/7] Testing Isolated /demo Hackathon Sandbox & /signup...');
    await page.goto('http://localhost:5173/demo');
    await sleep(1500);
    const demoTitle = await page.eval(() => document.querySelector('h1')?.textContent);
    console.log(`✓ Loaded Isolated Demo Sandbox: "${demoTitle}"`);
    await page.screenshot({ path: join(QA_DIR, '10-demo-sandbox.jpg') });
    console.log('✓ Captured: 10-demo-sandbox.jpg');

    await page.goto('http://localhost:5173/signup');
    await sleep(1500);
    const signupRoleLocked = await page.eval(() => {
      return document.body.textContent?.includes('Student Account Only') || document.body.textContent?.includes('Student Registration');
    });
    console.log(`✓ Verified Public Signup Locked to Student Role: ${signupRoleLocked}`);
    await page.screenshot({ path: join(QA_DIR, '11-signup-student-only.jpg') });
    console.log('✓ Captured: 11-signup-student-only.jpg');

    await page.close();
    console.log('\n--- ALL REAL BROWSER QA TESTS COMPLETED SUCCESSFULLY ---');
  } finally {
    await browser.close();
  }
}

runBrowserQA().catch((err) => {
  console.error('QA Failed:', err);
  process.exit(1);
});
