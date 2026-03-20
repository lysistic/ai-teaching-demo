import fs from 'fs';

let code = fs.readFileSync('src/pages/Discussion.tsx', 'utf8');

// I will also rip out `bg-slate-100` and replace with `bg-white/10` directly.
code = code.replace(/bg-slate-100/g, 'bg-white/10');
code = code.replace(/border-slate-200/g, 'border-white/10');

fs.writeFileSync('src/pages/Discussion.tsx', code);
