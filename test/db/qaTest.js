const assert = require('chai').assert;
const db = require('../../db/db.js');


const User = db.User;
const Qa = db.Qa;
const Comment = db.Comment;

var wynfrith;
describe('test qa collection', () => {
  // remove test users
  before((done) => {
    Qa.remove({}, (err) => {
      if (err) throw new Error(err);
      done()
    })
  })
  // create a global user
  before((done) => {
    User.findOne({username: 'wynfrith'})
        .then((user) => {
          wynfrith = user;
          done();
        })
  })

  it('should create a Question', (done) => {
    var question = new Qa({
      authorId: wynfrith._id,
      type: true,
      title: '我来提出一个问题',
      content: '问题正文问题正文问题正文问题正文问题正文问题正文问题正文问题正文问题正文问题正文问题正文问题正文问题正文',
      tags: ['标签1', '标签2'],
      ups: [
        { upType: true, authorId: wynfrith._id }
      ]
    })
    question.save().then((user)=>{
      done()
    })
  })

  it('should create a anwser', (done) => {
    Qa.findOne({type: true}, function(err, question) {
      var answer = new Qa({
        authorId: wynfrith._id,
        questionId: question._id,
        type: false,
        content: '这个问题还在么，现在应该已经可以了吧',
        isAccept: true
      });
      answer.save().then(()=>{
        done()
      })
    })
  })

  it('should get a question', (done) => {
    Qa.findOne({type: true}, (err, question) => {
      assert.equal(String(question.authorId), wynfrith._id);
      assert.equal(question.type, true)
      done()
    })
  })

  it('should get a answer', (done) => {
    Qa.findOne({type: false}, (err, answer)=> {
      assert.equal(answer.type, false);
      done()
    })
  })



})
