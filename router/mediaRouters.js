const express = require('express');
const {
  videosUpload,
  videoProcess,
  uploadFiles,
  getAllUploads,
  getOneUpload,
} = require('./../controllers/mediaController');
const authController = require('./../controllers/authController');
const { action, deleteUpload } = require('./../controllers/courseController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect, authController.restrictTo('admin'));

router
  .route('/')
  .get(getAllUploads)
  .post(videosUpload, videoProcess, uploadFiles);

router.route('/:id').get(getOneUpload);
router.route('/:courseId/uploads/:id').delete(action, deleteUpload);

module.exports = router;
