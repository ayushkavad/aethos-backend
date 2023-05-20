const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const { getAll, getOne, updateOne, deleteOne } = require('./handlerFactory');

/**
 * Defines the memory storage for Multer.
 *
 * @type {Object}
 */
const multerStorage = multer.memoryStorage();

/**
 * Defines the file filter for Multer.
 *
 * @param {Object} req The request object.
 * @param {Object} file The file object.
 * @param {Function} cb The callback function.
 * @returns {void}
 */
const multerFilter = (req, file, cb) => {
  /**
   * Checks if the file is an image.
   *
   * @type {boolean}
   */
  const isImage = file.mimetype.startsWith('image');

  /**
   * If the file is an image, returns true.
   *
   * @returns {boolean}
   */
  if (isImage) {
    cb(null, true);
  } else {
    /**
     * If the file is not an image, returns an error.
     *
     * @param {string} message The error message.
     * @param {number} statusCode The HTTP status code.
     * @returns {void}
     */
    cb(new AppError('Not an image! Please upload only image', 400), false);
  }
};

/**
 * Defines the resizeUserPhoto function.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {Function} next The next middleware function.
 * @returns {void}
 */
exports.resizeUserPhoto = (req, res, next) => {
  /**
   * Checks if the request has a file.
   *
   * @type {boolean}
   */
  const hasFile = req.file;

  /**
   * If the request does not have a file, calls the next middleware function.
   *
   * @returns {void}
   */
  if (!hasFile) {
    next();
  }

  /**
   * Sets the file's filename.
   *
   * @type {string}
   */
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  /**
   * Resizes the file to 500x500 pixels and saves it to the `public/img/users` directory.
   *
   * @returns {void}
   */
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

/**
 * Defines the upload function.
 *
 * @param {Object} storage The storage object.
 * @param {Object} fileFilter The file filter object.
 * @returns {Object} The upload object.
 */
const upload = multer({
  /**
   * The storage object.
   *
   * @type {Object}
   */
  storage: multerStorage,

  /**
   * The file filter object.
   *
   * @type {Object}
   */
  fileFilter: multerFilter,
});

/**
 * Defines the uploadUserPhoto function.
 *
 * @param {string} photo The name of the file field.
 * @returns {Object} The upload object.
 */

exports.uploadUserPhoto = upload.single('photo');

/**
 * Filters an object by the specified fields.
 *
 * @param {Object} obj The object to be filtered.
 * @param {...string} allowedFields The names of the allowed fields.
 * @returns {Object} The filtered object.
 */
const filterObj = (obj, ...allowedFields) => {
  /**
   * The new object.
   *
   * @type {Object}
   */
  const newObj = {};

  /**
   * Iterates over the object's keys.
   *
   * @param {string} el The key.
   */
  Object.keys(obj).forEach((el) => {
    /**
     * Checks if the key is in the list of allowed fields.
     *
     * @type {boolean}
     */
    const isAllowedField = allowedFields.includes(el);

    /**
     * If the key is in the list of allowed fields, adds it to the new object.
     */
    if (isAllowedField) {
      newObj[el] = obj[el];
    }
  });

  /**
   * Returns the new object.
   *
   * @returns {Object}
   */
  return newObj;
};

/**
 * Gets the current user.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {Function} next The next middleware function.
 * @returns {void}
 */
exports.getMe = (req, res, next) => {
  /**
   * Sets the request parameter `id` to the current user's ID.
   *
   * @type {number}
   */
  req.params.id = req.user.id;

  next();
};

/**
 * Updates the current user.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {Function} next The next middleware function.
 * @returns {void}
 */
exports.updateMe = catchAsync(async (req, res, next) => {
  /**
   * Checks if the request body contains a password or passwordConfirm field.
   *
   * @type {boolean}
   */
  const hasPassword = req.body.password || req.body.passwordConfirm;

  /**
   * If the request body contains a password or passwordConfirm field, returns an error.
   */
  if (hasPassword) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updateMyPassword.'
      )
    );
  }

  /**
   * Filters the request body.
   *
   * @param {Object} body The request body.
   * @param {string[]} allowedFields The names of the allowed fields.
   * @returns {Object} The filtered object.
   */
  const filterBody = filterObj(req.body, 'name', 'email');

  /**
   * If the request contains a file, sets the `photo` field to the file's filename.
   */
  if (req.file) {
    filterBody.photo = req.file.filename;
  }

  /**
   * Updates the user.
   *
   * @param {number} id The user ID.
   * @param {Object} body The updated user data.
   * @param {Object} options The options.
   * @returns {Promise<User>} A promise that resolves to the updated user.
   */
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  /**
   * Returns the updated user.
   */
  res.status(200).json({
    status: 'success',
    data: {
      data: updateUser,
    },
  });
});

/**
 * Deletes the current user.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {Function} next The next middleware function.
 * @returns {void}
 */
exports.deleteMe = catchAsync(async (req, res, next) => {
  /**
   * Updates the user to inactive.
   *
   * @param {number} id The user ID.
   * @param {Object} body The updated user data.
   * @param {Object} options The options.
   * @returns {Promise<User>} A promise that resolves to the updated user.
   */
  await User.findByIdAndUpdate(req.user.id, { active: false });

  /**
   * Returns a 204 No Content response.
   */
  res.status(204).json({
    status: 'success',
    data: {
      data: null,
    },
  });
});

/**
 * Gets all users.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {Function} next The next middleware function.
 * @returns {void}
 */
exports.getAllUsers = getAll(User);

/**
 * Gets a user by ID.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {Function} next The next middleware function.
 * @returns {void}
 */
exports.getUser = getOne(User);

// Only administrators can delete users.
exports.updateUser = updateOne(User);
// Only administrators can delete users.
exports.deleteUser = deleteOne(User);
