const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A course must have a title.'],
      unique: true,
      trim: true,
      maxlength: [
        100,
        'A tour name must have less or equal then 40 characters',
      ],
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
    priceDiscount: {
      type: Number,
      default: 0,
      min: [0, 'Price discount must be above 0'],
      max: [100, 'Price discount must be below or equal 100'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratings must be above 1.0'],
      max: [5, 'Ratings must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    imageCover: String,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A course must have a summary'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A course must have a discription.'],
    },
    learningContent: {
      type: [String],
      trim: true,
      required: [true, 'A course must have a learning content.'],
    },
    requirement: {
      type: [String],
      trim: true,
      required: [true, 'A course must have a requirement '],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Index the course model.
courseSchema.index({ price: 1, ratingsAverage: -1 });
courseSchema.index({ slug: 1 });

/**
 * Defines a virtual property called `currentPrice` on the `Course` model.
 *
 * @type {mongoose.Schema.Virtual}
 */
 courseSchema.virtual('currentPrice').get(function () {
  /**
   * Calculates the current price of the course by subtracting the discount from the original price.
   *
   * @returns {number} The current price of the course.
   */
  return this.price - (this.price * this.priceDiscount) / 100;
});

// Define the virtual properties for the course model.
courseSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'course',
  localField: '_id',
});

courseSchema.virtual('mediaContent', {
  ref: 'Media',
  foreignField: 'course',
  localField: '_id',
});

// Define the pre-save hooks for the course model.
courseSchema.pre('save', function (next) {
  // Generate the slug for the course.
  this.slug = slugify(this.title, { lower: true });
  next();
});

courseSchema.pre(/^find/, function (next) {
  // Populate the instructor for the course.
  this.populate({
    path: 'instructor',
    select: '-__v -passwordChangedAt',
  });
  next();
});

courseSchema.pre('save', function (next) {
  // Calculate the current price of the course.
  const calcDiscountPrice = (this.price * this.priceDiscount) / 100;
  this.currentPrice = this.price - calcDiscountPrice;
  next();
});

// Define the Course model.
const Course = mongoose.model('Course', courseSchema);

// Export the Course model.
module.exports = Course;