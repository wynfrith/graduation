import Qa from "../models/Qa";
import {SaveError} from "../utils/error";
import {NotFoundError} from "../utils/error";
import {Ok} from "../utils/error";
/**
 * Created by wyn on 3/25/16.
 */

const QaService = {
  // 除了对qa的增删改查, 还包括点踩, 采纳等特殊操作
  
  createQuestion: async (question, user) => {
    question = new Qa({
      type: true,
      authorId: user._id,
      author: user.username,
      title: question.title,
      content: question.content
    });
    try {
      return Ok(await question.save());
    } catch (err) {
      return SaveError(err)
    }
  },
  // 添加答案同时当前问题答案计数+1
  createAnswer:async (answer, qid, user) => {
    answer = new Qa({
      type: false,
      authorId: user._id,
      author: user.username,
      content: answer.content,
      questionId: qid
    });
    try {
      const question = await Qa.findOne({idDel: false, _id: uid});
      question.answerNum += 1;
      return Ok(await Promise.all([
        question.save(),
        answer.save()
      ]))
    } catch (err) {
      return SaveError(err);
    }
  },

  // 关闭问题
  closeQuestion: async (qid) => {
    try {
      let question = await Qa.findOneAndUpdate(
        {isDel:false, _id: uid}, {isClosed: true}, {runValidators: true});
      return !!question ? Ok(question) : NotFoundError();
    } catch (err) {
      return SaveError(err)
    }
  },

  // 删除question或answer
  deleteQa:async (id) => {
    try {
      let question = await Qa.findOneAndUpdate(
        {isDel:false, _id: uid}, {isDel: true}, {runValidators: true});
      return !!question ? Ok(question) : NotFoundError();
    } catch (err) {
      return SaveError(err)
    }
  },

  //注意不可修改字段
  updateQuestion:async  (qid, question) => {
    try {
      let questioin = await Qa.findOneAndUpdate(
        {isDel: false, _id: qid}, {
          title: question.title,
          content: question.content,
          tags : question.tags
        },{runValidators: true});
    } catch (err) {
      return SaveError(err);
    }
  },
  
  // 保证answer的questionId不可被修改
  updateAnswer:async  (aid, answer) => {
    try {
      let answer = await Qa.findOneAndUpdate(
        { isDel: false, _id: aid },
        { content: answer.content },
        { runValidators: true }
      )
    } catch (err) {
      return SaveError(err);
    }
  },

  getQasByUser:async  (uid, {
    skip = 0,
    limit = 10,
    sort = { createAt: -1 }
  } = {}) => {
    return await Qa.find({isDel: false, authorId: uid })
      .sort({ createAt: -1}).limit(limit).skip(skip);
  },

  getQuestionsByUser:async  (username, {
    page = 1,
    limit = 10,
    sort = { createAt: -1 }
  } = {}) => {
    let skip = (page - 1) * limit;
    skip  = skip > 0 ? skip : 0;

    let filters = {isDel: false, author: username, type: true};
    return await Promise.all([
      Qa.find(filters).sort({ createAt: -1}).limit(limit).skip(skip),
      Qa.find(filters).count()
    ])
  },
  
  getAnswersByUser: async (username, {
    page = 0,
    limit = 0
  } = {}) => {
    let skip = (page - 1) * limit;
    skip  = skip > 0 ? skip : 0;
    
    let filters = {isDel: false, author: username, type:false};
    return await Promise.all([
      Qa.find(filters).sort({ createAt: -1}).limit(limit).skip(skip),
      Qa.find(filters).count()
    ])
  },

  getQuestionById: async (qid) => {
    return await Qa.findOne({isDel: false, _id: qid, type: true});
  },

  getAnswersByQuestion: async (qid) => {
    return await Qa.find({isDel: true, parentId: qid, type: false });
  },
  
  
  getQuestions:async ({page= 1, limit = 10, sort = "", fields = {}} = {}) => {
    let skip = (page - 1) * limit;
    skip  = skip > 0 ? skip : 0;

    if (sort == 'hot') {
      sort = { answerNum: -1,  createdAt: -1 }
    } else {
      sort = { createdAt: -1 }
    }
    let filter = {isDel: false, type: true};
    return await Promise.all([
      Qa.find(filter , fields ).sort(sort).limit(limit).skip(skip),
      Qa.find(filter).count()
    ]);
  },

  searchQuestions: async (text, {page = 1, limit = 10, sort = {createAt: -1}} = {}) => {
    let skip = (page - 1) * limit;
    skip  = skip > 0 ? skip : 0;
    let reg = text ? new RegExp(text, 'i') :'';
    let filters = {isDel: false, type: true};
    return await Promise.all([
      Qa.find(filters).sort(sort).limit(limit).skip(skip).regex('title', reg),
      Qa.find(filters).regex('title', reg).count()
    ])
  },
  
  getRecommendQuestions: async ({limit = 10} = {}) => {
    let sort = { like: -1 , createdAt: -1};
    let fields = {title: 1, hate: 1, like: 1};
    return await Qa.find({isDel: false, type: true}, fields).sort(sort).limit(limit);
  },

  // 如果答案已经被采纳, 则取消采纳
  adoptAnswer:async  (aid) => {
    let answer = await Qa.findOne({isDel: false, type: false, _id: aid});
    if (!answer) return NotFoundError();
    answer.isAccept = !answer.isAccept;
    try {
      return Ok(answer.save());
    }
     catch (err) {
      return SaveError(err);
    }

  },
  
  // 如果是讨厌, isLike为false. 若该答案或问题已被讨厌或喜欢, 则取消
  likeOrHate:async  (qaId, isLike = true) => {
    let qa = qaId.findOne({isDel: false, _id: qaId});
    if (!qa) return NotFoundError();
    if (isLike) {
      qa.like = !qa.like;
    } else {
      qa.hate = !qa.hate
    }
    try {
      return Ok(qa.save());
    } catch (err) {
      return SaveError(err);
    }
    
  }


  
};

export default QaService;
