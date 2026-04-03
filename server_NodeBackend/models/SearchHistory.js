const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema({
  songId: String,
  title: String,
  composer: String,
  raga: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SearchHistory", searchHistorySchema);