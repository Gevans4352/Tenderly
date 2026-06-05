const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

router.post("/", auth, (req, res) => {
  const { title, body, mood_tag, era_tag, is_anonymous } = req.body;

  const stmt = db.prepare(`
        INSERT INTO artifacts ( user_id, title, body, mood_tag, era_tag, is_anonymous)
        VALUES (?, ?, ?, ?, ?, ?)
        `);
  const result = stmt.run(
    req.user.id,
    title,
    body,
    mood_tag || null,
    era_tag || null,
    is_anonymous ? 1 : 0,
  );

  res.json({
    message: "Artificial Submitted",
    id: result.lastInsertRowid,
  });
});

router.get("/", (req, res) => {
  const artifacts = db
    .prepare(
      `
        SELECT artifacts.*, users.username
        FROM artifacts
        LEFT JOIN users ON artifacts.user_id = users.id
        ORDER BY artifacts.created_at DESC 
        `,
    )
    .all();
  res.json(artifacts);
});

router.get("/:id", (req, res) => {
  const artifacts = db
    .prepare(
      `
        SELECT artifacts.*, users.username
        FROM artifacts
        LEFT JOIN users ON artifacts.user_id = users.id
        WHERE artifacts.id = ?
        `,
    )
    .get(req.params.id);
  if (!artifacts) {
    return res.status(404).json({
      error: "Not Found",
    });
  }
  res.json(artifacts);
});

router.delete("/:id", auth, (req, res) => {
  const artifacts = db.prepare(`
        SELECT * FROM artifacts WHERE id = ?
        `);
  if (!artifacts) {
    return res.status(404).json({
      error: "Not found",
    });
  }
  if (artifacts.user_id !== req.user.id) {
    return res.status(403).json({
      error: "Not Yours To Delete",
    });
  }
  db.prepare(
    `
        DELETE FROM artifacts WHERE id = ?
        `,
  ).run(req.params.id);
  res.json({
    message: "Artifact Deleted",
  });
});

module.exports = router;
