/**
 * Test script for Website Public API endpoints
 * Tests content retrieval by type with API key authentication
 */

const axios = require("axios");

// Configuration
const BASE_URL = "http://localhost:5000";
const API_KEY = "cms-website-api-key-2026"; // From .env WEBSITE_API_KEY

// Helper function to make requests with API key
async function testEndpoint(method, endpoint, description) {
  console.log(`\n📝 Testing: ${description}`);
  console.log(`   ${method} ${endpoint}`);
  console.log("   ─────────────────────────────────────────");

  try {
    const response = await axios({
      method: method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        "X-API-Key": API_KEY,
      },
    });

    console.log(`   ✅ Status: ${response.status}`);
    console.log(`   ✅ Success: ${response.data.success}`);
    console.log(`   ✅ Message: ${response.data.message}`);

    if (response.data.data) {
      if (Array.isArray(response.data.data)) {
        console.log(`   ✅ Data Count: ${response.data.data.length}`);
        if (response.data.data.length > 0) {
          console.log(
            `   ✅ First Item: ${response.data.data[0].title || response.data.data[0]}`,
          );
        }
      } else {
        console.log(`   ✅ Data:`, JSON.stringify(response.data.data, null, 2));
      }
    }

    if (response.data.pagination) {
      console.log(`   ✅ Pagination:`, response.data.pagination);
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.log(`   ❌ Error: ${error.response?.status || error.message}`);
    console.log(
      `   ❌ Message: ${error.response?.data?.message || error.message}`,
    );
    return { success: false, error: error.message };
  }
}

// Test without API key
async function testWithoutApiKey() {
  console.log(`\n🔒 Testing: Without API Key (Should Fail)`);
  console.log("   ─────────────────────────────────────────");

  try {
    const response = await axios.get(
      `${BASE_URL}/api/website/content?type=blog`,
    );
    console.log(`   ❌ Should have failed but got: ${response.status}`);
  } catch (error) {
    console.log(`   ✅ Status: ${error.response?.status || "Error"}`);
    console.log(
      `   ✅ Message: ${error.response?.data?.message || error.message}`,
    );
    console.log(`   ✅ Correctly rejected without API key!`);
  }
}

// Test with wrong API key
async function testWithWrongApiKey() {
  console.log(`\n🔒 Testing: With Wrong API Key (Should Fail)`);
  console.log("   ─────────────────────────────────────────");

  try {
    const response = await axios({
      method: "GET",
      url: `${BASE_URL}/api/website/content?type=blog`,
      headers: {
        "X-API-Key": "wrong-api-key",
      },
    });
    console.log(`   ❌ Should have failed but got: ${response.status}`);
  } catch (error) {
    console.log(`   ✅ Status: ${error.response?.status || "Error"}`);
    console.log(
      `   ✅ Message: ${error.response?.data?.message || error.message}`,
    );
    console.log(`   ✅ Correctly rejected wrong API key!`);
  }
}

// Run all tests
async function runTests() {
  console.log("╔═══════════════════════════════════════════════════════╗");
  console.log("║   Website Public API Tests (API Key Required)        ║");
  console.log("╚═══════════════════════════════════════════════════════╝");

  // Test security first
  await testWithoutApiKey();
  await testWithWrongApiKey();

  // Test valid endpoints
  await testEndpoint("GET", "/api/website/content?type=blog", "Get all blogs");
  await testEndpoint(
    "GET",
    "/api/website/content?type=story",
    "Get all stories",
  );
  await testEndpoint(
    "GET",
    "/api/website/content?type=guide",
    "Get all guides",
  );
  await testEndpoint(
    "GET",
    "/api/website/content?type=blog&page=1&limit=5",
    "Get blogs with pagination",
  );
  await testEndpoint(
    "GET",
    "/api/website/content/latest?limit=5",
    "Get latest 5 content items",
  );
  await testEndpoint("GET", "/api/website/stats", "Get content statistics");

  // Test invalid type
  console.log(`\n📝 Testing: Invalid Content Type`);
  try {
    await axios({
      method: "GET",
      url: `${BASE_URL}/api/website/content?type=invalid`,
      headers: { "X-API-Key": API_KEY },
    });
  } catch (error) {
    console.log(`   ✅ Status: ${error.response?.status}`);
    console.log(`   ✅ Message: ${error.response?.data?.message}`);
    console.log(`   ✅ Correctly rejected invalid type!`);
  }

  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║   All Tests Completed!                                ║");
  console.log("╚═══════════════════════════════════════════════════════╝");
}

// Execute tests
runTests().catch(console.error);
