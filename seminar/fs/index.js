const fs = require('fs');
const path = require('path');

const resolve = (name) => path.resolve(__dirname, name)

// readFile
fs.readFile(resolve('data.txt'), 'utf-8', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
})

// writeFile
// 如果路径不存在，会先创建文件
fs.writeFile(resolve('data.txt'), 'write content', (err) => {
  if (err) {
    console.log(err);
  } else {
    fs.readFile(resolve('data.txt'), 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    })
  }
})

// appendFile
fs.appendFile(resolve('data.txt'), '\nappend text', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('写入成功');
  }
})

// copyFile
fs.copyFile(resolve('data.txt'), resolve('test.txt'), (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('拷贝成功');
  }
})

// wathcFile
fs.watchFile(resolve('data.txt'), {
  interval: 20 //20ms监控一下
}, (curr, prev) => {
  if (curr.mtime !== prev.mtime) {
    console.log('文件被修改了');
    // 取消文件监听
    fs.unwatchFile(resolve('data.txt'))
  }
})
