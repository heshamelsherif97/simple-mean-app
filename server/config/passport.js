var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const ADMIN = require('../models/admin');

module.exports = function(passport){

  passport.serializeUser(function(user, next) {
        next(null, {id: user.id, admin: user.name?true:false});
    });
    // used to deserialize the user
    passport.deserializeUser(function(user, next) {
          ADMIN.findById(user.id, function(err, admin) {
            next(err, admin);
          })


    });

          passport.use('admin-login', new LocalStrategy({
                  usernameField: 'email',
                  passwordField: 'password',
              },
              function (req, email, password,next){
                console.log('sad');

              //Find the admin account with the given email
                ADMIN.findOne({'local.email': email},function(err,admin){
                  console.log('sad');

                  if(err){
                      console.log(err);
                  }
                  if(admin){
                      //Validate that the entered password matches the stored one
                      if(admin.validPassword(admin.local.salt,password,admin.local.hash)){
                          return next(null,admin)
                      }else{
                          return next({success:false,error:"incorrect password"})
                      }
                  }else{
                      return next({success:false,error:"This account does not exist"})
                  }

              })

              }));


}
