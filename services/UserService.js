import User from "../models/User";
import {SaveError, Ok, NotFoundError} from "../utils/error";
import koaJwt from 'koa-jwt'
import cfg from '../config'
/**
 * Created by wyn on 3/25/16.
 */
const UserService = {

  getUserByName: async (username) => {
    return await User.findOne({ isDel: false, username: username });
  },
  getUserBrief: async (username) => {
    return await User.findOne({isDel: false, username: username}, {
      username: 1,
      role: 1,
      email: 1,
      'info.photoAddress': 1,
      'info.brief': 1
    })
  },
  getUserById: async (uid) => {
    return await User.findOne({ isDel: false, _id: uid });
  },
  
  getUserByEmail: async(email) => {
    return await User.findOne({ isDel:  false, email: email });
  },

 // 生成token
  genToken: (user) => {
    const id = user._id;
    return koaJwt.sign({id: user._id}, cfg.secret);
  },
  // 登陆验证
  isValid: (user, password) => {
    return user.password == password;
  },


  register: async (user) => {
    user.role = 'user';
    user = new User(user);
    try {
      return Ok(await user.save());
    } catch (err) {
      return SaveError(err);
    }
  },
  
  registerAdmin: async (admin) => {
    admin.role = 'admin';
    let user = new User(admin);
    try {
      return Ok(await user.save());
    } catch (err) {
      return SaveError(err);
    }
  },

  // 用户修改info资料,返回的是未修改前的信息
  updateInfo: async (uid, user) => {
    let info = user.info; // 只修改info信息
    try { 
      let user = await User.findOneAndUpdate(
        {isDel: false, _id: uid}, { info: info },{runValidators: true});
      return !!user ? Ok(user) : NotFoundError();
    } catch (err) {
      return SaveError(err);
    }
  },

  updatePassword: async (uid, password) => {
    try {
      let user = await User.findOneAndUpdate(
        {isDel:false, _id: uid}, { password: password }, {runValidators: true});
      return !!user ? Ok(user) : NotFoundError();
    } catch (err) {
      return SaveError(err)
    }
  },

  deleteUser: async (uid) => {
    try {
      let user = await User.findOneAndUpdate(
        {isDel: false, _id: uid}, { isDel: true });
      return !!user ? Ok(user) : NotFoundError();
    } catch (err) {
      return SaveError(err);
    }
  },

  deleteUserForce: async (uid) => {
    try {
      let user = await User.findOneAndRemove({_id: uid});
      return !!user ? Ok(user) : NotFoundError();
    } catch (err) {
      return SaveError(err);
    }

  },

  //查询isdel = false的, bylasttime
  getUsers: async ({ page = 1,limit = 10, search = '', sort = { createAt: -1 }, filter = {}} = {}) => {
    filter.isDel = false;
    const f = {};
    

    // 计算skip
    let skip = (page - 1) * limit;
    skip  = skip > 0 ? skip : 0;
    
    for(let [k,v] of Object.entries(filter)) 
      if (v != undefined) f[k] = v;

    // search
    let reg = '';
    if (search) {
      reg = new RegExp(search, 'i');
    }
    return await Promise.all([
      User.find(f).sort(sort).limit(limit).skip(skip).regex('username',reg),
      User.find(f).regex('username', reg).count()
      ])
  },
  searchGeneralUsers : async (text, { page = 1, limit = 10 , sort = { createdAt: -1}} = {}) => {
    let skip = (page - 1) * limit;
    skip  = skip > 0 ? skip : 0;
    let reg = text ? new RegExp(text, 'i') : '';

    let filters = {isDel: false, role:'user'};
    return await Promise.all([
      User.find(filters).sort(sort).limit(limit).skip(skip).regex('username', reg),
      User.find(filters).regex('username', reg).count()
    ]);
  },
  getUsersCount: async () => {
    return await User.count({isDel: false})
  }


};

export default UserService;