const express = require("express");
const router = express.Router();
const db = require("../config/db.config");

router.get("/message", async (req, res) => {
  try {
    const [result] = await db.execute("SELECT * FROM contact");
    res.json(result);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/thesis-dashboard-data", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT COUNT(*) AS totalThesis 
      FROM thesis_submissions
    `);

    const totalThesis = rows[0]?.totalThesis || 0;

    res.json({ totalThesis });
  } catch (error) {
    console.error("Error fetching thesis dashboard data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/dashboard-data", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT COUNT(*) AS totalStudents 
      FROM students
    `);

    const totalStudents = rows[0]?.totalStudents || 0;

    const totalRevenue = totalStudents * 500;

    res.json({ totalStudents, totalRevenue });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/image/:id", async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM images WHERE id = ?";

  try {
    const [result] = await db.execute(query, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "image not found" });
    }
    res.json({ message: "images deleted successfully" });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ error: "Database delete error" });
  }
});

module.exports = router;
