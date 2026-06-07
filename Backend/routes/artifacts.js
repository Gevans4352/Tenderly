const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const { title, body, mood_tag, era_tag, is_anonymous } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO artifacts (user_id, title, body, mood_tag, era_tag, is_anonymous)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        req.user.id,
        title,
        body,
        mood_tag || null,
        era_tag || null,
        is_anonymous ? 1 : 0,
      ],
    );
    res.json({ message: "artifact submitted", id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: "could not submit artifact" });
  }
});

router.get("/", async (req, res) => {
  try {
    const sort = req.query.sort || "newest";

    let orderClause = "ORDER BY artifacts.created_at DESC";
    if (sort === "oldest") orderClause = "ORDER BY artifacts.created_at ASC";
    if (sort === "branched") orderClause = "ORDER BY branch_count DESC";

    const result = await pool.query(`
            SELECT artifacts.*, users.username,
            (SELECT COUNT(*) FROM branches WHERE branches.artifact_id = artifacts.id) as branch_count,
            (SELECT COUNT(*) FROM reactions WHERE reactions.artifact_id = artifacts.id) as reaction_count
            FROM artifacts
            LEFT JOIN users ON artifacts.user_id = users.id
            ${orderClause}
        `);

    res.json(result.rows);
  } catch (err) {
    console.error("fetch error:", err.message);
    res.status(500).json({ error: "could not fetch artifacts" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `
            SELECT artifacts.*, users.username
            FROM artifacts
            LEFT JOIN users ON artifacts.user_id = users.id
            WHERE artifacts.id = $1
        `,
      [req.params.id],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "could not fetch artifact" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM artifacts WHERE id = $1`, [
      req.params.id,
    ]);
    const artifact = result.rows[0];

    if (!artifact) return res.status(404).json({ error: "not found" });
    if (artifact.user_id !== req.user.id)
      return res.status(403).json({ error: "not yours to delete" });

    // delete related data first
    await pool.query(`DELETE FROM reactions WHERE artifact_id = $1`, [
      req.params.id,
    ]);
    await pool.query(`DELETE FROM branches WHERE artifact_id = $1`, [
      req.params.id,
    ]);
    await pool.query(`DELETE FROM artifacts WHERE id = $1`, [req.params.id]);

    res.json({ message: "artifact deleted" });
  } catch (err) {
    console.error("delete error:", err.message);
    res.status(500).json({ error: "could not delete artifact" });
  }
});

module.exports = router;
