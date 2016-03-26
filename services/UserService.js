/**
 * Created by wyn on 3/25/16.
 */
const UserService = {

 getUserByName: (username) => {},
 
 getUserById: (uid) => {},
 
 // 登陆验证
 validate: (username, password) => {},

 validateByEmail: (email, password) => {},

 register: (user) => {},

 // 用户修改资料, 注意role其他一些非法变量的过滤
 updateUser: (uid, user) => {},

 deleteUser: (uid) => {},

 // 查询isdel = false的
 getUsers: (skip, limit = 10) => {},
 
 getUsersCount: () => {}

 
};

export default UserService;