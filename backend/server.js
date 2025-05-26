const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/db.config.js");

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
const port = 4000;

const isProduction = false;

if (isProduction) {
  app.use(
    cors({
      origin: "https://Uoplibrary.com",
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:5174"], // Modified line
      credentials: true,
    })
  );
}
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/resources", resourceRoutes);
app.use("/events", eventRoutes);
app.use("/api/thesis-submissions", thesisRoutes);
app.use("/api", basicRoutes);
app.use("/api", formRoutes);

if (isProduction) {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(
    `Server is running on Port ${port} in ${
      isProduction ? "production" : "development"
    } mode`
  );
});
