const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema({
  songs: { type: Array, default: [] },
  currentQueueIndex: { type: Number, default: -1 }
});

module.exports = mongoose.model("Queue", queueSchema);
