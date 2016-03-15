const db = require('../db/db.js');
const logger = require('../utils/logger.js')
const userService = require('../service/userService.js')
const status = require('../configs/status.js')


const User = db.User;
const Qa= db.Qa;

const QaCtrl= {};

QaCtrl.question = function* (qid) {
  const question = yield Qa.findOne({type: true, _id: qid});
  logger.debug(question)
  yield this.render('question', { question: question })
}

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


module.exports = QaCtrl;
