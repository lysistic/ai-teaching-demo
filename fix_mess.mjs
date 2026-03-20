import fs from 'fs';
let code = fs.readFileSync('src/pages/Discussion.tsx', 'utf8');

// I created a mess with my global regex replacements earlier. Let's clean it up properly.
code = code.replace(/bg-white\/\[0\.03\] default-dark-card dark:bg-white\/5/g, 'bg-white/5');
code = code.replace(/bg-white\/10 dark:bg-slate-800 dark:bg-white\/10/g, 'bg-white/10');
code = code.replace(/dark:border-white\/10/g, ''); // already border-white/10
code = code.replace(/bg-white\/5 hover:bg-white\/10 dark:bg-slate-800\/40/g, 'bg-white/5 hover:bg-white/10');
code = code.replace(/ bg-white\/\[0\.03\] dark:bg-white\/\[0\.03\]/g, ' bg-white/5');

fs.writeFileSync('src/pages/Discussion.tsx', code);
