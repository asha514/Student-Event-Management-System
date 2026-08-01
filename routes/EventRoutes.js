const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = require("../controllers/EventController");

router.post("/", protect, createEvent);

// Public routes for fetching events
router.get("/", getEvents);
router.get("/:id", getEventById);

router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

module.exports = router;