import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generateAaravResumePdf() {
  const lines = [
    'AARAV SHARMA',
    'Email: aarav.sharma@campus.edu | Phone: +91 98765 43210 | Bangalore, Karnataka, India',
    'LinkedIn: linkedin.com/in/aarav-sharma | GitHub: github.com/aarav-sharma | Portfolio: aaravsharma.dev',
    '========================================================================================',
    'EDUCATION',
    'National Institute of Technology, Surathkal',
    'Bachelor of Technology in Computer Science and Engineering | Class of 2026',
    'Cumulative GPA: 8.85 / 10.00 | Standing Backlogs: 0 | Coursework: Data Structures, Algorithms, DBMS, OS, Networks',
    '========================================================================================',
    'TECHNICAL SKILLS',
    'Programming Languages: TypeScript, JavaScript, Python, Java, SQL, C++',
    'Frontend Development: React.js, Next.js, Redux Toolkit, Tailwind CSS, HTML5, CSS3',
    'Backend & APIs: Node.js, Express.js, FastAPI, RESTful APIs, GraphQL, Microservices',
    'Databases & Caching: PostgreSQL, Redis, MongoDB, Supabase PostgreSQL, Prisma ORM',
    'Cloud & DevOps: Docker, AWS (S3, EC2, Lambda), Git, GitHub Actions CI/CD, Linux, Postman',
    'Core Competencies: Object-Oriented Design, System Design, Asynchronous Architecture, Performance Optimization',
    '========================================================================================',
    'TECHNICAL PROJECTS',
    '1. CampusFlow — Campus Recruitment Intelligence Platform (React, TypeScript, Supabase, Groq AI)',
    '   - Architected university placement platform serving students, recruiters, and placement directors.',
    '   - Integrated AI resume intelligence with Groq LPU engine for automatic skill taxonomy extraction.',
    '   - Implemented real-time role-based access control and interview scheduling with automated ICS calendar sync.',
    '2. Distributed Task Queue & Event Processor (Python, Redis, Docker)',
    '   - Built an asynchronous distributed background task processor processing up to 10,000 tasks/min.',
    '   - Integrated exponential backoff retries, Redis Pub/Sub event broadcasting, and Prometheus metrics.',
    '3. Cloud Commerce Scalable Microservices API (Node.js, Express, PostgreSQL, Docker)',
    '   - Engineered decoupled REST API services with JWT session validation, rate limiting, and ACID transactions.',
    '   - Optimized PostgreSQL query execution plans and database indexes, reducing average p95 latency by 42%.',
    '========================================================================================',
    'PROFESSIONAL EXPERIENCE',
    'Software Engineering Intern | NovaTech Systems, Bangalore (May 2025 - July 2025)',
    '   - Developed enterprise microservices using TypeScript, Node.js, and PostgreSQL for customer analytics.',
    '   - Automated unit and integration test coverage to 92% using Jest and Supertest across 14 API endpoints.',
    '   - Collaborated with senior engineering team on AWS ECS container deployments and database indexing.',
    '========================================================================================',
    'CERTIFICATIONS & ACHIEVEMENTS',
    '   - AWS Certified Cloud Practitioner (Amazon Web Services, 2025)',
    '   - Docker Certified Associate (Docker Inc., 2025)',
    '   - 1st Place Winner — Inter-College Hackathon 2025 (Built automated proctoring platform)',
    '   - Dean\'s Academic Honors List for 4 Consecutive Semesters',
  ];

  // Generate valid PDF-1.4 with exact cross-reference offsets
  const contentStream =
    'BT\n/F1 10 Tf\n12 TL\n36 756 Td\n' +
    lines
      .map((line, i) => {
        const escaped = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
        return i === 0 ? `(${escaped}) Tj` : `T* (${escaped}) Tj`;
      })
      .join('\n') +
    '\nET';

  const contentLen = Buffer.byteLength(contentStream, 'utf8');

  let pdf = '%PDF-1.4\n';
  const offsets = [];

  offsets.push(Buffer.byteLength(pdf, 'utf8'));
  pdf += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';

  offsets.push(Buffer.byteLength(pdf, 'utf8'));
  pdf += '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';

  offsets.push(Buffer.byteLength(pdf, 'utf8'));
  pdf += '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n';

  offsets.push(Buffer.byteLength(pdf, 'utf8'));
  pdf += `4 0 obj\n<< /Length ${contentLen} >>\nstream\n${contentStream}\nendstream\nendobj\n`;

  offsets.push(Buffer.byteLength(pdf, 'utf8'));
  pdf += '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';

  const startXref = Buffer.byteLength(pdf, 'utf8');
  pdf += 'xref\n0 6\n0000000000 65535 f \n';
  for (const off of offsets) {
    pdf += String(off).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF`;

  return Buffer.from(pdf, 'utf8');
}

const outputPath = path.resolve(__dirname, 'Aarav_Sharma_Resume_2026.pdf');
const pdfBuffer = generateAaravResumePdf();
fs.writeFileSync(outputPath, pdfBuffer);
console.log(`✓ Generated synthetic demo resume fixture at: ${outputPath} (${pdfBuffer.length} bytes)`);
