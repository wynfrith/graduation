import path from 'path'
import Koa from 'koa'
import mongoose from 'mongoose'
import convert from 'koa-convert'
import cors from 'kcors'
import morgan from 'koa-morgan'
import serve from 'koa-static'
import favicon from 'koa-favicon'
import etag from 'koa-etag'
import conditional from 'koa-conditional-get'

import router from './routes/router';
import adminRouter from './routes/adminRouter';
import apiRouter from './routes/apiRouter'
import errorHandler from './middlewares/errorHandler'
import nunjucks from './middlewares/nunjucks-2'

import dateFilter from './utils/filters/dateFilter'

const app = new Koa();


// middleware
app.use(morgan('dev'));
app.use(conditional());
app.use(etag());
app.use(cors());


app.use(serve(path.join(__dirname, '/public')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
// app.use(nunjucks());

app.use(nunjucks({
  ext: 'html',
  path: path.join(__dirname, 'views'),
  nunjucksConfig: {
    autoescape: true,
    watch: true
  },
  configureEnvironment: (env) => {
    env.addFilter('dateFilter', dateFilter);
  }
}));



app.use(errorHandler());

// routes
app
  .use(router.routes())
  .use(router.allowedMethods());

app.use(apiRouter.routes())
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

