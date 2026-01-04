const axios = require('axios');

async function testLogin() {
    try {
        console.log('Testing admin login...');
        
        const loginData = {
            email: "admin@example.com",
            password: "password123"
        };
        
        console.log('Sending request to:', 'http://localhost:5000/api/admin/login');
        console.log('With data:', loginData);
        
        const response = await axios.post('http://localhost:5000/api/admin/login', loginData, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Login successful!');
        console.log('Status:', response.status);
        console.log('Response:', response.data);
        
    } catch (error) {
        console.log('❌ Login failed!');
        console.log('Full error:', error);
        console.log('Error message:', error.message);
        console.log('Error code:', error.code);
        
        if (error.response) {
            console.log('Response status:', error.response.status);
            console.log('Response data:', error.response.data);
            console.log('Response headers:', error.response.headers);
        } else if (error.request) {
            console.log('Request was made but no response received');
            console.log('Request:', error.request);
        }
    }
}

testLogin();