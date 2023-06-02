const jwt = require('jsonwebtoken');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const isAdmin = user?.role;
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 9000000 * 24 * 60),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: true,
  });
  user.password = undefined;
  //req.session.user = user;
  const event = statusCode === 200 ? 'Logged in' : 'Sign up';

  res.status(statusCode).json({
    status: `${event} successfully`,
    token,
    isAdmin,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (user) {
    return res.status(400).json({
      error: 'Email already exists',
    });
  }
  const newUser = new User({ ...req.body, role: req.body.role });
  await newUser.save();
  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email or password'), 400);
  }

  const user = await User.findOne({ email }).select('+password');
  // req.session.regenerate(function (e) {
  //   if (e) next(e);
  //   req.session.user = user;
  //   req.session.save(function (e) {
  //     if (e) return next(e);
  //   });
  // });
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, req, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie('jwt');
  // res.cookie('jwt', 'logged-out', {
  //   expires: new Date(Date.now() + 10 * 1000),
  //   httpOnly: true,
  // });
  res.status(200).json({ status: 'Successful logout' });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token === 'null') {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  const decode = await promisify(jwt?.verify)(token, process.env.JWT_SECRET);
  //console.log(decode);
  const currentUser = await User.findById(decode?.id);
  //console.log(currentUser);
  if (!currentUser) {
    return next(
      new AppError('User belong to this token no longer exist.', 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to this action', 403)
      );
    }
    next();
  };
};
