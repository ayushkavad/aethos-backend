const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const Course = require('./../model/courseModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.getAllCourses = async (req, res, next) => {
  try {
    const features = new APIFeatures(Course.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    let courses;
    if (req.query.search) {
      courses = await Course.aggregate([
        {
          $search: {
            index: 'SearchTitle',
            text: {
              query: req.query.search,
              path: {
                wildcard: '*',
              },
              fuzzy: {},
            },
          },
        },
      ]);
    } else {
      courses = await features.query;
    }

    res.status(200).json({
      status: 'success',
      courses: courses.length,
      data: {
        data: courses,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getCourse = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError('No course found with that ID!', 404));
  }
  const course = await Course.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      data: course,
    },
  });
});

exports.createCourse = async (req, res, next) => {
  try {
    const newCourse = await Course.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: newCourse,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateCourse = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError('No course found with that ID!', 404));
  }
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: course,
    },
  });
});

exports.deleteCourse = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError('No course found with that ID!', 404));
  }

  await Course.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: {
      data: null,
    },
  });
});

exports.getBestSeller = async (req, res, next) => {
  try {
    const course = await Course.find({ bestseller: { $ne: false } });

    res.status(200).json({
      status: 'success',
      data: {
        data: course,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTopRatings = async (req, res, next) => {
  try {
    const course = await Course.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.8 } },
      },
      {
        $group: {
          _id: { $toUpper: '$level' },
          numCourse: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        data: course,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
