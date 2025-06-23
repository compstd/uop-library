const express = require("express");
const path = require("path");
const db = require("../config/db.config.js");
const { uploadMemory, handleMulterError } = require("../config/multer.config2.js");

const router = express.Router();

// POST /api/submit-form
router.post("/submit-form", uploadMemory.single("image"), async (req, res) => {
  const {
    fname, lname, fathername, department, semester, PAddress,
    email, phone, nic, dob, status, designation, issue, expire,
  } = req.body;
  
  const image = req.file ? req.file.buffer : null;
  
  let connection;
  let retries = 3;
  
  while (retries > 0) {
    try {
      connection = await db.getConnection();
      
      // Test the connection first
      await connection.execute('SELECT 1');
      
      await connection.beginTransaction();
      
      const [studentResult] = await connection.execute(
        `INSERT INTO students 
        (first_name, last_name, father_name, cnic, dob, phone, email, address, type, status, image) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [fname, lname, fathername, nic, dob, phone, email, PAddress, designation, status, image]
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
      break; // Success, exit retry loop
      
    } catch (error) {
      console.error(`❌ Error submitting form (attempt ${4 - retries}):`, error);
      
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error("Rollback error:", rollbackError);
        }
      }
      
      // Check if it's a connection-related error
      if (error.code === 'PROTOCOL_CONNECTION_LOST' || 
          error.code === 'ECONNRESET' || 
          error.code === 'ER_SERVER_SHUTDOWN' ||
          error.message.includes('Connection lost')) {
        
        retries--;
        if (retries > 0) {
          console.log(`Retrying connection... ${retries} attempts remaining`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          continue;
        }
      } else {
        // Non-connection error, don't retry
        retries = 0;
      }
      
      if (retries === 0) {
        res.status(500).json({ 
          error: "Database connection failed. Please try again later." 
        });
      }
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
});

// Add this to your routes
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
