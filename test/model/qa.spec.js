import chai from 'chai'
import mongoose from 'mongoose'

import User from '../../models/User'
import Qa from '../../models/Qa'
import Tag from '../../models/Tag'
import Notify from '../../models/Notify'

const assert = chai.assert;

// async function add(a, b) => { return a+b }

let user;

describe ('test qa', () => {

  before(async () => {
    mongoose.connect('mongodb://localhost/newQA');
    user = await User.findOne({ username: 'wynfrith' });
    await Qa.remove({});
    await Notify.remove({ action: 'answer'});
  });
  after(() => mongoose.connection.close());


  it('should create a Question', async () => {
    let javascriptTag = await Tag.findOne({name: 'javascript'});
    let koaTag = await Tag.findOne({name: 'koa'});
    
    let question = new Qa({
      authorId: user._id,
      author: user.username,
      type: true,
      title: '我来提出一个问题',
      content: '问题正文问题正文问题正文问题正文问题正文问题正文问题正文问题正文问题正文问题正文问题正文问题正文问题正文',
      tags: [javascriptTag.name, koaTag.name],
      like: ['yangtao', 'xiaoheng'],
      hate: ['wynfrith']
    });   

    try {
      question = await question.save();
      assert.equal(question.score, 1);
    } catch (err) {
      throw err;
    }

  });

  it('should create a answer', async () => {
    let yangtao = await User.findOne({ username: 'yangtao'});
    let question = await Qa.findOne({type: true});
    
    //create answer
    let answer = new Qa({
      authorId: yangtao._id,
      author: yangtao.username,
      questionId: question._id,
      title: question.title,
      type: false,
      content: '这个问题还在么，现在应该已经可以了吧',
      isAccept: true,
      like: ['yangtao'],
      hate: ['泽仰', 'wynfrith', 'xiaoheng']
    });
    // 同时产生了一条通知
    let announce = new Notify({
      type: 'remind',
      sender: yangtao.username,
      target: question._id,
      targetName: question.title,
      targetType: 'question',
      receiver:  question.authorId,
      action: 'answer'
    });
    
    try {
      answer = await answer.save();
      announce = await announce.save();
      assert.equal(answer.score, -2);
      assert.equal(announce.sender, 'yangtao');
      assert.equal(announce.target, question._id);
    } catch (err) {
      throw err;
    }
  });

  it('should get a question', async () => {
    let question = await Qa.findOne({type: true});
    assert.equal(question.title, '我来提出一个问题')
  });

  it('should get a answer', async () => {
    let answer = await Qa.findOne({type: false});
    assert.equal(answer.content, '这个问题还在么，现在应该已经可以了吧');
  });


});


