var mongoose = require('mongoose');
var productSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  tech_specs:{
    type:String,
    required:true
  },
  image:{
    type:String,
    default:'/assets/imgs/default.png'
  }
});
var product = mongoose.model('product', productSchema);
module.exports = product;
