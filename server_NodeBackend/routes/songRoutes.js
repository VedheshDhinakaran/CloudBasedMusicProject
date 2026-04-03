const express = require("express");
const router = express.Router();
const axios = require("axios");
const Song = require("../models/Song");


// ✅ GET ALL SONGS + SEARCH + FILTER
router.get("/", async (req, res) => {
  try {
    // ✅ ADD composer here
    const { title, raga, composer } = req.query;

    let filter = {};

    if (title && title.trim() !== "") {
      filter.title = { $regex: title, $options: "i" };
    }

    if (raga && raga.trim() !== "") {
      filter.raga = { $regex: raga, $options: "i" };
    }

    // ✅ THIS IS WHERE YOUR CODE GOES
    if (composer && composer.trim() !== "") {
      filter.composer = { $regex: composer, $options: "i" };
    }

    console.log("FILTER:", filter); // debug

    const songs = await Song.find(filter).sort({ title: 1 });

    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET SINGLE SONG
router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ 🎯 RECOMMENDATION ENGINE
// Logic: same raga + different song
router.get("/recommend/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const recommendations = await Song.find({
      raga: song.raga,
      _id: { $ne: song._id }
    }).limit(5);

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ OPTIONAL: GET ALL UNIQUE RAGAS (for dynamic dropdown later)
router.get("/meta/ragas", async (req, res) => {
  try {
    const ragas = await Song.distinct("raga");
    res.json(ragas.sort());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Search suggestions (title autocomplete)
router.get("/search/suggestions", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) return res.json([]);

    const suggestions = await Song.find({
      title: { $regex: q, $options: "i" }
    })
      .limit(5)
      .select("title");

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;