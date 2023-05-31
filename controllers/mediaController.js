const path = require('path');
const multer = require('multer');
const Media = require('./../model/mediaModel');
const AppError = require('./../utils/appError');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./../controllers/handlerFactory');


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
  const ext = path.extname(file.originalname);

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

module.exports.videosUpload = upload.fields([
  { name: 'mediaContent', maxCount: 50 },
]);


exports.videoProcess = (req, res, next) => {
  const mediaContent = [];
  req.files.mediaContent.forEach((media) => {
    mediaContent.push(media.path);
  });
  req.body.mediaContent = mediaContent;
  next();
};

exports.getAllUploads = getAll(Media);
exports.getOneUpload = getOne(Media);
exports.uploadFiles = createOne(Media);
exports.updateUpload = updateOne(Media);
exports.deleteUpload = deleteOne(Media);
