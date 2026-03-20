import fs from 'fs';
let tw = fs.readFileSync('tailwind.config.js', 'utf8');
if (!tw.includes('darkMode')) {
  tw = tw.replace('theme: {', "darkMode: ['class', '[data-theme=\"dark\"]'],\n  theme: {");
  fs.writeFileSync('tailwind.config.js', tw);
}
