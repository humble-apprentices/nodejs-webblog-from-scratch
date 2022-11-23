import router from "./router.mjs";
import { parsePostData } from "../utils/bodyParser.mjs";
import { findUserByName, registerUser } from "../controller/auth.mjs";
import { createSession } from "../controller/session.mjs";

router.post("/api/user/login", async (ctx, next) => {
  console.log("==========/api/user/login==========");
  const { req } = ctx;
  const result = {
    code: 0,
    data: null,
    message: "success",
  };
  ctx.status = 200;
  try {
    const { name, password } = await parsePostData(req);
    //读取用户文件，校验用户密码是否正确
    const user = await findUserByName(name);
    if (user) {
      // 密码加密与对比
      if (password === user.password) {
        const sessiont = await createSession(user.userId);
        ctx.setHeader(
          "set-cookie",
          `session=${JSON.stringify(sessiont)}; Max-Age=2592000; Path=/`
        );
        result.data = user;
      } else {
        result.code = 1;
        result.message = "用户名或密码错误";
      }
    } else {
      result.code = 1;
      result.message = "用户名未注册";
    }
  } catch (error) {
    result.code = 1;
    result.message = error.message;
  }
  ctx.setHeader("Content-type", `application/json;charset=utf-8`);
  ctx.body = JSON.stringify(result);
  await next();
});

router.post("/api/user/register", async (ctx, next) => {
  console.log("==========/api/user/register==========");
  const { req } = ctx;
  ctx.status = 200;
  const result = {
    code: 0,
    data: null,
    message: "success",
  };
  try {
    const { name, password } = await parsePostData(req);
    const user = await registerUser(name, password);
    const sessiont = await createSession(user.userId);
    if (user) {
      ctx.setHeader(
        "set-cookie",
        `session=${JSON.stringify(sessiont)}; Max-Age=2592000; Path=/`
      );
      result.data = user;
    } else {
      result.code = 1;
      result.message = "注册失败";
    }
  } catch (error) {
    result.code = 1;
    result.message = error.message;
  }
  ctx.setHeader("Content-type", `application/json;charset=utf-8`);
  ctx.body = JSON.stringify(result);
  await next();
});
