// Helper script to get your Telegram Chat ID
// Run: TELEGRAM_BOT_TOKEN=your_token node src/get-chat-id.js

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ Set TELEGRAM_BOT_TOKEN environment variable');
  console.log('\nUsage:');
  console.log('  TELEGRAM_BOT_TOKEN=your_token node src/get-chat-id.js');
  process.exit(1);
}

async function getChatId() {
  console.log('🔍 Fetching recent messages to your bot...\n');

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
    const data = await response.json();

    if (!data.ok) {
      console.error('❌ Error:', data.description);
      return;
    }

    if (data.result.length === 0) {
      console.log('⚠️  No messages found.');
      console.log('   Send a message to your bot first, then run this again.');
      return;
    }

    console.log('✅ Found messages!\n');
    console.log('Your Chat ID(s):');
    console.log('─'.repeat(40));

    const chatIds = new Set();
    for (const update of data.result) {
      const chat = update.message?.chat;
      if (chat && !chatIds.has(chat.id)) {
        chatIds.add(chat.id);
        const name = chat.title || chat.first_name || chat.username || 'Unknown';
        const type = chat.type;
        console.log(`  ${chat.id}  →  ${name} (${type})`);
      }
    }

    console.log('─'.repeat(40));
    console.log('\n📋 Add this to your .env file:');
    const firstChatId = [...chatIds][0];
    console.log(`   TELEGRAM_CHAT_ID=${firstChatId}`);

  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

getChatId();
