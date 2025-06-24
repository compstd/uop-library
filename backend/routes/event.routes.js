const express = require("express");
const router = express.Router();
const db = require("../config/db.config");
const { uploadToCloudinary } = require("../config/cloudinary.config");
const { uploadMemory } = require("../config/multer.config2");

// Get all events
router.get("/", async (req, res) => {
  try {
    const [results] = await db.execute("SELECT * FROM events");
    res.json(results);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Database fetch error" });
  }
});

// Upload image and save in images table
router.post("/img", uploadMemory.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image file uploaded");
    }

    const result = await uploadToCloudinary(req.file.buffer, "images");

    const query = "INSERT INTO images (name, path) VALUES (?, ?)";
    await db.execute(query, [result.original_filename, result.secure_url]);

    res.send("Image uploaded successfully");
  } catch (err) {
    console.error("Error uploading image to Cloudinary:", err);
    res.status(500).send("Error uploading image");
  }
});

// Create a new event with Cloudinary image
router.post("/", uploadMemory.single("image"), async (req, res) => {
  const { title, description, time, date } = req.body;

  try {
    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "events");
      imageUrl = result.secure_url;
    }

    const query =
      "INSERT INTO events (title, caption, event_img, TIME, DATE) VALUES (?, ?, ?, ?, ?)";
    const [dbResult] = await db.execute(query, [
      title,
      description,
      imageUrl,
      time,
      date,
    ]);

    res.json({ ...dbResult, imageUrl });
  } catch (err) {
    console.error("Error inserting event:", err);
    res.status(500).json({ error: "Database insert error" });
  }
});

// Get events (no /uploads path needed)
router.get("/events", async (req, res) => {
  try {
    const [result] = await db.execute("SELECT * FROM events");
    res.json(result); // event_img is already a Cloudinary URL
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
