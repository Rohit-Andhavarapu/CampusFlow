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

const directions = [
  { id: 'direction-a-editorial', file: 'direction-a-editorial-prestige.html', name: 'Direction A: Editorial Prestige' },
  { id: 'direction-b-cinematic', file: 'direction-b-cinematic-prestige.html', name: 'Direction B: Cinematic Prestige' },
];

async function renderPrestigeDirections() {
  console.log('--- STARTING PRESTIGE DIRECTIONS RENDERING ---');
  const browser = await Browser.launch({ width: 1440, height: 900 });

  try {
    for (const d of directions) {
      console.log(`\nRendering: ${d.name}...`);
      const fileUrl = 'file:///' + resolve('docs/concepts', d.file).replace(/\\/g, '/');

      // 1. Desktop Render (1440 x 900)
      console.log(`  -> Desktop Viewport (1440x900)...`);
      const desktopPage = await browser.newPage({ width: 1440, height: 900 });
      await desktopPage.goto(fileUrl);
      await sleep(1500);

      const desktopOutPath = join(RENDERS_DIR, `${d.id}-desktop.jpg`);
      await desktopPage.screenshot({ path: desktopOutPath });
      console.log(`  ✓ Saved Desktop: ${desktopOutPath}`);

      const artifactDesktop = join(ARTIFACT_DIR, `${d.id}-desktop.jpg`);
      copyFileSync(desktopOutPath, artifactDesktop);
      console.log(`  ✓ Copied to Artifact: ${artifactDesktop}`);

      // 2. Mobile Render (390 x 844)
      console.log(`  -> Mobile Viewport (390x844)...`);
      const mobilePage = await browser.newPage({ width: 390, height: 844 });
      await mobilePage.goto(fileUrl);
      await sleep(1500);

      const mobileOutPath = join(RENDERS_DIR, `${d.id}-mobile.jpg`);
      await mobilePage.screenshot({ path: mobileOutPath });
      console.log(`  ✓ Saved Mobile: ${mobileOutPath}`);

      const artifactMobile = join(ARTIFACT_DIR, `${d.id}-mobile.jpg`);
      copyFileSync(mobileOutPath, artifactMobile);
      console.log(`  ✓ Copied to Artifact: ${artifactMobile}`);
    }

    console.log('\n--- ALL PRESTIGE DIRECTIONS RENDERS GENERATED SUCCESSFULLY ---');
  } catch (err) {
    console.error('Render failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

renderPrestigeDirections();
