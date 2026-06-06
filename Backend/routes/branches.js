const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

router.post("/:artifactId", auth, async (req, res) => {
  const { body } = req.body;

  try {
    const artifactResult = await pool.query(
      `SELECT * FROM artifacts WHERE id = $1`,
      [req.params.artifactId],
    );

    if (artifactResult.rows.length === 0) {
      return res.status(404).json({ error: "artifact not found" });
    }

    const result = await pool.query(
      `INSERT INTO branches (artifact_id, user_id, body)
             VALUES ($1, $2, $3) RETURNING id`,
      [req.params.artifactId, req.user.id, body],
    );

    res.json({ message: "branch planted", id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: "could not plant branch" });
  }
});

router.get("/:artifactId", async (req, res) => {
  try {
    const result = await pool.query(
      `
            SELECT branches.*, users.username
            FROM branches
            LEFT JOIN users ON branches.user_id = users.id
            WHERE branches.artifact_id = $1
            ORDER BY branches.created_at ASC
        `,
      [req.params.artifactId],
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "could not fetch branches" });
  }
});

module.exports = router;
