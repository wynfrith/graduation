/**
 * Created by wyn on 3/24/16.
 */

import mongoose from 'mongoose'
import timestamp from 'mongoose-timestamp'

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const UserNotifySchema = new Schema({
  id: { type: ObjectId },
  isRead: { type: Boolean, default: false },
  userId: { type: ObjectId },
  notifyId: { type: ObjectId },
  notifyType: { type: String },
  content: { type: String }
}, {versionKey: false});

UserNotifySchema.plugin(timestamp);
export default mongoose.model('UserNotify', UserNotifySchema);
