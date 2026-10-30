import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';

async function test() {
  const browser = await Browser.launch({ width: 1440, height: 900 });
  const page = await browser.newPage({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/login');
  await sleep(1500);

  const res = await page.eval(() => {
    function setReactValue(input, val) {
      const tracker = input._valueTracker;
      if (tracker) tracker.setValue('');
      const proto = Object.getPrototypeOf(input);
      const set = Object.getOwnPropertyDescriptor(proto, 'value')?.set || Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      set?.call(input, val);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const emailInput = document.querySelector('input[type="email"]');
    const passInput = document.querySelector('input[type="password"]');
    if (emailInput && passInput) {
      setReactValue(emailInput, 'rohitandhavarapu@gmail.com');
      setReactValue(passInput, 'CampusFlow2026!');
      document.querySelector('button[type="submit"]')?.click();
      return { filled: true, email: emailInput.value, pass: passInput.value };
    }
    return { filled: false };
  });

  console.log('Form fill result:', res);
  await sleep(4000);

  const finalState = await page.eval(() => ({
    url: window.location.pathname,
    h1: document.querySelector('h1')?.textContent,
    body: document.body.innerText.slice(0, 300)
  }));
  console.log('Final page state:', finalState);

  await browser.close();
}

test().catch(console.error);
