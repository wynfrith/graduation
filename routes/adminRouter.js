import Router from 'koa-router';

import UserService from "../services/UserService";

const router = new Router({ prefix: '/admin'});

router.get('/', async (ctx) => { await ctx.render('admin/index')});

router.get('/user', async ctx => { await ctx.render('admin/user')});


export default router;