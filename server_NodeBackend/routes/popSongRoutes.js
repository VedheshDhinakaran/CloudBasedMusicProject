const express = require("express");
const router = express.Router();
const Song = require("../models/Song");

// GET ALL POP SONGS + SEARCH + FILTER
router.get("/", async (req, res) => {
  try {
    const { title, artist, mood, album } = req.query;
    let filter = { genre: "pop" };

    if (title && title.trim() !== "") {
      filter.title = { $regex: title, $options: "i" };
    }

    if (artist && artist.trim() !== "") {
      filter.artist = { $regex: artist, $options: "i" };
    }

    if (mood && mood.trim() !== "") {
      filter.mood = { $regex: mood, $options: "i" };
    }

    if (album && album.trim() !== "") {
      filter.album = { $regex: album, $options: "i" };
    }

    const songs = await Song.find(filter).sort({ title: 1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE POP SONG
router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song || song.genre !== "pop") {
      return res.status(404).json({ message: "Pop song not found" });
    }
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RECOMMENDATIONS FOR POP SONGS
router.get("/recommend/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song || song.genre !== "pop") {
      return res.status(404).json({ message: "Pop song not found" });
    }

    const recommendations = await Song.find({
      genre: "pop",
      _id: { $ne: song._id },
      $or: [
        { mood: song.mood },
        { artist: song.artist }
      ]
    }).limit(5);

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
