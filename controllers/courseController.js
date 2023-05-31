const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const Course = require('./../model/courseModel');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');


exports.process = (req, res, next) => {
  // Split the learning content and requirement into an array of lines.
  req.body.learningContent = req.body.learningContent.split('\n');
  req.body.requirement = req.body.requirement.split('\n');

  // Continue to the next middleware function.
  next();
};


exports.createMyCourse = (req, res, next) => {
  // Check if the user is logged in.
  if (req.user.id) {
    // Set the instructor property of the request body to the user's ID.
    req.body.instructor = req.user.id;
  }

  // Call the next function in the middleware chain.
  next();
};


exports.action = async (req, res, next) => {

  const course = await Course.findById(req.params.id);
  const isOwner = req.user.id === course.instructor.id;

  if (!isOwner) {
    return next(
      new AppError(
        `You can not perform this action. You are not owner of this course!`,
        400
      )
    );
  }

  next();
};


const multerStorage = multer.memoryStorage();


const multerFilter = (req, file, cb) => {
  const mimetype = file.mimetype;
  const isImage = mimetype.startsWith('image');

  if (isImage) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only image', 400), false);
  }
};

exports.resizeCourseImageCover = (req, res, next) => {

  const hasFile = req.file;

  if (!hasFile) {
    next();
    return;
  }

  req.file.filename = `course-${req.params.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/courses/${req.file.filename}`);

  next();
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});


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
