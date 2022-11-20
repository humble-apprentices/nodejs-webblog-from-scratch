import { sessionIsEfective } from "../controller/session.mjs";

export async function auth (ctx, next) {
  console.log('=========validate auth=========');
  try {
    const { req } = ctx;
  const session = JSON.parse(req.headers['cookie'].match(/session=(.+)/)[1]);
  const whiteList = [
    '/api/user/login',
    '/api/user/register',
  ]
  if (whiteList.find(url => req.url.startsWith(url)) || sessionIsEfective(session)) return next();
  ctx.status = 401;
  ctx.setHeader("Content-type", `application/json;charset=utf-8`);
  ctx.body = JSON.stringify({
    code: 1,
    data: null,
    message: '未登录'
  });
  await next();
  } catch (error) {
    console.log('error', error)
  } 
}