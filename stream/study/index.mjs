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

// stream中buffer
var fileName = resolve(__dirname, "data.txt");
var stream = createReadStream(fileName);
console.log("stream内容", stream);
stream.on("data", function (chunk) {
  console.log('chukkkkkkkkkkkkkkkkkkkkkkkkk');
  console.log(chunk instanceof Buffer);
  console.log(chunk);
});

// buffer