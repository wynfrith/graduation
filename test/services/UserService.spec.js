import should from 'should';
import UserService from "../../services/UserService";
import mongoose from "mongoose";
import User from "../../models/User";

describe.only('user service', () => {
  before(() => mongoose.connect('mongodb://localhost/newQA'));
  after (() => mongoose.connection.close());
  
  describe('getUserByName', () => {
    it('should get a user username is wynfrith', async () => {
      let user = await UserService.getUserByName('wynfrith');
      user.should.have.property('username', 'wynfrith');
    });
    
    it('should get nothing', async () => {
      let user = await UserService.getUserByName('deleteduser');
      should.not.exists(user);
    });
  });
  
  describe('getUserById', () => {
    it('should get a user yangtao', async () =>  {
      let user = await UserService.getUserById('000000000000000000000002');
      user.should.have.property('username', 'yangtao');
    })
  });

  describe('getUserByEmail', function () {
    it('should get a user xiaoheng', async function () {
      let user = await UserService.getUserByEmail('xiaoheng@123.com');
      user.should.have.property('username', 'xiaoheng');
    });
  });

  describe('isValid', function () {
    it('should return true', async function () {
      const params = { username: 'wynfrith', password: 'wfc5582563' };
      let user = await UserService.getUserByName(params.username);
      let result = UserService.isValid(user, params.password);
      result.should.ok();
    });
    it('should return false', async function () {
      const params = { username: 'wynfrith', password: '111111' };
      let user = await UserService.getUserByName(params.username);
      let result = UserService.isValid(user, params.password);
      result.should.not.ok();
    });
  });

  describe('register and force remove', function () {
    it('should register success', async function () {
      let user = { username: 'helloworld', password: '1234567', email:'helloworld@126.com' };
      let res = await  UserService.register(user);
      res.code.should.equal(0);
      res.data.should.have.property('role', 'user');
      
      res = await UserService.deleteUserForce(res.data._id);
      res.code.should.equal(0);
      res.data.should.have.property('username', 'helloworld');
    });
    
    it('should get a user exist error', async function() {
      let user = { username: 'wynfrith', password: '1234567', email:'wangfucheng56@gmail.com' };
      let res = await UserService.register(user);
      res.code.should.not.equal(0);
      res.errors.should.have.length(2);
    });
    it('should get a field validate error', async function () {
      let user = { username: 'helloworld', password: '1', email:'helloworld@gmail.com' };
      let res = await UserService.register(user);
      res.code.should.not.equal(0);
    });
  });

  describe('register a admin and remove', function () {
    it('should register success', async function() {
      let admin = { username: 'admin', password: '88888888', email:'admin@wynfrith.me' };
      let res = await UserService.registerAdmin(admin);
      res.code.should.equal(0);
      res.data.should.have.property('role', 'admin');

      res = await UserService.deleteUserForce(res.data._id);
      res.code.should.equal(0);
      res.data.should.have.property('username', 'admin');
    });

    it('should register error', async function(){
      let admin = { username: 'admin', password: '88888888', email:'adminadmin' };
      let res = await UserService.registerAdmin(admin);
      res.code.should.not.equal(0);
      res.errors[0].should.have.property('error', 'email');
    });

    describe('update infos test', function () {
      it('should update zeyang brief 呵呵 to 哈哈 and rollback', async function () {
        let zeyang = await UserService.getUserByName('泽仰');
        zeyang.info.should.have.property('brief', '呵呵呵');
        zeyang.info.should.have.property('phoneNumber', '18669795487');
        
        zeyang.info.brief = '哈哈';
        let res = await UserService.updateInfo(zeyang._id, zeyang);
        res.code.should.equal(0);

        zeyang = await UserService.getUserByName('泽仰');
        zeyang.info.should.have.property('brief', '哈哈');
        zeyang.info.should.have.property('phoneNumber', '18669795487');
        
        //rollback
        zeyang.info.brief = '呵呵呵';
        await UserService.updateInfo(zeyang._id, zeyang);
        
      });
    });

    describe('updatePassword', function() {
      it('should update wynfrith password success and rollback', async function () {
        let wynfrith = await UserService.getUserByName('wynfrith');
        await UserService.updatePassword(wynfrith._id, '88888888');

        wynfrith = await UserService.getUserByName('wynfrith');
        wynfrith.should.have.property('password', '88888888');

        //rollback
        await UserService.updatePassword(wynfrith._id, 'wfc5582563');
      });
      it('should update failed', async function() {
        let wynfrith = await UserService.getUserByName('wynfrith');
        let res = await UserService.updatePassword(wynfrith._id, '123');
        res.code.should.not.equal(0);
      })
    });

    describe('delete User', function () {
      it('should delete xiaoheng and rollback', async () => {
        let xiaoheng = await UserService.getUserByName('xiaoheng');
        await UserService.deleteUser(xiaoheng._id);

        xiaoheng = await  UserService.getUserByName('xiaoheng');
        should.not.exist(xiaoheng);

        let user = await User.update(
          { _id: '000000000000000000000004'}, { isDel: false});
      });
      
    });

    describe('get UsersCount', function () {
      it('should get users count', async () => {
        let count = await UserService.getUsersCount();
        should(count).equal(4);
      })
    });

    describe('get Users', function () {
      it('should get users list default ', async () => {
        let users = await UserService.getUsers();
        should(users.length).equal(4);
      });
      
      it('should get user list skip 1 and limit 2', async () => {
        let users = await UserService.getUsers({limit: 2, skip: 1});
        should(users.length).equal(2);
      });
      
      it('should get user list sort by updatedAt', async () => {
        let users = await UserService.getUsers({ sort: { updatedAt: 1}});
        should(users[0].username).equal('yangtao');
      })
    });
    

  });

});