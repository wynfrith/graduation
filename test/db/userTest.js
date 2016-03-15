const assert = require('chai').assert;
const db = require('../../db/db.js');

const User = db.User;
const Qa = db.Qa;
const Comment = db.Comment;

describe('test user', () => {
  // remove test users
  before((done) => {
    User.remove({}, (err) => {
      if (err) throw new Error(err);
      done()
    })
  })

  it('should create a user', (done) => {
    var user = new User({
      username: 'wynfrith',
      email: 'wangfucheng56@gmail.com',
      phoneNumber: '18369905318',
      avatorAddress: 'http://my-ghost.b0.upaiyun.com/avator.jpg',
      brief: '个人简介',
      password: 'wfc5582563',
      infos: {
        birthday: new Date(1994, 1, 25),
        schoolName: '山东理工大学',
        institution: '软件工程学院',
        introduce: '我的个人介绍',
        gender: true,
        residence: '淄博',
        website: 'http://github.wynfrith.me',
        address: '山东淄博张店区'
      }
    });
    user.save(function(err) {
      if(err) throw new Error(err);
      done();
    })
  })

  it('should get a user', (done) => {
    User.findOne().then(function(user) {
      assert.equal('wynfrith', user.username)
      done()
    })
  })
})
