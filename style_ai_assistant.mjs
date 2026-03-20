import fs from 'fs';

let code = fs.readFileSync('src/pages/Discussion.tsx', 'utf8');

// The right column starts at:
// {/* 新增右侧：大型 AI 助教独立面板 */}
// Make the chat box use flex-1 to push everything down and fill space.

code = code.replace(
  '<div className="space-y-3">',
  '<div className="flex-1 flex flex-col min-h-0 space-y-4">'
);

code = code.replace(
  '<div className="rounded-xl border border-slate-200 dark:border-white/10 bg-black/20 p-3">',
  '<div className="flex-1 flex flex-col rounded-xl border border-slate-200 dark:border-white/10 bg-black/20 p-3 shadow-inner">'
);

code = code.replace(
  "flex-1 min-h-[300px] overflow-auto rounded-lg border",
  "flex-1 overflow-auto rounded-lg border"
);

code = code.replace(
  '<h2 className="text-lg font-semibold text-slate-900 dark:text-white/90 flex items-center gap-2">\n                <Brain className="h-5 w-5 text-purple-300" />\n                AI助教功能\n              </h2>',
  '<h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">\n                <Brain className="h-6 w-6 text-purple-400" />\n                Algo 智能体\n              </h2>'
);

// We should also make the input larger and more prominent
code = code.replace(
  'min-h-[100px] w-full rounded-lg border',
  'min-h-[120px] w-full rounded-lg border'
);

fs.writeFileSync('src/pages/Discussion.tsx', code);
