const Registration = require("../models/Registration");
const Event = require("../models/Event");
const transporter = require("../config/email");
const createRegistration = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const userId = req.user.id || req.user._id;

    const {
      eventId,
      name,
      collegeName,
      year,
      email,
      phone,
    } = req.body;

    // Check duplicate registration
    const existingRegistration = await Registration.findOne({
      userId,
      eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "You have already registered for this event",
      });
    }

    // Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Create registration
    const registration = await Registration.create({
      userId,
      eventId,
      name,
      collegeName,
      year,
      email,
      phone,
    });

    // Send confirmation email
    console.log("📧 Starting email send to:", email);
  transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Event Registration Confirmation 🎉",
  html: `YOUR HTML`
})
.then((info) => {
  console.log("✅ Email sent:", info.response);
  
})
.catch((err) => {
  console.error("❌ Email Error:", err);
});
return res.status(201).json({
  message: "Registration Successful",
  registration,
});
} catch (error) {
  console.error(error);

  return res.status(500).json({
    message: error.message,
  });
}
};
   
// Get all registrations
const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("userId")
      .populate("eventId");

    return res.status(200).json(registrations);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get logged-in user's registrations
const getMyRegistrations = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const userId = req.user.id || req.user._id;

    const registrations = await Registration.find({
      userId,
    }).populate("eventId");

    return res.status(200).json(registrations);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Delete registration
const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    await registration.deleteOne();

    return res.status(200).json({
      message: "Registration deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createRegistration,
  getRegistrations,
  getMyRegistrations,
  deleteRegistration,
};