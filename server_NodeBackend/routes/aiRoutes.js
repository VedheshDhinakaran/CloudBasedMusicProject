const express = require("express");
const router = express.Router();
const Song = require("../models/Song");
const { generateSongInsights } = require("../utils/aiService");

// GET /api/ai/insights/:id
router.get("/insights/:id", async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ message: "Song not found" });

        // If insights already exist, return them immediately
        if (song.story && song.beauty) {
            return res.json({
                story: song.story,
                beauty: song.beauty,
                cached: true
            });
        }

        // Generate new insights using local LLM service
        const insights = await generateSongInsights(song);

        // Save back to DB for zero-cost persistent storage
        song.story = insights.story;
        song.beauty = insights.beauty;
        await song.save();

        res.json({
            ...insights,
            cached: false
        });
    } catch (err) {
        console.error("AI Route Error:", err);
        res.status(500).json({ message: "AI Generation failed", error: err.message });
    }
});

module.exports = router;
