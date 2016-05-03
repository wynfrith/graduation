import Router from 'koa-router';

import jwt from 'koa-jwt';
import UserService from '../services/UserService'


const router = new Router();

router.get('/', async (ctx) => {
  await ctx.render('index');
});

router.get('/verify', async (ctx) => {
  const token = ctx.query.token;
  console.log('mail token: ', token);
  let res = UserService.verifyEmailToken(token);
  if(res) {
    res = await UserService.activeUser(res.id);
    ctx.redirect('/#!/verify?type=ok')
  } else {
    ctx.redirect('/#!/verify');
  }
});

router.get('/logout', async (ctx) => {
  ctx.session.user = null;
  ctx.redirect('/login');
});
router.get('/login', async (ctx) => { await ctx.render('admin/login')});
router.post('/login', async (ctx) => {
  let {username, password} = ctx.request.body;
  if(!username || !password) {
    return ctx.body = {code: 1, msg: '请输入用户名或密码'}
  }
  const user = await UserService.getUserByName(username);
  if(!user || user.role != 'admin') {
    return ctx.body = {code: 1, msg: '该用户不存在'}
  }
  const isValid = await UserService.isValid(user, password);
  if(!isValid) {
    return ctx.body = {code: 1, msg: '密码错误'}
  }
  // 加入session
  ctx.session.user = {
    username: user.username,
    avatar: user.info.photoAddress
  };
  return ctx.body = { code: 0 };
});


export default router;