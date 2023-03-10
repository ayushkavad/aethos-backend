const AppError = require('../utils/appError');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updateMyPassword.'
      )
    );
  }

  const filterBody = filterObj(req.body, 'name', 'email');

  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  console.log(updateUser);

  res.status(200).json({
    status: 'success',
    data: {
      data: updateUser,
    },
  });
});

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

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: {
      data: null,
    },
  });
});

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
