import fs from 'fs';
let code = fs.readFileSync('src/components/AppLayout.tsx', 'utf8');
code = code.replace(
  "document.documentElement.setAttribute('data-theme', themeMode)",
  "document.documentElement.setAttribute('data-theme', themeMode);\n    if (themeMode === 'dark') document.documentElement.classList.add('dark');\n    else document.documentElement.classList.remove('dark');"
);
fs.writeFileSync('src/components/AppLayout.tsx', code);
