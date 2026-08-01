const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const Event = require("./models/Event");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const eventRoutes = require("./routes/EventRoutes");
const registrationRoutes = require("./routes/RegistrationRoutes");
const userRoutes = require("./routes/UserRoutes");
//const newsletterRoutes = require("./routes/newsletterRoutes");

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
//app.use("/api/newsletter", newsletterRoutes);

app.get("/", (req, res) => {
  res.send("Event Registration API Running");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Auto-seed if database contains no events
    const count = await Event.countDocuments();
    console.log(`Database connected. Found ${count} events.`);
    if (count === 0) {
      console.log("No events found in DB. Auto-seeding initial events...");
      const seedDB = require("./seeder");
      await seedDB();
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();