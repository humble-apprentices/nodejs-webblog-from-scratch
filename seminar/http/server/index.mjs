import {
  access,
  fstat,
  readFile,
  stat
} from 'node:fs';
import {
  createServer
} from 'node:http';
import {
  join,
  dirname,
  resolve
} from 'node:path';
import {
  fileURLToPath,
  parse
} from 'node:url';
import {
  lookup
} from 'es-mime-types';

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

const {
  __dirname
} = getPath(
  import.meta.url)

// 监听请求事件
server.on('request', (req, res) => {
  console.log(req.url)
  // console.log(req.method)
  // console.log(req.httpVersion)
  // console.log(req.headers)
  let {
    pathname
  } = parse(req.url)
  // 处理中文路径
  pathname = decodeURIComponent(pathname)
  let absPath = join(__dirname, '../www', pathname)
  // 目标资源状态处理
  stat(absPath, (err, statObj) => {
    if (err) {
      res.statusCode = 404
      res.end('Not Found')
      return
    }
    if (statObj.isDirectory()) {
      absPath = join(absPath, 'index.html');
    }
    if (statObj.isDirectory()) {
      absPath = join(absPath, 'login.html');
    }
    if (statObj.isDirectory()) {
      absPath = join(absPath, 'regist.html');
    }
    readFile(absPath, (err, data) => {
      console.log(absPath);
      if (err) {
        res.writeHead(500, {
          'Content-type': `text/plain;charset=utf-8`
        })
        res.end('服务器错误')
      } else {
        res.setHeader('Content-type', `${lookup(absPath)};charset=utf-8`)
        res.end(data)
      }
    })
  })
});

server.listen(3000, '0.0.0.0', () => {
  console.log('server is start...')
  console.log("Local:   http://localhost:3000")
});