const path = require('path');
const multer = require('multer');
const Media = require('./../model/mediaModel');
const AppError = require('./../utils/appError');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./../controllers/handlerFactory');

/**
 * This function defines the file upload middleware.
 *
 * @param {Object} storage The storage object.
 * @param {Object} fileFilter The file filter object.
 * @returns {Object} The upload object.
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/videos');
  },
  filename: function (req, file, cb) {
    req.files.filename = `${Date.now()}.mp4`;
    cb(null, Date.now() + req.files.filename);
  },
});

/**
 * This function defines the file filter.
 *
 * @param {Object} req The request object.
 * @param {Object} file The file object.
 * @param {Function} cb The callback function.
 * @returns {void}
 */
const multerFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);

  if (ext !== '.mkv' && ext !== '.mp4') {
    return cb(
      new AppError('Not a video! Please upload only mp4 or mkv.', 400),
      false
    );
  }
  cb(null, true);
};

/**
 * This function defines the file upload middleware.
 *
 * @param {Object} storage The storage object.
 * @param {Object} fileFilter The file filter object.
 * @returns {Object} The upload object.
 */
const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

module.exports.videosUpload = upload.fields([
  { name: 'mediaContent', maxCount: 50 },
]);

/**
 * This function processes the uploaded videos.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {Function} next The next middleware function.
 * @returns {void}
 */

exports.videoProcess = (req, res, next) => {
  const mediaContent = [];
  req.files.mediaContent.forEach((media) => {
    mediaContent.push(media.path);
  });
  req.body.mediaContent = mediaContent;
  next();
};

/**
 * Returns all uploads from the database.
 *
 * @param {Mdeia} Media The model for uploads.
 * @returns {Promise<Array<Media>>} A promise that resolves to an array of uploads.
 */
exports.getAllUploads = getAll(Media);

/**
 * Returns a single upload from the database by its ID.
 *
 * @param {Media} Media The model for uploads.
 * @param {string} id The ID of the uploads to retrieve.
 * @returns {Promise<Media>} A promise that resolves to the upload.
 */
exports.getOneUpload = getOne(Media);

/**
 * Creates a new upload in the database.
 *
 * @param {Media} Media The model for uploads.
 * @param {Object} reqBody The request body containing the properties for the upload.
 * @returns {Promise<Review>} A promise that resolves to the created upload.
 */
exports.uploadFiles = createOne(Media);

/**
 * Updates an existing upload in the database.
 *
 * @param {Media} Media The model for uploads.
 * @param {string} id The ID of the upload to update.
 * @param {Object} reqBody The request body containing the properties to update.
 * @returns {Promise<Media>} A promise that resolves to the updated upload.
 */
exports.updateUpload = updateOne(Media);

/**
 * Deletes a Media from the database.
 *
 * @param {Review} Media The model for uploads.
 * @param {string} id The ID of the upload to delete.
 * @returns {Promise<void>} A promise that resolves when the upload is deleted.
 */
exports.deleteUpload = deleteOne(Media);
