import { createServer } from 'node:http';

const html = (title = 'My Blog Title') => `
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
  </head>
  
  <h1>${title}</h1>
  
  <form action="/set_title" method="post">
    <input name="title" placeholder="请输入新标题" />
    <input type="submit" value="提交" />
  </form>
`;

let title = 'My Blog Title';

const server = createServer((req, res) => {
  if (req.url === '/set_title') {
    const payload = [];

    req.on('data', chunk => {
      payload.push(chunk);
    });

    req.on('end', () => {
      title = decodeURIComponent(Buffer.concat(payload).toString('utf-8')).split('=')[1];

      res.writeHead(302, {
        location: '/',
      });

      res.end();
    });

    return;
  }

  if (req.url === '/') {
    res.end(html(title));
    return;
  }

  res.statusCode = 404;
  res.end('404');
});

server.listen(3333);
