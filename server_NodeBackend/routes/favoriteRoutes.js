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
    const { title, composer, youtube } = req.body;
    
    // Deduplication per user
    const existingFav = await Favorite.findOne({ 
        userId: req.user.userId, 
        title, 
        composer 
    });

    if (existingFav) {
      return res.status(400).json({ error: "Song already in favorites" });
    }

    const fav = new Favorite({
        ...req.body,
        youtube, // Explicitly include youtube data if provided
        userId: req.user.userId
    });
    
    await fav.save();
    res.json(fav);
  } catch (err) {
    console.error("Add Favorite Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ❌ REMOVE using title + composer
router.delete("/", auth, async (req, res) => {
  try {
    const { title, composer } = req.query;

    await Favorite.findOneAndDelete({
      userId: req.user.userId,
      title: title,
      composer: composer,
    });

    res.json({ message: "Removed" });
  } catch (err) {
    console.error("Delete Favorite Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;