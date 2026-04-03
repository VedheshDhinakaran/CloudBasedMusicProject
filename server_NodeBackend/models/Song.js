const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: String,
  composer: String,
  raga: String,
  tala: String,
  type: String,
  verified: Boolean,
  story: String,
  beauty: String,
  youtube: {
    videoId: String,
    title: String,
    thumbnail: String
  }
});

module.exports = mongoose.model("Song", songSchema);