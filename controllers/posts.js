const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Post = require("../models/Post");
const Event = require("../models/Event");


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

  const posts = await query;

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
// @route POST /api/v1/events/:eventId/posts
// @access  Private
exports.addPost = asyncHandler(async (req, res, next) => {
  req.body.event = req.params.eventId;
  req.body.user = req.user.id;

  const event = await Event.findById(req.params.eventId);

  if (!event) {
    return next(
      new ErrorResponse(`No Event with id of  ${req.params.eventId}`),
      404
    );
  }
  // Make sure user is event owner
  if (event.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add post to event ${event._id}`,
        401
      )
    );
  }
  const post = await Post.create(req.body);

  console.log(post);
  res.status(200).json({
    success: true,
    data: post
  });
});

// @des Delete a post
// @route DELETE /api/v1/events/:eventId/post
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`No Post with id of  ${req.params.id}`), 404);
  }

  // Make sure user is event owner
  if (event.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete post ${event._id}`,
        401
      )
    );
  }

  await post.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @des like a post
// @route PUT /api/v1/events/:eventId/posts/:postId/like/:id
// @access  Private

exports.likePost = asyncHandler(async (req, res, next) => {
  // Find the associated event
  if (req.params.eventId) {
    query = Post.find({ event: req.params.eventId });
  }

  const post = await Post.findById(req.params.id);

  // Check if post has already been liked
  if (post.likes.some((like) => like.user.toString() === req.user.id)) {
    return next(new ErrorResponse(`Post already liked`, 400));
  }

  post.likes.unshift({ user: req.user.id });

  await post.save();

  return next(res.status(200).json({ success: true, data: post.likes }));
});

// @des unlike a post
// @route PUT /api/v1/events/:eventId/posts/:postId/unlike/:id
// @access  Private

exports.unlikePost = asyncHandler(async (req, res, next) => {
  // Find the post
  if (req.params.eventId) {
    query = Post.find({ event: req.params.eventId });
  }

  const post = await Post.findById(req.params.id);

  // Check if post has already been liked
  if (post.likes.some((like) => like.user.toString() === req.user.id)) {
    return next(new ErrorResponse(`Post not yet liked`, 400));
  }

  // Remove the like
  post.likes = post.likes.filter(({ user }) => user.toString() !== req.user.id);

  await post.save();
  return next(res.status(200).json({ success: true, data: post.likes }));
});


