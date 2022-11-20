import { Layer } from "./layer.mjs";
import methods from "methods";
import { pathToRegexp } from "path-to-regexp";
import compose from "./compose.mjs";

export default class Router {
  constructor(opts) {
    this.opts = opts || {};
    this.stack = []; // 存储layer
    this.setMethodVerb();
  }
  setMethodVerb() {
    methods.forEach((method) => {
      Router.prototype[method] = function (path, middleware) {
        this.register(path, [method], middleware, {});
        return this;
      };
    });
  }
  // register方法主要负责实例化Layer对象、更新路由前缀和前置param处理函数
  register(path, methods, middleware, opts = {}) {
    // 允许path为数组
    if (Array.isArray(path)) {
      path.forEach((pathItem) => {
        this.register(pathItem, methods, middleware, opts);
      });
      return this;
    }

    // 实例化Layer
    var route = new Layer(path, methods, middleware, {
      end: opts.end === false ? opts.end : true,
      name: opts.name,
      sensitive: opts.sensitive || this.opts.sensitive || false,
      strict: opts.strict || this.opts.strict || false,
      prefix: opts.prefix || this.opts.prefix || "",
      ignoreCaptures: opts.ignoreCaptures,
    });

    if (this.opts.prefix) {
      // 全局的prefix
      route.setPrefix(this.opts.prefix);
    }

    // 将路由实例推入router的stack中
    this.stack.push(route);
    return route;
  }
  use() {
    let middleware = Array.prototype.slice.call(arguments);
    let path = "";
    const hasPath = middleware[0] === "string";
    if (hasPath) path = middleware.shift();
    for (const method of middleware) {
      const keys = [];
      pathToRegexp(this.opts.prefix || "", keys);
      const routerPrefixHasParam = this.opts.prefix && keys.length;
      // 如果没有path，则所有请求都会匹配到该中间件
      this.register(path || "([^/]*)", [], method, {
        end: false,
        ignoreCaptures: !hasPath && !routerPrefixHasParam,
      });
    }
    return this;
  }
  routes() {
    const dispatch = (ctx, next) => {
      const { url: path, method } = ctx.req;
      const matched = this.match(path, method);
      if (!matched.hasMethod) return next();
      const matchedLayers = matched.layers;
      const layerChain = []
      matchedLayers.forEach((layer) => {
        layerChain.push(...layer.stack)
      })
      return compose(layerChain)(ctx, next);
    };
    dispatch.router = this;
    return dispatch;
  }
  match(path, method) {
    const layers = this.stack;
    const matched = {
      path: [],
      layers: [],
      hasMethod: false,
    };

    layers.forEach((layer) => {
      if (layer.match(path)) {
        matched.path.push(path);
        if (
          layer.methods.length === 0 ||
          layer.methods.indexOf(method) !== -1
          ) {
            // 没有对应的处理函数
            matched.layers.push(layer);
            if (layer.methods.length > 0) {
              // 有对应的处理函数
              matched.hasMethod = true;
            }
          }
      }
    });
    return matched;
  }
}