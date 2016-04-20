import mongoose from 'mongoose'
import timestamp from 'mongoose-timestamp'

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

//TODO: 限制tag,不允许传入非法tag
const QaSchema = new Schema({
  id: { type: ObjectId },
  author: { type: String },
  authorId: {type: ObjectId },
  questionId: { type: ObjectId }, // question此值缺省
  type: { type: Boolean }, // true 问题, false 答案
  title: {
    type: String
  }, // answer此值 = question.title
  content: String,
  tags: Array, // answer此值缺省, 存放tags name
  like: Array, 
  hate: Array, 
  isAccept: { type: Boolean, default: false }, // 被采纳
  isClosed: { type: Boolean, default: false },
  isDel: { type: Boolean, default: false },
  answerNum: { type:Number, default: 0},
  views: { type: Number, default: 0},
  comments: [{
    id: { type: ObjectId },
    author: { type: String },
    avatar: { type: String },
    content: { type: String },
    isDel: { type: Boolean, default: false }
  }]
}, {versionKey: false});

// 投票数
QaSchema.virtual('score').get(function() {
  return this.like.length - this.hate.length;
});

// 回答数

QaSchema.plugin(timestamp);
QaSchema.set('toJSON', { virtuals: true });
QaSchema.set('toObject', { virtuals: true });
export default mongoose.model('Qa', QaSchema);
