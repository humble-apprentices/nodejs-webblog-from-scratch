import { constants } from 'node:fs';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { open, access, mkdir } from 'node:fs/promises';

const { O_RDWR, O_CREAT, O_TRUNC } = constants;

const DATA_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  'data',
);

const checkOrSetUpDataDir = async () => {
  try {
    await access(DATA_DIR);
  } catch(error) {
    if (error.errno === -2) {
      await mkdir(DATA_DIR);
    }
  }
};

const getDataFilePath = (name) => join(
  DATA_DIR,
  name,
);

// fs constants: https://nodejs.org/api/fs.html#fspromisesconstants
const writeDataFileContent = async (name, content) => {
  const file = await open(getDataFilePath(name), O_RDWR | O_TRUNC);
  await file.write(Buffer.from(content));
  await file.sync();
  file.close();
  return content;
};

// fs constants: https://nodejs.org/api/fs.html#fspromisesconstants
const readDataFileContent = async (name, defaultContent = '') => {
  const file = await open(getDataFilePath(name), O_RDWR | O_CREAT);
  const fileContent = await file.readFile('utf8');

  if (!fileContent.length && defaultContent) {
    await file.write(Buffer.from(defaultContent));
    await file.sync();
  }

  file.close();
  return fileContent || defaultContent;
};

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

      writeDataFileContent('title.txt', title);
    });

    return;
  }

  res.statusCode = 404;
  res.end('404');
});

const start = async (port) => {
  await checkOrSetUpDataDir();
  title = await readDataFileContent('title.txt', '你好世界');
  server.listen(port);
};

start(3333);

