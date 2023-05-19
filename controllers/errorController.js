const AppError = require('./../utils/appError');

 /**
   * Handles a CastError error.
   *
   * @param {Error} err The error object.
   * @returns {Error} The modified error object.
   */
  const handleCastErrorDB = (err) => {
    const message = `Invalid input ${err.path} ${err.value}`;
    return new AppError(message, 400);
  };

  /**
   * Handles a duplicate fields error.
   *
   * @param {Error} err The error object.
   * @returns {Error} The modified error object.
   */
   const handleDuplicateFieldsDB = (err) => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    return new AppError(
      `Duplicate field value ${value} please use another value!`,
      400
    );
  };

  /**
   * Handles a validation error.
   *
   * @param {Error} err The error object.
   * @returns {Error} The modified error object.
   */
   const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    return new AppError(`Invalid Input data. ${errors.join('. ')}`, 400);
  };

  /**
   * Handles a JWT error.
   *
   * @returns {Error} The modified error object.
   */
   const handleJWTError = () => {
    return next(new AppError('Invalid token. Please login again!', 401));
  };

  /**
   * Handles a JWT expired error.
   *
   * @returns {Error} The modified error object.
   */
   const handleJWTExpiredError = () => {
    return next(
      new AppError('Your token has expired. Please Log in again!', 401)
    );
  };

  /**
   * Sends the error response in development mode.
   *
   * @param {Error} err The error object.
   * @param {Object} res The response object.
   * @returns {void}
   */
   const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  };

  /**
   * Sends the error response in production mode.
   *
   * @param {Error} err The error object.
   * @param {Object} res The response object.
   * @returns {void}
   */

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Somthing want very wrong!',
    });
  }
};


/**
 * Handles errors.
 *
 * @param {Error} err The error object.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {Function} next The next middleware function.
 * @returns {void}
 */
 module.exports = (err, req, res, next) => {
  /**
   * Sets the error status code.
   *
   * @type {number}
   */
  err.statusCode = err.statusCode || 500;

  /**
   * Sets the error status message.
   *
   * @type {string}
   */
  err.status = err.status || 'error';


  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }else if(process.env.NODE_ENV === 'production'){
  /**
   * Sends the error response in production mode.

   */
    let error = { ...err };
    error.message = err.message;

      // Handle specific errors.
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    } else if (err.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    } else if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    } else if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    } else if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }


  next();
};




