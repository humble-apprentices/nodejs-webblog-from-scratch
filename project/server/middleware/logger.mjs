export async function logger(ctx, next) {
  const startTime = Date.now();
  console.log('\n\n=================logger start==================\n')
  console.log('logger: request url = ', ctx.req.url);
  console.log('logger: request time = ', startTime);
  await next();
  const endTime = Date.now();
  console.log('logger: response time = ', endTime);
  console.log(`logger: ${endTime - startTime}ms from request to response`);
  console.log('\n=================logger end====================\n\n')
}