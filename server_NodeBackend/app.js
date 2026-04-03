const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ✅ create app FIRST
const app = express();

app.use(cors());
app.use(express.json());
// ✅ connect DB
mongoose.connect("mongodb+srv://vedheshdv_db_user:lscx0iV2I3UjkkJR@cluster0.hvlhozc.mongodb.net/carnaticDB?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ import routes AFTER app is created
const songRoutes = require("./routes/songRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const aiRoutes = require("./routes/aiRoutes");
const queueRoutes = require("./routes/queueRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const searchRoutes = require("./routes/searchRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");
const authRoutes = require("./routes/authRoutes");

// ✅ use routes
app.use("/songs", songRoutes);
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