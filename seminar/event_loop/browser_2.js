
// 示例二
setTimeout(() => {
  console.log('S1')
  Promise.resolve().then(() => {
    console.log('P2')
  })
  Promise.resolve().then(() => {
    console.log("P3")
  })
}, 0);

Promise.resolve().then(() => {
  console.log("P1")
  setTimeout(() => {
    console.log('S2')
  }, 0)
  setTimeout(() => {
    console.log('S3')
  }, 0)
  Promise.resolve().then(() => {
    console.log("P4")
  })
})