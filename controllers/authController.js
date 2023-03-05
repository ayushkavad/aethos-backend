const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signInToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signInToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  //1) check if email and password exits
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  //2) check if user exist && password correct
  const user = await User.findOne({ email }).select('+password');

  if (!user && !(await user.correctPassword(password, user.passowrd))) {
    return next(new AppError('Please provide valid email and password', 401));
  }

  //3) if everythings ok sens token to cline
  const token = signInToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not loggin!. Please login to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belong to this token does not longer exist!', 401)
    );
  }

  if (!currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'You recently changed your password. Please log in again!',
        401
      )
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.body.role);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You don't have permission to perform this action`, 403)
      );
    }
    next();
  };
};
