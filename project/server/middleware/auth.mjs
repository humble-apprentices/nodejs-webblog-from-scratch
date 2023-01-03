import { sessionIsEfective } from "../controller/session.mjs";
import { getCookie } from "../utils/cookie.mjs";

export async function auth(ctx, next) {
  console.log("=========validate auth=========");
  try {
    if (ctx.body) return await next();
    const { req } = ctx;
    getCookie("session", req.headers["cookie"]);
    const cookie = getCookie("session", req.headers["cookie"]);
    const session = JSON.parse(cookie || '{}');
    const whiteList = ["/api/user/login", "/api/user/register"];
    if (
      whiteList.find((url) => req.url.startsWith(url)) ||
      sessionIsEfective(session)
    )
      return await next();
    ctx.status = 401;
    ctx.setHeader("Content-type", `application/json;charset=utf-8`);
    ctx.body = JSON.stringify({
      code: 1,
      data: null,
      message: "未登录",
    });
    await next();
  } catch (error) {
    console.log("error", error);
  }
}
