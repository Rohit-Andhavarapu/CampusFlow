import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const RENDERS_DIR = resolve('docs/concepts/renders');
const ARTIFACT_DIR = 'C:/Users/ROHIT/.gemini/antigravity/brain/932bedea-303a-43ec-a64a-9e6ad1213de2';

if (!existsSync(RENDERS_DIR)) {
  mkdirSync(RENDERS_DIR, { recursive: true });
}

if (!existsSync(ARTIFACT_DIR)) {
  mkdirSync(ARTIFACT_DIR, { recursive: true });
}

const concepts = [
  { id: 'concept-1-academic', file: 'concept-1-academic.html', name: 'Concept 1 — Academic Prestige Gazette' },
  { id: 'concept-2-studio', file: 'concept-2-studio.html', name: 'Concept 2 — Precision Studio Workbench' },
  { id: 'concept-3-kinetic', file: 'concept-3-kinetic.html', name: 'Concept 3 — Kinetic Journey Stream' },
  { id: 'concept-4-hybrid', file: 'concept-4-hybrid.html', name: 'Concept 4 — Precision × Kinetic Hybrid' },
];

async function renderMockups() {
  console.log('--- STARTING HIGH-FIDELITY CONCEPT RENDERING ---');
  const browser = await Browser.launch({ width: 1440, height: 900 });

  try {
    for (const c of concepts) {
      console.log(`\nRendering: ${c.name}...`);
      const fileUrl = 'file:///' + resolve('docs/concepts', c.file).replace(/\\/g, '/');

      // 1. Desktop Render (1440 x 900)
      console.log(`  -> Desktop Viewport (1440x900)...`);
      const desktopPage = await browser.newPage({ width: 1440, height: 900 });
      await desktopPage.goto(fileUrl);
      await sleep(1500); // Allow fonts & CDN Tailwind to settle

      const desktopOutPath = join(RENDERS_DIR, `${c.id}-desktop.jpg`);
      await desktopPage.screenshot({ path: desktopOutPath });
      console.log(`  ✓ Saved Desktop: ${desktopOutPath}`);

      // Copy to Artifact dir
      const artifactDesktop = join(ARTIFACT_DIR, `${c.id}-desktop.jpg`);
      copyFileSync(desktopOutPath, artifactDesktop);
      console.log(`  ✓ Copied to Artifact: ${artifactDesktop}`);

      // 2. Mobile Render (390 x 844 - iPhone 14 / standard modern mobile)
      console.log(`  -> Mobile Viewport (390x844)...`);
      const mobilePage = await browser.newPage({ width: 390, height: 844 });
      await mobilePage.goto(fileUrl);
      await sleep(1500);

      const mobileOutPath = join(RENDERS_DIR, `${c.id}-mobile.jpg`);
      await mobilePage.screenshot({ path: mobileOutPath });
      console.log(`  ✓ Saved Mobile: ${mobileOutPath}`);

      // Copy to Artifact dir
      const artifactMobile = join(ARTIFACT_DIR, `${c.id}-mobile.jpg`);
      copyFileSync(mobileOutPath, artifactMobile);
      console.log(`  ✓ Copied to Artifact: ${artifactMobile}`);
    }

    console.log('\n--- ALL 8 CONCEPT RENDERS GENERATED & STORED IN ARTIFACT DIRECTORY ---');
  } catch (err) {
    console.error('Render failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

renderMockups();
