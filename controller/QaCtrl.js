const url = require('url')

const db = require('../db/db.js');
const logger = require('../utils/logger.js')
const userService = require('../service/userService.js')
const status = require('../configs/status.js')


const User = db.User;
const Qa= db.Qa;

const QaCtrl= {};

// 问题详情
QaCtrl.question = function* (qid) {
  const question = yield Qa.findOne({isDel: false, type: true, _id: qid});
  const answers = yield Qa.find({isDel: false, type: false, questionId: qid});
  logger.debug(question)
  yield this.render('question', { question: question, answers: answers})
}

// 提交问题
QaCtrl.ask = function* () {
  const curruser = this.session.curruser;
  logger.debug(curruser)

  const form = this.request.body;
  if (!form.title || !form.tags || !form.content)
    return this.body = { code: 222, msg: status[222].msg }

  // parse tags TODO://需要加强tags验证
  const tags = form.tags.split(';');

  const question = new Qa({
    authorId: curruser._id,
    authorName:curruser.username,
    type: true,
    title: form.title,
    content: form.content,
    tags: tags
  });
  try{
    yield question.save()
  } catch(e) {
    return this.body = { code: 1, error: e }
  }
  this.redirect('/')
}

// 提交答案
QaCtrl.answer  = function* (){
  const curruser = this.session.curruser;
  console.log(this.req.path);
  console.log(this.path);

  logger.debug(curruser)
  const form = this.request.body;
  if (!form.content || !form.qid)
    return this.body = { code: 222, msg: status[222].msg }

  const answer = new Qa({
    authorId: curruser._id,
    authorName: curruser.username,
    questionId: form.qid,
    type: false,
    content: form.content
  })

  try {
    yield answer.save();
  } catch (e) {
    logger.error(e);
    return this.body = { code: 1, msg: status[1].msg, error: e}
  }
  this.redirect(`/q/${form.qid}`)
}


module.exports = QaCtrl;
