import { createServer } from "node:http";
import { readFile, writeFile, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, parse } from "node:url";
import { join, dirname } from "node:path";
import { lookup } from "es-mime-types";
import crypto from "node:crypto";
import Password from "./password.mjs";
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
const USER_PATH = join(__dirname, "../../database", "user.json");
const ARTICLE_PATH = join(__dirname, "../../database", "allarticle.json");
const COMMENT_PATH = join(__dirname, "../../database", "comment.json");
const RELATION_PATH = join(__dirname, "../../database", "mappingRelations.json");
const USER_ALLARTICLE = join(__dirname, "../../database", "userAllarticle.json");
const USER_COMMENT = join(__dirname, "../../database", "userComment.json");

const auth = (req, res) => {
  const matched = req.headers?.['cookie']?.match?.(/userId=(\d+)/)?.[1];

  const user = matched
    && mReadFile(USER_PATH).find(u => u.userId === Number(matched));

  if (user) {
    return user;
  }

  // if (!req.url.startsWith('/login') || !req.url.startsWith('/favicon.ico')) {
  //   console.log(3333, req.url)
  //   res.statusCode = 302;
  //   res
  //     .setHeader('location', '/login')
  //     // .end();
  // }

  return null;
};

server.on("request", (req, res) => {

  const user = auth(req, res);

  console.log(req.url);
  console.log(req.method);
  // 静态服务处理不同的文件
  let { pathname } = parse(req.url);
  // 处理中文路径
  pathname = decodeURIComponent(pathname);
  // 动态生成相对路径
  let absPath = join(__dirname, "../www", pathname);


  // 注册接口
  if (req.url === "/post/api/regist") {
    var dataList = [];
    var requestBody = {};
    req.on("data", function (chunk) {
      dataList.push(chunk);
    });
    req.on("end", async function () {
      try {
        requestBody = getRequestBody(dataList);
        requestBody.userId = Math.round(Math.random() * 1000000000)
        // // 密码加密
        // const hash = crypto.createHash('sha256');
        // hash.update(requestBody.password);
        // requestBody.password = hash.digest('hex')
        // 密码加密
        requestBody.password = await new Password(requestBody.password).derive();
        //用户存储
        const user = mReadFile(USER_PATH);
        user.push(requestBody);//帖子name和content
        mWriteFile(USER_PATH, user);
      } catch (error) {
        console.log(error);
      }
    });
    res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
    res.end();
    return;
  }
  // 登录接口
  if (req.url === "/post/api/login") {
    var dataList = [];
    var requestBody = {};
    res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
    req.on("data", function (chunk) {
      dataList.push(chunk);
    });
    req.on("end", async function () {
      try {
        requestBody = getRequestBody(dataList);
        //读取用户文件，校验用户密码是否正确
        const users = mReadFile(USER_PATH);
        const userLogin = users.findIndex(bi => bi.name === requestBody.name)
        if (userLogin >= 0) {
          const user = users[userLogin];
          // // 密码加密与对比
          // const hash = crypto.createHash('sha256');
          // hash.update(requestBody.password);
          // requestBody.password = hash.digest('hex')

          // if (user.password === requestBody.password) {
          // 密码加密与对比
          if (await new Password(requestBody.password).verify(user.password)) {
            res
              .setHeader('set-cookie', `userId=${user.userId}; Max-Age=2592000; Path=/`)
              .end(JSON.stringify({ code: 'success', user }));
          } else {
            res.end(JSON.stringify({ code: 'wrongPwd' }));
          }
        } else {
          res.end(JSON.stringify({ code: 'noRegist' }));
        }

      } catch (error) {
        console.log(error);
      }
    });
    return;
  }

  //加密测试接口
  // hash
  if (req.url === "/post/api/testHash") {
    var dataList = [];
    var requestBody = {};
    res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
    req.on("data", function (chunk) {
      dataList.push(chunk);
    });
    req.on("end", function () {
      try {
        requestBody = getRequestBody(dataList);
        //获取加密模块支持的所有哈希算法
        const hashes = crypto.getHashes();
        //创建Hash对象，指定算法，此处示例为md5
        const hash = crypto.createHash('md5');
        //更新待计算哈希值的原文，可多次调用
        hash.update(requestBody.inputData, 'utf8');
        //输出哈希值，此处指定输出结果为16进制
        const result = hash.digest('hex');
        res.end(JSON.stringify(result));
      } catch (error) {
        console.log(error);
      }
    });
    return;
  }
  // 对称加密
  if (req.url === "/post/api/testCipheriv") {
    var dataList = [];
    var requestBody = {};
    res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
    req.on("data", function (chunk) {
      dataList.push(chunk);
    });
    req.on("end", function () {
      try {
        const algorithm = 'aes-192-cbc';
        const password = 'pwd';

        //通过scrypt函数生成key，key的长度和加密算法有关，aes192则要求key为192位（24字节）
        crypto.scrypt(password, 'salt', 24, (err, key) => {
          if (err) throw err;
          //通过randomFill生成随机的初始化向量,固定为16字节
          crypto.randomFill(new Uint8Array(16), (err, iv) => {
            if (err) throw err;
            //创建Cipher对象,指定其算法，秘钥，初始化向量
            const cipher = crypto.createCipheriv(algorithm, key, iv);
            //传入待加密内容，会获取加密片段
            let encrypted = cipher.update('一二三四伍六七', 'utf8', 'hex');
            //获取剩余加密内容，并和之前加密片段相加，即得到最终加密结果
            encrypted += cipher.final('hex');
            console.log('3333333', encrypted);
            res.end(JSON.stringify(encrypted));
          });
        });
      } catch (error) {
        console.log(error);
      }
    });
    return;
  }

  // 对称解密，原文：some clear text data
  if (req.url === "/post/api/testDecipheriv") {
    var dataList = [];
    var requestBody = {};
    res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
    req.on("data", function (chunk) {
      dataList.push(chunk);
    });
    req.on("end", function () {
      try {
        const algorithm = 'aes-192-cbc';
        const password = 'Password used to generate key';
        const encrypted = 'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
        //使用加密时的密码生成解密的秘钥，必须与加密时秘钥一致
        crypto.scrypt(password, 'salt', 24, (err, key) => {
          if (err) throw err;
          //创建初始化向量
          const iv = Buffer.alloc(16, 0);
          const decipher = crypto.createDecipheriv(algorithm, key, iv);
          //传入待解密内容，会获取解密后片段
          let decrypted = decipher.update(encrypted, 'hex', 'utf8');
          //获取剩余解密内容，并和之前解密片段相加，即得到最终解密结果
          decrypted += decipher.final('utf8');
          res.end(JSON.stringify(decrypted));
        });
      } catch (error) {
        console.log(error);
      }
    });
    return;
  }


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
      try {
        requestBody = getRequestBody(dataList);
        requestBody.articlesId = Math.round(Math.random() * 1000000000);
        //修改帖子和关系文件
        const articles = mReadFile(ARTICLE_PATH);
        const mappingRelations = mReadFile(RELATION_PATH);
        const userAllarticle = mReadFile(USER_ALLARTICLE);
        articles.push(requestBody);//帖子name和content
        mappingRelations.push([]);//关系文件新增一个空数组
        userAllarticle.push({ userId: requestBody.userId, articlesId: requestBody.articlesId })
        mWriteFile(ARTICLE_PATH, articles);
        mWriteFile(RELATION_PATH, mappingRelations);
        mWriteFile(USER_ALLARTICLE, userAllarticle);
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
      try {
        requestBody = getRequestBody(dataList);
        //修改帖子 评论 关系三个文件
        const articles = mReadFile(ARTICLE_PATH);
        const comments = Object.fromEntries(mReadFile(COMMENT_PATH));
        const mappingRelations = mReadFile(RELATION_PATH);
        const userAllarticle = mReadFile(USER_ALLARTICLE);
        const articlesId = articles[requestBody.index].articlesId;
        removeArticle(requestBody.index, articlesId, articles, mappingRelations, comments, userAllarticle);
        const commentsResult = [];
        for (let i in comments) {
          commentsResult.push([i, comments[i]]); //转化为数组
        }
        mWriteFile(ARTICLE_PATH, articles);
        mWriteFile(COMMENT_PATH, commentsResult);
        mWriteFile(RELATION_PATH, mappingRelations);
        mWriteFile(USER_ALLARTICLE, userAllarticle);
      } catch (error) {
        console.log(error);
      }
    });

    res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
    res.end();
    return;
  }
  //提交评论接口
  if (req.url === "/post/api/submitComment") {
    var dataList = [];
    var requestBody = {};
    req.on("data", function (chunk) {
      dataList.push(chunk);
    });
    req.on("end", function () {
      try {
        requestBody = getRequestBody(dataList);

        //修改评论和关系文件
        const comments = mReadFile(COMMENT_PATH);
        const mappingRelations = mReadFile(RELATION_PATH);
        const userComment = mReadFile(USER_COMMENT);
        const allarticle = mReadFile(ARTICLE_PATH);
        const articlesId = allarticle[requestBody.index].articlesId;
        comments.push({ commentId: requestBody.commentId, content: requestBody.content });//评论存id和内容
        mappingRelations.push({ articlesId: articlesId, commentId: requestBody.commentId });//关系存评论id
        userComment.push({ userId: requestBody.userId, commentId: requestBody.commentId })
        const c = mWriteFile(COMMENT_PATH, comments);
        const m = mWriteFile(RELATION_PATH, mappingRelations);
        const u = mWriteFile(USER_COMMENT, userComment);
      } catch (error) {
        console.log(error);
      }
    });
    res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
    res.end();

    return;
  }

  //删除评论接口
  if (req.url === "/post/api/deleteComment") {
    var dataList = [];
    var requestBody = {};
    req.on("data", function (chunk) {
      dataList.push(chunk);
    });
    req.on("end", function () {
      try {
        requestBody = getRequestBody(dataList);
        //修改评论和关系文件
        let comments = mReadFile(COMMENT_PATH);
        let mappingRelations = mReadFile(RELATION_PATH);
        comments = comments.filter(bi => bi.commentId !== requestBody.time);
        mappingRelations = mappingRelations.filter(bi => bi.commentId !== requestBody.time);
        mWriteFile(COMMENT_PATH, comments);
        mWriteFile(RELATION_PATH, mappingRelations);
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
  // login.html
  if (req.url === "/login") {
    absPath = join(absPath, "login.html");
  }
  // regist.html
  if (req.url === "/regist") {
    absPath = join(absPath, "regist.html");
  }
  // demo.html
  if (req.url === "/demo") {
    absPath = join(absPath, "demo.html");
  }
  //所有帖子 同步读取文件，结果转化为字符串，解析JSON字符串转化为JS对象
  const articles = mReadFile(ARTICLE_PATH);
  //所有评论 同步读取文件，结果转化为字符串，解析JSON字符串转化为JS对象，最后转为键值对方便读写
  const comments = Object.fromEntries(mReadFile(COMMENT_PATH));

  // 获取静态资源
  readFile(absPath, (err, data) => {
    if (!err) {
      res.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
      if (req.url === "/get/api/getList") {
        const mappingRelations = JSON.parse(data.toString()); //帖子和评论的映射关系
        const commentData = mReadFile(COMMENT_PATH);
        for (let i = 0; i < articles.length; i++) {
          const map = mappingRelations.filter(bi => bi.articlesId === articles[i].articlesId);

          if (map && map.length > 0) { //如果帖子有评论
            articles[i]['children'] = [];
            for (let j = 0; j < map.length; j++) {
              const c = commentData.find(bi => bi.commentId === map[j].commentId)
              articles[i]['children'].push([map[j].commentId, c ? c.content : null]);
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

function mReadFile(path) {
  return JSON.parse(readFileSync(path).toString());
}

function mWriteFile(path, content) {
  writeFileSync(path, JSON.stringify(content));
}

const getRequestBody = (data) => {
  return JSON.parse(Buffer.concat(data).toString());
}

const removeArticle = (articleIndex, articlesId, articles, mapping, comments, userAllarticle) => {
  const userAllarticleIndex = userAllarticle.findIndex(bi => bi.articlesId === articleIndex);
  userAllarticle.splice(userAllarticleIndex, 1);
  articles.splice(articleIndex, 1);
  removeComments(articlesId, mapping, comments);
};
const removeComments = (articlesId, mapping, comments) => {
  mapping = mapping.filter(bi => bi.articlesId !== articlesId);
};

server.listen(3000, "0.0.0.0", () => {
  console.log("App running at:");
  console.log("Local:   http://localhost:3000");
});
