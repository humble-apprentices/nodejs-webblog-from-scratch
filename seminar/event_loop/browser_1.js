// 示例一
setTimeout(() => {
  console.log('S1')
  Promise.resolve().then(() => {
    console.log('P1')
  })
  Promise.resolve().then(() => {
    console.log("P2")
  })
}, 0);

setTimeout(() => {
  console.log('S2')
  Promise.resolve().then(() => {
    console.log('P3')
  })
  Promise.resolve().then(() => {
    console.log("P4")
  })
}, 0);

