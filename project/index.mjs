import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { readFile, writeFile } from 'node:fs';

const getDataFilePath = name => join(
  dirname(fileURLToPath(import.meta.url)),
  'data',
  name,
);

let title = null;
const TITLE_FILE = getDataFilePath('title.txt');

const html = title => `
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
</head>

<h1>${title}</h1>

<form action="/set_title" method="post" enctype="application/x-www-form-urlencoded">
  <label for="set_title">标题: </label>
  <input id="set_title" name="title" />
  <button>提交</button>
</form>
`;

const server = createServer((req, res) => {
  if (req.url === '/') {
    res.end(html(title));
    return;
  }

  if (req.url === '/set_title') {
    const payload = [];

    req.on('data', chunk => {
      payload.push(chunk);
    });

    req.on('end', () => {
      const params = new URLSearchParams(Buffer.concat(payload).toString());
      title = params.get('title');

      res.writeHead(302, {
        location: '/',
      }).end();

      writeFile(TITLE_FILE, title, err => {
        if (err) {
          console.error(err);
        }
      });
    });

    return;
  }

  res.statusCode = 404;
  res.end('404');
});

readFile(TITLE_FILE, (err, content) => {
  title = err ? '你好世界' : content.toString();
  server.listen(3333);
});
