import fs from 'fs';

let code = fs.readFileSync('src/pages/Discussion.tsx', 'utf8');

code = code.replace(
  '<div className="xl:col-span-6 lg:col-span-8 space-y-6">',
  '<div className="xl:col-span-5 lg:col-span-8 space-y-6">'
);

code = code.replace(
  '<div className="xl:col-span-3 lg:col-span-12 xl:sticky xl:top-6 flex flex-col h-[max(800px,calc(100vh-140px))] space-y-4">',
  '<div className="xl:col-span-4 lg:col-span-12 xl:sticky xl:top-6 flex flex-col h-[max(800px,calc(100vh-140px))] space-y-4">'
);

fs.writeFileSync('src/pages/Discussion.tsx', code);
