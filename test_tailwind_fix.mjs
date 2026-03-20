import fs from 'fs';
let tw = fs.readFileSync('tailwind.config.js', 'utf8');
if (tw.includes("darkMode: 'class'")) {
  console.log("Replacing with sensible default")
  tw = tw.replace("darkMode: 'class'", "darkMode: ['class', '[data-theme=\"dark\"]']");
  fs.writeFileSync('tailwind.config.js', tw);
}
