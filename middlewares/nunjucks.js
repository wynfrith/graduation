import co from 'co'
import path from 'path'
import views from 'koa-views'
import compose from 'koa-compose'
import convert from 'koa-convert'

// nunjucks template
export default function nunjucks() {
  const templates = views(path.join(__dirname,'../views'), { map: {html: 'nunjucks' }});
  const fix = async (ctx, next) => {
    ctx.render = co.wrap(ctx.render);
    await next();
  };
  return compose([
    convert(templates),
    fix
  ]);
}
