import fs from 'fs';

const pages = [
  'src/pages/Discussion.tsx',
  'src/pages/StudentHome.tsx',
  'src/pages/TeacherLab.tsx'
];

for (const page of pages) {
  let code = fs.readFileSync(page, 'utf8');
  
  // Wipe out any bg-slate-50 occurrences that don't have dark: correctly overriding them, or just force them dark.
  code = code.replace(/bg-slate-50/g, 'bg-slate-50 dark:bg-slate-800/40')
             .replace(/dark:bg-slate-800\/40 dark:bg-white\/5/g, 'dark:bg-white/5')
             .replace(/dark:bg-slate-800\/40 hover:bg-slate-100/g, 'hover:bg-slate-100 dark:bg-slate-800/40')
             .replace(/bg-white\//g, 'bg-white/') // dummy
             .replace(/bg-white /g, 'bg-white dark:bg-slate-900 ')
             .replace(/bg-white\"/g, 'bg-white dark:bg-slate-900"')
             .replace(/bg-slate-100/g, 'bg-slate-100 dark:bg-slate-800');
             
  fs.writeFileSync(page, code);
}
