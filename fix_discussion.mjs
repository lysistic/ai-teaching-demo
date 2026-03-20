import fs from 'fs';

let code = fs.readFileSync('src/pages/Discussion.tsx', 'utf8');

// Replacements
code = code.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">',
  '<div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">'
);

code = code.replace(
  '<div className="lg:col-span-1 space-y-6">',
  '<div className="xl:col-span-3 lg:col-span-4 space-y-6 sticky top-6">'
);

code = code.replace(
  '<div className="lg:col-span-3 space-y-6">',
  '<div className="xl:col-span-6 lg:col-span-8 space-y-6">'
);

// We need to cut out the AI block.
const aiStart = code.indexOf('          {/* AI助教功能 */}');
const postListStart = code.indexOf('        {/* 右侧：讨论帖子列表 */}');
// The closing div of the left column is right before postListStart
const leftColEnd = code.lastIndexOf('        </div>', postListStart);

// The AI block is from aiStart to leftColEnd
const aiBlock = code.substring(aiStart, leftColEnd);

// Remove the AI block from the left column
code = code.substring(0, aiStart) + code.substring(leftColEnd);

// We want to insert the AI block at the end of the grid, as a new column!
// Find the end of the right column.
// Notice the grid ends after the right column:
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
const endOfRightCol = code.lastIndexOf('      </div>\n    </div>\n  )\n}');

const newAiBlock = `
        {/* 新增右侧：大型 AI 助教独立面板 */}
        <div className="xl:col-span-3 lg:col-span-12 xl:sticky xl:top-6 flex flex-col h-[max(800px,calc(100vh-140px))] space-y-4">
${aiBlock.replace('<div className="glass neon-border p-5">', '<div className="glass neon-border p-5 flex flex-col h-full">\n            {/* 大型 AI 助教内容 */}').replace(/max-h-52/g, 'flex-1 min-h-[300px] overflow-auto').replace('min-h-[72px]', 'min-h-[100px]')}
        </div>
`;

code = code.substring(0, endOfRightCol) + newAiBlock + code.substring(endOfRightCol);

fs.writeFileSync('src/pages/Discussion.tsx', code);
