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
      set: (val) => Math.round(val * 10) / 10,
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
      required: true,
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

// courseSchema.index({price: 1})
courseSchema.index({ price: 1, ratingsAverage: -1 });
courseSchema.index({ slug: 1 });

courseSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'course',
  localField: '_id',
});

courseSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

courseSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'instructor',
    select: '-__v -passwordChangedAt',
  });

  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
