import { createServer } from "node:http";
import { readFile, writeFile, createReadStream } from "node:fs";
import { fileURLToPath, parse } from "node:url";
import { join, dirname } from "node:path";

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
  // 静态服务处理不同的文件
  let { pathname } = parse(req.url);
  // 处理中文路径
  pathname = decodeURIComponent(pathname);
  // 获取index.html
  if (req.url === "/") {
    // absPath = join(absPath, "index.html");
    let absPath = join(__dirname, "../server", "200m.txt");

    // 获取静态资源
    // 1.使用readStream
      let readStream = createReadStream(absPath);
      readStream.pipe(res);
    // 2.使用readFile
    // readFile(absPath, (err, data) => {
    //   res.end(data);
    // });
  }
  return;
});

server.listen(8000, "0.0.0.0", () => {
  console.log("App running at:");
  console.log("Local:   http://localhost:8000");
});
