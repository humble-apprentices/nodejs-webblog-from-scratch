// console.log(global); // 版本不同，输出的变量不同，『是否可枚举』

// console.log(__filename);
console.log(__dirname);

console.log(this); // 默认情况下this是空对象，和global并不是一样的
console.log(this === global);

(function () {
  console.log(this === global)
})()

// 模块加载机制流程