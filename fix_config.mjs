import fs from 'fs';
let tw = fs.readFileSync('tailwind.config.js', 'utf8');
tw = tw.replace("darkMode: ['selector', '[data-theme=\"dark\"]']", "darkMode: 'class'");
fs.writeFileSync('tailwind.config.js', tw);
