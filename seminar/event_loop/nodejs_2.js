// console.log(0);

const fs = require('node:fs');

// 示例二
// 老版本是某个阶段的队列全部执行完才执行微任务，新版变为和浏览器一样

console.log('start');

setTimeout(() => {
  console.log('S1');
  Promise.resolve().then(() => {
    console.log('P1');
  })
  process.nextTick(() => {
    console.log('tick1');
  })
}, 0);

Promise.resolve().then(() => {
  console.log('P2');
})

setTimeout(() => {
  console.log('S2');
  Promise.resolve().then(() => {
    console.log('P3');
  })
  process.nextTick(() => {
    console.log('tick2');
  })
}, 0);

console.log('end');