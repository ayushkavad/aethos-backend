const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const Course = require('./../model/courseModel');
const { getAll, createOne, updateOne, deleteOne } = require('./handlerFactory');

/**
 * This function processes the request body and prepares it for further processing.
 *
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @param {NextFunction} next The next function in the middleware chain.
 * @returns {void}
 */
exports.process = (req, res, next) => {
  // Split the learning content and requirement into an array of lines.
  req.body.learningContent = req.body.learningContent.split('\n');
  req.body.requirement = req.body.requirement.split('\n');

  // Continue to the next middleware function.
  next();
};

/**
 * Creates a new course.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {Function} next The next function in the middleware chain.
 *
 * @returns {void}
 */
exports.createMyCourse = (req, res, next) => {
  // Check if the user is logged in.
  if (req.user.id) {
    // Set the instructor property of the request body to the user's ID.
    req.body.instructor = req.user.id;
  }

  // Call the next function in the middleware chain.
  next();
};

/**
 * @function exports.action
 * @description Verifies that the current user is the owner of the course before allowing them to perform an action.
 * @param {Object} req The express request object.
 * @param {Object} res The express response object.
 * @param {Function} next The next middleware function.
 * @returns {void}
 */
exports.action = async (req, res, next) => {
  /**
   * @type {string}
   * @description The ID of the course.
   */
  let id;

  /**
   * @type {Course}
   * @description The course object.
   */
  const course = await Course.findById(id);

  /**
   * @type {boolean}
   * @description Whether the current user is the owner of the course.
   */
  const isOwner = req.user.id === course.instructor.id;

  if (!isOwner) {
    /**
     * @type {AppError}
     * @description An error object that indicates that the current user is not the owner of the course.
     */
    return next(
      new AppError(
        `You can not perform this action. You are not owner of this course!`,
        400
      )
    );
  }

  next();
};

/**
 * @variable multerStorage
 * @type {Object}
 * @description A multer storage object that stores uploaded files in memory.
 */
const multerStorage = multer.memoryStorage();

/**
 * @function multerFilter
 * @description A multer filter function that checks if the uploaded file is an image file.
 * @param {Object} req The express request object.
 * @param {Object} file The uploaded file object.
 * @param {Function} cb A callback function.
 * @returns {void}
 */
const multerFilter = (req, file, cb) => {
  /**
   * @type {string}
   * @description The MIME type of the uploaded file.
   */
  const mimetype = file.mimetype;

  /**
   * @type {boolean}
   * @description Whether the uploaded file is an image file.
   */
  const isImage = mimetype.startsWith('image');

  if (isImage) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only image', 400), false);
  }
};

/**
 * @function exports.resizeCourseImageCover
 * @description Resizes and uploads an image for a course.
 * @param {Object} req The express request object.
 * @param {Object} res The express response object.
 * @param {Function} next The next middleware function.
 * @returns {void}
 */
exports.resizeCourseImageCover = (req, res, next) => {
  /**
   * @type {boolean}
   * @description Whether the request has an uploaded file.
   */
  const hasFile = req.file;

  if (!hasFile) {
    next();
    return;
  }

  /**
   * @type {string}
   * @description The filename of the uploaded file.
   */
  req.file.filename = `course-${req.params.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/courses/${req.file.filename}`);

  next();
};

/**
 * @variable upload
 * @type {Object}
 * @description A multer instance that will be used to upload the image.
 */
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

/**
 * @function exports.uploadCourseImageCover
 * @description Uploads an image to the server.
 * @param {string} name The name of the file input field.
 * @returns {Object} A multer upload object.
 */

exports.uploadCourseImageCover = upload.single('imageCover');

exports.getAllCourses = getAll(Course);
exports.getBestSeller = getAll(Course);
exports.getCourse = getOne(Course, ['reviews', 'mediaContent']);
exports.createCourse = createOne(Course);
exports.updateCourse = updateOne(Course);
exports.deleteCourse = deleteOne(Course);

exports.getTopRatings = async (req, res, next) => {
  try {
    const course = await Course.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.8 } },
      },
      {
        $group: {
          _id: { $toUpper: '$level' },
          numCourse: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        data: course,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
