// 评论表
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CommentSchema = new Schema({
  id: { type: ObjectId },
  authorId: { type: ObjectId },
  qaId: { type: ObjectId },
  content: { type: String },
  isDel: { type: Boolean, default: false }
});

CommentSchema.plugin(timestamps);
mongoose.model('Comment', CommentSchema);
