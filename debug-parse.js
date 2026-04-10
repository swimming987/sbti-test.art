const fs = require('fs');
const content = fs.readFileSync('dist/en/test/index.html', 'utf8');

const dimMatch = content.match(/const SBTI_DIM = (\{.+?\});/s);
if (!dimMatch) {
  console.log('❌ SBTI_DIM not found');
  process.exit(1);
}

const dimJSON = dimMatch[1];
const errorPos = 869;
const start = Math.max(0, errorPos - 50);
const end = Math.min(dimJSON.length, errorPos + 50);

console.log(`Context around position ${errorPos}:`);
console.log(dimJSON.substring(start, end));
console.log(' '.repeat(errorPos - start) + '^');

console.log('\nCharacter codes around error:');
for (let i = errorPos - 5; i < errorPos + 5 && i < dimJSON.length; i++) {
  const char = dimJSON[i];
  console.log(`  [${i}] ${char} = U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`);
}
