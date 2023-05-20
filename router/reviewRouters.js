const express = require('express');
const {
  getAllReview,
  setCourseAndUserId,
  createReview,
  getReview,
  updateReview,
  deleteReview,
} = require('./../controllers/reviewController');
const { protect, restrictTo } = require('./../controllers/authController');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReview)
  .post(protect, restrictTo('user'), setCourseAndUserId, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(protect, restrictTo('user'), updateReview)
  .delete(protect, restrictTo('user', 'admin'), deleteReview);

module.exports = router;
