const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Post = require("../models/Post");

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
      select: "name description"
    });
  }

	const posts = await query;
	
  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
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
exports.addPost = asyncHandler(async (req, res, next) => {
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