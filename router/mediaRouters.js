const express = require('express');
const mediaController = require('./../controllers/mediaController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(mediaController.getAllUploads)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    mediaController.videosUpload,
    mediaController.videoProcess,
    mediaController.uploadFiles
  );

module.exports = router;
