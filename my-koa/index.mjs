import Application from "./application.mjs";
// import Application from "koa";

const app = new Application();

app.use((ctx, next) => {
  console.log('我是第一个中间件start');
  setTimeout(async () => {
    console.log('2秒后才响应')
    await next();
    // await next();
    console.log('我是第一个中间件end');
  }, 2000)
})

app.use(async (ctx, next) => {
  console.log('我是第二个中间件start');
  await next();
  console.log('我是第二个中间件end');
})

app.listen(3000, () => {
  console.log('服务启动完成')
})