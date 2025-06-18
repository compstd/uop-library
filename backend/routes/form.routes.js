const express = require("express");
const path = require("path");
const db = require("../config/db.config.js");
const uploadMemory = require("../config/multer.config2.js");

const router = express.Router();

// POST /api/submit-form
router.post("/submit-form", uploadMemory.single("image"), async (req, res) => {
  const {
    fname,
    lname,
    fathername,
    department,
    semester,
    PAddress,
    email,
    phone,
    nic,
    dob,
    status,
    designation,
    issue,
    expire,
  } = req.body;

  const image = req.file ? req.file.buffer : null;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [studentResult] = await connection.execute(
      `INSERT INTO students 
      (first_name, last_name, father_name, cnic, dob, phone, email, address, type, status, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fname,
        lname,
        fathername,
        nic,
        dob,
        phone,
        email,
        PAddress,
        designation,
        status,
        image,
      ]
    );

    const studentId = studentResult.insertId;

    await connection.execute(
      "INSERT INTO student_programs (student_id, program, semester) VALUES (?, ?, ?)",
      [studentId, department, semester]
    );

    await connection.execute(
      "INSERT INTO card_table (student_id, issue_date, expirey_date) VALUES (?, ?, ?)",
      [studentId, issue, expire]
    );

    await connection.commit();

    res.json({ message: "Form submitted successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error submitting form:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  } finally {
    connection.release();
  }
});

// GET /api/images
router.get("/images", async (req, res) => {
  const query = "SELECT id, name, path FROM images WHERE 1";

  try {
    const [results] = await db.execute(query);
    const images = results.map((img) => ({
      id: img.id,
      name: img.name,
      path: `/uploads/${path.basename(img.path.toString())}`,
    }));
    res.json(images);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
