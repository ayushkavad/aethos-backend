const express = require('express');
const {
  getAllUploads,
  videosUpload,
  videoProcess,
  uploadFiles,
  getOneUpload,
  deleteUpload,
} = require('./../controllers/mediaController');
const { protect, restrictTo } = require('./../controllers/authController');
const { action } = require('./../controllers/courseController');

const router = express.Router({ mergeParams: true });

// // Protect all routers and restrictTo admin
router.use(protect, restrictTo('admin'));

router
  .route('/')
  .get(getAllUploads)
  .post(videosUpload, videoProcess, uploadFiles);

router.route('/:id').get(getOneUpload);
router.route('/:courseId/uploads/:id').delete(action, deleteUpload);

module.exports = router;
