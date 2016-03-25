import path from 'path'
import Koa from 'koa'
import mongoose from 'mongoose'
import convert from 'koa-convert'
import logger from 'koa-logger'

import router from './routes/router';
import nunjucks from './middlewares/nunjucks'
import errorHandler from './middlewares/errorHandler'

const app = new Koa();


// middleware
app.use(convert(logger()));
app.use(nunjucks());
app.use(errorHandler());

// routes
app
  .use(router.routes())
  .use(router.allowedMethods());

// app start
if(path.resolve('index.js') === module.parent.filename){
  mongoose.set('debug', true);
  mongoose.connect('mongodb://localhost/newQA');

  app.listen(3000, () => console.log('server started http://localhost:3000'));
}


export default app

