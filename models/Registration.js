const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  collegeName: {
    type: String,
    required: true,
  },

  year: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
  },

  registeredAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model("Registration", registrationSchema);