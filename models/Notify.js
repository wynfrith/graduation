import mongoose from 'mongoose'
import timestamp from 'mongoose-timestamp'

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const NotifySchema = new Schema({
  id: { type: ObjectId },
  content: { type: String },
  type: {
    type: String,
    required: true,
    enum: ['announce', 'remind', 'message']
  }, // enum[1, 2, 3]  1: 公告 Announce，2: 提醒 Remind，3：信息 Message
  target: { type: ObjectId },  //目标的ID (比如说我的其中一篇文章的id)
  targetName: { type: String },
  targetType: { type: String }, // 类型, 指明target是comment, question, answer 
  sender: { type: String },  // 发送者用户名 (user)
  receiver: { type: ObjectId }, //消息接受者, 通常是target的主人
  action: {
    type: String,
    enum: ['answer', 'comment', 'reply', 'like', 'hate']
  }  // 比如说 comment/like/post/update
});

NotifySchema.plugin(timestamp);
export default mongoose.model('Notify', NotifySchema);