import { parse } from "node:url";
import { join } from "node:path";
import { readFileSync, statSync } from "node:fs";
import { lookup } from "es-mime-types";

const getFile = (ctx, absPath) => {
  // 获取静态资源
  ctx.statusCode = 200;
  ctx.setHeader("Content-type", `${lookup(absPath)};charset=utf-8`);
  ctx.body = readFileSync(absPath);
};

export function staticServer(dir) {
  return async (ctx, next)  => {
    console.log("=========staticServer========");
    const { req } = ctx;
    // 静态服务处理不同的文件
    let { pathname } = parse(req.url);
    if (pathname.startsWith("/api")) return await next();
    // 处理中文路径
    pathname = decodeURIComponent(pathname);
    // 动态生成相对路径
    let absPath = join(dir, pathname);
    try {
      const statObj = await statSync(absPath);
      if (statObj.isDirectory()) {
        absPath = join(absPath, "index.html");
        getFile(ctx, absPath);
      } else if (statObj.isFile()) {
        getFile(ctx, absPath);
      }
      await next();
    } catch (error) {
      ctx.statusCode = 404;
      ctx.setHeader("Content-type", `text/plain;charset=utf-8`);
      ctx.body = 'NOT FOUND';
    }
  }
}
