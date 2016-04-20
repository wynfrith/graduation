import mongoose from 'mongoose'
import timestamp from 'mongoose-timestamp'

// tag
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const TagSchema = new Schema({
  id: { type: ObjectId },
  parentId: { type: ObjectId }, // 子标签专用
  name: { type: String, unique: true, required: true },
  memo: { type: String },
  isDel: { type: Boolean, default: false }
}, {versionKey: false});


TagSchema.plugin(timestamp);
export default mongoose.model('Tag', TagSchema);