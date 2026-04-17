const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  songId: String,
  title: String,
  genre: { type: String, default: "carnatic" },
  composer: String,
  raga: String,
  artist: String,
  album: String,
  mood: String,
  year: Number,
  duration: String,
  language: String,
  image: String,
  youtube: {
    videoId: String,
    title: String,
    thumbnail: String
  }
});

module.exports = mongoose.model("Favorite", favoriteSchema);
