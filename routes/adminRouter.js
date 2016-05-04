import Router from 'koa-router';

import { list as uList ,detail as uDetail, ban,unBan, remove as uRemove } from '../controllers/UserController'
import { list as tagList, add as addTag, remove as removeTag, edit as editTag } from '../controllers/TagController'
import {
  list as qList,
  remove as removeQuestion
} from '../controllers/QaController'

import AnnounceCtrl from '../controllers/AnnounceController'
import StatisticCtrl from '../controllers/StatisticController'

const router = new Router({ prefix: '/admin'});

router.get('/', async (ctx) => { await ctx.render('admin/index')});


router.get('/user', uList);
router.get('/user/:username', uDetail);
router.post('/user/ban', ban);
router.post('/user/unBan', unBan);
router.post('/user/remove', uRemove);

router.get('/tag', tagList);
router.post('/tag/add', addTag);
router.post('/tag/edit', editTag);
router.post('/tag/remove',removeTag);

router.get('/question', qList);
router.post('/question/remove', removeQuestion);

router.get('/announce', AnnounceCtrl.list);
router.post('/announce', AnnounceCtrl.post);

router.get('/statistics/user', StatisticCtrl.userStatistic)


export default router;