const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  contentTitle: {
    type: String,
    required: [true, 'A course must have a content title.'],
  },
  mediaContent: {
    type: [
      { type: String, required: [true, 'A course must have a media content.'] },
    ],
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
  },
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
