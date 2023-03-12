const mongoose = require('mongoose');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To Allow for nested GET Reviews on Course
    let filter = {};
    if (req.params.courseId) filter = { course: req.params.courseId };
    if (req.originalUrl.split('/').includes('best-seller'))
      filter = { bestseller: { $ne: false } };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    let doc;
    if (Model === mongoose.model('Course') && req.query.search) {
      doc = await Model.aggregate([
        {
          $search: {
            index: 'SearchTitle',
            text: {
              query: req.query.search,
              path: {
                wildcard: '*',
              },
              fuzzy: {},
            },
          },
        },
      ]);
      doc = await Model.populate(doc, {
        path: 'instructor',
        select: '-__v -passwordChangedAt',
      });
    } else {
      doc = await features.query;
    }

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, populateObj) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateObj) query = query.populate(populateObj);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No document found with that ID!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID!', 404));
    }

    res.status(204).json({
      status: 'success',
      data: {
        data: null,
      },
    });
  });

// console.log('hello')
