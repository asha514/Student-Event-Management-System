const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  capacity: {
    type: Number,
    required: true,
  },

  department: {
    type: String,
    required: true,
    default: "Computer Science",
  },

  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  isTrending: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Event", eventSchema);