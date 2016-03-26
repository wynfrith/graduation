import Router from 'koa-router';

import User from '../models/User'
import Tag from '../models/Tag';

import NotifyService from '../services/NotifyService'
import UserService from "../services/UserService";

const router = new Router();

router.get('/', (ctx) => { ctx.body = 'hello world' });

router.get('/nunjucks', async ctx => await ctx.render('index'));

router.get('/user/:username', async (ctx) => {
  let users = await UserService.getUsers();
  ctx.body = { params: ctx.params };
});

export default router;