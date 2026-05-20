const mongoose = require('mongoose');
const Song = require('./models/Song');
const logger = require('./logger');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('✅ Connected to MongoDB');
    
    const result = await Song.updateMany({}, { $unset: { story: "", beauty: "" } });
    logger.info(`✅ Cleared cached insights from ${result.modifiedCount} songs`);
    
    await mongoose.connection.close();
    logger.info('✅ Done');
  } catch (err) {
    logger.error('❌ Error:', err.message);
  }
})();
