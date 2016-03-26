import chai from 'chai'
import mongoose from 'mongoose'

import User from '../../models/User'
import Qa from '../../models/Qa'
import Comment from '../../models/Comment'
import Notify from "../../models/Notify";


const assert = chai.assert;

let user;
describe('test comment', () => {

  before(async () => {
    mongoose.connect('mongodb://localhost/newQA');
    user = await User.findOne({ username: 'wynfrith' });
    await Comment.remove();
    await Notify.remove({action: 'reply'})
  });
  after(() => mongoose.connection.close());


  it('should create a comment', async () => {
    let answer = await Qa.findOne({type: false});
    let zeyang = await User.findOne({username: '泽仰'});
    if (!answer) throw new Error('answer is null');

    let comment = new Comment({
      authorId: zeyang._id,
      author: zeyang.username,
      qaId: answer._id,
      content: '这是一条评论'
    });
    
    let notify = new Notify({
      type: 'remind',
      target: answer._id,
      targetName: answer.title,
      targetType: 'answer',
      sender: zeyang.username,
      receiver: answer.authorId,
      action: 'reply'
    });
    
    try {
      await comment.save();
      notify = await notify.save();
      assert.equal(notify.sender, '泽仰');
    } catch (err) {
      throw err;
    }
    

  });


  it('should get comment', async () => {
    let comment = await Comment.findOne({});
    assert.equal(comment.content, '这是一条评论');
  })


});


