import app from './src/app.js';
import mongoose from 'mongoose';
import { User } from './src/models/User.js';
import { Order } from './src/models/Order.js';

const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}/api`;

async function testSuite() {
  console.log('--- Starting API Verification Test Suite (MongoDB) ---');

  // Start the server (which connects to MongoDB automatically via server.js/app imports)
  const server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);

    try {
      // Wait for Mongoose connection to be fully ready
      if (mongoose.connection.readyState !== 1) {
        await new Promise((resolve) => mongoose.connection.once('open', resolve));
      }

      // Clear test data collections
      await User.deleteMany({});
      await Order.deleteMany({});
      console.log('Cleared User and Order collections.');

      let token = '';

      // 1) Test Health Check
      console.log('Testing /health...');
      const healthRes = await fetch(`http://localhost:${PORT}/health`);
      const healthJson = await healthRes.json();
      if (healthJson.status !== 'success') throw new Error('Health check failed');
      console.log('✅ Health check passed');

      // 2) Test Signup
      console.log('Testing Signup...');
      const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          name: 'Testy Tester',
          phone: '1234567890',
          address: '456 Test Street',
        }),
      });
      const signupJson = await signupRes.json();
      if (signupRes.status !== 201 || signupJson.status !== 'success') {
        throw new Error(`Signup failed: ${JSON.stringify(signupJson)}`);
      }
      console.log('✅ Signup passed');

      token = signupJson.token;

      // 3) Test Login
      console.log('Testing Login...');
      const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });
      const loginJson = await loginRes.json();
      if (loginRes.status !== 200 || loginJson.status !== 'success') {
        throw new Error(`Login failed: ${JSON.stringify(loginJson)}`);
      }
      console.log('✅ Login passed');

      // 4) Test Profile Fetch
      console.log('Testing Profile...');
      const profileRes = await fetch(`${BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const profileJson = await profileRes.json();
      if (profileRes.status !== 200 || profileJson.data.user.email !== 'test@example.com') {
        throw new Error(`Profile check failed: ${JSON.stringify(profileJson)}`);
      }
      console.log('✅ Profile fetch passed');

      // 5) Test Get Menu Items
      console.log('Testing Get Menu...');
      const menuRes = await fetch(`${BASE_URL}/menu`);
      const menuJson = await menuRes.json();
      if (menuRes.status !== 200 || menuJson.data.menuItems.length === 0) {
        throw new Error('Menu items retrieval failed');
      }
      const item = menuJson.data.menuItems[0];
      console.log(`✅ Get Menu passed (Found item: ${item.name})`);

      // 6) Test Order Creation
      console.log('Testing Order Creation...');
      const orderRes = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [
            {
              menuItemId: item._id, // MongoDB Object IDs
              quantity: 2,
            },
          ],
        }),
      });
      const orderJson = await orderRes.json();
      if (orderRes.status !== 201 || orderJson.status !== 'success') {
        throw new Error(`Order creation failed: ${JSON.stringify(orderJson)}`);
      }
      console.log('✅ Order creation passed');

      // 7) Test Get My Orders
      console.log('Testing Get My Orders...');
      const myOrdersRes = await fetch(`${BASE_URL}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const myOrdersJson = await myOrdersRes.json();
      if (myOrdersRes.status !== 200 || myOrdersJson.data.orders.length === 0) {
        throw new Error(`Orders history lookup failed: ${JSON.stringify(myOrdersJson)}`);
      }
      console.log('✅ Orders history lookup passed');

      console.log('\n🌟 ALL TESTS PASSED SUCCESSFULLY! 🌟');
    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
    } finally {
      // Disconnect database and shut down testing port
      await mongoose.disconnect();
      server.close(() => {
        console.log('Test server closed.');
        process.exit(0);
      });
    }
  });
}

testSuite();
