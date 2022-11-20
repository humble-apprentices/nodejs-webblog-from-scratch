import { pathToRegexp } from "path-to-regexp";

export class Layer {
  constructor(path, methods, middleware, opts = {}) {
    this.opts = opts || {};
    this.methods = [];
    this.paramNames = [];
    this.stack = Array.isArray(middleware) ? middleware : [middleware];

    this.methods = methods.map(method => method.toUpperCase());
    this.path = path;
    this.regexp = pathToRegexp(path, this.paramNames, this.opts);
  }

  match(path) {
    return this.regexp.test(path);
  }
  setPrefix(prefix) {
    if (this.path) {
      this.path =
        this.path !== "/" || this.opts.strict
          ? `${prefix}${this.path}`
          : prefix; // 拼接新的路由路径
      this.paramNames = [];
      // 根据新的路由路径字符串生成正则表达式
      this.regexp = pathToRegexp(this.path, this.paramNames, this.opts);
    }
    return this;
  }
}