const express = require('express');
const courseControllers = require('./../controllers/courseController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../router/reviewRouters');

const router = express.Router();

router.use('/:courseId/reviews', reviewRouter);

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
    courseControllers.updateCourse
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    courseControllers.action,
    courseControllers.deleteCourse
  );

module.exports = router;
