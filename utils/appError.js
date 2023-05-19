/**
 * This class represents an application error.
 */
 class AppError extends Error {
  /**
   * Creates a new AppError instance.
   *
   * @param {string} message The error message.
   * @param {number} statusCode The HTTP status code.
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Exports the `AppError` class.
 *
 * @type {AppError}
 */
module.exports = AppError;
