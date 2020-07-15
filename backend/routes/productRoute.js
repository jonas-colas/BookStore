const express = require('express');
const router = express.Router();

const {allProducts, listSearch, create, productById, read, remove,
 update, listRelated, categoriesByProduct, productBySearch, picture
} = require('../controllers/productController');
const {requireLogin, isAuth, isAdmin} = require('../controllers/authController');
const {userById} = require('../controllers/userController');

router.get('/products', allProducts);
router.get('/products/search', listSearch);
router.get('/product/:productId', read);
router.post('/product/create/:userId', requireLogin, isAuth, isAdmin, create);
router.put('/product/:productId/:userId', requireLogin, isAuth, isAdmin, update);
router.delete('/product/:productId/:userId', requireLogin, isAuth, isAdmin, remove);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories', categoriesByProduct);
router.post('/products/by/search', productBySearch);
router.get('/product/picture/:productId', picture);


router.param('userId', userById);
router.param('productId', productById);


module.exports = router;