import fs from 'fs';

let content = fs.readFileSync('src/components/AppLayout.tsx', 'utf8');

// put cn back
content = "import { cn } from '../lib/cn'\n" + content;

fs.writeFileSync('src/components/AppLayout.tsx', content);
