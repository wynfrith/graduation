import mongoose from 'mongoose'
import timestamp from 'mongoose-timestamp'

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  id: ObjectId,
  role: {
    type: String,
    require: true,
    default: 'user', // [admin, user]
    enum:{ values: ['user', 'admin'], message: '非法权限' }
  },
  email: {
    type: String,
    unique: true,
    required: [true, '请输入邮箱'],
    maxlength: [50, '您的邮箱太长了...']
  },
  username: {
    type: String,
    unique: true,
    required: [true, '请输入用户名'],
    minlength: [2, '用户名最短为2位'],
    maxlength: [20, '用户名最长为20位']
  },
  password: {
    type: String,
    required: [true, '请输入密码'],
    minlength: [6, '密码最短为6位'],
    maxlength: [25, '密码最长为25位']
  },
  isActive: { type: Boolean, default: true },
  isBan: { type: Boolean, default: false },
  isDel: { type: Boolean, default: false },
  photoAddress: String,
  brief: String,
  // skill_tags: Array,
  info: {
    phoneNumber: String,
    birthday: Date,
    schoolName: String,
    institution: String,
    introduce: String,
    gender: Boolean, // true 男  false 女
    residence: String,
    website: String,
    address: String
  }
});


UserSchema.plugin(timestamp);
UserSchema.set('toJSON', {transform(doc, ret) { delete ret.password; }});

export default mongoose.model('User', UserSchema);