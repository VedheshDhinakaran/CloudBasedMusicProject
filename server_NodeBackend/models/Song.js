const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, enum: ["carnatic", "pop"], default: "carnatic" },

  // Carnatic fields
  composer: String,
  raga: String,
  tala: String,
  type: String,
  verified: Boolean,

  // Pop fields
  artist: String,
  album: String,
  year: Number,
  duration: String,
  language: String,
  mood: String,
  category: String,

  story: String,
  beauty: String,
  youtube: {
    videoId: String,
    title: String,
    thumbnail: String,
    channelTitle: String
  }
});

module.exports = mongoose.model("Song", songSchema);

