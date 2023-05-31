/** 
*This module provides a set of functions for managing user authentication and authorization.
*/

 const { promisify } = require('util');
 const crypto = require('crypto');
 const jwt = require('jsonwebtoken');
 const User = require('./../model/userModel');
 const catchAsync = require('../utils/catchAsync');
 const AppError = require('../utils/appError');
 const sendEmail = require('./../utils/email');
 

 const signInToken = (id) => {
   return jwt.sign({ id }, process.env.SECRET_KEY, {
     expiresIn: process.env.EXPIRES_IN,
   });
 };

 const createSendToken = async (user, statusCode, res) => {
   const token = await signInToken(user._id);
 
   const cookieOptions = {
     expires: new Date(
       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
     ),
     httpOnly: true,
   };
 
   if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
 
   await res.cookie('jwt', token, cookieOptions);
 
   user.password = undefined;
 
   await res.status(statusCode).json({
     status: 'success',
     token,
     data: {
       user,
     },
   });
 };
 

exports.signup = catchAsync(async (req, res, next) => {
  // Create a new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  // Create a JWT token and set it in the response
  createSendToken(newUser, 201, res);
});


 exports.login = catchAsync(async (req, res, next) => {
  // 1) Check if email and password exist
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Please provide valid email and password', 401));
  }

  // 3) If everything is ok, send token to client
  createSendToken(user, 200, res);
});


 exports.logout = (req, res, next) => {
  // Set a cookie with a short expiration date to invalidate the JWT token
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  // Indicate success
  res.status(200).json({ status: 'success' });
};


 exports.protect = catchAsync(async (req, res, next) => {
  // Get the JWT token from the request
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookie.jwt) {
    token = req.cookie.jwt;
  }

  // If there is no JWT token, return an unauthorized error
  if (!token) {
    return next(
      new AppError('You are not logged in!. Please login to get access.', 401)
    );
  }

  // Verify the JWT token
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

  // Get the user from the database
  const currentUser = await User.findById(decoded.id);

  // If the user does not exist, return an unauthorized error
  if (!currentUser) {
    return next(
      new AppError('The user belong to this token does not longer exist!', 401)
    );
  }

  // If the user recently changed their password, return an unauthorized error
  if (!currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'You recently changed your password. Please log in again!',
        401
      )
    );
  }

  // Set the current user on the request object
  req.user = currentUser;

  // Continue to the next middleware function
  next();
});


 exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if the user has the required role
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You don't have permission to perform this action`, 403)
      );
    }

    // Continue to the next middleware function
    next();
  };
};


 exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Find the user by email address
  const user = await User.findOne({ email: req.body.email });

  // If the user does not exist, return an error
  if (!user) {
    return next(new AppError('No user found with that email address.', 404));
  }

  // Create a password reset token for the user
  const resetToken = user.createPasswordResetToken();

  // Save the user with the new password reset token
  await user.save({ validateBeforeSave: false });

  // Get the reset URL
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/user/resetPassword/${resetToken}`;

  // Create the reset email message
  const message = `Forgot your password? send PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forgot your password. please ignore this email!`;

  // Try to send the email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your reset password token (valid for 10 min)',
      message,
    });

    // Indicate success
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    // If the email fails to send, reset the password reset token and try again later
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Return an error
    return next(
      new AppError('There was an error sending email. Try again leter!', 500)
    );
  }
});


 exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get the hashed token from the request
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Find the user by hashed token and password reset expiration date
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // If the user does not exist or the token has expired, return an error
  if (!user) {
    return next(new AppError('Invalid token or has expired!', 400));
  }

  // Set the user's new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  // Remove the password reset token and expiration date
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // Save the user
  await user.save({ validateBeforeSave: false });

  // Create a JWT token and set it in the response
  createSendToken(user, 200, res);
});


 exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get the current user from the request
  const user = await User.findById(req.user.id).select('+password');

  // If the current password is incorrect, return an error
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong!', 400));
  }

  // Set the user's new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  // Save the user
  await user.save();

  // Create a JWT token and set it in the response
  createSendToken(user, 200, res);
});
