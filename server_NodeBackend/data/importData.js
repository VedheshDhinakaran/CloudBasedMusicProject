const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Song = require("./models/Song");

const MONGO_URI = "mongodb+srv://vedheshdv_db_user:lscx0iV2I3UjkkJR@cluster0.hvlhozc.mongodb.net/carnaticDB?retryWrites=true&w=majority";

async function importData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    // 📂 Read both files
    const syamaPath = path.join(__dirname, "data", "syama_shastri_songs.json");
    const dikshitarPath = path.join(__dirname, "data", "muthuswamy_dikshitar_songs.json");

    const syamaData = JSON.parse(fs.readFileSync(syamaPath, "utf-8"));
    const dikshitarData = JSON.parse(fs.readFileSync(dikshitarPath, "utf-8"));

    // 🎼 Inject composer
    const syamaWithComposer = syamaData.map(song => ({
      ...song,
      composer: "Syama Sastri"
    }));

    const dikshitarWithComposer = dikshitarData.map(song => ({
      ...song,
      composer: "Muthuswami Dikshitar"
    }));

    // 🔥 Combine both
    const allSongs = [...syamaData, ...dikshitarData];

    // 🧹 Clear old data
    await Song.deleteMany();
    console.log("Old data cleared");

    // ✅ Insert all
    await Song.insertMany(allSongs);

    console.log("All songs imported successfully");

    await mongoose.connection.close();
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

importData();