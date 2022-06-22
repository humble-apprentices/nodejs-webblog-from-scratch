// console.log(0);

const fs = require('node:fs');
const path = require('node:path');

const resolve = (name) => path.resolve(__dirname, name)
// 示例四
console.log('start');

setTimeout(() => {
  console.log('S1');
  Promise.resolve().then(() => {
    console.log('P1', Date.now());
  })
})

fs.readFile(resolve(__dirname, 'text.txt'), (err, data) => {
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
  fs.readFile(resolve(__dirname, 'text.txt'), (err, data) => {
    console.log('read index ', index);
    if (err) throw err;
  })
}

console.log('end');