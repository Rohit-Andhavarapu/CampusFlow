import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const QA_DIR = '.taste-skill/intelligence-qa';
const ARTIFACT_DIR = 'C:/Users/ROHIT/.gemini/antigravity/brain/932bedea-303a-43ec-a64a-9e6ad1213de2';

function saveAndCopy(filename) {
  const local = join(QA_DIR, filename);
  const artifact = join(ARTIFACT_DIR, filename);
  copyFileSync(local, artifact);
  console.log(`  ✓ Saved & Copied: ${filename}`);
}

async function captureResponsive() {
  console.log('--- CAPTURING RESPONSIVE VIEWPORT ARTIFACTS ---');

  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    console.log(`\nCapturing ${vp.name.toUpperCase()} (${vp.width}x${vp.height})...`);
    const browser = await Browser.launch({ width: vp.width, height: vp.height });
    try {
      const page = await browser.newPage({ width: vp.width, height: vp.height });

      // 1. Admin Placement Pulse
      await page.goto('http://localhost:5173/demo');
      await sleep(1500);
      await page.eval(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const adminBtn = btns.find((b) => b.textContent?.includes('Dr. K. R. Rao') || b.textContent?.includes('placements@campus.edu'));
        adminBtn?.click();
      });
      await sleep(2500);
      await page.goto('http://localhost:5173/admin/analytics');
      await sleep(2500);
      const adminFile = `24-${vp.name}-admin-placement-pulse.jpg`;
      await page.screenshot({ path: join(QA_DIR, adminFile) });
      saveAndCopy(adminFile);

      // 2. Student What-If Lab
      await page.goto('http://localhost:5173/demo');
      await sleep(1500);
      await page.eval(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const studentBtn = btns.find((b) => b.textContent?.includes('Aarav Sharma'));
        studentBtn?.click();
      });
      await sleep(2500);
      await page.goto('http://localhost:5173/student/eligibility-lab');
      await sleep(2500);
      const labFile = `25-${vp.name}-whatif-eligibility-lab.jpg`;
      await page.screenshot({ path: join(QA_DIR, labFile) });
      saveAndCopy(labFile);

    } finally {
      await browser.close();
    }
  }

  console.log('\n--- ALL RESPONSIVE VIEWPORT ARTIFACTS CAPTURED ---');
}

captureResponsive().catch(console.error);
