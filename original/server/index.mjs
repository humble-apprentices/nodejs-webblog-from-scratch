import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs";
import { readFile as readFilePromise, writeFile as writeFilePromise } from "node:fs/promises";

import { fileURLToPath, parse } from "node:url";
import { join, dirname } from "node:path";
import { lookup } from "es-mime-types";

// mjs写法里无法获取__dirname, __filename
const getPath = (url) => {
  const __filename = fileURLToPath(url);
  const __dirname = dirname(__filename);
  return {
    __dirname,
    __filename,
  };
};

const { __dirname } = getPath(import.meta.url);

const blogEntryTemplate = (blogData, index) => `
<div class="box-article">
    <div class="article-name">${blogData.name}</div>
    <div class="article-content">${blogData.content}</div>

    <form action="/post/api/deleteListItem" method="post">
        <input name="index" value="${index}" type="hidden" />
        <button class="delete-button">删除</button>
    </form>
</div>
`;

const server = createServer();

const DATA_PATH = join(__dirname, "../../database", "allarticle.json");
const TEMPLATE_PATH = join(__dirname, "../www", "index.html");

const redirectTo = (reqPath, res) => {
  res.writeHead(302, { location: reqPath }).end();
};

const readRequest = req => new Promise((resolve, reject) => {
  const dataList = [];

  req.on('data', chunk => {
    dataList.push(chunk);
  });

  req.on('end', () => {
    try {
      resolve(new URLSearchParams(Buffer.concat(dataList).toString('utf-8')));
    } catch (err) {
      reject(err);
    }
  });

  req.on('error', err => reject(err));
});

const readJsonFile = async filePath => {
  return JSON.parse((await readFilePromise(filePath)).toString('utf-8'));
}

const writeJsonFile = async (filePath, content) => {
  await writeFilePromise(filePath, JSON.stringify(content, null, 4));
}

const renderEntryList = async res => {
  try {
    const [template, entriesData] = await Promise.all([
      readFilePromise(TEMPLATE_PATH),
      readJsonFile(DATA_PATH),
    ]);

    const templateString = template.toString('utf-8');
    const entriesString = entriesData
      .map((entry, i) => blogEntryTemplate(entry, i))
      .join('');

    const result = templateString.replace('$$ENTRY_LIST$$', entriesString);
    res.setHeader("Content-type", 'text/html;charset=utf-8');
    res.end(result);
  } catch (err) {
    res.writeHead(500, { "Content-type": "text/html;charset=utf-8" });
    res.end("服务器错误");
  }
};

const removeEntry = async (req, res) => {
  try {
    const [form, entries] = await Promise.all([
      readRequest(req),
      readJsonFile(DATA_PATH),
    ]);

    entries.splice(Number(form.get('index')), 1);
    await writeJsonFile(DATA_PATH, entries);
  } catch (err) {
    res.writeHead(500, { "Content-type": "text/html;charset=utf-8" });
    res.end("服务器错误");
  }

  redirectTo('/', res);
};

const postEntry = async (req, res) => {
  try {
    const [form, entries] = await Promise.all([
      readRequest(req),
      readJsonFile(DATA_PATH),
    ]);

    entries.push({ name: form.get('name'), content: form.get('content') });
    await writeJsonFile(DATA_PATH, entries);
  } catch (err) {
    res.writeHead(500, { "Content-type": "text/html;charset=utf-8" });
    res.end("服务器错误");
  }

  redirectTo('/', res);
};

server.on("request", async (req, res) => {
  // 提交博客接口
  if (req.url === '/post/api/postList') {
    await postEntry(req, res);
    return;
  }

  // 删除博客接口
  if (req.url === '/post/api/deleteListItem') {
    await removeEntry(req, res);
    return;
  }

  // 获取index.html
  if (req.url === '/') {
    await renderEntryList(res);
    return;
  }

  let { pathname } = parse(req.url);
  // 处理中文路径
  pathname = decodeURIComponent(pathname);
  // 动态生成相对路径
  let absPath = join(__dirname, "../www", pathname);

  // 获取静态资源
  readFile(absPath, (err, data) => {
    // console.log(absPath)
    if (!err) {
      res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`).end(data);
    } else {
      res.writeHead(500, {
        "Content-type": "text/html;charset=utf-8",
      });
      res.end("服务器错误");
    }
  });
});

server.listen(8080, "0.0.0.0", () => {
  console.log("App running at:");
  console.log("Local:   http://localhost:8080");
});
