const route = require('koa-route')
const logger = require('../utils/logger.js')

// controllers
const HomeCtrl = require('../controller/HomeCtrl.js')
const UserCtrl = require('../controller/UserCtrl.js')
const QaCtrl = require('../controller/QaCtrl.js')

const routes = function (app) {
  // home page
  app.use(route.get('/', HomeCtrl.index))

  app.use(route.get('/login', function*() { yield this.render('login') }))
  app.use(route.post('/login', HomeCtrl.login))
  app.use(route.get('/logout', HomeCtrl.logout))

  app.use(route.get('/register', function*() { yield this.render('register') }))
  app.use(route.post('/register', HomeCtrl.register))

  // user page
  app.use(route.get('/u/:username', UserCtrl.index))

  // question page
  app.use(route.get('/q/:qid', QaCtrl.question))
  app.use(route.get('/ask', function* () { yield this.render('ask') }))
  app.use(route.post('/ask', QaCtrl.ask))

  // json test
  app.use(route.get('/json', function*() { this.body = { json: true }}))

}

module.exports = routes;
