import http from 'node:http';
const server = http.createServer((req, res) => {
  // 每一次请求处理的方法
  console.log(req.url)
  console.log(req)
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello NodeJS');
})

server.listen(8080, (req) => {
  console.log('收到请求了');
})