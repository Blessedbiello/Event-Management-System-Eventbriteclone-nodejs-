const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Event = require("../models/Event");
// const Post = require("../models/Post");

// @des Get all events
// @route GET /api/v1/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res, next) => {
  let query;

  let queryStr = JSON.stringify(req.query);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Event.find(JSON.parse(queryStr));

  const events = await query;

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
  // Add user to req.body
  req.body.user = req.user.id;

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
  let event = await Event.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is event owner
  if (event.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this Event`,
        401
      )
    );
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: event });
});

// @des Subscribe to an event
// @route PUT /api/v1/events/:id/subscribe
// @access  Private
exports.subscribeEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if post has already been subscribed
  if (event.subscribe.some((subscribe) => subscribe.user.toString() === req.user.id)) {
    return next(new ErrorResponse(`Event already subscribed`, 400));
  }

  event.subscribe.unshift({ user: req.user.id });

  await event.save();

  return next(res.status(200).json({ success: true, data: event.subscribe }));
});

// @des Delete an event
// @route DELETE /api/v1/events/:id
// @access  Private
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404);
  }

  // Make sure user is event owner
  if (event.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this Event`,
        401
      )
    );
  }

  event.remove();

  res.status(200).json({ success: true, data: {} });
});

// @des Get event within a radius
// @route GET /api/v1/events/radius/:zipcode/:distance
// @access  Private
exports.getEventsByRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //  Get lat and lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calculate radius using radiance
  // Divide distance by Radius of Earth
  // Earth radius 3,963 miles/6,378 km

  const radius = distance / 3963;

  const events = await Event.find({
    location: { $geowithin: { $cemtersphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});
