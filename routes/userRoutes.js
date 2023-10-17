const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//get routes
//public routes
router.get('/signup', userController.renderSignupForm);
router.get('/login', userController.renderLoginForm);

// protected routes
router.get('/home', authMiddleware, userController.renderHome);
router.get('/edit-profile', authMiddleware, userController.renderEditProfile);
router.get('/profile', authMiddleware, userController.renderProfile);
router.get('/create-post', authMiddleware, userController.renderCreatePost);

//post routes
router.post('/signup', userController.signupUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/edit-profile', authMiddleware, userController.saveProfile);

module.exports = router;
