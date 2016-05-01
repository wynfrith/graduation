import chai from 'chai'
import mongoose from 'mongoose'

import User from '../../models/User'
import Qa from '../../models/Qa'
import Tag from '../../models/Tag'
import Notify from '../../models/Notify'

const assert = chai.assert;

// async function add(a, b) => { return a+b }

let user;

describe.only('test qa', () => {

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
      authorAvatar: 'http://graduation.b0.upaiyun.com/avatars/2016/04/26/IMG_e563d8711ab4ea5389314c86d9312333.jpg',
      type: true,
      title: '测试markdown的渲染情况?',
      content: "# 这是最大的字体\n## 二号标题\n### 三号标题拉克丝就\n#### 四号标题\n##### 五号标题阿狸的减肥了\n\n> 卢萨卡的就打了款家的离开家里的空间阿达刻录机大空间里卡掉了\n\n这是一段**普通**的文字, `javascript` 是一门坑爹的语言, *斜体* 是这样的 @wynfrith\n\n\n1. 这是第一条\n\t- 哈哈\n\t- 呵呵\n2. 这是第二条\n\n这是一条链接 [http://wwynfrith.me](http://wynfrith.me)\n\n下面是一张图片 \n\n![我头像](http://my-ghost.b0.upaiyun.com/cunliang.png)\n\njs端\n``` javascript\nvar app = angular.module('myApp', []);\napp.controller('myCtrl', function ($scope, $http) {\n $http.get(\"test.ask\").success(function (response) {\n $scope.myWelcome = response;\n });\n});\n```\njsp端：\n\n```html\n<body>\n\t<div ng-app=\"myApp\" ng-controller=\"myCtrl\">\n\t\t <p> 从服务器获取的信息是:</p>\n\t\t <h3>{{myWelcome}}</h3>\n\t</div>\n\t<p> $http 服务向服务器请求信息，返回的值放入变量 中</p>\n</body>\n```",
      tags: [javascriptTag.name, koaTag.name],
      like: ['yangtao', 'xiaoheng'],
      hate: ['wynfrith'],
      answerNum: 7,
      views: 132,
      comments: [
        {
          author:'wynfrith',
          content: '我给自己来一条评论看看'
        }
      ]
    });

    try {
      question = await question.save();
      assert.equal(question.score, 1);
    } catch (err) {
      throw err;
    }

  });

  it('should create some questions to test', async () => {
    let yangtao = await User.findOne({ username: 'yangtao'});
    let zeyang = await User.findOne({ username: '泽仰'});
    let xiaoheng = await User.findOne({ username: 'xiaoheng'});

    let javascriptTag = await Tag.findOne({name: 'javascript'});
    let rubyTag = await Tag.findOne({name: 'ruby'});
    let pythonTag = await Tag.findOne({name: 'python'});
    let koaTag = await Tag.findOne({name: 'koa'});

    let q1 = new Qa({
      authorId: yangtao._id,
      author: yangtao.username,
      type: true,
      title: '《精通CSS》中绝对定位的几个疑问？麻烦前端大大们看一下，非常感谢',
      content: "> 非常感谢您能抽时间看一下我的问题，我会在下面进行描述，非常感谢\n\n1. 绝对定位元素在没有已经定位的祖先元素的情况下，那么它的位置是相对于初始包含块的。根据用户代理的不同，初始包含块可能是画布或者HTML元素\n2. 出处 《精通CSS》 46页\n\n\n1. 请问这里的初始包含块指的是？\n2. 用户代理是指不同浏览器吗？为何叫用户代理呢？\n3. 画布指的是？HTML元素指的是<html></html>吗？",
      tags: [javascriptTag.name],
      like: [],
      hate: [],
      answerNum: 1,
      views: 22
    });

    let q2 = new Qa({
      authorId: zeyang._id,
      author: zeyang.username,
      type: true,
      title: 'css怎么实现图片环绕的效果',
      content: "让标号1的一组图片环绕标号2的这张图片\n\n```html\n<div>\n /*让他们环绕我*/\n <div>\n <img src=\"http://www.gbtags.com/gb/laitu/400x200&text=可爱的小周周/dd4814/ffffff\" />\n </div>\n /*环绕他去*/\n <div>\n <img src=\"http://www.gbtags.com/gb/laitu/400x200&text=叫/dd4814/ffffff\" />\n </div>\n <div>\n <img src=\"http://www.gbtags.com/gb/laitu/400x200&text=我/dd4814/ffffff\" />\n </div>\n <div>\n <img src=\"http://www.gbtags.com/gb/laitu/400x200&text=小/dd4814/ffffff\" />\n </div>\n <div>\n <img src=\"http://www.gbtags.com/gb/laitu/400x200&text=周/dd4814/ffffff\" />\n </div>\n <div>\n <img src=\"http://www.gbtags.com/gb/laitu/400x200&text=周/dd4814/ffffff\" />\n </div>\n </div>\n```",
      tags: [pythonTag.name],
      like: ['wynfrith','yangtao'],
      hate: [],
      answerNum: 0,
      views: 2
    });

    let q3 = new Qa({
      authorId:xiaoheng._id,
      author:xiaoheng.username,
      type: true,
      title: 'Iterm2 有哪些好看的配色?',
      content:  "iterm2 刚刚开始用，求教好看的配色主题！\n\n怎么设置背景为半透明，谢谢", 
      tags: [rubyTag.name],
      like: [],
      hate: ['wynfrith','xiaoheng', 'yangtao'],
      answerNum: 1,
      views: 10
    });

    try {
      await Promise.all([
        q1.save(), q2.save(), q3.save()
      ]);
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
    // assert.equal(question.title, '测试markdown的渲染情况?')
  });

  it('should get a answer', async () => {
    let answer = await Qa.findOne({type: false});
    assert.equal(answer.content, '这个问题还在么，现在应该已经可以了吧');
  });


});


