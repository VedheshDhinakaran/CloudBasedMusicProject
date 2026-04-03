const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  songId: String,
  title: String,
  raga: String,
  composer: String,
  image: String,
  youtube: {
    videoId: String,
    title: String,
    thumbnail: String
  }
});

module.exports = mongoose.model("Favorite", favoriteSchema);