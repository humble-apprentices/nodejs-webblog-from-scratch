import { join, dirname, resolve } from "node:path";
import { fileURLToPath, parse } from "node:url";
import { createReadStream, fstat, readFile, stat } from "node:fs";
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

function streambuffer() {
  // stream中buffer
  var fileName = resolve(__dirname, "data.txt");
  var stream = createReadStream(fileName);
  // console.log("stream内容", stream);
  stream.on("data", function (chunk) {
    console.log("获取数据");
    console.log(chunk instanceof Buffer);
    console.log(chunk);
  });
}

// buffer

function createBuffer() {
  let buf = Buffer.alloc(10, 0,"utf8");
  console.log(buf);
  writeBuffer(buf, 1, '111');
}

function writeBuffer(buf, offset, data) {
  buf.write(data, offset);
  console.log(buf);
  readBufer(buf, 0, 3);
}

function readBufer(buf, start, end) {
  console.log(buf.toString("utf8", start, end));
}

// streambuffer()
createBuffer();
