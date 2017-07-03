var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var path = require('path');
var expressValidator = require('express-validator');
var api = require('./server/routes/api');
var dB = "mongodb://127.0.0.1:27017/SimpleApp";
var app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/api', api);
app.use(session({secret: 'Cerebrus', cookie: { maxAge : 3600000 * 48 }}));
app.use(passport.initialize());
app.use(passport.session());
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
mongoose.connect(dB, function(err){
  if(err){
    return err;
  }
  else{
    console.log('Successfully connected to MongoDB');
  }
});
app.listen(port, function(err){
  if(err){
    return err;
  }
  else{
    console.log('Successfully started the server at port '+port);
  }
});
