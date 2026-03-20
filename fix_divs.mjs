import fs from 'fs';

let code = fs.readFileSync('src/pages/Discussion.tsx', 'utf8');

// The occurrence replaced was at 570. Let's restore it.
code = code.replace(
  '<h2 className="text-lg font-semibold text-slate-900 dark:text-white/90 mb-4 flex items-center gap-2">\n              <Users className="h-5 w-5 text-green-300" />\n              活跃用户\n            </h2>\n            <div className="flex-1 flex flex-col min-h-0 space-y-4">',
  '<h2 className="text-lg font-semibold text-slate-900 dark:text-white/90 mb-4 flex items-center gap-2">\n              <Users className="h-5 w-5 text-green-300" />\n              活跃用户\n            </h2>\n            <div className="space-y-3">'
);

// Now apply to the AI block carefully
code = code.replace(
  '        {/* {/* 大型 AI 助教内容 */}',
  '' // wait this comment is not there
);

code = code.replace(
  /\n(\s*)<div className="space-y-3">\n\s*<div className="flex-1 flex flex-col rounded-xl/,
  '\n$1<div className="flex-1 flex flex-col min-h-0 space-y-4">\n$1  <div className="flex-1 flex flex-col rounded-xl'
);

fs.writeFileSync('src/pages/Discussion.tsx', code);
