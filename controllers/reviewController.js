const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');
const Review = require('./../model/reviewModel');

exports.setCourseAndUserId = (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReview = getAll(Review);
exports.getReview = getOne(Review);
exports.createReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
