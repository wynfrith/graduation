import Router from 'koa-router';
import UserService from '../services/UserService';
import QaService from "../services/QaService";
import TagService from "../services/TagService";
// rest接口, 提供前端api
const router = new Router({ prefix: '/api'});
export default router;

// 问题列表 TODO: 标签类型
router.get('/q/list', async (ctx) => {
  let limit = ctx.query.limit || 3;
  let [questions, count] = await QaService.getQuestions({
    page: ctx.query.page,
    limit: limit,
    sort: ctx.query.sort,
    fields: {tags: 1, answerNum: 1, views: 1, title: 1, author: 1, updatedAt: 1, createdAt: 1, like: 1, hate: 1}
  });
  ctx.body = { 
    questions: questions, 
    page: {
      currPage: +ctx.query.page || 1,
      pageNum: Math.ceil(count / limit),
      count: count
    }
  }
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
  ctx.body = { questions: questions[0], answers: answers[0] };
});

// 获取用户提出的问题
router.get('/u/:uid/questions', async (ctx) => {
  let limit = ctx.query.limit || 10;
  let [questions, count] = await QaService.getQuestionsByUser(ctx.params.uid, {
    page: ctx.query.page,
    limit: limit
  });
  ctx.body = {
    questions: questions,
    page: {
      currPage: +ctx.query.page || 1,
      pageNum: Math.ceil(count / limit),
      count: count
    }
  }
});

// 获取用户回答的答案
router.get('/u/:uid/answers', async (ctx) => {
  let limit = ctx.query.limit || 10;
  let [questions, count] = await QaService.getAnswersByUser(ctx.params.uid, {
    page: ctx.query.page,
    limit: limit
  });
  ctx.body = {
    questions: questions,
    page: {
      currPage: +ctx.query.page || 1,
      pageNum: Math.ceil(count / limit),
      count: count
    }
  }
});



// 搜索 ( ?text=....&type = ['question', 'user', 'tag'] )
router.get('/search', async (ctx) => {
  let limit = ctx.query.limit || 10;
  let page = ctx.query.page;
  let result, count;
  switch (ctx.query.type) {
    case 'question':
      [result, count] = await QaService.searchQuestions(ctx.query.text, {page: page, limit: limit});
      break;
    case 'user':
      [result, count]= await UserService.searchGeneralUsers(ctx.query.text,{page: page, limit: limit});
      break;
    case 'tag':
      [result, count] = await TagService.searchTags(ctx.query.text,{page: page, limit: limit});
      break;
    default:
      [result, count] = await QaService.searchQuestions(ctx.query.text,{page: page, limit: limit});
  }
  ctx.body = {
    result: result,
    page: {
      currPage: +ctx.query.page || 1,
      pageNum: Math.ceil(count / limit),
      count: count
    }
  }
  
});

// TODO: 数据
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

// 登陆
router.post('/login', async (ctx) => {
  const form = ctx.request.body;
  // 判断username or email
  if(!form.username || !form.password) {
    return ctx.body = {code: 1, msg: '登陆失败'}
  }
  const user = await UserService.getUserByName(form.username);
  if(!user) {
    return ctx.body = {code: 1, msg: '该用户不存在'}
  }
  const isValid = await UserService.isValid(user, form.password);
  if(!isValid) {
    return ctx.body = { code: 1, msg: '密码错误'}
  }
  // TODO: 生成 token, 并写入session或local storage
  ctx.body = { code: 0, token: '12123123' };
});

// 注册
router.post('/register', async (ctx) => {
  const form = ctx.request.body;
  if(!form.username || !form.email || !form.password ) {
    return ctx.body = { code: 1, msg: '请认真填写表单,亲' }
  }
  const [u1, u2] = await Promise.all([
    UserService.getUserByName(form.username),
    UserService.getUserByEmail(form.email)
  ]);
  if(u1) return ctx.body = { code: 1, msg: '用户名已存在'};
  if(u2) return ctx.body = { code: 1, msg: '邮箱已存在'};

  const res = await UserService.register({
    username: form.username,
    password: form.password,
    email: form.email
  });
  if (res.code != 0) {
    return ctx.body = { code: 1, msg: '注册失败', errors: res.errors };
  }
  // 同样生成一个token, 发送给前端
  ctx.body = { code: 0 , token: '1231311'};
  
});


// 投票(喜欢点赞)


// 评论



// 注销

// 修改个人资料

// 修改邮箱 (发送邮件)

// 修改密码 (发送邮件)

// 找回密码 (发送邮件)

// 修改头像





