// 评论表
import mongoose from 'mongoose'
import timestamp from 'mongoose-timestamp'

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

// TODO: Comment完全可以合并到Qa表中
const CommentSchema = new Schema({
  id: { type: ObjectId },
  author: { type: String },
  authorId: { type: ObjectId },
  qaId: { type: ObjectId },
  content: { type: String },
  isDel: { type: Boolean, default: false }
});

CommentSchema.plugin(timestamp);
export default mongoose.model('Comment', CommentSchema);
