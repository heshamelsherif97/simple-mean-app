var mongoose = require('mongoose');
var adminSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
 local: {
     email: {
         type: String,
         required: true,
         unique: true
     },
     hash: String,
     salt: String
 },
 phone:String,
 address: String
});

adminSchema.methods.validPassword = function(salt, password, hash) {
    var enteredHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return enteredHash === hash;
}

var admin = mongoose.model('admin', adminSchema);
module.exports = admin;
