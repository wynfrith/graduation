const koa = require('koa');
const path = require('path')
const colors = require('colors')
const json = require('koa-json')
const serve = require('koa-static')
const morgan = require('koa-morgan')
const bodyparser = require('koa-bodyparser')
const nunjucks = require('koa-nunjucks-2')
const mongoose = require('mongoose');
const session = require('koa-session');

const cfg = require('./configs/config.json')
const routes = require('./routers/index.js')
const db = require('./db/db.js')
const logger = require('./utils/logger.js')


app = koa()
app.keys = ['wynfrith'];

if (cfg.debug) {
  var traceMQuery = function (method, info, query) {
    return function (err, result, millis) {
      if (err) {
        logger.error('traceMQuery error:', err)
      }
      var infos = [];
      infos.push(query._collection.collection.name + "." + method.blue);
      infos.push(JSON.stringify(info));
      infos.push((millis + 'ms').green);

      logger.debug("MONGO".magenta, infos.join(' '));
    };
  };

  mongoose.Mongoose.prototype.mquery.setGlobalTraceFunction(traceMQuery);
}


// middleware
app.use(morgan.middleware('dev'))
app.use(session(app))
app.use(serve(path.join(__dirname, './public')))
app.use(bodyparser())
app.use(json())

app.context.render = nunjucks({
  ext:'html',
  path: path.join(__dirname, './views'),
  nunjucksConfig: {
    watch: true, //debug
    autoescape: true
  }
})

routes(app)

app.listen(cfg.port, () => {
    logger.info('debug mode :)'.blue)
    console.log(`server started on : http://localhost:${cfg.port}\n`);
})
