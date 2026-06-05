const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);

  try {
    const stmt = db.prepare(`
            INSERT INTO users ( username, email, password_hash)
            VALUES (?, ?, ?)
            `);
    stmt.run(username, email, hash);
    res.json({
      message: "Account Created",
    });
  } catch (error) {
    res.status(400).json({
      error: "Username or email already exists",
    });
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({
      error: "Invalid Credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
  res.json({
    token,
    username: user.username,
  });
});

module.exports = router;
