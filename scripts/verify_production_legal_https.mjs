import https from 'node:https';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function verifyProduction() {
  console.log('=== VERIFYING LIVE PRODUCTION DEPLOYMENT AT https://campusflow-sand.vercel.app ===');
  
  // 1. Check production /privacy
  console.log('1. Fetching https://campusflow-sand.vercel.app/privacy ...');
  const privacyRes = await fetchUrl('https://campusflow-sand.vercel.app/privacy');
  console.log('   Status Code:', privacyRes.statusCode);
  console.log('   Content-Type:', privacyRes.headers['content-type']);
  console.log('   Body contains "CampusFlow":', privacyRes.body.includes('CampusFlow'));
  console.log('   Body contains "index":', privacyRes.body.includes('index-'));

  // 2. Check production /terms
  console.log('2. Fetching https://campusflow-sand.vercel.app/terms ...');
  const termsRes = await fetchUrl('https://campusflow-sand.vercel.app/terms');
  console.log('   Status Code:', termsRes.statusCode);
  console.log('   Content-Type:', termsRes.headers['content-type']);
  console.log('   Body contains "CampusFlow":', termsRes.body.includes('CampusFlow'));
}

verifyProduction().catch(err => {
  console.error('Error verifying production:', err);
});
