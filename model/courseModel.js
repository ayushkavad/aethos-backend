const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A course mush have a title.'],
    unique: true,
  },
  price: {
    type: String,
    required: [true, 'A course mush have a title.'],
    unique: true,
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
