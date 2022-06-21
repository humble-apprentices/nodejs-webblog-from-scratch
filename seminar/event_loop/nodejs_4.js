// console.log(0);

const fs = require('node:fs');
// 示例四
console.log('start');

setTimeout(() => {
  console.log('S1');
  Promise.resolve().then(() => {
    console.log('P1', Date.now());
  })
})

fs.readFile('event/text.txt', (err, data) => {
  console.log('first read');
  if (err) throw err;
  setImmediate(() => {
    console.log('setImmediate', Date.now());
  })
  setTimeout(() => {
    console.log('S2');
  })
})
for (let index = 0; index < 5; index++) {
  fs.readFile('event/text.txt', (err, data) => {
    console.log('read index ', index);
    if (err) throw err;
  })
}

console.log('end');