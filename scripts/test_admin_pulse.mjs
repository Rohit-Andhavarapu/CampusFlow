import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';

async function test() {
  const browser = await Browser.launch({ width: 1440, height: 900 });
  const page = await browser.newPage({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173/demo');
  await sleep(2000);
  await page.eval(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find((b) => b.textContent?.includes('Dr. K. R. Rao'));
    btn?.click();
  });
  await sleep(4000);

  await page.goto('http://localhost:5173/admin/analytics');
  await sleep(3000);

  const res = await page.eval(() => {
    return {
      title: document.title,
      heading: document.querySelector('h1')?.innerText,
      recharts: document.querySelectorAll('.recharts-wrapper').length,
      donutMetric: document.querySelector('.recharts-wrapper')?.innerText,
      bodyTextSnippet: document.body.innerText.substring(0, 500)
    };
  });
  console.log('Admin page result:', res);

  await browser.close();
}

test();
