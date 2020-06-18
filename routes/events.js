const express = require("express");
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByRadius,
  getPosts,
  getPost,
  addPost,
  deletePost
} = require("../controllers/events");

// Include other resource routers
const postRouter = require("./events");

const router = express.Router({ mergeParams: true });

// Re-route into other resource routers
router.use("./:eventId/posts", postRouter);

router.route("/radius/:zipcode/:distance").get(getEventsByRadius);

// Include other resource routers
const { protect } = require("../middleware/auth");

router.route("/").get(getEvents).post(createEvent).post(addPost);
router.route("/").get(getPosts);
router.route("/:id").get(getPost).delete(deletePost);

router
  .route("/:id")
  .get(getEvent)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

module.exports = router;
