#!/usr/bin/env node

const http = require("http");

// Test endpoints with their expected methods and paths
const tests = [
  { method: "GET", path: "/api/health", name: "Health Check" },
  {
    method: "POST",
    path: "/api/admin/login",
    name: "Admin Login",
    body: { email: "admin@example.com", password: "password123" },
  },
  { method: "GET", path: "/api/content", name: "Get Content Items" },
  { method: "GET", path: "/api/pages", name: "Get Pages" },
  { method: "GET", path: "/api/admins", name: "Get All Admins" },
  { method: "GET", path: "/api/admin/profile", name: "Get Admin Profile" },
];

let completed = 0;
let passed = 0;
let failed = 0;

console.log("\n=== CMS Backend API Test Suite ===\n");

tests.forEach((test, index) => {
  setTimeout(() => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: test.path,
      method: test.method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        completed++;
        if (res.statusCode >= 200 && res.statusCode < 400) {
          passed++;
          console.log(
            `✓ ${test.method} ${test.path} - ${test.name} (${res.statusCode})`
          );
        } else {
          failed++;
          console.log(
            `✗ ${test.method} ${test.path} - ${test.name} (${res.statusCode})`
          );
        }

        if (completed === tests.length) {
          console.log(`\n=== Test Summary ===`);
          console.log(
            `Total: ${tests.length}, Passed: ${passed}, Failed: ${failed}\n`
          );
          process.exit(0);
        }
      });
    });

    req.on("error", (e) => {
      completed++;
      failed++;
      console.log(
        `✗ ${test.method} ${test.path} - ${test.name} (Error: ${e.message})`
      );

      if (completed === tests.length) {
        console.log(`\n=== Test Summary ===`);
        console.log(
          `Total: ${tests.length}, Passed: ${passed}, Failed: ${failed}\n`
        );
        process.exit(0);
      }
    });

    if (test.body) {
      req.write(JSON.stringify(test.body));
    }
    req.end();
  }, index * 500);
});
