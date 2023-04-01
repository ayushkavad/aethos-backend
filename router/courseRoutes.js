const express = require('express');
const courseControllers = require('./../controllers/courseController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../router/reviewRouters');
const uploadRouter = require('./../router/mediaRouters');

const router = express.Router();

router.use('/:courseId/reviews', reviewRouter);
router.use('/:courseId/uploads', uploadRouter);

router.route('/top-ratings').get(courseControllers.getTopRatings);
router.route('/best-seller').get(courseControllers.getBestSeller);

router
  .route('/')
  .get(courseControllers.getAllCourses)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    courseControllers.createMyCourse,
    courseControllers.createCourse
  );

router
  .route('/:id')
  .get(courseControllers.getCourse)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    courseControllers.action,
    courseControllers.uploadCourseImageCover,
    courseControllers.resizeCourseImageCover,
    courseControllers.updateCourse
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    courseControllers.action,
    courseControllers.deleteCourse
  );

module.exports = router;
