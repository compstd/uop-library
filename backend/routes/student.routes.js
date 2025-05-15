const express = require("express");
const router = express.Router();
const db = require("../config/db.config");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/", async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 5;
  const query = `
    SELECT 
      s.std_id,
      s.first_name,
      s.last_name,
      s.father_name,
      s.cnic,
      s.dob,
      s.phone,
      s.email,
      s.address,
      s.type,
      s.status,
      s.image,
      sp.program,
      sp.semester
    FROM 
      students s
    JOIN 
      student_programs sp ON s.std_id = sp.student_id
    WHERE 
      s.status = 'pending'
    ORDER BY 
      s.std_id
    LIMIT ? OFFSET ?
  `;
  try {
    const [result] = await db.execute(query, [limit, offset]);
    res.json(result);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Database fetch error" });
  }
});
router.get("/getstudents", async (req, res) => {
  const query = `
    SELECT 
      s.std_id,
      s.first_name,
      s.last_name,
      s.father_name,
      s.cnic,
      s.dob,
      s.phone,
      s.email,
      s.address,
      s.type,
      s.status,
      s.image,
      sp.program,
      sp.semester
    FROM 
      students s
    JOIN 
      student_programs sp ON s.std_id = sp.student_id
    WHERE 
      s.status = 'approved'
    ORDER BY 
      s.std_id
      LIMIT 10 `;
  try {
    const [result] = await db.execute(query);
    res.json(result);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Database fetch error" });
  }
});

router.get("/expiredCards", async (req, res) => {
  const query = `
    SELECT 
      s.std_id,
      s.first_name,
      s.last_name,
      s.father_name,
      s.cnic,
      s.dob,
      s.phone,
      s.email,
      s.address,
      s.type,
      s.status,
      s.image,
      sp.program,
      sp.semester,
      ct.card_id,
      ct.issue_date,
      ct.expirey_date
    FROM 
      students s
    JOIN 
      student_programs sp ON s.std_id = sp.student_id
    JOIN 
      card_table ct ON s.std_id = ct.student_id
    WHERE 
      s.status = 'approved' AND ct.expirey_date < NOW()
    ORDER BY 
      s.std_id;
  `;

  try {
    const [result] = await db.execute(query);
    res.json(result);
  } catch (err) {
    console.error("Error fetching students with expired cards:", err);
    res.status(500).json({ error: "Database fetch error" });
  }
});

router.get("/:cnic", async (req, res) => {
  const { cnic } = req.params;
  const query = `
    SELECT 
      s.*,
      sp.program,
      sp.semester,
      c.issue_date,
      c.expirey_date
    FROM 
      students s
    LEFT JOIN 
      student_programs sp ON s.std_id = sp.student_id
    LEFT JOIN 
      card_table c ON s.std_id = c.student_id
    WHERE 
      s.cnic = ?
  `;
  try {
    const [result] = await db.execute(query, [cnic]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Student Not found" });
    }
    const student = result[0];
    if (student.image) {
      student.image = `data:image/jpeg;base64,${student.image.toString(
        "base64"
      )}`;
    }
    res.json(student);
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:cnic", async (req, res) => {
  const { cnic } = req.params;
  try {
    const [result] = await db.execute(
      `UPDATE students SET status = 'approved' WHERE cnic = ?`,
      [cnic]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Status not found" });
    }
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Error updating status" });
  }
});

router.put("/update/:id", async (req, res) => {
  const {
    fname,
    lname,
    father,
    program,
    semester,
    cnic,
    phone,
    dob,
    address,
    type,
    email,
    status,
  } = req.body;

  const id = req.params.id;
  const issueDate =
    req.body.issueDate || new Date().toISOString().split("T")[0];

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    await connection.execute(
      "UPDATE students SET `first_name`=?, `last_name`=?, `father_name`=?, `cnic`=?, `phone`=?, `email`=?, `address`=?, `type`=?, `status`=? WHERE `std_id` = ?",
      [fname, lname, father, cnic, phone, email, address, type, status, id]
    );

    await connection.execute(
      "UPDATE `student_programs` SET `program`=?, `semester`=? WHERE `student_id` = ?",
      [program, semester, id]
    );

    await connection.execute(
      "UPDATE `card_table` SET `issue_date`=?, `expirey_date`=? WHERE `student_id` = ?",
      [issueDate, dob, id]
    );

    await connection.commit();
    res.json({ message: "Student information updated successfully" });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Error updating student information" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute("DELETE FROM students WHERE std_id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ error: "Error deleting student" });
  }
});

module.exports = router;
