// // 1 资源： CPU、内存
// const fs = require('node:fs'); // 是否引用会影响内存使用的大小
// console.log(process.cpuUsage())
// Buffer.alloc(1000)
// console.log(process.memoryUsage())

// {
//   rss: 21786624, // 常驻内存
//   heapTotal: 5005312, // 当前脚本申请的总内存大小
//   heapUsed: 3181784, // 实际使用的内存大小
//   external: 1083065, // 扩展内存，存放底层C或者C++模块所占内存大小
//   arrayBuffers: 9914 // 缓冲区大小，独立的空间大小，不占V8内存
// }




// // 2 运行环境：运行目录、node环境、cpu架构、用户环境、系统平台
// console.log(process.cwd())
// console.log(process.version)
// console.log(process.versions)
// console.log(process.arch)
// console.log(process.env)
// console.log(process.env.PATH)
// console.log(process.env.HOME) // window平台是 USERPROFILE
// console.log(process.platform)




// // 3 运行状态：启动参数、PID、运行时间
// console.log(process.argv); // 数组类型，默认有两个值，node程序路径和当前文件路径
// console.log(process.argv0); // node
// console.log(process.execArgv); // node 运行参数 eg: node --harmony filename output:[--harmony]
// console.log(process.pid);
// console.log(process.uptime()); // 文件从头到尾运行时间




// // 4 事件
// process.on('exit', (code) => {
//   // 只能执行同步代码
//   console.log('exit:' + code);
// })
// process.on('beforeExit', (code) => {
//   // 可以执行异步代码
//   console.log('before exit:' + code);
// })
// console.log('代码执行完了');
// // 手动调用时，不会执行beforeExit，且后面的代码都不会被执行
// process.exit();




// 5 标准输入 输出 错误
// process.stdin.pipe(process.stdout)
// process.stdin.setEncoding('utf-8');
// process.stdin.on('readable', () => {
//   let chunk = process.stdin.read()
//   if (chunk !== null) {
//     process.stdout.write('data: ' + chunk);
//   }
// })

// console.log = function (data) {
//   process.stdout.write('---' + data + '\n')
// };
// console.log(11);
// console.log(22);

// const fs = require('node:fs');
// fs.createReadStream('text.txt').pipe(process.stdout)