var mongoose = require('mongoose');
var product = require('../models/product');
var passport = require('passport');
require('../config/passport')(passport);

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
    passport.authenticate('admin-signup', function(err, user) {
    if (err) {
      res.json({success:false})
    }
    else if(user){
      //Log the user in via passport
      req.login(user, function(err) {
          if (err) {
            res.json({success: false, error: "An unexpected error has occured"})
          }
          else {
            //Identify this user as a client, and send the response with the newly created user
            req.session.admin = true
            res.json({success: true, user: req.user})
          }
      })
    }
    else {
      console.log('error here');
      res.json({success: false, error: "An unexpected error has occured"})
    }
  })(req, res, next)
},

  login: function(req, res,next) {
      passport.authenticate('admin-login', function(err, user) {
          if (err) {
              res.json(err);
          }
          else if(user) {
              req.login(user, function(err) {
                  if (err) {
                      res.json({success: false, error: "An unexpected error has occured"})
                  }
                  else {
                      req.session.admin = true
                      res.json({success: true, user: req.user})
                  }
              })

          }
          else {
            console.log('error here');

              res.json({success: false, error: "Authentication failed"})
          }
      })(req, res, next)
  },
  logout: function(req, res, next) {
    req.logout()
    req.session.destroy(function() {
        res.json({success: true})
    })
  },
}
