var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
// 问题或者回答
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var QaSchema = new Schema({
  id: { type: ObjectId },
  authorId: { type: ObjectId },
  authorName: { type: String },
  questionId: { type: ObjectId }, // question此值缺省
  type: { type: Boolean }, // true 问题, false 答案
  title: {
    type: String,
   }, // answer此值缺省
  content: String,
  tags: Array, // answer此值缺省, 存放tags name
  ups: [{
    _id: '',
    upType: Boolean,  // true +1, false -1
    authorId: { type: ObjectId }
  }],
  isAccept: { type: Boolean, default: false }, // 被采纳
  isClosed: { type: Boolean, default: false },
  isDel: { type: Boolean, default: false }
});

QaSchema.plugin(timestamps);
mongoose.model('Qa', QaSchema);
