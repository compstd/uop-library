const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/db.config.js");
require("dotenv").config();

// Define isProduction at the top
const isProduction = process.env.NODE_ENV === 'production';

// Test database connection
db.execute("SHOW TABLES")
  .then(([rows]) => {
    console.log("Database connected! Tables:", rows);
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Import all your route modules
const upload = require("./config/multer.config.js");
const uploads = require("./config/multer.config2.js");
const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const resourceRoutes = require("./routes/resource.routes");
const eventRoutes = require("./routes/event.routes");
const uploadMemory = require("./config/multer.config2.js");
const thesisRoutes = require("./routes/thesis.routes");
const basicRoutes = require("./routes/basic.routes.js");
const formRoutes = require("./routes/form.routes");

const app = express();

// Set port with fallback
const port = process.env.PORT || 10000;

// CORS configuration
app.use(cors({
  origin: [
    'https://uop-library.onrender.com',
    'https://uop-admin.onrender.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this for form data
app.use(cookieParser());

// Static files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Debug middleware (optional - remove in production if needed)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  next();
});

// Test routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!', 
    cors: 'enabled',
    environment: isProduction ? 'production' : 'development',
    port: port
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    environment: isProduction ? "production" : "development",
    timestamp: new Date().toISOString(),
    port: port
  });
});

// API Routes
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/resources", resourceRoutes);
app.use("/events", eventRoutes);
app.use("/api/thesis-submissions", thesisRoutes);
app.use("/api", basicRoutes);
app.use("/api", formRoutes);

app.get("/users", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM login");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    ...(isProduction ? {} : { error: err.message }), // Only show error details in development
  });
});

// Add this to your main app file
const keepAlive = async () => {
  try {
    const connection = await db.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    console.log('Database keep-alive ping sent');
  } catch (error) {
    console.error('Keep-alive failed:', error);
  }
};

// Ping every 4 minutes (PlanetScale typically idles after 5 minutes)
setInterval(keepAlive, 4 * 60 * 1000);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(
    `🚀 Server is running on Port ${port} in ${
      isProduction ? "production" : "development"
    } mode`
  );
  console.log(`📍 Server URL: http://0.0.0.0:${port}`);
  console.log(`🔗 Health Check: http://0.0.0.0:${port}/health`);
});
