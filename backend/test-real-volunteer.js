// Save as test-real-volunteer.js
import http from 'http'

const testRealVolunteer = async () => {
  console.log('🧪 Testing with REAL volunteer username...\n');
  
  const results = [];
  
  // Use the REAL username from your logs
  const realUsername = 'kirtanvyasckvb';
  
  for (let i = 1; i <= 5; i++) {
    console.log(`📤 Test ${i}/5 for volunteer: ${realUsername}`);
    
    const postData = JSON.stringify({
      razorpay_order_id: `real_test_${Date.now()}_${i}`,
      razorpay_payment_id: `real_pay_${Date.now()}_${i}`,
      name: `Real Donor ${i}`,
      email: `real${i}@example.com`,
      phone: `+91111111111${i}`,
      amount: i * 500, // 500, 1000, 1500, 2000, 2500
      refName: realUsername  // REAL volunteer username
    });
    
    const result = await new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/save-payment',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          resolve({
            test: i,
            status: res.statusCode,
            success: res.statusCode === 201,
            data: JSON.parse(data || '{}')
          });
        });
      });
      
      req.on('error', (error) => {
        resolve({
          test: i,
          status: 'ERROR',
          success: false,
          error: error.message
        });
      });
      
      req.write(postData);
      req.end();
    });
    
    results.push(result);
    console.log(`   Status: ${result.status} ${result.success ? '✅' : '❌'}`);
    
    // Wait 1 second
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('\n📊 SUMMARY:');
  console.log(`Total: ${results.length}`);
  console.log(`Success: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);
  
  // Check if user was updated
  console.log('\n🔍 Checking user amount...');
  
  await new Promise(r => setTimeout(r, 2000)); // Wait for updates
  
  const checkReq = http.request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/donations?username=${realUsername}`,
    method: 'GET'
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const donations = JSON.parse(data);
        console.log(`Donations for ${realUsername}:`, donations.length || 0);
        console.log('Last 3 donations:', donations.slice(0, 3));
      } catch (e) {
        console.log('Response:', data);
      }
    });
  });
  
  checkReq.end();
};

testRealVolunteer();