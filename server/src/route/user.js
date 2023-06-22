const express = require('express');
//const User = require('../models/user');
const user = require('../controller/user');
const authController = require('../controller/authentication');
const userRoute = express.Router();

userRoute.post('/signup', authController.signup);
userRoute.post('/login', authController.login);
userRoute.get('/logout', authController.logout);
userRoute.get('/email/confirmation', authController.emailConfirm);
userRoute.use(authController.protect);
userRoute.get('/me', user.getMe, user.getUser);
userRoute.patch('/updateMe', user.updateMe);

userRoute.use(authController.restrictTo('admin'));
userRoute.get('/', user.getAllUsers);
userRoute.route('/:id').patch(user.updateUser).delete(user.deleteUser);

module.exports = userRoute;
