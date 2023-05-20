const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');
const Review = require('./../model/reviewModel');

/**
 * Sets the `course` and `user` properties on the request body if they are not present.
 *
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @param {NextFunction} next The next function in the middleware chain.
 */
exports.setCourseAndUserId = (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

/**
 * Returns all reviews from the database.
 *
 * @param {Review} Review The model for reviews.
 * @returns {Promise<Array<Review>>} A promise that resolves to an array of reviews.
 */
exports.getAllReview = factory.getAll(Review);

/**
 * Returns a single review from the database by its ID.
 *
 * @param {Review} Review The model for reviews.
 * @param {string} id The ID of the review to retrieve.
 * @returns {Promise<Review>} A promise that resolves to the review.
 */
exports.getReview = getOne(Review);

/**
 * Creates a new review in the database.
 *
 * @param {Review} Review The model for reviews.
 * @param {Object} reqBody The request body containing the properties for the review.
 * @returns {Promise<Review>} A promise that resolves to the created review.
 */
exports.createReview = createOne(Review);

/**
 * Updates an existing review in the database.
 *
 * @param {Review} Review The model for reviews.
 * @param {string} id The ID of the review to update.
 * @param {Object} reqBody The request body containing the properties to update.
 * @returns {Promise<Review>} A promise that resolves to the updated review.
 */
exports.updateReview = updateOne(Review);

/**
 * Deletes a review from the database.
 *
 * @param {Review} Review The model for reviews.
 * @param {string} id The ID of the review to delete.
 * @returns {Promise<void>} A promise that resolves when the review is deleted.
 */
exports.deleteReview = deleteOne(Review);
