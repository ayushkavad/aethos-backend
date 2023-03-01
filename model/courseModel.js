const mongoose = require('mongoose');
// const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A course must have a title.'],
    unique: true,
    trim: true,
  },
  level: {
    type: String,
    required: [true, 'A course must a level.'],
  },
  price: {
    type: Number,
    required: [true, 'A course must have a title.'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Ratings must be above 1.0'],
    max: [5, 'Ratings must be below 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  imageCover: {
    type: String,
    required: [true, 'A course must have a image cover.'],
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A course must have a summary'],
  },
  discription: {
    type: String,
    trim: true,
    required: [true, 'A course must have a discription.'],
  },
  learningContent: {
    type: String,
    trim: true,
    required: [true, 'A course must have a learning content.'],
  },
  requirement: {
    type: String,
    trim: true,
    required: [true, 'A course must have a requirement '],
  },
  courseContent: {
    type: [{ name: String, content: [String] }],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
