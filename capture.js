const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const targets = [
  { url: 'http://localhost:5173/student/opportunities', file: 'explore_opportunities.png' },
  { url: 'http://localhost:5173/student/opportunities/job_aetos_ai', file: 'job_details.png' },
  { url: 'http://localhost:5173/student/applications', file: 'my_applications.png' },
  { url: 'http://localhost:5173/recruiter/dashboard', file: 'recruiter_dashboard.png' },
  { url: 'http://localhost:5173/recruiter/applicants', file: 'recruiter_applicants.png' },
  { url: 'http://localhost:5173/admin/dashboard', file: 'admin_dashboard.png' },
];

const tempPath = 'C:\\Users\\ROHIT\\AppData\\Local\\Temp\\screenshot.png';

for (const target of targets) {
  try {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    cp.execFileSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
      '--headless=new',
      '--disable-gpu',
      '--window-size=1440,900',
      '--virtual-time-budget=3000',
      '--screenshot=' + tempPath,
      target.url,
    ]);
    if (fs.existsSync(tempPath)) {
      const dest = path.join('screenshots', target.file);
      fs.copyFileSync(tempPath, dest);
      console.log('Captured:', target.file);
    }
  } catch (err) {
    console.error('Failed to capture', target.file, err.message);
  }
}
