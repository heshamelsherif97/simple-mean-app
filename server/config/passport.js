const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const ADMIN = require('../models/admin');

module.exports = function(passport){

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    ADMIN.getAdminById(id, function(err, user) {
      done(err, user);
    });
  });

    passport.use(new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
    },
      function(email, password, done) {
       ADMIN.getAdminByEmail(email, function(err, user){
       	if(err) throw err;
       	if(!user){
       		return done(null, false, {message: 'Invalid Username'});
       	}

       	ADMIN.comparePassword(password, user.password, function(err, isMatch){
       		if(err) throw err;
       		if(isMatch){
       			return done(null, user);
       		} else {
       			return done(null, false, {message: 'Invalid password'});
       		}
       	});
       });
      }));


}
