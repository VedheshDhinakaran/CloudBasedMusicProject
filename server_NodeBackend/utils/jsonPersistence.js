const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

/**
 * Scans all .json files in data/ folder, finds the song by title+composer,
 * and writes the youtube metadata directly into the JSON file.
 */
function updateSongInJson(title, composer, youtubeData) {
  try {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));

    for (const file of files) {
      const filePath = path.join(DATA_DIR, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const songs = JSON.parse(raw);

      let updated = false;

      for (let i = 0; i < songs.length; i++) {
        if (
          songs[i].title &&
          songs[i].title.toLowerCase() === title.toLowerCase() &&
          songs[i].composer &&
          songs[i].composer.toLowerCase() === composer.toLowerCase()
        ) {
          // Only update if not already cached
          if (!songs[i].youtube || !songs[i].youtube.videoId) {
            songs[i].youtube = {
              videoId: youtubeData.videoId,
              title: youtubeData.title,
              thumbnail: youtubeData.thumbnail,
              channelTitle: youtubeData.channelTitle
            };
            updated = true;
            console.log(`📝 JSON UPDATED: "${title}" in ${file}`);
          } else {
            console.log(`📦 JSON ALREADY CACHED: "${title}" in ${file}`);
          }
        }
      }

      if (updated) {
        fs.writeFileSync(filePath, JSON.stringify(songs, null, 2), "utf-8");
      }
    }
  } catch (err) {
    console.error("❌ JSON persistence error:", err.message);
  }
}

/**
 * Scans all .json files in data/ folder looking for a song that already
 * has a cached youtube link.
 */
function findCachedYoutubeInJson(title, composer) {
  try {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));

    for (const file of files) {
      const filePath = path.join(DATA_DIR, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const songs = JSON.parse(raw);

      for (const song of songs) {
        if (
          song.title &&
          song.title.toLowerCase() === title.toLowerCase() &&
          song.composer &&
          song.composer.toLowerCase() === composer.toLowerCase() &&
          song.youtube &&
          song.youtube.videoId
        ) {
          return song.youtube;
        }
      }
    }
  } catch (err) {
    console.error("❌ JSON cache lookup error:", err.message);
  }

  return null;
}

module.exports = { updateSongInJson, findCachedYoutubeInJson };
