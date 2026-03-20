import fs from 'fs';
let code = fs.readFileSync('src/pages/StudentOJ.tsx', 'utf8');
const lines = code.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<div') || l.includes('</div')) {
    console.log(i + 1 + ': ' + l.trim());
  }
});
