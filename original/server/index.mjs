import { createServer } from "node:http";
import { readFile, writeFile, readFileSync, writeFileSync } from "node:fs";
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
//   server.maxConnections = 3;
//   server.getConnections(function (err, count) {
//     console.log("当前连接的客户端个数为：" + count);
//   });
//   console.log(server.address(), '666');
  console.log(req.url);
  console.log(req.method);
  // 静态服务处理不同的文件
  let { pathname } = parse(req.url);
  // 处理中文路径
  pathname = decodeURIComponent(pathname);
  // 动态生成相对路径
  let absPath = join(__dirname, "../www", pathname);
  const ARTICLE_PATH = join(__dirname, "../../database", "allarticle.json");
  const COMMENT_PATH = join(__dirname, "../../database", "comment.json");
  const RELATION_PATH = join(__dirname, "../../database", "mappingRelations.json");
  // 获取博客接口
  if (req.url === "/get/api/getList") {
    absPath = RELATION_PATH;
  }
  // 提交博客接口
  if (req.url === "/post/api/postList") {
    var dataList = [];
    var requestBody = {};
    req.on("data", function (chunk) {
      dataList.push(chunk);
    });
    req.on("end", function () {
      requestBody = Buffer.concat(dataList).toString();
      try {
        requestBody = JSON.parse(requestBody);
        //修改帖子和关系文件
        const articles = JSON.parse(readFileSync(ARTICLE_PATH).toString());
        const mappingRelations = JSON.parse(readFileSync(RELATION_PATH).toString());
        articles.push(requestBody);//帖子name和content
        mappingRelations.push([]);//关系文件新增一个空数组
        writeFileSync(ARTICLE_PATH, JSON.stringify(articles));
        writeFileSync(RELATION_PATH, JSON.stringify(mappingRelations));
      } catch (error) {
        console.log(error);
      }
    });
    res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
    res.end();
    return;
  }
  // 删除博客接口
  if (req.url === "/post/api/deleteListItem") {
    var dataList = [];
    var requestBody = {};
    req.on("data", function (chunk) {
      dataList.push(chunk);
    });
    req.on("end", function () {
      requestBody = Buffer.concat(dataList).toString();
      try {
        requestBody = JSON.parse(requestBody);
        //修改帖子 评论 关系三个文件
        const articles = JSON.parse(readFileSync(ARTICLE_PATH).toString());
        const comments = Object.fromEntries(JSON.parse(readFileSync(COMMENT_PATH).toString()));
        const mappingRelations = JSON.parse(readFileSync(RELATION_PATH).toString());
        articles.splice(requestBody.index, 1); //删除帖子
        mappingRelations[requestBody.index].forEach((item)=>{ //删除帖子的评论
          delete comments[item];
        });
        const commentsResult = [];
        for(let i in comments) {
          commentsResult.push([i, comments[i]]); //转化为数组
        }
        mappingRelations.splice(requestBody.index, 1); //删除对应关系
        writeFileSync(ARTICLE_PATH, JSON.stringify(articles));
        writeFileSync(COMMENT_PATH, JSON.stringify(commentsResult));
        writeFileSync(RELATION_PATH, JSON.stringify(mappingRelations));
      } catch (error) {
        console.log(error);
      }
    });
    
    res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
    res.end();
    return;
  }
  //提交评论接口
  if(req.url === "/post/api/submitComment") {
    var dataList = [];
    var requestBody = {};
    const time = new Date().getTime().toString();
    req.on("data", function (chunk) {
      dataList.push(chunk);
    });
    req.on("end", function () {
      requestBody = Buffer.concat(dataList).toString();
      try {
        requestBody = JSON.parse(requestBody);
        //修改评论和关系文件
        const comments = JSON.parse(readFileSync(COMMENT_PATH).toString());
        const mappingRelations = JSON.parse(readFileSync(RELATION_PATH).toString()); 
        comments.push([time, requestBody[1]]);//评论存id和内容
        mappingRelations[requestBody[0]].push(time);//关系存评论id
        const c = writeFileSync(COMMENT_PATH, JSON.stringify(comments));
        const m = writeFileSync(RELATION_PATH, JSON.stringify(mappingRelations));
      } catch (error) {
        console.log(error);
      }
    });
    res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
    res.end();
    
    return;
  }

  //删除评论接口
  if(req.url === "/post/api/deleteComment") {
    var dataList = [];
    var requestBody = {};
    const time = new Date().getTime().toString();
    req.on("data", function (chunk) {
      dataList.push(chunk);
    });
    req.on("end", function () {
      requestBody = Buffer.concat(dataList).toString();
      try {
        requestBody = JSON.parse(requestBody);
        //修改评论和关系文件
        const comments = Object.fromEntries(JSON.parse(readFileSync(COMMENT_PATH).toString()));
        const mappingRelations = JSON.parse(readFileSync(RELATION_PATH).toString());      
        delete comments[requestBody.time];
        mappingRelations[requestBody.index].splice(mappingRelations[requestBody.index].indexOf(requestBody.time), 1);
        const commentsResult = [];
        for(let i in comments) {
          commentsResult.push([i, comments[i]]); //转化为数组
        }
        writeFileSync(COMMENT_PATH, JSON.stringify(commentsResult));
        writeFileSync(RELATION_PATH, JSON.stringify(mappingRelations));
      } catch (error) {
        console.log(error);
      }
    });

    res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
    res.end();
    return; 
  }
  // 获取index.html
  if (req.url === "/") {
    absPath = join(absPath, "index.html");
  }
  //所有帖子 同步读取文件，结果转化为字符串，解析JSON字符串转化为JS对象
  const articles = JSON.parse(readFileSync(ARTICLE_PATH).toString());
  //所有评论 同步读取文件，结果转化为字符串，解析JSON字符串转化为JS对象，最后转为键值对方便读写
  const comments = Object.fromEntries(JSON.parse(readFileSync(COMMENT_PATH).toString()));

  // 获取静态资源
  readFile(absPath, (err, data) => {
    if (!err) {
      res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
      if(req.url === "/get/api/getList") {
        const mappingRelations = JSON.parse(data.toString()); //帖子和评论的映射关系
        for(let i=0; i<articles.length; i++) {
          if(mappingRelations[i] && mappingRelations[i].length>0) { //如果帖子有评论
            articles[i]['children'] = [];
            for(let j=0; j<mappingRelations[i].length; j++) {
              articles[i]['children'].push([mappingRelations[i][j], comments[mappingRelations[i][j]]]);
            }
          }
        }
        res.end(JSON.stringify(articles));
      } else {
        res.end(data);
      }
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
  console.log("App running at:");
  console.log("Local:   http://localhost:3000");
});
