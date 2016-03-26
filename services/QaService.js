/**
 * Created by wyn on 3/25/16.
 */

const QaService = {
  // 除了对qa的增删改查, 还包括点踩, 采纳等特殊操作
  
  createQuestion: (question) => {},
  createAnswer: (answer, qid) => {},
  
  // 删除question或answer
  removeQa: (id) => {},

  //注意不可修改字段
  updateQuestion: (qid, question) => {},
  // 保证answer的questionId不可被修改
  updateAnswer: (aid, answer) => {},

  getQuestionById: (qid) => {},
  getAnswersByQuestion: (qid) => {},
  
  getQuestions: (skip = 0, limit = 10) => {},
  getQuestionsByUser: (skip = 0, limit = 10) => {},
  getAnswersByUser: (skip = 0, limit = 10) => {},

  // 如果答案已经被采纳, 则取消采纳
  adoptAnswer: (answer) => {},
  
  // 如果是讨厌, isLike为false. 若该答案或问题已被讨厌或喜欢, 则取消
  likeOrHate: (qaId, isLike = true) => {},


  
};

export default QaService;
