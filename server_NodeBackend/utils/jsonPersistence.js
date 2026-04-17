const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const CACHE_FILE = path.join(DATA_DIR, "youtube_cache.json");

/**
 * Loads the YouTube cache from the separate cache file.
 */
function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("❌ Cache load error:", err.message);
  }
  return {};
}

/**
 * Saves the YouTube cache to the separate cache file.
 */
function saveCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  } catch (err) {
    console.error("❌ Cache save error:", err.message);
  }
}

/**
 * Updates the YouTube cache with new data.
 */
function updateSongInJson(title, composer, youtubeData) {
  const cache = loadCache();
  const key = `${title.toLowerCase().trim()}|${composer.toLowerCase().trim()}`;
  
  if (!cache[key]) {
    cache[key] = {
      videoId: youtubeData.videoId,
      title: youtubeData.title,
      thumbnail: youtubeData.thumbnail,
      channelTitle: youtubeData.channelTitle
    };
    saveCache(cache);
    console.log(`📝 CACHE UPDATED: "${title}"`);
  } else {
    console.log(`📦 CACHE ALREADY EXISTS: "${title}"`);
  }
}

/**
 * Finds cached YouTube data.
 */
function findCachedYoutubeInJson(title, composer) {
  const cache = loadCache();
  const key = `${title.toLowerCase().trim()}|${composer.toLowerCase().trim()}`;
  return cache[key] || null;
}

module.exports = { updateSongInJson, findCachedYoutubeInJson };
