import fs from 'fs';
let tw = fs.readFileSync('tailwind.config.js', 'utf8');
tw = tw.replace("darkMode: ['class', '[data-theme=\"dark\"]']", "darkMode: ['selector', '[data-theme=\"dark\"]']");
fs.writeFileSync('tailwind.config.js', tw);
