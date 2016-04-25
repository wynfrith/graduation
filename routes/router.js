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
    ctx.redirect('http://127.0.0.1:8080/#!/verify?type=ok')
  } else {
    ctx.redirect('http://127.0.0.1:8080/#!/verify');
  }
});


export default router;