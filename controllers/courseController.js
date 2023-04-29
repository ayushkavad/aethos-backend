const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const Course = require('./../model/courseModel');
const factory = require('./handlerFactory');

exports.process = (req, res, next) => {
  req.body.learningContent = req.body.learningContent.split('\n');
  req.body.requirement = req.body.requirement.split('\n');
  next();
};

exports.createMyCourse = (req, res, next) => {
  if (req.user.id) req.body.instructor = req.user.id;
  next();
};

exports.action = async (req, res, next) => {
  let id;
  req.params.courseId ? (id = req.params.courseId) : (id = req.params.id);

  const course = await Course.findById(id);

  if (req.user.id !== course.instructor.id) {
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
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only image', 400), false);
  }
};

exports.resizeCourseImageCover = (req, res, next) => {
  if (!req.file) next();

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

exports.getAllCourses = factory.getAll(Course);
exports.getBestSeller = factory.getAll(Course);
exports.getCourse = factory.getOne(Course, ['reviews', 'mediaContent']);
exports.createCourse = factory.createOne(Course);
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);

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
