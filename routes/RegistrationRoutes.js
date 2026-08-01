const express = require("express");
console.log("Registration Routes Loaded");
const router = express.Router();

const {
  createRegistration,
  getRegistrations,
  deleteRegistration,
  getMyRegistrations,
} = require("../controllers/RegistrationController");

const protect = require("../middleware/authMiddleware");


// Create registration
router.post("/", protect, createRegistration);


// Get my registrations
router.get("/my", protect, getMyRegistrations);


// Get all registrations
router.get("/", getRegistrations);


// Delete registration
router.delete("/:id", deleteRegistration);


module.exports = router;