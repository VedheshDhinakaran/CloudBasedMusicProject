const express = require("express");
const axios = require("axios");
const router = express.Router();
const mongoose = require("mongoose");
const Song = require("../models/Song");
const VideoCache = require("../models/VideoCache");
const { updateSongInJson, findCachedYoutubeInJson } = require("../utils/jsonPersistence");

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// 🕊️ FALLBACK Carnatic Classics (Used when Quota is hit)
const CLOUD_FALLBACKS = [
  { videoId: "9S_Jv9eW2mQ", title: "Carnatic Vocal - M.S. Subbulakshmi", channelTitle: "Classic Carnatic" },
  { videoId: "vHk-k_XhG-E", title: "Bombay Jayashri - Best of Carnatic", channelTitle: "Carnatic Music" },
  { videoId: "Gq97_mCjXzA", title: "Sudha Ragunathan - Divine Melodies", channelTitle: "Amutham Music" },
  { videoId: "fVIsC2O8C1A", title: "Aruna Sairam - Abhangs & Carnatic", channelTitle: "Saregama" }
];

router.get("/search", async (req, res) => {
  try {
    const { songId, title, composer, raga } = req.query;

    if (!title) return res.status(400).json({ error: "title is required" });

    // 🚀 1. JSON FILE CACHE CHECK (Primary - checks the .json data files)
    if (composer) {
      const jsonCached = findCachedYoutubeInJson(title, composer);
      if (jsonCached) {
        console.log("📦 CACHE HIT (JSON File):", title);
        return res.json(jsonCached);
      }
    }

    // 🚀 2. VIDEO CACHE CHECK (MongoDB query-based)
    const cacheQuery = `${title.toLowerCase().trim()} | ${(raga || "").toLowerCase().trim()} | ${(composer || "").toLowerCase().trim()}`;
    try {
      const cachedVideo = await VideoCache.findOne({ query: cacheQuery });
      if (cachedVideo) {
        console.log("📦 CACHE HIT (VideoCache DB):", title);
        const result = {
          videoId: cachedVideo.videoId,
          title: cachedVideo.title,
          thumbnail: cachedVideo.thumbnail,
          channelTitle: cachedVideo.channelTitle
        };
        // Also persist to JSON so next time it hits the faster file cache
        if (composer) updateSongInJson(title, composer, result);
        return res.json(result);
      }
    } catch (err) { console.error("Video cache error:", err); }

    // 🚀 3. LOCAL SONG DB CACHE CHECK
    if (songId && mongoose.Types.ObjectId.isValid(songId)) {
      try {
        const existingSong = await Song.findById(songId);
        if (existingSong && existingSong.youtube && existingSong.youtube.videoId) {
          console.log("📦 CACHE HIT (Local Song DB):", existingSong.title);
          // Also persist to JSON
          if (composer) updateSongInJson(title, composer, existingSong.youtube);
          return res.json(existingSong.youtube);
        }
      } catch (err) { console.error("Song cache error:", err); }
    }

    // 🚀 4. YOUTUBE API FETCH (Only if no cache hit anywhere)
    let bestVideo = null;

    try {
        const searchQuery = `${title} ${raga || ""} ${composer || ""}`.trim();
        console.log("⚡ YouTube API Search (no cache):", searchQuery);

        const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
          params: { 
            part: "snippet", 
            q: searchQuery, 
            type: "video", 
            maxResults: 1, 
            key: YOUTUBE_API_KEY, 
            videoEmbeddable: "true" 
          }
        });

        const videos = response.data.items;
        if (videos && videos.length > 0) {
          bestVideo = videos[0];
          console.log("🎯 Selected First Result | Title:", bestVideo.snippet.title);
        }
    } catch (apiErr) {
      if (apiErr.response?.status === 403) {
        console.error("⛔ YOUTUBE QUOTA EXCEEDED - Using Fallback Music");
        const fallback = CLOUD_FALLBACKS[Math.floor(Math.random() * CLOUD_FALLBACKS.length)];
        return res.json({
            videoId: fallback.videoId,
            title: `[Fallback] ${fallback.title} (Quota Limited)`,
            thumbnail: `https://img.youtube.com/vi/${fallback.videoId}/hqdefault.jpg`,
            channelTitle: fallback.channelTitle,
            isFallback: true
        });
      }
      throw apiErr;
    }

    if (!bestVideo) return res.status(404).json({ error: "No videos found" });

    const youtubeData = {
      videoId: bestVideo.id.videoId,
      title: bestVideo.snippet.title,
      thumbnail: bestVideo.snippet.thumbnails.high?.url || bestVideo.snippet.thumbnails.default?.url,
      channelTitle: bestVideo.snippet.channelTitle
    };

    // 🚀 5. SAVE TO JSON FILE (Primary persistent cache)
    if (composer) {
      updateSongInJson(title, composer, youtubeData);
    }

    // 🚀 6. SAVE TO VIDEO CACHE (MongoDB backup)
    try {
      await VideoCache.create({ query: cacheQuery, ...youtubeData });
      console.log("💾 Saved to VideoCache DB:", title);
    } catch (err) { console.error("Save to VideoCache failed:", err.message); }

    // 🚀 7. SAVE TO LOCAL SONG DOCUMENT (if valid ObjectId)
    if (songId && mongoose.Types.ObjectId.isValid(songId)) {
      try {
        await Song.findByIdAndUpdate(songId, { youtube: youtubeData });
        console.log("💾 Saved to Song document:", title);
      } catch (err) { console.error("Save to Song failed:", err.message); }
    }

    res.json(youtubeData);

  } catch (error) {
    console.error("YouTube Error:", error.message);
    res.status(500).json({ error: "YouTube search failed" });
  }
});

module.exports = router;