// Test Telegram connection
import 'dotenv/config';
import { sendStartupMessage } from './telegram.js';

console.log('📤 Sending test message...');

const result = await sendStartupMessage();

if (result?.ok) {
  console.log('✅ Message sent successfully!');
} else {
  console.log('❌ Failed to send message');
  console.log(result);
}
