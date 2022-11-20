import Emitter from "events";
import http from "http";
import compose from "./compose.mjs";

export default class Application extends Emitter {
  middleware = [];
  ctx = {
    req: null,
    res: null,
  };
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
      this.createContext(req, res);
      const onerror = (err) => {
        this.emit("error", err);
      };
      const handleResponse = () => {
        res.end(this.ctx.body);
        console.log("服务响应完成了");
      };
      return fn(this.ctx).then(handleResponse).catch(onerror);
    };
  }
  use(fn) {
    this.middleware.push(fn);
  }
  createContext(req, res) {
    this.ctx.req = req;
    this.ctx.res = res;
    this.app = this;
    this.ctx.body = ''
    this.ctx.status = {
      get () {
        return res.statusCode
      },
      set (code) {
        res.statusCode = code
      }
    };
    this.ctx.setHeader = (name, value) => {
      res.setHeader(name, value);
    }
  }
}
