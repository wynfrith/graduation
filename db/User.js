var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  id: ObjectId,
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
    minlength: [7, '用户名最短为7位'],
    maxlength: [20, '用户名最长为20位']
  },
  password: {
    type: String,
    required: [true, '请输入密码'],
    minlength: [7, '密码最短为7位'],
    maxlength: [25, '密码最长为25位']
  },
  phoneNumber: String,
  isActived: { type: Boolean, default: true },
  isBan: { type: Boolean, default: false },
  isDel: { type: Boolean, default: false },
  avatorAddress: String,
  brief: String,
  // skill_tags: Array,
  infos: {
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

UserSchema.plugin(timestamps);
mongoose.model('User', UserSchema);

// var User = mongooe.model('UserSchema', UserSchema);





// {
//   "email":"",
//   "username":"",
//   "phone_number":"",
//   "is_actived": true,
//   "is_ban": false,
//   "is_del": false,
//   "createdAt":"",
//   "updatedAt":"",
//   "avator_address":"",
//   "brief":"",
//   "password":"",
//   "infos":{
//     "birthday":"",
//     "school_name":"",
//     "institution":"",
//     "introduce":"",
//     "gender":"",
//     "residence":"",
//     "website":"",
//     "address":""
//   },
//   "skill_tags":[],
// }
