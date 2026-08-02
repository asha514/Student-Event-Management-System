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
    try {
      console.log("before sending email");
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Event Registration Confirmation 🎉",
        html: `
<div style="background:#f4f7fb;padding:30px;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.15);">

    <div style="background:#2563eb;color:#fff;padding:25px;text-align:center;">
      <h1>🎉 Registration Successful</h1>
      <p>Student Event Management System</p>
    </div>

    <div style="padding:25px;">
      <h2>Hello ${name}, 👋</h2>

      <p>Your registration has been confirmed successfully.</p>

      <hr>

      <p><strong>🎫 Event:</strong> ${event.title}</p>
      <p><strong>🏫 College:</strong> ${collegeName}</p>
      <p><strong>📚 Year:</strong> ${year}</p>
      <p><strong>📍 Venue:</strong> ${event.location}</p>
      <p><strong>📅 Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
      <p><strong>🆔 Registration ID:</strong> ${registration._id}</p>

      <br>

      <p>Thank you for registering.</p>
    </div>

    <div style="background:#f1f5f9;padding:15px;text-align:center;">
      © 2026 Student Event Management System
    </div>

  </div>
</div>
`,
      });
console.log("after sending email");
      console.log("✅ Email sent successfully:", info.response);

    } catch (mailError) {
      console.error("❌ Email sending failed:", mailError.message);
    }

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