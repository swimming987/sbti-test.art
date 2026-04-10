const test = {text: '内心频道雪花较多，常在"我是谁"里循环缓存。'};
const json1 = JSON.stringify(test);
console.log('Before:', json1);
console.log('Contains left quote:', json1.includes('"'));
console.log('Contains right quote:', json1.includes('"'));

const json2 = json1
  .replace(/"/g, '\\"')
  .replace(/"/g, '\\"');
console.log('After:', json2);
console.log('Still contains left quote:', json2.includes('"'));
