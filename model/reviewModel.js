const mongoose = require('mongoose');
const Course = require('./courseModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: [true, 'Review must belong to a course.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Index the review model.
reviewSchema.index({ course: 1, user: 1 }, { unique: true });

// Define the pre-find hook for the review model.
reviewSchema.pre(/^find/, function (next) {
  // Populate the user for the review.
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// Define the static method to calculate the average ratings for a course.
reviewSchema.statics.calcAverageRatings = async function (courseId) {
  const stats = await this.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: '$course',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Course.findByIdAndUpdate(courseId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// Define the post-save hook for the review model.
reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.course);
});

// Define the pre-findOneAnd hook for the review model.
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne().clone();
  next();
});

// Define the post-findOneAnd hook for the review model.
reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.course);
});

// Define the Review model.
const Review = mongoose.model('Review', reviewSchema);

// Export the Review model.
module.exports = Review;