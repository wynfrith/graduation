import chai from 'chai'
import mongoose from 'mongoose'

import User from '../../models/User'
import Qa from '../../models/Qa'
import Comment from '../../models/Comment'
import Notify from '../../models/Notify'

const assert = chai.assert;

/**
 */
describe('test announce', () => {
  before(async () => {
    mongoose.connect('mongodb://localhost/newQA');
    await Notify.remove({type: 'announce'})
  });
  after(async () => mongoose.connection.close());

  // 管理员发给用户的公告
  it('should create a announce by wynfrith', async () => {
    let wynfrith = await User.findOne({ username: 'wynfrith' });
    let announce = new Notify({
      content: '这是一条来自系统的通知',
      type: 'announce',
      sender: wynfrith.username
    });
    await announce.save();
    assert.equal(announce.sender, 'wynfrith')
  });


});


describe('test remind', () => {

});
