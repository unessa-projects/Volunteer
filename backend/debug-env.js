import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 DEBUGGING ENVIRONMENT 🔍');
console.log('================================');

// 1. Read .env file directly
const envPath = path.join(__dirname, '.env');
console.log('1. Reading .env file at:', envPath);

const envContent = fs.readFileSync(envPath, 'utf8');
const ngrokLine = envContent.split('\n').find(line => line.includes('NGROK_AUTHTOKEN'));
console.log('   NGROK_AUTHTOKEN in .env file:', ngrokLine);

// 2. Check process.env BEFORE dotenv
console.log('\n2. process.env BEFORE dotenv:');
console.log('   NGROK_AUTHTOKEN:', process.env.NGROK_AUTHTOKEN || '(not set)');

// 3. Load dotenv
import dotenv from 'dotenv';
dotenv.config();

// 4. Check process.env AFTER dotenv
console.log('\n3. process.env AFTER dotenv:');
console.log('   NGROK_AUTHTOKEN:', process.env.NGROK_AUTHTOKEN || '(not set)');
console.log('   Token length:', process.env.NGROK_AUTHTOKEN?.length);
console.log('   Token first 20 chars:', process.env.NGROK_AUTHTOKEN?.substring(0, 20));

// 5. Check ALL environment variables that start with NG
console.log('\n4. All NG* environment variables:');
Object.keys(process.env).forEach(key => {
  if (key.toUpperCase().startsWith('NG')) {
    console.log(`   ${key}=${process.env[key]?.substring(0, 30)}...`);
  }
});