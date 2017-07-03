var mongoose = require('mongoose');
var product = require('../models/product');


module.exports = {
  get_products: function(req, res, next){
    product.find(function(err, products){
      if(!products){
        res.json('No available products');
      }
      else{
        res.json({products:products});
      }
    })
  },

  get_product: function(req, res, next){
    product.findOne({_id:req.params.id}, function(err, product){
      if(err){
        res.json({error:'error finding product from Database'});
      }
      else{
        res.json({product:product});
      }
    })
  },

  delete_product: function(req, res, next){
    product.findOne({_id:req.body.id}, function(err, product){
      if(!product){
        res.json({error: 'Product could not be found'});
      }
      else{
        product.remove(function(err){
          if(err){
            res.json({error: 'Product failed to be deleted'});
          }
          else{
            res.json({message:'Product deleted Successfully'});
          }
        });
      }
    })
  },

  update_product: function(req, res, next){
    product.findOne({_id:req.body.id}, function(err, product){
      if(!product){
        res.json({error: 'Could not find product to edit'});
      }
      else{
        if(req.body.name){
          product.name = req.body.name;
        }
        if(req.body.description){
          product.description = req.body.description;
        }
        if(req.body.tech_specs){
          product.tech_specs = req.body.tech_specs;
        }
        product.save(function(err){
          if(err){
            res.json({error: 'Error Updating the Product'});
          }
          else{
            res.json({message: 'Product updated Successfully'});
          }
        });
      }
    })
  },

  add_product: function(req, res, next){
    var new_product = new product();
    new_product.name = req.body.name;
    new_product.description = req.body.description;
    new_product.tech_specs = req.body.tech_specs;
    new_product.save(function(err){
      if(err){
        res.json({error: 'Error adding new Product'});
      }
      else{
        res.json({message: 'Product added Successfully'});
      }
    });
  }
}
