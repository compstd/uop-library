const express = require("express");
const router = express.Router();
const db = require("../config/db.config");

router.get("/vpn", async (req, res) => {
  try {
    const [result] = await db.execute(
      `SELECT * FROM Resources WHERE STATUS = 'vpn'`
    );
    res.json(result);
  } catch (err) {
    console.error("Error fetching VPN resources:", err);
    res.status(500).json({ error: "Database fetch error" });
  }
});

router.get("/wifi", async (req, res) => {
  try {
    const [result] = await db.execute(
      `SELECT * FROM Resources WHERE STATUS = 'wifi'`
    );
    res.json(result);
  } catch (err) {
    console.error("Error fetching WiFi resources:", err);
    res.status(500).json({ error: "Database fetch error" });
  }
});

router.post("/insertResource", async (req, res) => {
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

router.post("/insertPurchase", async (req, res) => {
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

module.exports = router;
