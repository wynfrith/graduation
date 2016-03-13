const assert = require('chai').assert;
const db = require('../../db/db.js');


const User = db.User;
const Qa = db.Qa;
const Comment = db.Comment;

var wynfrith;
describe('Comment collection', () => {
  // remove test users
  before((done) => {
    Comment.remove({}, (err) => {
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

  it('should create a Comment', (done) => {
    Qa.findOne({type: false})
      .exec(function(err, answer) {
        var comment = new Comment({
          authorId: wynfrith._id,
          qaId: answer._id,
          content: '谢谢, 这个问题解决了'
        })
        comment.save().then((comment) => {
          done();
        })
      })
  })

  it('should get a comment', (done) => {
    Comment.findOne().exec(function(err, comment){
      console.log(comment);
      assert.equal(String(comment.authorId), wynfrith._id);
      done()
    })
  })

})
