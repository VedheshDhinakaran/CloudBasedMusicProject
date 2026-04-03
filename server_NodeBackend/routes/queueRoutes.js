const express = require("express");
const router = express.Router();
const Queue = require("../models/Queue");

// Get the current queue
router.get("/", async (req, res) => {
  try {
    let queueObj = await Queue.findOne();
    if (!queueObj) {
      queueObj = new Queue({ songs: [], currentQueueIndex: -1 });
      await queueObj.save();
    }
    res.json(queueObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update the queue
router.post("/", async (req, res) => {
  try {
    const { queue, currentQueueIndex } = req.body;
    let queueObj = await Queue.findOne();
    if (!queueObj) {
      queueObj = new Queue({ songs: queue, currentQueueIndex });
    } else {
      queueObj.songs = queue;
      queueObj.currentQueueIndex = currentQueueIndex;
    }
    await queueObj.save();
    res.json(queueObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
