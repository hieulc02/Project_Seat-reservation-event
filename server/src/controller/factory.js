const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('Not found document with ID', 404));
    }

    res.status(204).json({
      status: 'success',
    });
  });
exports.deleteAll = (Model) =>
  catchAsync(async (req, res, next) => {
    await Model.deleteMany({});
    res.status(204).json({
      status: 'success',
    });
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('Not found document with ID', 404));
    }

    res.status(200).json({
      status: 'Event successfully updated',
      doc,
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError('Not found document with ID', 404));
    }
    res.status(200).json({
      status: 'success',
      doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.find({});
    res.status(200).json({
      status: 'success',
      doc,
    });
  });
