import fs from 'fs';

let code = fs.readFileSync('src/pages/Discussion.tsx', 'utf8');

// The markers for AI block
const aiMarkerStart = '          {/* AI助教功能 */}';
const postListMarker = '{/* 右侧：讨论帖子列表 */}';

const startIndex = code.indexOf(aiMarkerStart);
const endIndex = code.indexOf(postListMarker);

// Inside the original string, we need to extract from startIndex to the line before postListMarker
// Actually, it's better to just regex the blocks.

// 1. Grid structure
code = code.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">',
  '<div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">'
);

// 2. Left Column
code = code.replace(
  '<div className="lg:col-span-1 space-y-6">',
  '<div className="xl:col-span-3 lg:col-span-4 space-y-6 sticky top-6">'
);

// 3. Middle Column
code = code.replace(
  '<div className="lg:col-span-3 space-y-6">',
  '<div className="xl:col-span-6 lg:col-span-8 space-y-6">'
);

// Now for moving the AI block:
// Let's use a simple parsing.
const lines = code.split('\n');

let aiBlockLines = [];
let inAiBlock = false;
let outLines = [];
let aiBlockStartLine = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{/* AI助教功能 */}')) {
    inAiBlock = true;
    aiBlockStartLine = i;
  }
  
  if (inAiBlock) {
    aiBlockLines.push(lines[i]);
    if (lines[i].includes('          </div>') && lines[i+1] === '        </div>' && lines[i+3].includes('{/* 右侧：讨论帖子列表 */}')) {
      inAiBlock = false;
      // skip adding the closing div of left column to aiBlock
    }
  } else {
    outLines.push(lines[i]);
  }
}

// Now we need to pop the last element of aiBlockLines which is `        </div>` ?
// Wait, my condition `lines[i+1] === '        </div>'` means `lines[i]` is `          </div>`.
// The aiBlockLines array captured the inner closing div.
// Let's refine the extraction.
