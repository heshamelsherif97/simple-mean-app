var mongoose = require('mongoose');
var product = require('../models/product');
var passport = require('passport');
var mailer = require('./mailController')
var multer = require('multer')
require('../config/passport')(passport);
const ADMIN = require('../models/admin');

module.exports = {
  checkAuthentication: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    else{
      return res.json({error: 'Not authenticated'});
    }
  },

  checkIsAdmin: function(req, res, next){
    var user = req.user;
    if(user.admin){
      return next();
    }else{
        return res.json({error: false, message: 'You are not authorized'});
    }
  },

  register: function(req, res,next) {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('name','Name contain inappropriate characters').isAlpha().
    notEmpty().withMessage('Name is required');
    req.checkBody('email','Invalid Email').isEmail().
    notEmpty().withMessage('Email is required');
    req.checkBody("password", 'Password should be combination of one uppercase , one lower case, one special char,one digit and min 8 , max 20 char long').
    matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").
    notEmpty().withMessage('Password is required');
    req.checkBody('phone','Invalid Phone Number.').
    notEmpty().withMessage('Phone is required');
    req.checkBody('address','Address contain inappropriate characters').isAlphanumeric().
    notEmpty().withMessage('Address is required');
    req.checkBody('password2','Passwords do not match.').equals(req.body.password).
    notEmpty().withMessage('Confirm Password is required');

    var errors = req.validationErrors();

    if(errors){
      res.json({success: false, errors:errors});
    } else {
      ADMIN.findOne({email:email}, function(err, admin){
        if(err){
          res.json({success:false, message: 'Unexpected error'});
        }else if(admin){
          res.json({success:false, message: 'Email Already used'});
        }else{
          var newAdmin = new ADMIN({
            name: name,
            email:email,
            phone:phone,
            address:address,
            password: password,
            confirmed: false,
            admin: false
          });

          ADMIN.createAdmin(newAdmin, function(err, user){
            if(err) throw err;
            else{
              var link = 'http://localhost:3000/api/activateAccount/'+user._id;
              var mail = {
               to: user.email,
               html: "<h3>Use the following link to activate your account</h3><br><b>"+link+"</b>",
               subject: 'Confirmation For your Account'
             }
             mailer.sendMail(mail, function(err, info) {
               if(err){
                 console.log(err)
                 res.json({success: false, message: 'Unexpected Error'});
               }else{
                 res.json({success: true, message: 'You have registered Successfully, An Email has been sent to your email with Confirmation'});
               }
             })
            }
          });
        }})
      }
      },

  login: function(req, res, next) {
    req.checkBody('email','Invalid Email').isEmail().notEmpty().withMessage('Email is required');
    req.checkBody("password", 'Password should be combination of one uppercase , one lower case, one special char,one digit and min 8 , max 20 char long').
    matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").
    notEmpty().withMessage('Password is required');


    var errors = req.validationErrors();

    if(errors){
      res.json({success: false, errors:errors});
    }else{
      passport.authenticate('local', function(err, user) {
         if (err) {
           res.json(err)
         }
         else if(user) {
           if(user.confirmed){
             req.login(user, function(err) {
                 if (err) {
                   res.json({success: false, error: "An unexpected error has occured"})
                 }
                 else {
                   res.json({success: true, message: 'Authenticated Successfully'})
                 }
             })
           }else{
             res.json({success: false, error: "You haven't confirmed your account yet"})
           }

         }
         else {
           res.json({success: false, message: 'Invalid Email or Password'})
         }
       })(req, res, next);
    }
  },

  logout: function(req, res, next) {
    req.logout()
    req.session.destroy(function() {
        res.json({success: true})
    })
  },

  verifyAdmin: function(req, res, next){
    ADMIN.findOne({_id: req.body.id}, function(err, user){
      if(err){
        res.json({success: false});
      }if(user){
        user.admin = true;
        user.save(function(err){
          if(err) res.json({success: false});
          else{
            res.json({success:true, message: 'user is now promoted to admin'});
          }
        });
      }else{
        res.json({success:false, message: 'Could not find User'});
      }
    })
  },

  activateAccount: function(req, res, next){
   var id = req.params.id;
   ADMIN.findOne({_id:id}, function(err, user){
     if(err) res.json({success: false});
     else if(user){
       if(user.confirmed){
         res.json({success: false, message: 'Account is already activated'})
       }else{
         user.confirmed = true;
         user.save(function(err){
           if(err) res.json({success: false});
           else{
             res.json({success: true, message: 'Acccount is confirmed'});
           }
         });
       }
     }else{
       res.json({success: false, message: 'Invalid Confirmation Link'})
     }
   })
 },
}
