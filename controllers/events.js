const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require('../middleware/async');
const Event = require("../models/Event");


// @des Get all events
// @route GET /api/v1/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res, next) => {
    const events = await Event.find();
    res.status(200).json({ success: true, count: events.length, data: events });
});

// @des Get single event
// @route GET /api/v1/events/:id
// @access  Private
exports.getEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: event });
});

// @des Create an event
// @route POST /api/v1/events
// @access  Private
exports.createEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event,
    });
});

// @des Update/Edit an event
// @route PUT /api/v1/events
// @access  Private
exports.updateEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    }

    res.status(200).json({ success: true, data: event });
});

// @des Delete an event
// @route DELETE /api/v1/events/:id
// @access  Private
exports.deleteEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    }

    res.status(200).json({ success: true, data: {} });
});
