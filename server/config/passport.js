var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require("crypto");
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

        passport.use('admin-signup', new LocalStrategy({
                usernameField: 'email',
                passwordField:'password',
                passReqToCallback: true
            },
            function (req,username,password,next) {
                process.nextTick(function () {
                    if (phone && address && name) {
                      //Find clients with the given username or email
                      ADMIN.findOne({'local.email':email}, function(err, user){
                        console.log('sad');

                        if (err) {
                          next({success: false, error: "An unexpected error has occured"})
                        }
                        if (user) {
                          next({success: false, error: "This email already exists!"})
                        }
                        else {
                          var admin = new ADMIN();
                          admin.local.email = req.body.email;
                          admin.name = req.body.name;
                          admin.phone = req.body.phone;
                          admin.address = req.body.address;
                          admin.local.salt = crypto.randomBytes(16).toString('hex')
                          admin.local.hash = crypto.pbkdf2Sync(password, client.local.salt, 1000, 64, 'sha512').toString('hex')
                          admin.save(function(err) {
                            if(err) {
                              next({success: false, error: 'An unexpected error has occured'})
                            }

                            return next(null, client)
                          })
                        }
                      })
                    }
                    else {
                      next({success: false, error: "Incomplete information entered"})
                    }
                });

            }));

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
