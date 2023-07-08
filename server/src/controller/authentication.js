const jwt = require('jsonwebtoken');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const Email = require('../utils/email');
const bcrypt = require('bcrypt');

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

const createConfirmCode = (userId) => {
  const salt = bcrypt.genSaltSync(10);
  const hashId = bcrypt.hashSync(userId, salt);
  const confirmCode = hashId.slice(0, 30);
  return confirmCode;
};

exports.signup = catchAsync(async (req, res, next) => {
  const { email, name } = req.body;
  const existUser = await User.findOne({ $or: [{ email }, { name }] });
  if (existUser) {
    return res.status(400).json({
      error: 'Email or name already exists',
    });
  }
  const user = new User({ ...req.body, role: req.body.role });
  const userId = user._id.toString();
  const confirmCode = createConfirmCode(userId);
  user.confirmCode = confirmCode;
  await Promise.all([new Email(user).sendVerify(), user.save()]);
  createSendToken(user, 201, req, res);
});

exports.emailConfirm = catchAsync(async (req, res, next) => {
  const confirmCode = req.query.code;
  const user = await User.findOne({ confirmCode });
  if (!user) {
    res.status(404).json({ error: 'Invalid confirmation code' });
  }
  user.verified = true;
  user.confirmCode = undefined;
  await user.save();
  res.status(200).json({ status: 'Email verification successful' });
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
  // if (!user.verified) {
  //   return next(
  //     new AppError('Email not confirmed. Please verify your email!', 401)
  //   );
  // }
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
  } else if (req.headers.cookie) {
    const keyValuePairs = req.headers.cookie.split('; ');
    if (keyValuePairs) {
      for (const pair of keyValuePairs) {
        if (pair.startsWith('jwt=')) {
          token = pair.substring(4);
          break;
        }
      }
    }
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
