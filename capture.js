const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const targets = [
  { url: 'http://localhost:5173/student/dashboard', file: 'student_dashboard.png', width: 1440, height: 900 },
  { url: 'http://localhost:5173/student/opportunities', file: 'explore_opportunities.png', width: 1440, height: 900 },
  { url: 'http://localhost:5173/student/opportunities/job_aetos_ai', file: 'job_details.png', width: 1440, height: 900 },
  { url: 'http://localhost:5173/student/applications', file: 'my_applications.png', width: 1440, height: 900 },
  { url: 'http://localhost:5173/student/applications/app_1', file: 'application_details.png', width: 1440, height: 900 },
  { url: 'http://localhost:5173/student/interviews', file: 'student_interviews.png', width: 1440, height: 900 },
  { url: 'http://localhost:5173/student/profile', file: 'student_profile.png', width: 1440, height: 900 },
  { url: 'http://localhost:5173/recruiter/dashboard', file: 'recruiter_dashboard.png', width: 1440, height: 900 },
  { url: 'http://localhost:5173/recruiter/applicants', file: 'recruiter_applicants.png', width: 1440, height: 900 },
  { url: 'http://localhost:5173/recruiter/jobs', file: 'recruiter_jobs.png', width: 1440, height: 900 },
  { url: 'http://localhost:5173/admin/dashboard', file: 'admin_dashboard.png', width: 1440, height: 900 },
  { url: 'http://localhost:5173/admin/analytics', file: 'admin_analytics.png', width: 1440, height: 900 },
  { url: 'http://localhost:5173/student/dashboard', file: 'student_dashboard_mobile.png', width: 375, height: 812 },
  { url: 'http://localhost:5173/student/opportunities', file: 'explore_opportunities_mobile.png', width: 375, height: 812 },
];

const tempPath = 'C:\\Users\\ROHIT\\AppData\\Local\\Temp\\screenshot.png';

for (const target of targets) {
  try {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    cp.execFileSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
      '--headless=new',
      '--disable-gpu',
      `--window-size=${target.width},${target.height}`,
      '--virtual-time-budget=2500',
      '--screenshot=' + tempPath,
      target.url,
    ]);
    if (fs.existsSync(tempPath)) {
      const dest = path.join('screenshots', target.file);
      fs.copyFileSync(tempPath, dest);
      console.log(`Captured [${target.width}x${target.height}]:`, target.file);
    }
  } catch (err) {
    console.error('Failed to capture', target.file, err.message);
  }
}
