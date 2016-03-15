const db = require('../db/db.js');
const logger = require('../utils/logger.js')
const userService = require('../service/userService.js')
const status = require('../configs/status.js')


const User = db.User;
const Qa= db.Qa;

const UserCtrl = {};

UserCtrl.index = function* (username) {
  // 通过session得到userid
  const user = yield User.findOne({username: username}, {password: 0});
  yield this.render('user', {user: user})
}

module.exports = UserCtrl;
