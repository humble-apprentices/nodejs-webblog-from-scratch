import Koa from 'koa';
import KoaRouter from 'koa-router';
const app = new Koa();
const router = new KoaRouter();

app.use( async (ctx, next) => {
    ctx.body = 'Hello World';
    next();
    console.log(ctx.path, ctx.req.url);
} );

router.get('/path', (ctx, next) => {
    console.log('/path收到了请求了');
    next();
    console.log('/path请求处理完毕');
})

router.get('/login', (ctx, next) => {
    console.log('/login收到了请求了');
    next();
    console.log('/login请求处理完毕');
})

router.use((ctx, next) => {
    console.log('所有请求都会走');
    next();
})

// app.use(router.routes());

app.listen( 3000 );