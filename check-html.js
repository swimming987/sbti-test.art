const fs = require('fs');
const content = fs.readFileSync('dist/en/test/index.html', 'utf8');
const idx = content.indexOf('常在');
if (idx === -1) {
  console.log('Not found');
} else {
  const sample = content.substring(idx, idx + 10);
  console.log('Sample:', sample);
  console.log('\nCharacter codes:');
  for (let i = 0; i < sample.length; i++) {
    const char = sample[i];
    const code = char.charCodeAt(0);
    console.log(`  ${char} = U+${code.toString(16).toUpperCase().padStart(4, '0')}`);
  }
  
  // Check if curly quotes exist
  const hasLeftCurly = content.includes('\u201C');
  const hasRightCurly = content.includes('\u201D');
  console.log('\nContains U+201C ("):', hasLeftCurly);
  console.log('Contains U+201D ("):', hasRightCurly);
}
