import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

// The issue might actually be that App.css or index.css has a manual override that breaks things.
code = code.replace("html[data-theme='light'] {\n    color-scheme: light;\n  }", "html[data-theme='light'] {\n    color-scheme: light;\n  }\n\n  html.dark {\n    color-scheme: dark;\n  }");

fs.writeFileSync('src/index.css', code);
