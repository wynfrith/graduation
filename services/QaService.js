import Qa from "../models/Qa";
import User from '../models/User'
import {SaveError, NotFoundError, Ok} from "../utils/error";
/**
 * Created by wyn on 3/25/16.
 */

const QaService = {
  // 除了对qa的增删改查, 还包括点踩, 采纳等特殊操作
  getQuestionCount: async () => {
    return await Qa.count({isDel:false, type: true});
  },
  getAnswerCount: async () => {
    return await Qa.count({isDel:false, type: false});
  },
  getViews: async () => {
    let num = 0;
    let qas = await Qa.find({isDel: false, type: true}, {views: 1});
    for(let qa of qas) {
      num += qa.views;
    }
    return num;
  },
  
  createQuestion: async (title, content, tagArray, user) => {
    const question = new Qa({
      type: true,
      authorId: user._id,
      author: user.username,
      authorAvatar: user.info.photoAddress,
      title: title,
      content: content,
      tags: tagArray
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
      authorAvatar: user.info.photoAddress,
      content: answer.content,
      questionId: qid
    });
    try {
      const question = await Qa.findOne({isDel: false, _id: qid});
      question.answerNum += 1;
      return Ok(await Promise.all([
        question.save(),
        answer.save()
      ]))
    } catch (err) {
      return SaveError(err);
    }
  },
  createComment:async (content, id, user) => {
    const comment = {
      author: user.username,
      authorAvatar: user.info.photoAddress,
      content: content
    };

    try {
      const qa = await Qa.findOne({isDel: false, _id: id});
      qa.comments.push(comment);
      return Ok(await qa.save());
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
        {isDel:false, _id: id}, {isDel: true});
      return !!question ? Ok(question) : NotFoundError();
    } catch (err) {
      return SaveError(err)
    }
  },

  //注意不可修改字段
  updateQuestion:async  (qid, question) => {
    try {
      let question = await Qa.findOneAndUpdate(
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
    limit = 5,
    sort = { createAt: -1 }
  } = {}) => {
    let skip = (page - 1) * limit;
    skip  = skip > 0 ? skip : 0;
    console.log('limit'+limit);

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
    let question = await Qa.findOne({_id: qid, type: true});
    console.log(question);
    // TODO 浏览量计数, 可换为redis
    try {
      question.views += 1;
      await question.save();
    } catch(err) {
      console.log(err);
    }
    return question;
  },

  getAnswersByQuestion: async (qid) => {
    return await Qa.find({isDel: false, questionId: qid, type: false });
  },
  
  
  getQuestions:async ({page= 1, limit = 10, tag, sort = "", fields = {}} = {}) => {
    let skip = (page - 1) * limit;
    skip  = skip > 0 ? skip : 0;

    if (sort == 'hot') {
      sort = { answerNum: -1,  createdAt: -1 }
    } else {
      sort = { createdAt: -1 }
    }

    let filter = {isDel: false, type: true};
    if (tag) {
      filter['tags'] = {
        "$in": [tag]
      }
    }
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
      return Ok(await answer.save());
    }
     catch (err) {
      return SaveError(err);
    }

  },
  
  // 如果是讨厌, isLike为false. 若该答案或问题已被讨厌或喜欢, 则取消
  likeOrHate:async  (qaId, currUser, isLike = true) => {
    let qa = await Qa.findOne({isDel: false, _id: qaId}); 
    if (!qa) return NotFoundError();
    
    let author = await User.findOne({username: qa.author, isDel: false});
    try {
    let likeIndex = qa.like.indexOf(currUser);
    let hateIndex = qa.hate.indexOf(currUser);
    if (isLike) {
      if (hateIndex != -1) { //cancel hate
        qa.hate.splice(hateIndex, 1);
        await qa.save();
        return {data:{ code: 0, type: 'hate', status:0, msg:'您取消了踩', username: currUser}, qa: qa}
      }
      if (likeIndex == -1) {
        author.scores += 1;
        author.save();
        qa.like.push(currUser);
        await qa.save();
        return {data:{code: 0, type: 'like', status:1, msg: '你赞了一下', username: currUser }, qa:qa}
      } else {
        author.scores -= 1;
        author.save();
        qa.like.splice(likeIndex, 1);
        await qa.save();
        return {data:{code: 0, type: 'like', status:0, msg: '你取消了赞', username: currUser }, qa:qa}
      }
    } else {
      if (likeIndex != -1) { //cancel like
        author.scores -= 1;
        author.save();
        qa.like.splice(likeIndex, 1);
        await qa.save();
        return {data:{ code: 0, type: 'like', status:0, msg:'您取消了赞', username: currUser  }, qa:qa}
      }
      if (hateIndex == -1) {
        qa.hate.push(currUser);
        await qa.save();
        return {data:{code: 0, type: 'hate', status:-1, msg: '你踩了一下', username: currUser }, qa:qa}
      } else {
        qa.hate.splice(hateIndex, 1);
        await qa.save();
        return {data:{code: 0, type: 'hate', status:0, msg: '你取消了踩', username: currUser }, qa:qa}
      }
    }
    } catch (err) {
      return SaveError(err);
    }
    
  },

  updateAvatar: async (author, avatar) => {
    try {
      let res = await Qa.update({ author: author, isDel: false },
       { authorAvatar: avatar}, { multi: true });
      return Ok(res);
    } catch (err) {
      return SaveError(err);
    }
    
    // find all and update
  },
  updateCommentAvatar: async (author, avatar) => {
    try {
      // TODO n方基本修改, 日后优化
      let qa =await Qa.find({ 'comments.author': author, isDel: false }); // TODO: 其中有一条,而不是第一条
      for(let i of qa) {
        i.comments = i.comments.map((comment) => {
          if (comment.author == author) {
            comment.authorAvatar = avatar
          }
          return comment;
        });
        i.save();

      }
      return Ok(res);
    } catch (err) {
      return SaveError(err);
    }
  }
};

export default QaService;
