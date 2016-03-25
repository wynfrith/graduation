import compose from 'koa-compose'

export default function errorHandler () {

  const handle500 = async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.log(err);
      ctx.status = err.status || 500;
      ctx.body = { msg: err.message };
      ctx.app.emit('error', err, ctx);
    }
  };

  const handle404 = async (ctx, next) => {
    await next();

    if (404 === ctx.status) {
      ctx.status = 404;
      switch (ctx.accepts('html', 'json')) {
        case 'html':
          ctx.type = 'html';
          ctx.body = '<h1>404</h1><p>该页面消失了</p>';
          break;
        case 'json':
          ctx.body = { msg: '该页面消失了' };
          break;
        default:
          ctx.type = 'text';
          ctx.body = '该页面消失了';
      }
    }
  };

  return compose([
    handle404,
    handle500
  ]);

}

