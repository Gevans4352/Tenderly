const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);

  try {
    await pool.query(
      `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)`,
      [username, email, hash],
    );
    res.json({ message: "account created" });
  } catch (err) {
    res.status(400).json({ error: "username or email already exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    const user = result.rows[0];

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: "something went wrong" });
  }
});

module.exports = router;
