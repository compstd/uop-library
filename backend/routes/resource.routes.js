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

module.exports = router;
