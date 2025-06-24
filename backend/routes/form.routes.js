const express = require("express");
const db      = require("../config/db.config.js");
const { uploadMemory } = require("../config/multer.config2.js");
const { uploadToCloudinary } = require("../config/cloudinary.config.js");
const router  = express.Router();

router.post(
  "/submit-form",
  uploadMemory.single("image"),
  async (req, res) => {
    const {
      fname, lname, fathername, department, semester,
      PAddress, email, phone, nic, dob, status,
      designation, issue, expire,
    } = req.body;

    let imageUrl = null;
    if (req.file) {
      // upload to Cloudinary via stream
      imageUrl = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "students" }, (err, result) => {
            if (err) return reject(err);
            resolve(result.secure_url);
          })
          .end(req.file.buffer);
      });
    }

    let conn;
    try {
      conn = await db.getConnection();
      await conn.beginTransaction();

      // Save the URL string instead of blob
      const [r] = await conn.execute(
        `INSERT INTO students
         (first_name, last_name, father_name,
          cnic, dob, phone, email, address,
          type, status, image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [fname, lname, fathername,
         nic, dob, phone, email, PAddress,
         designation, status, imageUrl]
      );
      const studentId = r.insertId;

      await conn.execute(
        `INSERT INTO student_programs
         (student_id, program, semester)
         VALUES (?, ?, ?)`,
        [studentId, department, semester]
      );
      await conn.execute(
        `INSERT INTO card_table
         (student_id, issue_date, expirey_date)
         VALUES (?, ?, ?)`,
        [studentId, issue, expire]
      );

      await conn.commit();
      return res.json({ message: "Form submitted successfully" });
    } catch (err) {
      if (conn) await conn.rollback();
      console.error(err);
      return res.status(500).json({ error: "Upload failed, please try again." });
    } finally {
      if (conn) conn.release();
    }
  }
);

router.get("/health", async (req, res) => {
  try {
    const connection = await db.getConnection();
    await connection.execute('SELECT 1 as health');
    connection.release();
    res.json({ status: "Database connected" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

router.get("/images", async (req, res) => {
  const query = "SELECT id, name, path FROM images";

  try {
    const [results] = await db.execute(query);

    const images = results.map((img) => ({
      id: img.id,
      name: img.name,
      url: img.path, // Cloudinary URL already stored in DB
    }));

    res.json(images);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
