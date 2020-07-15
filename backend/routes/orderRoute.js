const express = require('express');
const router = express.Router();

const {requireLogin, isAuth, isAdmin} = require('../controllers/authController');
const {userById, addOrderToUserHistory} = require('../controllers/userController');
const {create, listOrders, getStatusValues, orderById, updateOrderStatus} = require('../controllers/orderController');
const {decreaseStock} = require('../controllers/productController');

router.post('/order/create/:userId', requireLogin, isAuth, addOrderToUserHistory, decreaseStock, create);
router.get('/order/list/:userId', requireLogin, isAuth, isAdmin, listOrders);
router.get('/order/status-values/:userId', requireLogin, isAuth, isAdmin, getStatusValues);
router.put('/order/:orderId/status/:userId', requireLogin, isAuth, isAdmin, updateOrderStatus);

router.param('userId', userById);
router.param('orderId', orderById);

module.exports = router;