const express = require('express');
const router = express.Router();

const {allCategories, create, categoryById, oneCategory, update, remove} = require('../controllers/categoryController');
const {requireLogin, isAuth, isAdmin} = require('../controllers/authController');
const {userById} = require('../controllers/userController');

router.get('/categories', allCategories);
router.get('/category/:categoryId', oneCategory);
router.post('/category/create/:userId', requireLogin, isAuth, isAdmin, create);
router.put('/category/:categoryId/:userId', requireLogin, isAuth, isAdmin, update);
router.delete("/category/:categoryId/:userId", requireLogin, isAuth, isAdmin, remove);

router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;