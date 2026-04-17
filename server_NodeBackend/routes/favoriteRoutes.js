const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");
const auth = require("../middleware/auth");

// ✅ GET favorites (User specific)
router.get("/", auth, async (req, res) => {
  try {
    const favs = await Favorite.find({ userId: req.user.userId });
    res.json(favs);
  } catch (err) {
    console.error("Fetch Favorites Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADD favorite
router.post("/", auth, async (req, res) => {
  try {
    const { title, genre, composer, artist } = req.body;
    const favoriteQuery = {
      userId: req.user.userId,
      title,
      genre: genre || "carnatic"
    };

    if (genre === "pop") {
      favoriteQuery.artist = artist;
    } else {
      favoriteQuery.composer = composer;
    }

    const existingFav = await Favorite.findOne(favoriteQuery);
    if (existingFav) {
      return res.status(400).json({ error: "Song already in favorites" });
    }

    const fav = new Favorite({
      ...req.body,
      userId: req.user.userId
    });

    await fav.save();
    res.json(fav);
  } catch (err) {
    console.error("Add Favorite Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ✅ REMOVE favorite by genre-aware identifier
router.delete("/", auth, async (req, res) => {
  try {
    const { title, genre, composer, artist } = req.query;
    const deleteQuery = {
      userId: req.user.userId,
      title,
      genre: genre || "carnatic"
    };

    if (genre === "pop") {
      deleteQuery.artist = artist;
    } else {
      deleteQuery.composer = composer;
    }

    await Favorite.findOneAndDelete(deleteQuery);
    res.json({ message: "Removed" });
  } catch (err) {
    console.error("Delete Favorite Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;