const path = require('path');
const multer = require('multer');
const Media = require('./../model/mediaModel');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

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

/**
 * This function defines the videos upload route.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {Function} next The next middleware function.
 * @returns {void}
 */
exports.videosUpload = upload.fields([{ name: 'mediaContent', maxCount: 50 }]);

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
 * Gets all uploads.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {Function} next The next middleware function.
 * @returns {void}
 */
 exports.getAllUploads = factory.getAll(Media);

 /**
  * Gets an upload by ID.
  *
  * @param {Object} req The request object.
  * @param {Object} res The response object.
  * @param {Function} next The next middleware function.
  * @returns {void}
  */
 exports.getOneUpload = factory.getOne(Media);
 
 /**
  * Uploads files.
  *
  * @param {Object} req The request object.
  * @param {Object} res The response object.
  * @param {Function} next The next middleware function.
  * @returns {void}
  */
 exports.uploadFiles = factory.createOne(Media);
 
 /**
  * Updates an upload.
  *
  * @param {Object} req The request object.
  * @param {Object} res The response object.
  * @param {Function} next The next middleware function.
  * @returns {void}
  */
 exports.updateUpload = factory.updateOne(Media);
 
 /**
  * Deletes an upload.
  *
  * @param {Object} req The request object.
  * @param {Object} res The response object.
  * @param {Function} next The next middleware function.
  * @returns {void}
  */
 exports.deleteUpload = factory.deleteOne(Media);
 