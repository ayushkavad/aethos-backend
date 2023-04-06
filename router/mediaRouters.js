const express = require('express');
const mediaController = require('./../controllers/mediaController');
const authController = require('./../controllers/authController');
const courseController = require('./../controllers/courseController');

const router = express.Router({ mergeParams: true });

// Protect all routers and restrictTo admin
router.use(authController.protect, authController.restrictTo('admin'));

router
  .route('/')
  .get(mediaController.getAllUploads)
  .post(
    mediaController.videosUpload,
    mediaController.videoProcess,
    mediaController.uploadFiles
  );

router.route('/:id').get(mediaController.getOneUpload);
router
  .route('/:courseId/uploads/:id')
  .delete(courseController.action, mediaController.deleteUpload);

module.exports = router;
