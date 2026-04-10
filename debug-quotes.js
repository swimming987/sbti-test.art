const original = require('./data/questions.json');

const q20 = original.questions.find(q => q.id === 'q20');
console.log('Original options:');
q20.options.forEach((opt, i) => {
  console.log(`\nOption ${i+1}:`);
  console.log('  Raw:', opt.label);
  console.log('  Bytes:', Buffer.from(opt.label).toString('hex'));
  
  const normalized = opt.label
    .replace(/"/g, '"').replace(/"/g, '"')
    .replace(/'/g, "'").replace(/'/g, "'");
  console.log('  Normalized:', normalized);
  console.log('  Is same?:', opt.label === normalized);
});
