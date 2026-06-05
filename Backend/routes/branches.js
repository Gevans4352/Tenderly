const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

router.post("/:artifactId", auth, (req, res) => {
  const { body } = req.body;

  const artifact = db
    .prepare(
      `
        SELECT * FROM artifacts WHERE id = ?
        `,
    )
    .get(req.params.artifactId);
  if (!artifact) {
    return res.status(404).json({
      error: "Artifact Not Found",
    });
  }
  const result = db
    .prepare(
      `
        INSERT INTO branches (artifact_id, user_id, body)
        VALUES (?, ?, ?)
        `,
    )
    .run(req.params.artifactId, req.user.id, body);
  res.json({
    message: "Branch Planted",
    id: result.lastInsertRowid,
  });
});

router.get("/:artifactId", (req, res) => {
  const branches = db
    .prepare(
      `
        SELECT branches.*, users.username
        FROM branches
        LEFT JOIN users ON branches.user_id = users.id
        WHERE branches.artifact_id = ?
        ORDER BY branches.created_at ASC
        `,
    )
    .all(req.params.artifactId);
  res.json(branches);
});

module.exports = router;
