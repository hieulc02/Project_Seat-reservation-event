const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factory');

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
  await User.findByIdAndUpdate(req.body._id, filterBody, {
    runValidators: true,
  });

  res.status(200).json({ status: 'Updated successfully' });
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
