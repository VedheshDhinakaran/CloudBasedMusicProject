const axios = require('axios');
const logger = require('./logger');

async function testAuth() {
  try {
    logger.info("Testing Signup...");
    const signupRes = await axios.post('http://localhost:5000/auth/signup', {
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    logger.info("Signup Success:", signupRes.data);

    logger.info("Testing Login...");
    const loginRes = await axios.post('http://localhost:5000/auth/login', {
      email: signupRes.data.email,
      password: 'password123'
    });
    logger.info("Login Success:", loginRes.data);
  } catch (err) {
    logger.error("Test Failed:", err.response?.data || err.message);
  }
}

testAuth();
