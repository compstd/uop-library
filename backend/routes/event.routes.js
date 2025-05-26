const express = require("express");
const router = express.Router();
const db = require("../config/db.config");
const upload = require("../config/multer.config");

router.get("/", async (req, res) => {
  try {
    const [results] = await db.execute("SELECT * FROM events");
    res.json(results);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Database fetch error" });
  }
});

router.post("/img", upload.single("image"), async (req, res) => {
  const imgPath = req.file.path;
  const imgName = req.file.filename;

  const query = "INSERT INTO images (name, path) VALUES (?, ?)";
  try {
    await db.execute(query, [imgName, imgPath]);
    res.send("Image uploaded successfully");
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).send("Error uploading image");
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const { title, description, time, date } = req.body;
  const relativePath = req.file ? `/uploads/${req.file.filename}` : null;

  const query =
    "INSERT INTO `events`(`title`, `caption`, `event_img`, `TIME`, `DATE`) VALUES (?, ?, ?, ?, ?)";
  try {
    const [result] = await db.execute(query, [
      title,
      description,
      relativePath,
      time,
      date,
    ]);
    res.json({ ...result, imagePath: relativePath });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ error: "Database insert error" });
  }
});

router.get("/events", async (req, res) => {
  const query = "SELECT * FROM events";

  try {
    const [result] = await db.execute(query);
    const processedEvents = result.map((event) => ({
      ...event,
      event_img: event.event_img
        ? `/uploads/${path.basename(event.event_img)}`
        : null,
    }));
    res.json(processedEvents);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
