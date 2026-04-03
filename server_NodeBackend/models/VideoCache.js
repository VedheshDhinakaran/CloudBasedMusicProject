const mongoose = require("mongoose");

const videoCacheSchema = new mongoose.Schema({
  query: { type: String, unique: true, index: true }, // "Title | Raga | Composer"
  videoId: String,
  title: String,
  thumbnail: String,
  channelTitle: String,
  createdAt: { type: Date, default: Date.now, expires: "30d" } // Auto-expire after 30 days
});

module.exports = mongoose.model("VideoCache", videoCacheSchema);
