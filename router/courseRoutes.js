const express = require('express');
const {
  getTopRatings,
  getBestSeller,
  createMyCourse,
  process,
  createCourse,
  action,
  getCourse,
  getAllCourses,
  uploadCourseImageCover,
  resizeCourseImageCover,
  updateCourse,
  deleteCourse,
} = require('./../controllers/courseController');
const { protect, restrictTo } = require('./../controllers/authController');
const reviewRouter = require('./../router/reviewRouters');
const uploadRouter = require('./../router/mediaRouters');

const router = express.Router();

router.use('/:courseId/reviews', reviewRouter);
router.use('/:courseId/uploads', uploadRouter);

router.route('/top-ratings').get(getTopRatings);
router.route('/best-seller').get(getBestSeller);

router
  .route('/')
  .get(getAllCourses)
  .post(protect, restrictTo('admin'), createMyCourse, process, createCourse);

router
  .route('/:id')
  .get(getCourse)
  .patch(
    protect,
    restrictTo('admin'),
    action,
    uploadCourseImageCover,
    resizeCourseImageCover,
    updateCourse
  )
  .delete(protect, restrictTo('admin'), action, deleteCourse);

module.exports = router;
