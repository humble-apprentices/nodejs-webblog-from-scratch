// console.log(0);

// 示例一
console.log('start');

setTimeout(() => {
  console.log('S1')
  Promise.resolve().then(() => {
    console.log('P1')
  })
  process.nextTick(() => {
    console.log('tick1');
  })
}, 0);

Promise.resolve().then(() => {
  console.log('P2')
})

process.nextTick(() => {
  console.log('tick2');
})

setImmediate(() => {
  console.log('setImmediate')
  Promise.resolve().then(() => {
    console.log('P3')
  })
});

console.log('end');