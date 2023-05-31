const express = require('express');
//const User = require('../models/user');
const userController = require('../controller/user');
const authController = require('../controller/authentication');
const userRoute = express.Router();

userRoute.post('/signup', authController.signup);
userRoute.post('/login', authController.login);
userRoute.get('/logout', authController.logout);

userRoute.use(authController.protect);
userRoute.get('/me', userController.getMe, userController.getUser);
userRoute.patch('/updateMe', userController.updateMe);

userRoute.use(authController.restrictTo('admin'));
userRoute.get('/', userController.getAllUsers);
userRoute
  .route('/:id')
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRoute;
