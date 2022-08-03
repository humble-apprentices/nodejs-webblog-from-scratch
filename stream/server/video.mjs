import { createServer } from "node:http";

import { stat, createReadStream, readFile } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { memoryUsage } from "node:process";

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

createServer(function (req, res) {
  if (req.url != "/v") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
    <video width="420" height="340" src="/v" controls></video>
    <form action="/post/api/memoryUsage" method="post">
        <button class="delete-button">获取内存</button>
    </form>
    `);
  } else {
    // var file = join(__dirname, "./C0001.mp4");
    var file = join(__dirname, "./miaomiao.mp4");
    stat(file, function (err, stats) {
      if (err) {
        res.end(err);
      }
      var range = req.headers.range;
      if (!range) {
        // 416 Wrong range
        return res.sendStatus(416);
      }
      if(req.url='/post/api/memoryUsage') {
        console.log('aaa')
        console.log(memoryUsage());
      }
      var positions = range.replace(/bytes=/, "").split("-");
      var start = parseInt(positions[0], 10);
      var total = stats.size;
      var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      var chunksize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Type": "video/mp4",
      });
      console.log("memoryUsage");
      console.log(memoryUsage());
      // var stream = createReadStream(file, { start: start, end: end })
      //   .on("open", function () {
      //     console.log(memoryUsage());
      //     stream.pipe(res);
      //   })
      //   .on("error", function (err) {
      //     res.end(err);
      //   });

      readFile(file, (err, data) => {
        if(err) {
          res.end("服务器错误");
        } else {
          console.log('readFile')
          res.end(data);
          console.log(memoryUsage());
        }
      });


    });
  }
}).listen(3001, "0.0.0.0", () => {
  console.log("App running at:");
  console.log("Local:   http://localhost:3001");
});
