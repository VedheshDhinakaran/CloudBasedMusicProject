const express = require("express");
const router = express.Router();
const spotifyService = require("../utils/spotifyService");

// GET /spotify/search?q=...
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || String(query).trim() === "") {
      return res.json([]);
    }

    const spotifyData = await spotifyService.searchTracks(query, 30);

    const mapped = (spotifyData.tracks?.items || []).map((track) => ({
      spotifyId: track.id,
      title: track.name,
      composer: track.artists.map((a) => a.name).join(", "),
      raga: track.album?.name || "",
      type: "spotify-track",
      audio: track.preview_url || "",
      durationMs: track.duration_ms,
      album: track.album?.name,
      image: track.album?.images?.[0]?.url || "",
      spotifyUrl: track.external_urls?.spotify,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Spotify search error", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /spotify/track/:id
router.get("/track/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "spotify track id is required" });
    }

    const track = await spotifyService.getTrackById(id);

    const mapped = {
      spotifyId: track.id,
      title: track.name,
      composer: track.artists.map((a) => a.name).join(", "),
      raga: track.album?.name || "",
      type: "spotify-track",
      audio: track.preview_url || "",
      durationMs: track.duration_ms,
      album: track.album?.name,
      image: track.album?.images?.[0]?.url || "",
      spotifyUrl: track.external_urls?.spotify,
      explicit: track.explicit,
      releaseDate: track.album?.release_date,
    };

    res.json(mapped);
  } catch (err) {
    console.error("Spotify track detail error", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
