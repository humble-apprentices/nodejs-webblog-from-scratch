// console.log(0);

const fs = require('node:fs');
const path = require('node:path');

const resolve = (name) => path.resolve(__dirname, name)
// 示例三
// 主模块中运行时顺序不一定，器将受进程性能的约束（这可能会受到计算机上其他正在运行应用程序的影响）
// 非主模块运行时，顺序为setImmediate > timeout
setTimeout(() => {
  console.log('timeout');
}, 0);

setImmediate(() => {
  console.log('immediate');
});

fs.readFile(resolve(__dirname, 'text.txt'), (err, data) => {
  if (err) throw err;
  setImmediate(() => {
    console.log('immediate');
  })
  setTimeout(() => {
    console.log('timeout');
  })
})
