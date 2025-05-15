const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ExcelJS = require("exceljs");
const path = require("path");
const db = require("./config/db.config.js");

const upload = require("./config/multer.config.js");
const uploads = require("./config/multer.config2.js");

const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const resourceRoutes = require("./routes/resource.routes");
const eventRoutes = require("./routes/event.routes");
const uploadMemory = require("./config/multer.config2.js");

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
      origin: "http://localhost:5173",
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

app.post("/api/submit-form", uploadMemory.single("image"), async (req, res) => {
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

  let image = req.file ? req.file.buffer : null;

  // Using a connection from the pool
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction(); // Start transaction

    const [studentResult] = await connection.query(
      "INSERT INTO students (first_name, last_name, father_name, cnic, dob, phone, email, address, type, status, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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

    await connection.query(
      "INSERT INTO student_programs (student_id, program, semester) VALUES (?, ?, ?)",
      [studentId, department, semester]
    );

    await connection.query(
      "INSERT INTO card_table (student_id, issue_date, expirey_date) VALUES (?, ?, ?)",
      [studentId, issue, expire]
    );

    await connection.commit();
    res.json({ message: "Form submitted successfully" });
  } catch (error) {
    await connection.rollback(); // Rollback in case of error
    console.error("Error submitting form:", error);
    res.status(500).json({ error: "Error submitting form" });
  } finally {
    connection.release(); // Release the connection back to the pool
  }
});

app.post("/api/resource", async (req, res) => {
  const { fname, lname, department, regNo, email, phone, status } = req.body;

  try {
    const [result] = await db.execute(
      "INSERT INTO resources (fname, lname, department, registration, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [fname, lname, department, regNo, email, phone, status]
    );
    res
      .status(200)
      .send({ message: "Data successfully submitted to resources" });
  } catch (err) {
    console.error("Error in submitting to resources:", err);
    res.status(500).send({ message: "Error in submitting to resources" });
  }
});

app.post("/api/purchase", async (req, res) => {
  const { fname, lname, department, semester, isbn, title, email, phone, dop } =
    req.body;

  try {
    const [result] = await db.execute(
      "INSERT INTO book_purchase (fname, lname, department, semester, email, phone, isbn, publication, title) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [fname, lname, department, semester, email, phone, isbn, dop, title]
    );
    res
      .status(200)
      .send({ message: "Data successfully submitted to purchase" });
  } catch (err) {
    console.error("Error in submitting to purchase:", err);
    res.status(500).send({ message: "Error in submitting to purchase" });
  }
});
app.post(
  "/api/thesis-submission",
  uploadMemory.single("pdf"),
  async (req, res) => {
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
        { timeout: 60000 } // 60 second timeout
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
  }
);

app.get("/api/thesis-submissions", async (req, res) => {
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

app.delete("/api/thesis-submissions/delete/:id", async (req, res) => {
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

app.get("/api/thesis-download/:id", async (req, res) => {
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

app.get("/api/thesis-submissions/excel", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, title, student_id, scholar_name, supervisor_name, degree, department, year 
       FROM thesis_submissions 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
       ORDER BY id DESC`
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

app.get("/api/dashboard-data", async (req, res) => {
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

app.get("/api/thesis-dashboard-data", async (req, res) => {
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

app.get("/events", async (req, res) => {
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

app.get("/api/images", async (req, res) => {
  const query = "SELECT id, name, path FROM images WHERE 1";

  try {
    const [results] = await db.execute(query);
    const images = results.map((img) => ({
      id: img.id,
      name: img.name,
      path: `/uploads/${path.basename(img.path.toString())}`, // Convert Buffer to string
    }));
    res.json(images);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/message", async (req, res) => {
  try {
    const [result] = await db.execute("SELECT * FROM contact");
    res.json(result);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
