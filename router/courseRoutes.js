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
  .get(authController.protect, courseControllers.getAllCourses)
  .post(courseControllers.createCourse);

router
  .route('/:id')
  .get(courseControllers.getCourse)
  .patch(courseControllers.updateCourse)
  .delete(authController.protect, courseControllers.deleteCourse);

module.exports = router;
