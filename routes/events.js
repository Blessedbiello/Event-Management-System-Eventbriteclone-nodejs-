const express = require("express");
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByRadius,
  
} = require("../controllers/events");

// Include other resource routers
const postRouter = require("./posts");

const router = express.Router();

// Re-route into other resource routers
router.use("./:eventId/posts", postRouter);

router.route("/radius/:zipcode/:distance").get(getEventsByRadius);

// Include other resource routers
const { protect } = require("../middleware/auth");

router.route("/").get(getEvents).post(createEvent);

router
  .route("/:id")
  .get(getEvent)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

module.exports = router;