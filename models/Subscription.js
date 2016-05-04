/**
 * Created by wyn on 5/4/16.
 */

import mongoose from 'mongoose'
import timestamp from 'mongoose-timestamp'

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const SubscriptionSchema = new Schema({
  id: { type: ObjectId },
  target: { type: String },
  type: { type: String},
  uid : { type: ObjectId}
}, {versionKey: false});

// SubscriptionSchema.plugin(timestamp);
export default mongoose.model('Subscription', SubscriptionSchema);
