const path = require('path');
const multer = require('multer');
const Media = require('./../model/mediaModel');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/videos');
  },
  filename: function (req, file, cb) {
    req.files.filename = `${Date.now()}.mp4`;
    cb(null, Date.now() + req.files.filename);
  },
});

const multerFilter = (req, file, cb) => {
  var ext = path.extname(file.originalname);

  if (ext !== '.mkv' && ext !== '.mp4') {
    return cb(
      new AppError('Not a video! Please upload only mp4 or mkv.', 400),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

exports.videosUpload = upload.fields([{ name: 'mediaContent', maxCount: 50 }]);

exports.videoProcess = (req, res, next) => {
  req.body.mediaContent = [];
  req.files.mediaContent.forEach((media) => {
    req.body.mediaContent.push(media.path);
  });
  next();
};

exports.getAllUploads = factory.getAll(Media);
exports.uploadFiles = factory.createOne(Media);
