import Router from 'koa-router';

import User from '../models/User'
import Tag from '../models/Tag';

import NotifyService from '../services/NotifyService'

const router = new Router();

router.get('/', (ctx) => { ctx.body = 'hello world' });

router.get('/nunjucks', async ctx => await ctx.render('index'));

router.get('/user/:username', async (ctx) => {
  await NotifyService.createAnnounce();
  ctx.body = { params: ctx.params };
});

export default router;