import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs";
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

const server = createServer();
server.on("request", (req, res) => {
  console.log(req.url);
  console.log(req.method);
  // 静态服务处理不同的文件
  let { pathname } = parse(req.url);
  // 处理中文路径
  pathname = decodeURIComponent(pathname);
  // 动态生成相对路径
  let absPath = join(__dirname, "../www", pathname);
  // 获取博客接口
  if (req.url === "/api/getList") {
    absPath = join(__dirname, "../database", "allarticle.json");
  }
  // 提交博客接口
  if (req.url === "/api/postList") {
    var buffers = [];
    var requestBody = {};
    req.on("data", function (chunk) {
      buffers.push(chunk);
    });
    req.on("end", function () {
      requestBody = Buffer.concat(buffers).toString();
      try {
        requestBody = JSON.parse(requestBody);
      } catch (error) {
        console.log(error);
      }
    });
    absPath = join(__dirname, "../database", "allarticle.json");
    readFile(absPath, (err, data) => {
      if (!err) {
        res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
        const list = JSON.parse(data);
        list.push(requestBody);
        const listJson = JSON.stringify(list,null, 4);
        writeFile(absPath, listJson, (err) => {
          if (!err) {
            res.end();
          }
          console.log("JSON data is saved.");
        });
      } else {
        res.writeHead(500, {
          "Content-type": "text/html;charset=utf-8",
        });
        res.end("服务器错误");
      }
    });
    return;
  }
  // 获取index.html
  if (req.url === "/") {
    absPath = join(absPath, "index.html");
  }
  // 获取静态资源
  readFile(absPath, (err, data) => {
    // console.log(absPath)
    if (!err) {
      res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
      res.end(data);
    } else {
      res.writeHead(500, {
        "Content-type": "text/html;charset=utf-8",
      });
      res.end("服务器错误");
    }
  });

  return;
});

server.listen(3000, "0.0.0.0", () => {
  console.log("server is start...");
});
