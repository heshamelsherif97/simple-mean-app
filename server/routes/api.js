var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
router.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
var productController = require('../controllers/productController');
var adminController = require('../controllers/adminController');

router.post('/get_products/', productController.get_products);
router.post('/get_product/:id/', productController.get_product);
router.post('/delete_product/', adminController.checkAuthentication, productController.delete_product);
router.post('/update_product/', adminController.checkAuthentication, productController.update_product);
router.post('/add_product/', adminController.checkAuthentication, productController.add_product);

router.post('/admin_register/', adminController.register);
router.post('/check_admin/', adminController.checkAuthentication);
router.post('/admin_login/', adminController.login);
router.post('/admin_logout/', adminController.logout);

module.exports = router;
