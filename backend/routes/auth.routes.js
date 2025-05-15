const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db.config");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, "secret_key");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Invalid token!" });
  }
};

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [result] = await db.execute(
      "INSERT INTO `login`(`username`, `email`, `password`) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );
    res.status(200).send({ message: "User Registered Successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send({ message: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [result] = await db.execute("SELECT * FROM login WHERE email = ?", [
      email,
    ]);

    if (result.length === 0) {
      return res.status(401).send({ message: "User not found" });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user.id }, "secret_key", { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3600000,
    });

    res.status(200).send({ message: "Successfully logged In" });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send({ message: "Error logging in" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  res.status(200).send({ message: "Successfully logged out" });
});

router.get("/protected", verifyToken, (req, res) => {
  res.status(200).send({ message: "Access granted", user: req.user });
});

module.exports = router;
