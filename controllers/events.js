const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Event = require("../models/Event");
const Post = require("../models/Post");

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

// @des Get all posts on an event & all posts
// @route GET /api/v1/posts
// @route GET /api/v1/:eventid/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.eventId) {
    query = Post.find({ event: req.params.eventId });
  } else {
    query = Post.find().populate({
      path: "event",
      select: "name description",
    });
  }

  const Posts = await query;
  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

// @des Get a single post
// @route GET /api/v1/posts
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await (await Post.findById(req.params.id)).populated({
    path: "event",
    select: "name description",
  });

  if (!post) {
    return next(new ErrorResponse(`No post with id of  ${req.params.id}`), 404);
  }
  res.status(200).json({
    success: true,
    data: post,
  });
});

// @des Add a post
// @route POST /api/v1/events/:eventId/post
// @access  Private
exports.getPost = asyncHandler(async (req, res, next) => {
  req.body.event = req.params.eventId;

  const event = await Event.findById(req.params.eventId);

  if (!event) {
    return next(
      new ErrorResponse(`No Event with id of  ${req.params.eventId}`),
      404
    );
  }

  const post = await Post.create(req.body);

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @des Delete a post
// @route DELETE /api/v1/events/:eventId/post
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`No Post with id of  ${req.params.id}`),
      404
    );
  }

  await post.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
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
    new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404);
  }

  res.status(200).json({ success: true, data: event });
});

// @des Delete an event
// @route DELETE /api/v1/events/:id
// @access  Private
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404);
  }

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
