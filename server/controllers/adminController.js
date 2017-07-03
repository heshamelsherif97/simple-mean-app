var mongoose = require('mongoose');
var product = require('../models/product');
var passport = require('passport');
require('../config/passport')(passport);
const ADMIN = require('../models/admin');


// var registerSchema = {
//  'email': {
//     notEmpty:{
//       errorMessage: 'Email is required'
//     },
//     isEmail: {
//       errorMessage: 'Invalid Email'
//     }
//   },
//   'password': {
//     notEmpty: {
//       errorMessage: 'Password is required'
//     },
//     isAlphanumeric:{
//       errorMessage: 'Password contain inappropriate characters'
//     },
//     isLength: {
//       options: [{ min: 8, max: 12 }],
//       errorMessage: 'Password must be between 8 to 12 characters'
//     },
//   },
//   'password2': {
//     notEmpty: {
//       errorMessage: 'Please Confirm your Password'
//     },
//     isAlphanumeric: {
//       errorMessage: 'Password contain inappropriate characters'
//     },
//     isLength: {
//       options: [{ min: 8, max: 12 }],
//       errorMessage: 'Password must be between 8 to 12 characters'
//     }
//   },
//   'phone': {
//     notEmpty: {
//       errorMessage: 'Phone is required'
//     },
//      isMobilePhone: {
//        errorMessage: 'Invalid Phone Number'
//      },
//    },
//    'address': {
//      notEmpty: {
//        errorMessage: 'Address is required'
//      },
//       isAlphanumeric: {
//         errorMessage: 'Address contain inappropriate characters'
//       },
//     },
//     'name': {
//       notEmpty: {
//         errorMessage: 'Name is required'
//       },
//        isAlpha: {
//          errorMessage: 'Name contain inappropriate characters'
//        },
//      },
// };

module.exports = {
  checkAuthentication: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    else{
      return res.json({error: 'Not authenticated'});
    }
  },

  register: function(req, res,next) {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var password = req.body.password;
    var password2 = req.body.password2;

    // req.check(registerSchema);
    //
    // req.checkBody('password2','Passwords do not match.').equals(req.body.password);
    //
    // var errors = req.validationErrors();

    // if(errors){
    //   res.json({success: false, errors:errors});
    // } else {
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
            password: password
          });

          ADMIN.createAdmin(newAdmin, function(err, user){
            if(err) throw err;
          });
          res.json({success: true, message: 'You have registered Successfully'});
        }})
      // }
      },

  login: function(req, res,next) {
    passport.authenticate('admin-signup', function())
    ;
  },
  logout: function(req, res, next) {
    req.logout()
    req.session.destroy(function() {
        res.json({success: true})
    })
  },
}
