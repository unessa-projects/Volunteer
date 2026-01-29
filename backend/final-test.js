// final-test.js
console.log('🎯 FINAL TEST - Environment Variable Check');
console.log('==========================================');

// Check before dotenv
console.log('\n1. Before dotenv:');
console.log('   NGROK_AUTHTOKEN:', process.env.NGROK_AUTHTOKEN || '(not set)');

// Load dotenv
import dotenv from 'dotenv';
dotenv.config();

console.log('\n2. After dotenv:');
console.log('   NGROK_AUTHTOKEN:', process.env.NGROK_AUTHTOKEN || '(not set)');
console.log('   First 20 chars:', process.env.NGROK_AUTHTOKEN?.substring(0, 20) + '...');
console.log('   Length:', process.env.NGROK_AUTHTOKEN?.length);

// Expected: 37sBR9nv6AXAyhsj1wTr7VjoB3P_3RdQhXWkc8E9kPyDjfGre
// Length should be 55