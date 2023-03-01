const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A course must have a title.'],
    unique: true,
    trim: true,
    maxlength: [100, 'A tour name must have less or equal then 40 characters'],
    minlength: [10, 'A tour name must have more or equal then 10 characters'],
  },
  slug: String,
  level: {
    type: String,
    required: [true, 'A course must have a level'],
    enum: {
      values: ['beginner', 'intermediate', 'advanced'],
      message: 'level is either: beginner, intermediate, advanced',
    },
  },
  price: {
    type: Number,
    required: [true, 'A course must have a title.'],
  },
  peiceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price',
    },
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
  bestseller: {
    type: Boolean,
    default: false,
  },
});

courseSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// courseSchema.pre(/^find/, function (next) {
//   this.find({ bestseller: { $ne: false } });
//   next();
// });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
