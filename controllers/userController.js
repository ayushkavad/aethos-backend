const AppError = require('../utils/appError');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    courses: users.length,
    data: {
      data: users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError(`No user found with that ID!`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

exports.createUser = async (req, res, next) => {
  try {
    // res.status(201).json({
    //   status: 'success',
    //   data: {
    //     data: newCourse,
    //   },
    // });
  } catch (err) {
    // res.status(400).json({
    //   status: 'fail',
    //   message: 'invalid data sent!',
    // });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    // res.status(200).json({
    //   status: 'success',
    //   data: {
    //     data: course,
    //   },
    // });
  } catch (err) {
    // res.status(404).json({
    //   status: 'fail',
    //   message: 'No course found with that ID!',
    // });
  }
};

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID!', 404));
  }

  res.status(204).json({
    status: 'success',
    data: {
      data: null,
    },
  });
});
