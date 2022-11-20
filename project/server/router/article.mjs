import router from "./router.mjs";
import { parsePostData } from "../utils/bodyParser.mjs";
import {
  addArticle,
  deleteArticleById,
  findArticleById,
  getArticles,
} from "../controller/article.mjs";

router.get("/api/article/list", async (ctx, next) => {
  console.log("==========/api/article/list==========");
  const result = {
    code: 0,
    data: null,
    message: "success",
  };
  ctx.status = 200;
  try {
    result.data = getArticles();
  } catch (error) {
    result.code = 1;
    result.message = error.message;
  }
  ctx.setHeader("Content-type", `application/json;charset=utf-8`);
  ctx.body = JSON.stringify(result);
  await next();
});

router.post("/api/article/add", async (ctx, next) => {
  console.log("==========/api/article/add==========");
  const { req } = ctx;
  const result = {
    code: 0,
    data: null,
    message: "success",
  };
  const data = await parsePostData(req);
  ctx.status = 200;
  try {
    const article = addArticle(data);
    result.data = article;
  } catch (error) {
    result.code = 1;
    result.message = error.message;
  }
  ctx.setHeader("Content-type", `application/json;charset=utf-8`);
  ctx.body = JSON.stringify(result);
  await next();
});

router.post("/api/article/delete", async (ctx, next) => {
  console.log("==========/api/article/delete==========");
  const { req } = ctx;
  const result = {
    code: 0,
    data: null,
    message: "success",
  };
  const data = await parsePostData(req);
  ctx.status = 200;
  try {
    const article = findArticleById(data.id);
    if (article) {
      const article = deleteArticleById(data.id);
      result.data = article;
    } else {
      result.message = "文章不存在";
      result.code = 1;
    }
  } catch (error) {
    result.code = 1;
    result.message = error.message;
  }
  ctx.setHeader("Content-type", `application/json;charset=utf-8`);
  ctx.body = JSON.stringify(result);
  await next();
});
