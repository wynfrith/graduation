/**
 * Created by wyn on 5/4/16.
 */

import chai from 'chai'
import mongoose from 'mongoose'
const assert = chai.assert;

import NotifyService from '../../services/NotifyService'
import Qa from '../../models/Qa'
import User from '../../models/User'
import  Subscription from '../../models/Subscription'

describe.only('test remind notifys', () => {
  before(async () => {
    mongoose.connect('mongodb://localhost/newQA');
  });
  after(async () => mongoose.connection.close());

  it('should create some subscription', async() => {
    let question = await Qa.findOne({title: '测试markdown的渲染情况?'});
    let wynfrith = await User.findOne({ username: 'wynfrith' });
    let yangtao = await User.findOne({ username: 'yangtao' });
    NotifyService.subscribe(wynfrith._id, question._id, 'question');
    NotifyService.subscribe(yangtao._id, question._id, 'question');
    NotifyService.subscribe(yangtao._id, question._id, 'question');
    assert.equal(await Subscription.count(),2);
    // NotifyService.subscribe(wynfrith._id, question._id, 'question');
  });

  it.skip('should create remind for all  subscribed people', async () => {
    // createRemind (target, targetType, sender, action, content) {
    // 例如, 泽仰 在 测试markdown的渲染情况? 发表了一篇新答案, 它首先会生成remind, 然后订阅这个问题
    let question = await Qa.findOne({title: '测试markdown的渲染情况?'});
    let zeyang = await User.findOne({ username: '泽仰' });
    NotifyService.createRemind(question._id, 'question', '泽仰', 'answer', '<a >泽仰</a> 回答了问题 <a>测试markdown的渲染情况?</a>')
  });

  it.only('should pull remind', async () => {
    let wynfrith = await User.findOne({ username: 'wynfrith' });
    await NotifyService.pullRemind(wynfrith._id);
    let notifies = await NotifyService.getUserNotify(wynfrith._id);
    // console.log(notifies);
    // assert.equal(notifies.length, 1);
  });


  
  // 管理员发给用户的公告
  // it('should create a announce by wynfrith', async () => {
  //   let wynfrith = await User.findOne({ username: 'wynfrith' });
  //   let announce = new Notify({
  //     content: '这是一条来自系统的通知',
  //     type: 'announce',
  //     sender: wynfrith.username
  //   });
  //   await announce.save();
  //   assert.equal(announce.sender, 'wynfrith')
  // });


});