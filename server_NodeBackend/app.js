const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ✅ create app FIRST
const app = express();

app.use(cors());
app.use(express.json());
// ✅ connect DB
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/carnaticDB";
mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err.message));

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
app.listen(5000, () => {
  console.log("Server running on port 5000");
});