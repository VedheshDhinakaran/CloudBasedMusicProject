const axios = require('axios');

async function testAuth() {
  try {
    console.log("Testing Signup...");
    const signupRes = await axios.post('http://localhost:5000/auth/signup', {
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    console.log("Signup Success:", signupRes.data);

    console.log("Testing Login...");
    const loginRes = await axios.post('http://localhost:5000/auth/login', {
      email: signupRes.data.email,
      password: 'password123'
    });
    console.log("Login Success:", loginRes.data);
  } catch (err) {
    console.error("Test Failed:", err.response?.data || err.message);
  }
}

testAuth();
