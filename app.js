import path from 'path'
import Koa from 'koa'
import mongoose from 'mongoose'
import convert from 'koa-convert'
import logger from 'koa-logger'
import serve from 'koa-static'
import favicon from 'koa-favicon'

import router from './routes/router';
import adminRouter from './routes/adminRouter';
import errorHandler from './middlewares/errorHandler'
import nunjucks from './middlewares/nunjucks-2'

const app = new Koa();


// middleware
app.use(convert(logger()));
app.use(serve(path.join(__dirname, '/public')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
// app.use(nunjucks());

app.use(nunjucks({
  ext: 'html',
  path: path.join(__dirname, 'views'),
  nunjucksConfig: {
    autoescape: true,
    watch: true
  }
}));

app.use(errorHandler());

// routes
app
  .use(router.routes())
  .use(router.allowedMethods());

app
  .use(adminRouter.routes());

// app start
if(path.resolve('index.js') === module.parent.filename){
  mongoose.set('debug', true);
  mongoose.connect('mongodb://localhost/newQA');

  app.listen(3000, () => console.log('server started http://localhost:3000'));
}


export default app

