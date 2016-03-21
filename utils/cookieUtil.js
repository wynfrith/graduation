'use strict'
const util = require('util')
const crypto = require('crypto')
const cfg = require('../configs/config.json')

// 解析cookie数组
const cookieParser = (arr) => {
  if (util.isArray(arr)) {
    const cookies = {}

    arr.forEach((str) => {
      str = str.substr(0, str.indexOf(';'))
      var kv = str.split('=');
      cookies[kv[0]] = kv[1];
    })

    return cookies;
  }
}

// cookie 加密
const cookieEncode = (str) => {
  if(util.isObject(str) || util.isArray(str)) str = JSON.stringify(str)
  str = str + cfg.cookie.symbol + (new Date().getTime() + cfg.cookie.expiredTime);
  console.time('encode')
  const cipher = crypto.createCipher(cfg.cookie.algorithm, cfg.cookie.key);
  var hash = cipher.update(str, 'utf8', 'hex');
  hash += cipher.final('hex');
  console.timeEnd('encode')
  return hash
}

// cookie解密
const cookieDecode = (cookieStr) => {
  console.time('decode')
  const decipher = crypto.createDecipher(cfg.cookie.algorithm, cfg.cookie.key);
  var str = decipher.update(cookieStr, 'hex', 'utf8');
  str += decipher.final('utf8');
  console.timeEnd('decode')
  return str;
}

exports.cookieParser = cookieParser;
exports.cookieEncode = cookieEncode;
exports.cookieDecode = cookieDecode;
