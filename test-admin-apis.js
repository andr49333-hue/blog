#!/usr/bin/env node

const axios = require('axios');

// Configuration
const BASE_URL = process.env.API_URL || 'http://localhost:5000';
const API_BASE = `${BASE_URL}/api`;

// Test credentials
const SUPER_ADMIN = {
  email: 'admin@example.com',
  password: 'password123'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Test results
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, status, details = '') {
  results.total++;
  if (status === 'PASS') {
    results.passed++;
    log(`✓ ${name}`, 'green');
  } else {
    results.failed++;
    log(`✗ ${name}`, 'red');
  }
  if (details) {
    console.log(`  ${details}`);
  }
  results.tests.push({ name, status, details });
}

// Test functions
async function testLogin() {
  try {
    log('\n=== Testing Login ===', 'cyan');
    
    const response = await axios.post(`${API_BASE}/admin/login`, {
      email: SUPER_ADMIN.email,
      password: SUPER_ADMIN.password
    });

    if (response.status === 200 && response.data.success && response.data.token) {
      logTest('POST /api/admin/login - Valid credentials', 'PASS', 
        `Status: ${response.status}, Token received`);
      return response.data.token;
    } else {
      logTest('POST /api/admin/login - Valid credentials', 'FAIL', 
        `Unexpected response: ${JSON.stringify(response.data)}`);
      return null;
    }
  } catch (error) {
    logTest('POST /api/admin/login - Valid credentials', 'FAIL', 
      `Error: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function testLoginInvalid() {
  try {
    await axios.post(`${API_BASE}/admin/login`, {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    });
    logTest('POST /api/admin/login - Invalid credentials', 'FAIL', 
      'Should have returned 401');
  } catch (error) {
    if (error.response?.status === 401) {
      logTest('POST /api/admin/login - Invalid credentials', 'PASS', 
        `Status: ${error.response.status}`);
    } else {
      logTest('POST /api/admin/login - Invalid credentials', 'FAIL', 
        `Expected 401, got ${error.response?.status || 'error'}`);
    }
  }
}

async function testGetProfile(token) {
  try {
    const response = await axios.get(`${API_BASE}/admin/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200 && response.data.success && response.data.data) {
      logTest('GET /api/admin/profile', 'PASS', 
        `Status: ${response.status}, Profile retrieved`);
      return response.data.data;
    } else {
      logTest('GET /api/admin/profile', 'FAIL', 
        `Unexpected response: ${JSON.stringify(response.data)}`);
      return null;
    }
  } catch (error) {
    logTest('GET /api/admin/profile', 'FAIL', 
      `Error: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function testUpdateProfile(token) {
  try {
    const response = await axios.put(`${API_BASE}/admin/profile`, {
      name: 'Updated Admin Name',
      email: SUPER_ADMIN.email // Keep same email
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200 && response.data.success) {
      logTest('PUT /api/admin/profile', 'PASS', 
        `Status: ${response.status}, Profile updated`);
      return response.data.data;
    } else {
      logTest('PUT /api/admin/profile', 'FAIL', 
        `Unexpected response: ${JSON.stringify(response.data)}`);
      return null;
    }
  } catch (error) {
    logTest('PUT /api/admin/profile', 'FAIL', 
      `Error: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function testChangePassword(token) {
  try {
    const response = await axios.put(`${API_BASE}/admin/profile/password`, {
      oldPassword: SUPER_ADMIN.password,
      newPassword: 'newPassword123'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200 && response.data.success) {
      logTest('PUT /api/admin/profile/password', 'PASS', 
        `Status: ${response.status}, Password changed`);
      
      // Change it back for other tests
      await axios.put(`${API_BASE}/admin/profile/password`, {
        oldPassword: 'newPassword123',
        newPassword: SUPER_ADMIN.password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } else {
      logTest('PUT /api/admin/profile/password', 'FAIL', 
        `Unexpected response: ${JSON.stringify(response.data)}`);
      return false;
    }
  } catch (error) {
    logTest('PUT /api/admin/profile/password', 'FAIL', 
      `Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testGetAllAdmins(token) {
  try {
    const response = await axios.get(`${API_BASE}/admins`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200 && response.data.success && Array.isArray(response.data.data)) {
      logTest('GET /api/admins', 'PASS', 
        `Status: ${response.status}, Retrieved ${response.data.data.length} admin(s)`);
      return response.data.data;
    } else {
      logTest('GET /api/admins', 'FAIL', 
        `Unexpected response: ${JSON.stringify(response.data)}`);
      return [];
    }
  } catch (error) {
    logTest('GET /api/admins', 'FAIL', 
      `Error: ${error.response?.data?.message || error.message}`);
    return [];
  }
}

async function testGetAllAdminsWithFilters(token) {
  try {
    const response = await axios.get(`${API_BASE}/admins?role=super_admin&isActive=true&page=1&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200 && response.data.success && response.data.pagination) {
      logTest('GET /api/admins - With filters (role, isActive, pagination)', 'PASS', 
        `Status: ${response.status}, Pagination: ${JSON.stringify(response.data.pagination)}`);
      return true;
    } else {
      logTest('GET /api/admins - With filters', 'FAIL', 
        `Unexpected response: ${JSON.stringify(response.data)}`);
      return false;
    }
  } catch (error) {
    logTest('GET /api/admins - With filters', 'FAIL', 
      `Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testGetAdminById(token, adminId) {
  try {
    const response = await axios.get(`${API_BASE}/admins/${adminId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200 && response.data.success && response.data.data) {
      logTest('GET /api/admins/:id', 'PASS', 
        `Status: ${response.status}, Admin retrieved`);
      return response.data.data;
    } else {
      logTest('GET /api/admins/:id', 'FAIL', 
        `Unexpected response: ${JSON.stringify(response.data)}`);
      return null;
    }
  } catch (error) {
    logTest('GET /api/admins/:id', 'FAIL', 
      `Error: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function testGetAdminByIdNotFound(token) {
  try {
    await axios.get(`${API_BASE}/admins/507f1f77bcf86cd799439011`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    logTest('GET /api/admins/:id - Not found', 'FAIL', 
      'Should have returned 404');
  } catch (error) {
    if (error.response?.status === 404) {
      logTest('GET /api/admins/:id - Not found', 'PASS', 
        `Status: ${error.response.status}`);
    } else {
      logTest('GET /api/admins/:id - Not found', 'FAIL', 
        `Expected 404, got ${error.response?.status || 'error'}`);
    }
  }
}

async function testCreateAdmin(token) {
  try {
    const newAdminData = {
      name: 'Test Admin',
      email: `testadmin${Date.now()}@example.com`,
      password: 'testPassword123',
      role: 'admin'
    };

    const response = await axios.post(`${API_BASE}/admins`, newAdminData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 201 && response.data.success && response.data.data) {
      logTest('POST /api/admins - Create admin', 'PASS', 
        `Status: ${response.status}, Admin created: ${response.data.data.email}`);
      return response.data.data;
    } else {
      logTest('POST /api/admins - Create admin', 'FAIL', 
        `Unexpected response: ${JSON.stringify(response.data)}`);
      return null;
    }
  } catch (error) {
    logTest('POST /api/admins - Create admin', 'FAIL', 
      `Error: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function testCreateAdminDuplicateEmail(token) {
  try {
    await axios.post(`${API_BASE}/admins`, {
      name: 'Duplicate Admin',
      email: SUPER_ADMIN.email, // Using existing email
      password: 'password123',
      role: 'admin'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    logTest('POST /api/admins - Duplicate email', 'FAIL', 
      'Should have returned 409');
  } catch (error) {
    if (error.response?.status === 409) {
      logTest('POST /api/admins - Duplicate email', 'PASS', 
        `Status: ${error.response.status}`);
    } else {
      logTest('POST /api/admins - Duplicate email', 'FAIL', 
        `Expected 409, got ${error.response?.status || 'error'}`);
    }
  }
}

async function testUpdateAdmin(token, adminId) {
  try {
    const response = await axios.put(`${API_BASE}/admins/${adminId}`, {
      name: 'Updated Test Admin',
      role: 'admin'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200 && response.data.success) {
      logTest('PUT /api/admins/:id - Update admin', 'PASS', 
        `Status: ${response.status}, Admin updated`);
      return response.data.data;
    } else {
      logTest('PUT /api/admins/:id - Update admin', 'FAIL', 
        `Unexpected response: ${JSON.stringify(response.data)}`);
      return null;
    }
  } catch (error) {
    logTest('PUT /api/admins/:id - Update admin', 'FAIL', 
      `Error: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function testUpdateAdminNotFound(token) {
  try {
    await axios.put(`${API_BASE}/admins/507f1f77bcf86cd799439011`, {
      name: 'Non-existent Admin'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    logTest('PUT /api/admins/:id - Not found', 'FAIL', 
      'Should have returned 404');
  } catch (error) {
    if (error.response?.status === 404) {
      logTest('PUT /api/admins/:id - Not found', 'PASS', 
        `Status: ${error.response.status}`);
    } else {
      logTest('PUT /api/admins/:id - Not found', 'FAIL', 
        `Expected 404, got ${error.response?.status || 'error'}`);
    }
  }
}

async function testDeleteAdmin(token, adminId) {
  try {
    const response = await axios.delete(`${API_BASE}/admins/${adminId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200 && response.data.success) {
      logTest('DELETE /api/admins/:id - Delete admin (soft delete)', 'PASS', 
        `Status: ${response.status}, Admin deactivated`);
      return true;
    } else {
      logTest('DELETE /api/admins/:id - Delete admin', 'FAIL', 
        `Unexpected response: ${JSON.stringify(response.data)}`);
      return false;
    }
  } catch (error) {
    logTest('DELETE /api/admins/:id - Delete admin', 'FAIL', 
      `Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testDeleteAdminNotFound(token) {
  try {
    await axios.delete(`${API_BASE}/admins/507f1f77bcf86cd799439011`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    logTest('DELETE /api/admins/:id - Not found', 'FAIL', 
      'Should have returned 404');
  } catch (error) {
    if (error.response?.status === 404) {
      logTest('DELETE /api/admins/:id - Not found', 'PASS', 
        `Status: ${error.response.status}`);
    } else {
      logTest('DELETE /api/admins/:id - Not found', 'FAIL', 
        `Expected 404, got ${error.response?.status || 'error'}`);
    }
  }
}

async function testUnauthorizedAccess() {
  try {
    await axios.get(`${API_BASE}/admin/profile`);
    logTest('GET /api/admin/profile - Unauthorized', 'FAIL', 
      'Should have returned 401');
  } catch (error) {
    if (error.response?.status === 401) {
      logTest('GET /api/admin/profile - Unauthorized', 'PASS', 
        `Status: ${error.response.status}`);
    } else {
      logTest('GET /api/admin/profile - Unauthorized', 'FAIL', 
        `Expected 401, got ${error.response?.status || 'error'}`);
    }
  }
}

// Main test runner
async function runTests() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     Admin API Test Suite - Complete CRUD & Login Tests    ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  let token = null;
  let createdAdminId = null;
  let profileData = null;

  try {
    // 1. Test Login
    token = await testLogin();
    await testLoginInvalid();

    if (!token) {
      log('\n❌ Login failed. Cannot proceed with other tests.', 'red');
      printSummary();
      process.exit(1);
    }

    // 2. Test Profile Operations
    profileData = await testGetProfile(token);
    await testUpdateProfile(token);
    await testChangePassword(token);

    // 3. Test Unauthorized Access
    await testUnauthorizedAccess();

    // 4. Test Get All Admins
    const admins = await testGetAllAdmins(token);
    await testGetAllAdminsWithFilters(token);

    // 5. Test Get Admin By ID
    if (profileData && profileData._id) {
      await testGetAdminById(token, profileData._id);
    }
    await testGetAdminByIdNotFound(token);

    // 6. Test Create Admin (requires super_admin)
    const newAdmin = await testCreateAdmin(token);
    if (newAdmin && newAdmin._id) {
      createdAdminId = newAdmin._id;
    }
    await testCreateAdminDuplicateEmail(token);

    // 7. Test Update Admin
    if (createdAdminId) {
      await testUpdateAdmin(token, createdAdminId);
    }
    await testUpdateAdminNotFound(token);

    // 8. Test Delete Admin (soft delete)
    if (createdAdminId) {
      await testDeleteAdmin(token, createdAdminId);
    }
    await testDeleteAdminNotFound(token);

  } catch (error) {
    log(`\n❌ Unexpected error: ${error.message}`, 'red');
    console.error(error);
  }

  printSummary();
}

function printSummary() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                    Test Summary                            ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  log(`\nTotal Tests: ${results.total}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  
  const passRate = ((results.passed / results.total) * 100).toFixed(1);
  log(`Pass Rate: ${passRate}%`, passRate === '100.0' ? 'green' : 'yellow');
  
  if (results.failed > 0) {
    log('\nFailed Tests:', 'red');
    results.tests
      .filter(t => t.status === 'FAIL')
      .forEach(t => {
        log(`  ✗ ${t.name}`, 'red');
        if (t.details) {
          log(`    ${t.details}`, 'yellow');
        }
      });
  }
  
  log('\n', 'reset');
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

