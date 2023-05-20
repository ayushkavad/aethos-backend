const express = require('express');
const {
  getMe,
  getUser,
  uploadUserPhoto,
  resizeUserPhoto,
  updateMe,
  deleteMe,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
} = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('logout', logout);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protect all router after this middleware
router.use(protect);

router.patch('/updateMyPassword', updatePassword);

router.get('/me', getMe, getUser);
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe', deleteMe);

// Protect all routes and restric to admin after this middleware
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
