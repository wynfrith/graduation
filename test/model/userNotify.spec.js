import chai from 'chai'
import mongoose from 'mongoose'

import User from '../../models/User'
import Qa from '../../models/Qa'
import Comment from '../../models/Comment'
import Notify from "../../models/Notify";
import UserNotify from '../../models/UserNotify'

const assert = chai.assert;

describe('user notity test', () => {
  before(async () => {
    mongoose.set('debug',  true);
    mongoose.connect('mongodb://localhost/newQA');
    await UserNotify.remove();
  });
  after(() => mongoose.connection.close());

  it('should add notifys to usernotify', async () => {
    let wynfrith = await User.findOne({username: 'wynfrith'});
    // 通过UserNotify中的最后一条的lastTime来确定拉取范围!!!
    let notities = await Notify.find({ $or: [ {receiver: wynfrith._id}, {type: 'announce'}] });
    let res = await UserNotify.insertMany(notities);
    assert.equal(res.length, 2);
  });
});

