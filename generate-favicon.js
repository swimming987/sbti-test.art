const fs = require('fs');
const path = require('path');

// 简单的favicon.ico生成器
// 读取logo.png并创建一个基本的.ico文件
// 注意：这是一个简化版本，真实场景建议使用专业工具如sharp或jimp

console.log('生成 favicon.ico...');

const logoPath = path.join(__dirname, 'logo.png');
const faviconPath = path.join(__dirname, 'favicon.ico');
const distFaviconPath = path.join(__dirname, 'dist', 'favicon.ico');

if (!fs.existsSync(logoPath)) {
  console.error('❌ logo.png 不存在');
  process.exit(1);
}

// 对于简单的实现，我们可以直接复制PNG作为临时方案
// 大多数现代浏览器也支持.ico文件名但实际是PNG格式
fs.copyFileSync(logoPath, faviconPath);
console.log('✅ 已创建 favicon.ico（基于 logo.png）');

// 同时复制到dist目录
if (fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.copyFileSync(logoPath, distFaviconPath);
  console.log('✅ 已复制到 dist/favicon.ico');
}

console.log('\n提示：如需标准的 .ico 格式，推荐使用在线工具：');
console.log('  - https://www.favicon-generator.org/');
console.log('  - https://realfavicongenerator.net/');
