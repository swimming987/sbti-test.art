const test = {text: '内心频道雪花较多，常在"我是谁"里循环缓存。'};
const json1 = JSON.stringify(test);
console.log('JSON output:');
console.log(json1);
console.log('\nCharacter codes in output:');
for (let i = json1.indexOf('在') + 1; i < json1.indexOf('我') + 3; i++) {
  const char = json1[i];
  console.log(`  ${char} = U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`);
}
