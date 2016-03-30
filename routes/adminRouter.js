import Router from 'koa-router';

import { list as uList ,detail as uDetail } from '../controllers/UserController'

const router = new Router({ prefix: '/admin'});

router.get('/', async (ctx) => { await ctx.render('admin/index')});

router.get('/user', uList);
router.get('/user/:username', uDetail);


export default router;