var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport);
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
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
router.post('/delete_product/', adminController.checkAuthentication, adminController.checkIsAdmin, productController.delete_product);
router.post('/update_product/', adminController.checkAuthentication, adminController.checkIsAdmin, productController.update_product);
router.post('/add_product/', adminController.checkAuthentication, adminController.checkIsAdmin, productController.add_product);

router.post('/admin_register/', adminController.register);
router.post('/check_admin/', adminController.checkAuthentication);
router.post('/admin_logout/', adminController.logout);
router.post('/admin_login/', adminController.login);
router.post('/verifyAdmin/', adminController.checkAuthentication, adminController.checkIsAdmin, adminController.verifyAdmin);

router.get('/activateAccount/:id/', adminController.activateAccount);



module.exports = router;
