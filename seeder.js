const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Event = require("./models/Event");

dotenv.config();

const sampleEvents = [
  {
    title: "HackNIT 2026 Hackathon",
    description: "24-Hour National level coding competition and prototype building hackathon.",
    location: "Main Auditorium & CSE Labs",
    date: new Date("2026-08-15T09:00:00.000Z"),
    capacity: 150,
    department: "Computer Science",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isTrending: true,
  },
  {
    title: "Paper Presentation & AI Summit",
    description: "Present innovative research papers on Machine Learning, NLP, and Computer Vision.",
    location: "Seminar Hall B",
    date: new Date("2026-08-18T10:00:00.000Z"),
    capacity: 80,
    department: "Computer Science",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isTrending: true,
  },
  {
    title: "Cloud & Cybersecurity Expo",
    description: "Learn cloud infrastructure, AWS/GCP, and ethical hacking fundamentals with hands-on labs.",
    location: "IT Smart Classroom 1",
    date: new Date("2026-08-20T11:00:00.000Z"),
    capacity: 100,
    department: "Information Technology",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isTrending: false,
  },
  {
    title: "Full-Stack Web Dev Workshop",
    description: "Master React, Node.js, and MongoDB in an intensive 1-day guided workshop.",
    location: "IT Lab 3",
    date: new Date("2026-08-22T09:30:00.000Z"),
    capacity: 60,
    department: "Information Technology",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isTrending: true,
  },
  {
    title: "Robo Wars & Line Follower Challenge",
    description: "High-octane bot battles and autonomous robot navigation competition.",
    location: "Indoor Sports Complex",
    date: new Date("2026-08-25T10:00:00.000Z"),
    capacity: 120,
    department: "Electronics & Communication",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isTrending: true,
  },
  {
    title: "Embedded Systems & IoT Expo",
    description: "Showcase Arduino, Raspberry Pi, and Smart Home automation projects.",
    location: "ECE Lab 2",
    date: new Date("2026-08-28T14:00:00.000Z"),
    capacity: 75,
    department: "Electronics & Communication",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isTrending: false,
  },
  {
    title: "EV Motors & Renewable Energy Symposium",
    description: "Keynote talks on Electric Vehicle powertrains, Battery Management Systems, and Solar Grids.",
    location: "Electrical Conference Room",
    date: new Date("2026-09-02T10:00:00.000Z"),
    capacity: 90,
    department: "Electrical & Electronics",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isTrending: false,
  },
  {
    title: "Smart Grid Circuit Design Contest",
    description: "Design energy-efficient circuit simulation layouts under time constraints.",
    location: "EEE Simulation Lab",
    date: new Date("2026-09-05T11:00:00.000Z"),
    capacity: 50,
    department: "Electrical & Electronics",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isTrending: false,
  },
  {
    title: "CAD/CAM 3D Modeling Championship",
    description: "Design complex mechanical parts using SolidWorks and Fusion 360.",
    location: "CAD Lab, Mech Block",
    date: new Date("2026-09-08T09:30:00.000Z"),
    capacity: 70,
    department: "Mechanical Engineering",
    image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isTrending: true,
  },
  {
    title: "Automobile Engine Assembly Expo",
    description: "Live disassembly and re-assembly challenge of IC engines and transmission systems.",
    location: "Mechanical Workshop",
    date: new Date("2026-09-12T10:00:00.000Z"),
    capacity: 80,
    department: "Mechanical Engineering",
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isTrending: false,
  },
  {
    title: "Bridge Building Structural Contest",
    description: "Construct Popsicle stick bridges tested to structural failure point.",
    location: "Civil Structural Lab",
    date: new Date("2026-09-15T11:00:00.000Z"),
    capacity: 60,
    department: "Civil Engineering",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isTrending: true,
  },
  {
    title: "Smart Cities & Green Concrete Workshop",
    description: "Explore eco-friendly building materials and sustainable urban planning.",
    location: "Civil Seminar Room",
    date: new Date("2026-09-18T14:00:00.000Z"),
    capacity: 85,
    department: "Civil Engineering",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isTrending: false,
  },
  {
    title: "Startup Pitch Deck Competition",
    description: "Pitch your business idea to real angel investors and venture capitalists.",
    location: "MBA Auditorium",
    date: new Date("2026-09-22T10:00:00.000Z"),
    capacity: 100,
    department: "Management Studies",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isTrending: true,
  },
  {
    title: "Stock Market Trading Simulation",
    description: "Real-time virtual stock market trading and portfolio management battle.",
    location: "Finance Lab",
    date: new Date("2026-09-25T09:30:00.000Z"),
    capacity: 110,
    department: "Management Studies",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isTrending: false,
  },
  {
    title: "Inter-College Battle of the Bands",
    description: "Western and classical musical bands rock the main open-air stage.",
    location: "Open Air Amphitheatre",
    date: new Date("2026-10-01T17:00:00.000Z"),
    capacity: 500,
    department: "Cultural & Arts",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isTrending: true,
  },
  {
    title: "Campus Dance & Drama Fest",
    description: "Solo, duo, and group thematic dance performances & theatrical plays.",
    location: "Main Auditorium",
    date: new Date("2026-10-04T16:00:00.000Z"),
    capacity: 350,
    department: "Cultural & Arts",
    image: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isTrending: true,
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/event_registration_db";
    await mongoose.connect(mongoUri);
    console.log("Seeder connected to MongoDB:", mongoUri);

    await Event.deleteMany({});
    console.log("Cleared existing events collection.");

    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`Successfully seeded ${createdEvents.length} events into MongoDB!`);

    await mongoose.connection.close();
    console.log("Database connection closed cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = seedDB;
