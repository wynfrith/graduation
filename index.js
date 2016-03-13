const koa = require('koa');
const path = require('path')
const colors = require('colors')
const json = require('koa-json')
const serve = require('koa-static')
const morgan = require('koa-morgan')
const nunjucks = require('koa-nunjucks-2')

const cfg = require('./configs/config.json')
const routes = require('./routers/index.js')
const db = require('./db/db.js')
const logger = require('./utils/logger.js')


app = koa()

// middleware
app.use(morgan.middleware('dev'))
app.use(serve(path.join(__dirname, './public')))
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
