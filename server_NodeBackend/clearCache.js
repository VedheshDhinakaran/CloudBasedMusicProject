const mongoose = require('mongoose');
const Song = require('./models/Song');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const result = await Song.updateMany({}, { $unset: { story: "", beauty: "" } });
    console.log(`✅ Cleared cached insights from ${result.modifiedCount} songs`);
    
    await mongoose.connection.close();
    console.log('✅ Done');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
