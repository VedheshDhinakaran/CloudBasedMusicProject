const express = require("express");
const router = express.Router();
const Song = require("../models/Song");


// GET ALL SONGS + SEARCH + FILTER
router.get("/", async (req, res) => {
  try {
    const { title, raga, composer, genre, artist, mood } = req.query;
    const filter = {};

    if (genre && genre.trim() !== "") {
      filter.genre = genre.toLowerCase();
    }

    if (title && title.trim() !== "") {
      filter.title = { $regex: title, $options: "i" };
    }

    if (filter.genre === "pop") {
      if (artist && artist.trim() !== "") {
        filter.artist = { $regex: artist, $options: "i" };
      }
      if (mood && mood.trim() !== "") {
        filter.mood = { $regex: mood, $options: "i" };
      }
    } else {
      if (raga && raga.trim() !== "") {
        filter.raga = { $regex: raga, $options: "i" };
      }
      if (composer && composer.trim() !== "") {
        filter.composer = { $regex: composer, $options: "i" };
      }
    }

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


// RECOMMENDATION ENGINE
router.get("/recommend/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    let recommendations = [];
    if (song.genre === "pop") {
      recommendations = await Song.find({
        genre: "pop",
        _id: { $ne: song._id },
        $or: [
          { mood: song.mood },
          { artist: song.artist }
        ]
      }).limit(5);
    } else {
      recommendations = await Song.find({
        genre: "carnatic",
        raga: song.raga,
        _id: { $ne: song._id }
      }).limit(5);
    }

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET ALL UNIQUE CARNATIC RAGAS
router.get("/meta/ragas", async (req, res) => {
  try {
    const ragas = await Song.distinct("raga", { genre: "carnatic" });
    res.json(ragas.sort());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/meta/artists", async (req, res) => {
  try {
    const artists = await Song.distinct("artist", { genre: "pop" });
    res.json(artists.sort());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/meta/moods", async (req, res) => {
  try {
    const moods = await Song.distinct("mood", { genre: "pop" });
    res.json(moods.sort());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search suggestions (title autocomplete)
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