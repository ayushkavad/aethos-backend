const mongoose = require('mongoose');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

/**
 * Gets all documents from a model.
 *
 * @param {Model} model The model to get documents from.
 * @returns {Promise<Array<Document>>} A promise that resolves to an array of documents.
 */
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

/**
 * Gets a single document from a model.
 *
 * @param {Model} model The model to get the document from.
 * @param {Array<string>} populateArr The names of the properties to populate.
 * @returns {Promise<Document>} A promise that resolves to the document.
 */
exports.getOne = (Model, populateArr) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateArr) query = query.populate(populateArr);
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

/**
 * Creates a new document in a model.
 *
 * @param {Model} model The model to create the document in.
 * @param {Object} reqBody The request body containing the properties for the document.
 * @returns {Promise<Document>} A promise that resolves to the document.
 */
exports.createOne = (Model, reqBody) =>
  catchAsync(async (req, res, next) => {
    if (!reqBody.course) reqBody.course = req.params.courseId;
    const doc = await Model.create(reqBody);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

/**
 * Updates a document in a model.
 *
 * @param {Model} model The model to update the document in.
 * @param {Object} reqBody The request body containing the properties to update.
 * @returns {Promise<Document>} A promise that resolves to the document.
 */
exports.updateOne = (Model, reqBody) =>
  catchAsync(async (req, res, next) => {
    if (req.file) {
      req.body.imageCover = req.file.filename;
    }
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

/**
 * Deletes a document from a model.
 *
 * @param {Model} model The model to delete the document from.
 * @param {string} id The ID of the document to delete.
 * @returns {Promise<Document>} A promise that resolves to the document.
 */
exports.deleteOne = (Model, id) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(id);

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
