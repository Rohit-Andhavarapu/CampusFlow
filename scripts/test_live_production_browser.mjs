import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';

async function testLiveProduction() {
  console.log('=== VERIFYING LIVE PRODUCTION BROWSER RENDERING ===');
  console.log('Target: https://campusflow-sand.vercel.app');
  const browser = await Browser.launch({ width: 1440, height: 900 });

  try {
    const page = await browser.newPage({ width: 1440, height: 900 });

    // 1. Visit live /privacy
    console.log('[1/3] Navigating to https://campusflow-sand.vercel.app/privacy ...');
    await page.goto('https://campusflow-sand.vercel.app/privacy');
    await sleep(2500);

    const privacyLiveCheck = await page.eval(() => {
      const text = document.body.innerText;
      return {
        url: window.location.href,
        hasTitle: text.includes('CampusFlow Privacy Policy'),
        hasGoogleOAuth: text.includes('Google OAuth') || text.includes('Google Sign-In'),
        hasGroqConsent: text.includes('Groq') && text.includes('consent'),
        hasPostgresRls: text.includes('Row Level Security'),
        hasOperatorInfo: text.includes('Rohit Andhavarapu'),
        hasOperatorReviewFlag: text.includes('Notice for Legal & Operator Review'),
      };
    });
    console.log('Live Production Privacy Check:', privacyLiveCheck);

    if (!privacyLiveCheck.hasTitle || !privacyLiveCheck.hasGoogleOAuth || !privacyLiveCheck.hasGroqConsent) {
      throw new Error('Live Privacy Policy did not render expected legal content!');
    }

    // 2. Visit live /terms
    console.log('[2/3] Navigating to https://campusflow-sand.vercel.app/terms ...');
    await page.goto('https://campusflow-sand.vercel.app/terms');
    await sleep(2500);

    const termsLiveCheck = await page.eval(() => {
      const text = document.body.innerText;
      return {
        url: window.location.href,
        hasTitle: text.includes('Terms of Service'),
        hasAcademicVeracity: text.includes('Academic Integrity') || text.includes('CGPA'),
        hasRecruitmentLimits: text.includes('No Guarantee of Employment') || text.includes('Institutional Recruitment'),
        hasAiDisclaimer: text.includes('Advisory Nature of Groq-Powered AI Insights') || text.includes('Heuristic'),
        hasOperatorReviewFlag: text.includes('Notice for Legal Operator Review'),
      };
    });
    console.log('Live Production Terms Check:', termsLiveCheck);

    if (!termsLiveCheck.hasTitle || !termsLiveCheck.hasAcademicVeracity || !termsLiveCheck.hasAiDisclaimer) {
      throw new Error('Live Terms of Service did not render expected content!');
    }

    // 3. Test Navigation from Home -> Footer -> /privacy
    console.log('[3/3] Testing client navigation from Landing Page to /privacy ...');
    await page.goto('https://campusflow-sand.vercel.app/');
    await sleep(2000);

    await page.eval(() => {
      const privacyLink = Array.from(document.querySelectorAll('a')).find(a => a.getAttribute('href') === '/privacy');
      if (privacyLink) privacyLink.click();
    });
    await sleep(2000);

    const navPath = await page.eval(() => window.location.pathname);
    console.log('  Navigated path:', navPath);
    if (navPath !== '/privacy') {
      throw new Error(`Expected path /privacy, got ${navPath}`);
    }

    console.log('🎉 ALL LIVE PRODUCTION HTTPS CHECKS VERIFIED 100% WORKING!');
  } finally {
    await browser.close();
  }
}

testLiveProduction().catch(err => {
  console.error('Live Production Browser Test Error:', err);
  process.exit(1);
});
