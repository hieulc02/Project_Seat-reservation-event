const express = require('express');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  const filterBody = filterObj(req.body, 'name', 'email');

  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).send(updateUser);
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
