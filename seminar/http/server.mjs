import { readFile } from 'node:fs';
import { createServer } from 'node:http';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const server = createServer()

// mjs写法里无法获取__dirname, __filename
const getPath = (url) => {
  const __filename = fileURLToPath(url)
  const __dirname = dirname(__filename)
  return {
    __dirname,
    __filename
  }
}

const { __dirname } = getPath(import.meta.url)

// 监听请求事件
server.on('request', (req, res) => {
  // console.log(req.url)
  // console.log(req.method)
  // console.log(req.httpVersion)
  // console.log(req.headers)
  if (req.url === '/') {
    readFile(join(__dirname, './www/index.html'), (err, data) => {
      if (err) {
        res.writeHead(500, {
          'Content-type': 'text/html;charset=utf-8'
        })
        res.end('服务器错误')
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/html;charset=utf-8'
        });
        res.end(data);
      }
    })
  } else {
    res.end('hello world')
  }
});

server.listen(3000, '0.0.0.0', () => {
  console.log('server is start...')
});