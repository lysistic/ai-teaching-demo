import fs from 'fs';

let code = fs.readFileSync('src/pages/Discussion.tsx', 'utf8');

// I will just rip out all `bg-slate-50` strings completely from Discussion.tsx and replace with `bg-slate-900/40` directly to see what happens since the screenshot showed a bug.

code = code.replace(/bg-slate-50/g, 'bg-white/5');

fs.writeFileSync('src/pages/Discussion.tsx', code);

let code2 = fs.readFileSync('src/pages/TeacherLab.tsx', 'utf8');
code2 = code2.replace(/bg-slate-50/g, 'bg-white/5');
fs.writeFileSync('src/pages/TeacherLab.tsx', code2);

let code3 = fs.readFileSync('src/pages/TeacherAnalytics.tsx', 'utf8');
code3 = code3.replace(/bg-slate-50/g, 'bg-white/5');
fs.writeFileSync('src/pages/TeacherAnalytics.tsx', code3);

