import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';

async function testAll() {
  const browser = await Browser.launch({ width: 1440, height: 900 });
  const page = await browser.newPage({ width: 1440, height: 900 });

  async function loginAs(name) {
    await page.goto('http://localhost:5173/demo');
    await sleep(2000);
    await page.eval((n) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find((b) => b.textContent?.includes(n));
      btn?.click();
    }, name);

    for (let i = 0; i < 15; i++) {
      await sleep(500);
      const path = await page.eval(() => window.location.pathname);
      if (path !== '/demo') {
        console.log(`✓ Logged in as "${name}". Path: ${path}`);
        return path;
      }
    }
    console.log(`✗ Failed to navigate from /demo for "${name}"`);
  }

  // 1. Student
  await loginAs('Aarav Sharma');
  await sleep(1500);
  const studentText = await page.eval(() => ({
    hasCompass: document.body.innerText.includes('Career Compass'),
    recharts: document.querySelectorAll('.recharts-wrapper').length,
    path: window.location.pathname
  }));
  console.log('Student Dashboard status:', studentText);

  // 2. What-If Lab
  await page.goto('http://localhost:5173/student/eligibility-lab');
  await sleep(2000);
  const labText = await page.eval(() => ({
    hasLab: document.body.innerText.includes('What-If Eligibility Lab'),
    hasSlider: Boolean(document.querySelector('input[type="range"]')),
    path: window.location.pathname
  }));
  console.log('Eligibility Lab status:', labText);

  // 3. Recruiter
  await loginAs('Priya Nair');
  await sleep(1500);
  await page.goto('http://localhost:5173/recruiter/analytics');
  await sleep(2000);
  const recText = await page.eval(() => ({
    hasRecAnalytics: document.body.innerText.includes('Corporate Hiring Analytics'),
    recharts: document.querySelectorAll('.recharts-wrapper').length,
    path: window.location.pathname
  }));
  console.log('Recruiter Analytics status:', recText);

  // 4. Admin
  await loginAs('Dr. K. R. Rao');
  await sleep(1500);
  await page.goto('http://localhost:5173/admin/analytics');
  await sleep(2000);
  const adminText = await page.eval(() => ({
    hasPulse: document.body.innerText.includes('Placement Pulse'),
    recharts: document.querySelectorAll('.recharts-wrapper').length,
    path: window.location.pathname
  }));
  console.log('Admin Placement Pulse status:', adminText);

  await browser.close();
}

testAll();
