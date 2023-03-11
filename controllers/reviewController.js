const Review = require('./../model/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReview = catchAsync(async (req, res, next) => {
  let filter;
  if (req.params.courseId) filter = { course: req.params.courseId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    length: reviews.length,
    data: {
      data: reviews,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      data: review,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  if (!req.body.user) req.body.user = req.user.id;

  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: review,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    status: 'success',
    data: {
      data: review,
    },
  });
});

exports.setCourseAndUserId = (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

// exports.deleteReview = exports.deleteReview = catchAsync(
//   async (req, res, next) => {
//     await Review.findByIdAndDelete(req.params.id);

//     res.status(204).json({
//       status: 'success',
//       data: {
//         data: null,
//       },
//     });
//   }
// );
