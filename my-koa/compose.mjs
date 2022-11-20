const compose = (middlewares) => {
  return (ctx) => {
    let index = -1
    function next (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i;
      let fn = middlewares[i];
      if (i >= middlewares.length) {
        // 全部执行完毕
        return Promise.resolve()
      }
      try {
        return Promise.resolve(fn(ctx, next.bind(null, ++i)));
      } catch (error) {
        return Promise.reject();
      }
    }
    return next(0);
  }
}

export default compose;

// const middlewares = [];

// for (let i = 0; i < 10; i++) {
//   middlewares.push(async (next) => {
//     console.log(`第${i}个中间件被执行了===>start`)
//     await next();
//     console.log(`第${i}个中间件被执行了===>end`)
//   })
// }

// const dispatchFn = compose(middlewares);

// dispatchFn().then(() => {
//   console.log('所有中间件执行完毕');
// });