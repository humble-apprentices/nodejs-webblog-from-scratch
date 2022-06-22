const path = require('path');

// // 1 获取路径中的基础名称
// /**
//  * 01 返回的就是接收路径当中的最后一部分
//  * 02 第二个参数表示扩展名，如果没有设置，返回完整的文件名称带后缀
//  * 03 第二个参数作为后缀时，如果没有在当前路径中被匹配到，就会被忽略
//  * 04 处理目录路径时如果结尾有路径分隔符，则会被忽略
//  */
// console.log(__filename);
// console.log(path.basename(__filename));
// console.log(path.basename(__filename, '.js'));
// console.log(path.basename(__filename, '.css'));
// console.log(path.basename('/a/b/c'));
// console.log(path.basename('/a/b/c/'));

// // 2 获取路径目录名（路径）
// /**
//  * 01 返回路径中最后一个部分的上一层目录所在路径
//  */
// console.log(path.dirname(__filename));
// console.log(path.dirname('/a/b/c'));
// console.log(path.dirname('/a/b/c/'));

// // 3 获取路径扩展名
// /**
//  * 01 返回path路径中响应文件的后缀名
//  * 02 如果path中存在多个.，它匹配的是最后一个点，到结尾的内容
//  */
// console.log(path.extname(__filename));
// console.log(path.extname('/a/b'));
// console.log(path.extname('/a/b/index.html.js.css'));
// console.log(path.extname('/a/b/index.html.js.'));
// console.log(path.extname('/a/b/index.html.js.css/'));

// // 4 解析路径
// /**
//  * 01 接收一个路径，返回一个对象，包含不同信息
//  */
// console.log(path.parse('/a/b/c/index.html'));
// console.log(path.parse('/a/b/c'));
// console.log(path.parse('/a/b/c/'));
// console.log(path.parse('./a/b/c/'));

// // 5 序列化路径
// console.log(path.format(path.parse('./a/b/c')));

// // 6 判断当前路径是否是绝对路径
// console.log(path.isAbsolute('foo'));
// console.log(path.isAbsolute('./foo'));
// console.log(path.isAbsolute('/foo'));
// console.log(path.isAbsolute('////foo'));
// console.log(path.isAbsolute(''));
// console.log(path.isAbsolute('.'));
// console.log(path.isAbsolute('../bar'));

// // 7 拼接路径
// console.log(path.join('a', 'b', 'c', 'index.html'));
// console.log(path.join('a/b', '..', 'c', './d', 'index.html'));
// console.log(path.join(''));

// // 8 规范化路径
// console.log(path.normalize(''));
// console.log(path.normalize('a//b/c/../d'));
// console.log(path.normalize('a//\/b/c\/d'));

// 9 返回绝对路径
/**
 * resolve([from], to)
 */
console.log(path.resolve());
console.log(path.resolve('a', 'b'));
console.log(path.resolve('a', '/b'));
console.log(path.resolve('/a', '/b'));
console.log(path.resolve('/a', 'b'));
console.log(path.resolve('/a', 'b', './c'));
console.log(path.resolve('path.js'));