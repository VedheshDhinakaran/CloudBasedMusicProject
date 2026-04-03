const express = require("express");
const router = express.Router();
const SearchHistory = require("../models/SearchHistory");

// ➕ ADD SEARCH (when song clicked)
router.post("/", async (req, res) => {
  try {
    const { songId, title, composer, raga } = req.body;

    // remove duplicate
    await SearchHistory.deleteMany({
      $or: [
        ...(songId ? [{ songId }] : []),
        { title, composer }
      ]
    });

    // add new
    const newItem = await SearchHistory.create({
      songId,
      title,
      composer,
      raga
    });

    res.json(newItem);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 📥 GET HISTORY
router.get("/", async (req, res) => {
  try {
    const history = await SearchHistory.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(history);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ❌ DELETE ONE
router.delete("/:id", async (req, res) => {
  try {
    await SearchHistory.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;