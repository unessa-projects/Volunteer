// Save as test-multiple-payments.js
const testMultiplePayments = async () => {
  const baseUrl = 'http://localhost:5000';
  
  console.log('🚀 Making 10 test payments...\n');
  
  const results = [];
  
  for (let i = 1; i <= 10; i++) {
    console.log(`\n📤 Payment ${i}/10 ======================`);
    
    const testData = {
      razorpay_order_id: `order_test_${Date.now()}_${i}`,
      razorpay_payment_id: `pay_test_${Date.now()}_${i}`,
      name: `Test Donor ${i}`,
      email: `test${i}@example.com`,
      phone: `+9112345678${i.toString().padStart(3, '0')}`,
      amount: i * 100, // 100, 200, 300, ... 1000
      refName: i % 2 === 0 ? 'testvolunteer' : null // Every other payment has refName
    };
    
    console.log(`Sending:`, JSON.stringify(testData, null, 2));
    
    try {
      const startTime = Date.now();
      const response = await fetch(`${baseUrl}/api/save-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const result = await response.json();
      
      console.log(`⏱️ Response time: ${responseTime}ms`);
      console.log(`📥 Status: ${response.status}`);
      console.log(`📝 Result:`, JSON.stringify(result, null, 2));
      
      results.push({
        paymentNumber: i,
        paymentId: testData.razorpay_payment_id,
        status: response.status,
        success: response.status === 201,
        responseTime: responseTime,
        result: result
      });
      
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      results.push({
        paymentNumber: i,
        paymentId: testData.razorpay_payment_id,
        status: 'ERROR',
        success: false,
        error: error.message
      });
    }
    
    // Wait 1 second between payments
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n\n📊 SUMMARY ======================');
  console.log(`Total payments attempted: ${results.length}`);
  console.log(`Successful (201): ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);
  
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ FAILED PAYMENTS:');
    failed.forEach(f => {
      console.log(`- Payment ${f.paymentNumber}: ${f.paymentId} - ${f.error || 'Unknown error'}`);
    });
  }
  
  return results;
};

// Run the test
testMultiplePayments().then(results => {
  console.log('\n✅ Test completed. Check your server logs for detailed information.');
  console.log('📋 Copy and share both:');
  console.log('1. The test results above');
  console.log('2. The server logs from VS Code terminal');
});