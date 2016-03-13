const route = require('koa-route')
const logger = require('../utils/logger.js')

// controllers
const HomeCtrl = require('../controller/HomeCtrl.js')

const routes = function (app) {
  // home page
  app.use(route.get('/', HomeCtrl.index))

  // json test
  app.use(route.get('/json', function*() { this.body = { json: true }}))

}

module.exports = routes;
