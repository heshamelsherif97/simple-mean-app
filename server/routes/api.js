var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport);
var multer = require('multer');
var fs = require('fs')
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var productController = require('../controllers/productController');
var adminController = require('../controllers/adminController');
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

var MAGIC_NUMBERS = {
	jpg: 'ffd8ffe0',
	jpg1: 'ffd8ffe1',
	png: '89504e47',
	gif: '47494638'
}

function checkMagicNumbers(magic) {
	if (magic == MAGIC_NUMBERS.jpg || magic == MAGIC_NUMBERS.jpg1 || magic == MAGIC_NUMBERS.png || magic == MAGIC_NUMBERS.gif) return true
}


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'dist/assets/imgs/uploads')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
    },
})

var setting = multer({ storage: storage })

router.post('/get_products/', productController.get_products);
router.post('/get_product/:id/', productController.get_product);
router.post('/delete_product/', adminController.checkAuthentication, adminController.checkIsAdmin, productController.delete_product);
router.post('/update_product/', adminController.checkAuthentication, adminController.checkIsAdmin, productController.update_product);
router.post('/add_product/', adminController.checkAuthentication, adminController.checkIsAdmin, productController.add_product);

router.post('/admin_register/', adminController.register);
router.post('/check_logged/', adminController.checkAuthentication);
router.post('/admin_logout/', adminController.logout);
router.post('/admin_login/', adminController.login);
router.post('/verifyAdmin/', adminController.checkAuthentication, adminController.checkIsAdmin, adminController.verifyAdmin);

router.get('/activateAccount/:id/', adminController.activateAccount);

// router.post('/uploadImage/', upload.single('img'), function (req, res, next) {
// res.json({success: false, message: 'Image Uploaded sssSuccessfully'});
// })

var upload = setting.single('img')

router.post('/uploadImage/', function (req, res) {
  upload(req, res, function (err) {
    var bitmap = fs.readFileSync('./dist/assets/imgs/uploads/' + req.file.filename).toString('hex', 0, 4)
		if (!checkMagicNumbers(bitmap)) {
			fs.unlinkSync('./dist/assets/imgs/uploads/'+ req.file.filename)
			res.json({success: false, message: 'Invalid file type'})
		}
		 else{
       if (err) {
         res.json({success: false, message: err.message});
       }else{
         res.json({success:true, message: 'Image Uploaded Successfully'});
       }
     }


    // Everything went fine
  })
})



module.exports = router;
