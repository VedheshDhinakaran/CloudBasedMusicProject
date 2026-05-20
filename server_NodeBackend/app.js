const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const logger = require("./logger");
logger.info("CLOUDWATCH TEST LOG");
console.log("CLOUDWATCH TEST LOG");

// ✅ create app FIRST
const app = express();

app.use(cors());
app.use(express.json());
// ✅ connect DB
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/carnaticDB";
mongoose.connect(mongoUri)
  .then(() => logger.info("MongoDB Connected"))
  .catch(err => logger.error("MongoDB Connection Error:", err.message));

// ✅ import routes AFTER app is created
const songRoutes = require("./routes/songRoutes");
const popSongRoutes = require("./routes/popSongRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const aiRoutes = require("./routes/aiRoutes");
const queueRoutes = require("./routes/queueRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const searchRoutes = require("./routes/searchRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");
const authRoutes = require("./routes/authRoutes");

// ✅ use routes
app.use("/songs", songRoutes);
app.use("/pop-songs", popSongRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/api/ai", aiRoutes);
app.use("/queue", queueRoutes);
app.use("/playlists", playlistRoutes);
app.use("/search", searchRoutes);
app.use("/youtube", youtubeRoutes);
app.use("/auth", authRoutes);

// ✅ start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});