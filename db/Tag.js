var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
// 问题或者回答
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var TagSchema = new Schema({
  // TODO: tag字段补充
  id: { type: ObjectId },
  parentId: { type: ObjectId }, // 子标签专用
  name: { type: String, unique: true, required: true },
  memo: { type: String },
  isDel: { type: Boolean, default: false }
});


// name 索引

TagSchema.plugin(timestamps);
mongoose.model('Tag', TagSchema);
