var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var adminSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  address: String
});

var admin = mongoose.model('admin', adminSchema);
module.exports = admin;

module.exports.createAdmin = function(newAdmin, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newAdmin.password, salt, function(err, hash) {
	        newAdmin.password = hash;
	        newAdmin.save(callback);
	    });
	});
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.getAdminByEmail = function(email, callback){
	var query = {email: email};
	admin.findOne(query, callback);
}

module.exports.getAdminById = function(id, callback){
	admin.findById(id, callback);
}
