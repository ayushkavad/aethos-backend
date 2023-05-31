const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const { getAll, getOne, updateOne, deleteOne } = require('./handlerFactory');


const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {

  const isImage = file.mimetype.startsWith('image');

  if (isImage) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only image', 400), false);
  }
};


exports.resizeUserPhoto = (req, res, next) => {

  const hasFile = req.file;

  if (!hasFile) {
    next();
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};


const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');


const filterObj = (obj, ...allowedFields) => {

  const newObj = {};
  Object.keys(obj).forEach((el) => {
    const isAllowedField = allowedFields.includes(el);
    if (isAllowedField) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};


exports.updateMe = catchAsync(async (req, res, next) => {

  const hasPassword = req.body.password || req.body.passwordConfirm;
  
  // If the request body contains a password or passwordConfirm field, returns an error.
  
  if (hasPassword) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updateMyPassword.'
      )
    );
  }

  const filterBody = filterObj(req.body, 'name', 'email');
  
  // If the request contains a file, sets the `photo` field to the file's filename.
  if (req.file) {
    filterBody.photo = req.file.filename;
  }

  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });


  res.status(200).json({
    status: 'success',
    data: {
      data: updateUser,
    },
  });
});


exports.deleteMe = catchAsync(async (req, res, next) => {

  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: {
      data: null,
    },
  });
});

exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);

// Only administrators can delete users.
exports.updateUser = updateOne(User);
// Only administrators can delete users.
exports.deleteUser = deleteOne(User);
