import chai from 'chai'
import User from '../../models/User'
import mongoose from 'mongoose'

const assert = chai.assert;

// async function add(a, b) => { return a+b }

describe ('test user', () => {
  
  before(async () => {
    mongoose.connect('mongodb://localhost/newQA');
    await User.remove({})
  });
  after(() => mongoose.connection.close());


  it('should create a user', async () => {
    // assert(await add(1, 2), 3);
    let user = new User({
      role: 'admin',
      username: 'wynfrith',
      email: 'wangfucheng56@gmail.com',
      photoAddress: 'http://my-ghost.b0.upaiyun.com/avator.jpg',
      brief: '个人简介',
      password: 'wfc5582563',
      info: {
        phoneNumber: '18369905318',
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

    
    try {
      user = await user.save();
      assert.equal(JSON.stringify(user).password, null);
    } catch (err) {
      throw err;
    }

  });


  it('should get a user', async () => {
    const user = await User.findOne({username: 'wynfrith'});
    assert.equal(user.email, 'wangfucheng56@gmail.com')
  });
  
  it('should return role error', async () => {
    let user = new User({
      role: 'null',
      username: 'kongyazhou',
      email: 'kongyazhou110@126.com',
      password: '1231231'
    });
    try {
      await user.save()
    } catch (err) {
      assert.equal(err.errors.role.message, '非法权限')
    }
  });
  
  it('create users', async () => {
    let user1 = new User({ username: 'yangtao', email: 'yangtao@123.com', password: '1234567' });
    let user2 = new User({ username: '泽仰', email: 'zeyang@123.com', password: '1234567' });
    let user3 = new User({ username: 'xiaoheng', email: 'xiaoheng@123.com', password: '1234567' });
    try {
      await Promise.all([user1.save(), user2.save(), user3.save()]);
    } catch (err) {
      throw err;
    }
  })


});


