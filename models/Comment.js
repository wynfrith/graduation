// 评论表
import mongoose from 'mongoose'
import timestamp from 'mongoose-timestamp'

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

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
