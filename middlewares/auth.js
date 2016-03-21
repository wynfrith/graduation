'use strict'

const cfg = require('../configs/config.json')
const logger = require('../utils/logger.js')
const cookieDecode = require('../utils/cookieUtil.js').cookieDecode;
const userService = require('../service/userService.js')

const auth = (options)=> {

  // TODO: 把user和admin的权限认证分开
  /**
    * @param {Object} options
    * {Array} rules 需要权限的url array, 支持字符串和正则表达式
    */
  return function* (next) {
    const rules = [/^\/user\//, '/auth'];

    //recover session
    if(this.cookies.get('token')) {
      const token = this.cookies.get('token');
      logger.debug(`token is ${token}`)
      try {
        const arr = cookieDecode(token).split(cfg.cookie.symbol);
        const expTime = arr[1];
        if (expTime > new Date().getTime()) {
          const uid = JSON.parse(arr[0])
          const user = yield userService.getUserById(uid);
          logger.debug(user)
          if(!user) throw new Error(`user not found, uid = ${uid}`)
          this.session.curruser = user;
          yield next;
        }
      } catch (e){
        logger.info(e);
      }
    }

    // 判断当前路由是否需要授权访问
    var needAuth = false;
    for (var rule of rules) {
      if ((rule instanceof(RegExp) && rule.test(this.path)) || rule === this.path) {
        needAuth = true;
        break;
      }
    }

    if (!needAuth) {
      logger.debug('this url don\'t need auth')
      yield next;
    } else {
      if (this.session.curruser) {
         logger.debug('you can visit this url')
          yield next;
      } else {
        logger.debug('you need login')
        this.redirect(`/login?redirect=%2F`);
      }
    }
  }
}

module.exports = auth;
