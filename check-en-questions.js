const fs = require('fs');
const content = fs.readFileSync('dist/en/test/index.html', 'utf8');

// Extract SBTI_QUESTIONS
const match = content.match(/const SBTI_QUESTIONS = (\[.+?\]);/s);
if (!match) {
  console.log('❌ SBTI_QUESTIONS not found');
  process.exit(1);
}

try {
  const questions = JSON.parse(match[1]);
  console.log(`✅ Found ${questions.length} questions`);
  console.log('\nFirst question:');
  console.log('ID:', questions[0].id);
  console.log('Text:', questions[0].text.substring(0, 100) + '...');
  console.log('Options:', questions[0].options.map(o => o.label));
  
  console.log('\nQuestion 7 (diarrhea):');
  const q7 = questions.find(q => q.id === 'q7');
  console.log('Text:', q7.text);
  console.log('Options:', q7.options.map(o => o.label));
} catch (e) {
  console.log('❌ Parse failed:', e.message);
}
