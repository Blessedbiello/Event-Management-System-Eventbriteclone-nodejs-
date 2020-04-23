const express = require("express");
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");

const router = express.Router();

// Include other resource routers
const { protect } = require("../middleware/auth");

router
.route("/")
.get(getEvents)
.post( createEvent);

router
.route("/:id")
.get(getEvent)
.put(protect, updateEvent)
.delete(protect, deleteEvent);

module.exports = router;
