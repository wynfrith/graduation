import Router from 'koa-router';

import { list as uList ,detail as uDetail } from '../controllers/UserController'
import { list as tagList } from '../controllers/TagController'

const router = new Router({ prefix: '/admin'});

router.get('/', async (ctx) => { await ctx.render('admin/index')});

router.get('/user', uList);
router.get('/user/:username', uDetail);

router.get('/tag', tagList);


export default router;