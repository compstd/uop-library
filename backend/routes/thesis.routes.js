const express = require("express");
const ExcelJS = require("exceljs");
const db = require("../config/db.config");
const router = express.Router();
const {uploadMemory} = require("../config/multer.config2");

router.get("/download", async (req, res) => {
  console.log("Generating excel file...");
  try {
    const [rows] = await db.query(
      "SELECT id, title, student_id, scholar_name, supervisor_name, degree, department, year FROM thesis_submissions WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) ORDER BY id DESC"
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Thesis Submissions");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Title", key: "title", width: 40 },
      { header: "Student ID", key: "student_id", width: 15 },
      { header: "Scholar Name", key: "scholar_name", width: 25 },
      { header: "Supervisor Name", key: "supervisor_name", width: 25 },
      { header: "Degree", key: "degree", width: 20 },
      { header: "Department", key: "department", width: 25 },
      { header: "Year", key: "year", width: 10 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    };

    worksheet.addRows(rows);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=thesis_submissions.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating excel:", error);
    res.status(500).json({ error: "Error generating excel file" });
  }
});

router.post("/submit", uploadMemory.single("pdf"), async (req, res) => {
  let connection;
  try {
    if (req.file && req.file.size > 16 * 1024 * 1024) {
      return res.status(400).json({ error: "File size exceeds 16MB limit" });
    }

    connection = await db.getConnection();

    const {
      fname,
      lname,
      regNo,
      email,
      phone,
      title,
      stdId,
      scholar,
      supervisor,
      degree,
      department,
      year,
    } = req.body;

    const pdf = req.file ? req.file.buffer : null;

    // Split the query into smaller chunks if needed
    await connection.beginTransaction();

    const [result] = await connection.execute(
      "INSERT INTO thesis_submissions (first_name, last_name, registration_no, email, phone, title, student_id, scholar_name, supervisor_name, degree, department, year, pdf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        fname,
        lname,
        regNo,
        email,
        phone,
        title,
        stdId,
        scholar,
        supervisor,
        degree,
        department,
        year,
        pdf,
      ],
      { timeout: 60000 }
    );

    await connection.commit();
    res.json({ message: "Thesis submitted successfully" });
  } catch (error) {
    console.error("Detailed submission error:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError);
      }
    }

    if (error.code === "ER_PACKET_TOO_LARGE") {
      res.status(413).json({ error: "File size too large for database" });
    } else if (error.code === "ER_NET_PACKET_TOO_LARGE") {
      res.status(413).json({ error: "Network packet too large" });
    } else {
      res
        .status(500)
        .json({ error: "Error submitting thesis. Please try again." });
    }
  } finally {
    if (connection) connection.release();
  }
});

router.get("/", async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const [rows] = await db.query(
      "SELECT * FROM thesis_submissions ORDER BY id DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Error fetching submissions" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM thesis_submissions WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ message: "Thesis deleted successfully" });
  } catch (error) {
    console.error("Error deleting thesis:", error);
    res.status(500).json({ error: "Error deleting thesis" });
  }
});

router.get("/download/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT pdf, title FROM thesis_submissions WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Thesis not found" });
    }

    const thesis = rows[0];

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${thesis.title}.pdf"`
    );

    res.send(thesis.pdf);
  } catch (error) {
    console.error("Error downloading thesis:", error);
    res.status(500).json({ error: "Error downloading thesis" });
  }
});

module.exports = router;
