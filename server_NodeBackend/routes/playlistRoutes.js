const express = require("express");
const router = express.Router();
const Playlist = require("../models/Playlist");

// Get all playlists
router.get("/", async (req, res) => {
  try {
    const playlists = await Playlist.find().sort({ createdAt: -1 });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single playlist
router.get("/:id", async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Not found" });
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new playlist
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const newPlaylist = new Playlist({ name, songs: [] });
    await newPlaylist.save();
    res.json(newPlaylist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rename playlist
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const playlist = await Playlist.findByIdAndUpdate(req.params.id, { name }, { new: true });
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a song to playlist
router.post("/:id/songs", async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Not found" });
    
    const song = req.body;
    const existing = playlist.songs.find(s => 
      (s._id && s._id === song._id) || 
      (s.songId && s.songId === song.songId) || 
      (s.mbid && s.mbid === song.mbid) || 
      (s.title === song.title && s.composer === song.composer)
    );
    if (!existing) {
      playlist.songs.push(song);
      await playlist.save();
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a song from playlist
router.delete("/:id/songs/:songId", async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Not found" });

    playlist.songs = playlist.songs.filter(s => s._id !== req.params.songId && s.mbid !== req.params.songId && s.songId !== req.params.songId);
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete playlist
router.delete("/:id", async (req, res) => {
  try {
    await Playlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
