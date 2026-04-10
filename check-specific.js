const fs = require('fs');
const content = fs.readFileSync('dist/en/test/index.html', 'utf8');
const match = content.match(/const SBTI_QUESTIONS = (\[.+?\]);/s);
if (!match) {
  console.log('❌ Not found');
  process.exit(1);
}

const questions = JSON.parse(match[1]);

const q20 = questions.find(q => q.id === 'q20');
console.log('Q20 (Constipation):');
console.log('Options:', q20.options.map(o => o.label));

const q26 = questions.find(q => q.id === 'q26');
console.log('\nQ26 (Friend of friend):');  
console.log('Options:', q26.options.map(o => o.label));
