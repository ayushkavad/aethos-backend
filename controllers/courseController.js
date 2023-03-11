const AppError = require('../utils/appError');
const Course = require('./../model/courseModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllCourses = factory.getAll(Course);
exports.getCourse = factory.getOne(Course, { path: 'reviews' });
exports.createCourse = factory.createOne(Course);
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);

exports.getBestSeller = catchAsync(async (req, res, next) => {
  const course = await Course.find({ bestseller: { $ne: false } });

  if (!course) {
    return next(new AppError('No course found with that ID!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: course,
    },
  });
});

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
