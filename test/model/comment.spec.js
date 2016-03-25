import chai from 'chai'
import mongoose from 'mongoose'

import User from '../../models/User'
import Qa from '../../models/Qa'
import Comment from '../../models/Comment'

const assert = chai.assert;

let user;
describe ('test user', () => {

  before(async () => {
    mongoose.connect('mongodb://localhost/newQA');
    user = await User.findOne({ username: 'wynfrith' });
    await Comment.remove({})
  });
  after(() => mongoose.connection.close());


  it('should create a comment', async () => {
    let answer = await Qa.findOne({type: false});
    if (!answer) throw new Error('answer is null');

    let comment = new Comment({
      authorId: user._id,
      qaId: answer._id,
      content: '谢谢, 这个问题解决了'
    });
    
    try {
      await comment.save()
    } catch (err) {
      throw err;
    }

  });


  it('should get comment', async () => {
    let comment = await Comment.findOne({});
    assert.equal(comment.content, '谢谢, 这个问题解决了');
  })


});


