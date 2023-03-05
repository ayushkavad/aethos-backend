const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });

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
    return next(new AppError('Please enter email and password!', 400));
  }

  //2) check if user exist && password correct
  const user = await User.findOne({ email }).select('+password');

  if (!user && !(await User.correctPassword(password, user.passowrd))) {
    return next(new AppError('Please provide valid email and password', 401));
  }

  //3) if everythings ok sens token to cline
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });

  res.status(200).json({
    status: 'success',
    token,
  });
});
