import Emitter from "events";
import http from "http";
import compose from "./compose.mjs";

export default class Application extends Emitter {
  middleware = [];
  constructor() {
    super();
    return this;
  }

  listen(...args) {
    const server = http.createServer(this.serverCallback());
    server.listen(...args);
  }
  serverCallback() {
    const fn = compose(this.middleware);
    return (req, res) => {
      const ctx = this.createContext(req, res);
      const onerror = (err) => {
        this.emit("error", err);
      };
      const handleResponse = () => {
        res.end(ctx.body);
        console.log("服务响应完成了");
      };
      return fn(ctx).then(handleResponse).catch(onerror);
    };
  }
  use(fn) {
    this.middleware.push(fn);
  }
  createContext(req, res) {
    const ctx = {};
    ctx.req = req;
    ctx.res = res;
    ctx.app = this;
    ctx.body = "";
    ctx.status = {
      get() {
        return res.statusCode;
      },
      set(code) {
        res.statusCode = code;
      },
    };
    ctx.setHeader = (name, value) => {
      res.setHeader(name, value);
    };
    return ctx;
  }
}
