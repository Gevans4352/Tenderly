const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const artifactRoutes = require("./routes/artifacts");
const branchRoutes = require("./routes/branches");
const reactionRoutes = require("./routes/reactions");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/artifacts", artifactRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/reactions", reactionRoutes);

app.get("/", (req, res) => {
  res.json({ message: "tenderly is alive" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
