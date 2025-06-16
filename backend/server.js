const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/db.config.js");
require("dotenv").config();

db.execute("SHOW TABLES")
  .then(([rows]) => {
    console.log("Database connected! Tables:", rows);
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

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

const port = process.env.PORT;

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
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', cors: 'enabled' });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    environment: isProduction ? "production" : "development",
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/resources", resourceRoutes);
app.use("/events", eventRoutes);
app.use("/api/thesis-submissions", thesisRoutes);
app.use("/api", basicRoutes);
app.use("/api", formRoutes);

app.use((err, req, res, next) => {
  console.error("Error occurred:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    ...(isProduction ? {} : { error: err.message }), // Only show error details in development
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(
    `🚀 Server is running on Port ${port} in ${
      isProduction ? "production" : "development"
    } mode`
  );
  console.log(`📍 Server URL: http://localhost:${port}`);
  console.log(`🔗 Health Check: http://localhost:${port}/health`);
});
