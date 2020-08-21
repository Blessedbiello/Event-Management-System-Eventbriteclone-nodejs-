const express = require("express");
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByRadius
  
} = require("../controllers/events");

// Include other resource routers
const postRouter = require("./posts");

const router = express.Router();

// Include other resource routers
const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers
router.use("/:eventId/posts", postRouter);

router.route("/radius/:zipcode/:distance").get(getEventsByRadius); 

router 
  .route("/")
  .get(getEvents) 
  .post(protect, authorize('user', 'admin'), createEvent);

router
  .route("/:id")
  .get(getEvent)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

module.exports = router;