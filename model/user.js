const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
var UserSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  name: String,
  password: String,
  status: {type: String, default: 0},
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now}
}, {collection: 'users'});

UserSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}
module.exports = mongoose.model('users', UserSchema);