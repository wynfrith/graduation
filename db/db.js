var mongoose = require('mongoose');
var config   = require('../configs/config.json');


// create connection
mongoose.connect(config.database.url, config.database.options, function(err) {
  if (err) {
    console.log(er);
    process.exit(1);
  }
})

// models
require('./User.js')
require('./Comment.js')
require('./Qa.js')

exports.User = mongoose.model('User');
exports.Comment = mongoose.model('Comment');
exports.Qa = mongoose.model('Qa');
