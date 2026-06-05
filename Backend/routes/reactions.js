const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

router.post("/:artifactId", auth, (req, res) => {
  const { emoji } = req.body;

  const existing = db
    .prepare(
      `
        SELECT * FROM reactions WHERE artifact_id = ? AND user_id = ?
        `,
    )
    .get(req.params.artifactId, req.user.id);
  if (existing) {
    db.prepare(
      `
            DELETE FROM reactions WHERE artifact_id = ? AND user_id = ?
            `,
    ).run(req.params.artifactId, req.user.id);
    return res.json({
      message: "Reaction removed",
    });
  }
  db.prepare(
    `
    INSERT INTO reactions (artifact_id, user_id, emoji)
    VALUES (?, ?, ?)
`,
  ).run(req.params.artifactId, req.user.id, emoji);
  res.json({
    message: "Reaction added",
  });
});

router.get("/:artifactId", (req, res) => {
  const reactions = db
    .prepare(
      `
        SELECT emoji, COUNT (*) as count
        FROM reactions
        WHERE artifact_id = ?
        GROUP BY emoji 
        `,
    )
    .all(req.params.artifactId);
  res.json(reactions);
});

module.exports = router;
