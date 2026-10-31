import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';

async function test() {
  const browser = await Browser.launch({ width: 1440, height: 900 });
  const page = await browser.newPage({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173/demo');
  await sleep(2000);

  // Hook into console.error / console.log in page
  await page.eval(() => {
    window.__errors = [];
    window.__logs = [];
    const origErr = console.error;
    console.error = (...args) => {
      window.__errors.push(args.map(String).join(' '));
      origErr(...args);
    };
    const origLog = console.log;
    console.log = (...args) => {
      window.__logs.push(args.map(String).join(' '));
      origLog(...args);
    };
  });

  // Check buttons
  const buttonsInfo = await page.eval(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.map((b) => ({ text: b.textContent, disabled: b.disabled }));
  });
  console.log('Buttons on /demo:', buttonsInfo);

  // Click the student persona button
  const clickRes = await page.eval(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const studentBtn = btns.find((b) => b.textContent?.includes('Aarav Sharma'));
    if (!studentBtn) return { success: false, reason: 'not found' };
    studentBtn.click();
    return { success: true };
  });
  console.log('Click result:', clickRes);

  await sleep(4000);

  const curUrl = await page.eval(() => window.location.pathname);
  console.log('Current pathname after 4s:', curUrl);

  const errors = await page.eval(() => window.__errors);
  console.log('Page errors captured:', errors);

  const toasts = await page.eval(() => {
    const toastEls = Array.from(document.querySelectorAll('[class*="toast"], [class*="alert"]'));
    return toastEls.map((t) => t.innerText);
  });
  console.log('Toasts / Alerts on screen:', toasts);

  await browser.close();
}

test();
