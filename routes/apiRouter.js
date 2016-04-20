import Router from 'koa-router';
import UserService from '../services/UserService';
import QaService from "../services/QaService";
import TagService from "../services/TagService";
// rest接口, 提供前端api
const router = new Router({ prefix: '/api'});
export default router;

// 问题列表 TODO: 分页, 标签类型
router.get('/q/list', async (ctx) => {
  ctx.body = await QaService.getQuestions({
    sort: ctx.query.sort,
    fields: {tags: 1, answerNum: 1, views: 1, title: 1, author: 1, updatedAt: 1, createdAt: 1, like: 1, hate: 1}
  });
});

// 推荐问题
router.get('/q/recommends', async (ctx) => {
  ctx.body =  await QaService.getRecommendQuestions();
});

// 获取问题和所属的答案
router.get('/question/:id', async (ctx) => {
  let q = await QaService.getQuestionById(ctx.params.id);
  let [question, answers] =await Promise.all([
    QaService.getQuestionById(ctx.params.id),
    QaService.getAnswersByQuestion(ctx.params.id)
  ]);
  console.info(question);
  ctx.body = {question: question, answers: answers};
});

// 获取所有标签
router.get('/tags', async (ctx) => {
  ctx.body = await TagService.getTags();
});

// 获取热门标签名称
router.get('/hotTags', async (ctx) => {
  ctx.body = await TagService.getHotTags()
});


// 获取用户的摘要信息
router.get('/u/:username/brief', async (ctx) => {
  ctx.body = await UserService.getUserBrief(ctx.params.username)
});

// 获取用户信息 
router.get('/u/:username', async (ctx) => {
  ctx.body = await UserService.getUserByName(ctx.params.username);
});

// 获取用户发布的信息汇总
router.get('/u/:uid/news', async (ctx) => {
  let [questions, answers] = await Promise.all([
    QaService.getQuestionsByUser(ctx.params.uid, {limit: 5}),
    QaService.getAnswersByUser(ctx.params.uid, {limit: 5})
  ]);
  ctx.body = { questions: questions, answers: answers };
});

// 获取用户提出的问题 TODO: 分页
router.get('/u/:uid/questions', async (ctx) => {
  ctx.body = await QaService.getQuestionsByUser(ctx.params.uid);
});

// 获取用户回答的答案 TODO: 分页
router.get('/u/:uid/answers', async (ctx) => {
  ctx.body = await QaService.getAnswersByUser(ctx.params.uid);
});

// TODO: 明天写下面的
// 提交答案
router.post('/answer', async (ctx) => {
  console.info(ctx.request.body);
  ctx.body = { code: 0 };
  // await  QaService.createAnswer()
});

// 提交问题
router.post('/question', async (ctx) => {
  console.info(ctx.request.body);
  ctx.body = { code: 0 };
});


// 搜索 ( ?type = ['question', 'user', 'tag'] )

// 投票(喜欢点赞)

// 评论

// 登陆

// 注册

// 注销

// 修改个人资料


// 修改邮箱 (发送邮件)

// 修改密码 (发送邮件)

// 找回密码 (发送邮件)

// 修改头像

