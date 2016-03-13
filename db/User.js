var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  id: ObjectId,
  email: String,
  username: String,
  phoneNumber: String,
  isActived: { type: Boolean, default: true },
  isBan: { type: Boolean, default: false },
  isDel: { type: Boolean, default: false },
  avatorAddress: String,
  brief: String,
  password: String,
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
