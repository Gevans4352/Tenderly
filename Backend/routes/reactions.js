const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

router.post("/:artifactId", auth, async (req, res) => {
  const { emoji } = req.body;

  try {
    const existing = await pool.query(
      `SELECT * FROM reactions WHERE artifact_id = $1 AND user_id = $2`,
      [req.params.artifactId, req.user.id],
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `DELETE FROM reactions WHERE artifact_id = $1 AND user_id = $2`,
        [req.params.artifactId, req.user.id],
      );
      return res.json({ message: "reaction removed" });
    }

    await pool.query(
      `INSERT INTO reactions (artifact_id, user_id, emoji) VALUES ($1, $2, $3)`,
      [req.params.artifactId, req.user.id, emoji],
    );

    res.json({ message: "reaction added" });
  } catch (err) {
    res.status(500).json({ error: "could not toggle reaction" });
  }
});

router.get("/:artifactId", async (req, res) => {
  try {
    const result = await pool.query(
      `
            SELECT emoji, COUNT(*) as count
            FROM reactions
            WHERE artifact_id = $1
            GROUP BY emoji
        `,
      [req.params.artifactId],
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "could not fetch reactions" });
  }
});

module.exports = router;
