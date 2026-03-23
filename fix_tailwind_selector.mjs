import fs from 'node:fs';
import path from 'node:path';

try {
  const configPath = path.resolve(process.cwd(), 'tailwind.config.js');
  let tw = fs.readFileSync(configPath, 'utf8');

  // Regex allows more flexible matching instead of direct string parity.
  const oldModeRegex = /darkMode:\s*\['class',\s*'\[data-theme=(?:"|')dark(["'])\]'\]/g;
  const newModeStr = "darkMode: ['selector', '[data-theme=\"dark\"]']";

  if (tw.includes("darkMode: ['selector'")) {
    console.log('✅ tailwind.config.js 中 darkMode 已经是 selector 模式，无需重复修改！');
  } else {
    tw = tw.replace(oldModeRegex, newModeStr);
    
    // Fallback if the user just had `darkMode: 'class'`
    if (!tw.includes(newModeStr)) {
      tw = tw.replace(/darkMode:\s*['"]class['"]/g, newModeStr);
    }

    fs.writeFileSync(configPath, tw, 'utf8');
    console.log('✅ 成功更新 tailwind.config.js 的 darkMode 配置！');
  }
} catch (error) {
  console.error('❌ 处理 tailwind.config.js 时发生错误:', error);
  process.exit(1);
}
