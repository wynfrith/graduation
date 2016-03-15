const ValidationError = require('mongoose').Error.ValidationError;

const db = require('../db/db.js');
const logger = require('../utils/logger.js')
const userService = require('../service/userService.js')
const status = require('../configs/status.js')


const User = db.User;
const Qa= db.Qa;

const HomeCtrl = {};

HomeCtrl.index = function*() {
  const questions = yield Qa.find({type: true}).sort({ createdAt: -1 }).limit(20);
  logger.debug(questions)
  yield this.render('index', { questions: questions })
}

HomeCtrl.login = function* () {
  const form = this.request.body;
  logger.debug(form);
  if(!form.username) return this.body = { code: 200, msg: status[200].msg }
  if(!form.password) return this.body = { code: 201, msg: status[201].msg }

  const user = yield userService.checkUser(form.username);
  logger.debug("user is:",user);
  if (!user) return this.body = { code: 211, msg: status[211].msg }
  if(form.password !== user.password) return this.body = { code: 210, msg: status[210].msg }

  // 设置用户的session
  this.session.curruser = {
    username: user.username,
    avatorAddress: user.avatorAddress,
    _id: user._id,
  }
  // add to global
  this.render.env.addGlobal('curruser', this.session.curruser)
  return this.body = { code: 0, msg: 'success' }
}

HomeCtrl.logout = function* () {
  this.render.env.addGlobal('curruser', null);
  this.session = null;
  this.redirect('/')
}

HomeCtrl.register = function* () { // TODO: 考虑用户名中有@字符的情况
  const form = this.request.body;
  if (!form.email || !form.username || !form.password)
    return this.body = { code: 222, msg: status[222].msg}

  var user = yield User.findOne({username: form.username});
  if (user) return this.body = { code: 202, msg: status[202].msg }
  user = yield User.findOne({email: form.email})
  if (user) return this.body = { code: 203, msg: status[203].msg }

  user = new User({
    email: form.email,
    username: form.username,
    password: form.password });

  try { yield user.save() }
  catch (e) {
    if (e instanceof ValidationError)
      return this.body = { code: 223, msg: status[223].msg, error: e.errors }
    logger.error(e)
    return this.body = { code: 1, msg: status[1].msg, error: e.errors}
  }
  // logger.debug(`register result: ${result}`)
  return this.body = { code: 0, msg: 'success' }
}


module.exports = HomeCtrl;
