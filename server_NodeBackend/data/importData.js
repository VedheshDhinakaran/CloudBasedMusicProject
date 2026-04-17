const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Song = require("../models/Song");

require("dotenv").config({ path: path.join(__dirname, "../.env") });
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/carnaticDB";

async function importData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    const syamaPath = path.join(__dirname, "syama_shastri_songs.json");
    const dikshitarPath = path.join(__dirname, "muthuswamy_dikshitar_songs.json");
    const popPath = path.join(__dirname, "pop_songs.json");

    const syamaData = JSON.parse(fs.readFileSync(syamaPath, "utf-8"));
    const dikshitarData = JSON.parse(fs.readFileSync(dikshitarPath, "utf-8"));
    const popData = fs.existsSync(popPath) ? JSON.parse(fs.readFileSync(popPath, "utf-8")) : [];

    const syamaWithComposer = syamaData.map((song) => ({
      ...song,
      composer: "Syama Sastri",
      genre: "carnatic"
    }));

    const dikshitarWithComposer = dikshitarData.map((song) => ({
      ...song,
      composer: song.composer || "Muthuswami Dikshitar",
      genre: "carnatic"
    }));

    const popSongs = popData.map((song) => ({
      ...song,
      genre: "pop"
    }));

    await Song.deleteMany();
    console.log("Old data cleared");

    const allSongs = [...syamaWithComposer, ...dikshitarWithComposer, ...popSongs];
    await Song.insertMany(allSongs);

    console.log(`Imported ${allSongs.length} songs into MongoDB.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

importData();

