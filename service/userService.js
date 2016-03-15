const db = require('../db/db.js');

const userService = {
  checkUser: function* (username) {
    if (username.indexOf('@' == -1)) {
      return yield db.User.findOne({isDel: false, username: username });
    } else {
      return yield db.User.findOne({ isDel: false, email: username });
    }
  }

}
module.exports = userService;