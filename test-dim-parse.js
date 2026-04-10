const fs = require('fs');
const content = fs.readFileSync('dist/en/test/index.html', 'utf8');

// Extract SBTI_DIM
const dimMatch = content.match(/const SBTI_DIM = (\{.+?\});/s);
if (!dimMatch) {
  console.log('❌ SBTI_DIM not found');
  process.exit(1);
}

const dimJSON = dimMatch[1];
console.log('Extracted JSON (first 200 chars):');
console.log(dimJSON.substring(0, 200));

try {
  const parsed = JSON.parse(dimJSON);
  console.log('\n✅ JSON parsed successfully!');
  console.log(`Dimension count: ${Object.keys(parsed.dimensionMeta).length}`);
  console.log(`S2.L exists: ${!!parsed.dimExplanations?.S2?.L}`);
  if (parsed.dimExplanations?.S2?.L) {
    console.log(`S2.L value: ${parsed.dimExplanations.S2.L}`);
  }
} catch (e) {
  console.log('❌ JSON parse failed:', e.message);
}
