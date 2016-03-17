const assert = require('chai').assert;
const db = require('../../db/db.js');


const User = db.User;
const Qa = db.Qa;
const Comment = db.Comment;
const Tag = db.Tag;

describe('test tags collection', () => {
  // remove test tags
  before((done) => {
    Tag.remove({}, (err) => {
      if (err) throw new Error(err);
      done()
    })
  })

  it('should create a tag', (done) => {
    var tag = new Tag({
      name: 'ruby',
      memo: 'ruby是一门很优雅的语言, 我非常喜欢:)'
    })
    tag.save().then((tag)=>{
      done()
    })
  })

  it('should create a subtag', (done) => {
    Tag.findOne({ name: 'ruby' }, function(err, parentTag) {
      var subTag= new Tag({
        name: 'gem',
        memo: 'gem是ruby的包管理机制',
        parentId: parentTag._id
      });
      subTag.save().then(()=>{
        done()
      })
    })
  })

  it('should get a tag', (done) => {
    Tag.findOne({name: 'ruby'}, (err, pTag) => {
      Tag.findOne({ name: 'gem'}, (err, sTag) => {
        assert.equal(String(sTag.parentId), String(pTag._id))
        console.log(pTag);
        console.log(sTag);
        done()
      })
    })

  })


})
