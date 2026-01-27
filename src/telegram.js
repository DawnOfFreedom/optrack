// Telegram Bot Integration for OPtrack

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// OPtrack logo
const OPTRACK_LOGO_URL = 'https://i.imgur.com/btcDnw1.png';

/**
 * Send a photo with caption via Telegram (using URL)
 */
export async function sendPhoto(photoUrl, caption = '') {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('Telegram not configured');
    return null;
  }

  try {
    const response = await fetch(`${TELEGRAM_API}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        photo: photoUrl,
        caption,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('Telegram photo error:', data.description);
    }
    return data;
  } catch (error) {
    console.error('Failed to send Telegram photo:', error.message);
    return null;
  }
}

/**
 * Send a photo file directly via Telegram
 */
export async function sendPhotoFile(filePath, caption = '') {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('Telegram not configured');
    return null;
  }

  try {
    const fs = await import('fs');
    const path = await import('path');

    // Read file as blob
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'image/png' });

    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('photo', blob, path.basename(filePath));
    form.append('caption', caption);
    form.append('parse_mode', 'HTML');

    const response = await fetch(`${TELEGRAM_API}/sendPhoto`, {
      method: 'POST',
      body: form,
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('Telegram photo error:', data.description);
    }
    return data;
  } catch (error) {
    console.error('Failed to send Telegram photo:', error.message);
    return null;
  }
}

/**
 * Send a message via Telegram
 */
export async function sendMessage(text, options = {}) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('Telegram not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID');
    return null;
  }

  try {
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        ...options,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('Telegram error:', data.description);
    }
    return data;
  } catch (error) {
    console.error('Failed to send Telegram message:', error.message);
    return null;
  }
}

/**
 * Format price for display
 */
function formatPrice(sats) {
  if (sats === null || sats === undefined) return 'N/A';
  if (sats < 0.01) return sats.toExponential(2) + ' sats';
  if (sats < 1) return sats.toFixed(4) + ' sats';
  if (sats < 1000) return sats.toFixed(2) + ' sats';
  if (sats < 1000000) return (sats / 1000).toFixed(1) + 'K sats';
  return (sats / 1000000).toFixed(2) + 'M sats';
}

/**
 * Format percentage change
 */
function formatChange(oldPrice, newPrice) {
  if (!oldPrice || !newPrice) return '';
  const change = ((newPrice - oldPrice) / oldPrice) * 100;
  const emoji = change >= 0 ? '📈' : '📉';
  const sign = change >= 0 ? '+' : '';
  return `${emoji} ${sign}${change.toFixed(2)}%`;
}

/**
 * Send price alert
 */
export async function sendPriceAlert(token, oldPrice, newPrice, threshold) {
  const change = ((newPrice - oldPrice) / oldPrice) * 100;
  const emoji = change >= 0 ? '🟢' : '🔴';

  const message = `
${emoji} <b>${token.symbol} Price Alert</b>

${formatChange(oldPrice, newPrice)}

Old: ${formatPrice(oldPrice)}
New: ${formatPrice(newPrice)}
Threshold: ${threshold}%

<i>OPtrack • ${new Date().toLocaleTimeString()}</i>
`.trim();

  return sendMessage(message);
}

/**
 * Send periodic status update
 */
export async function sendStatusUpdate(tokens) {
  const lines = tokens
    .filter(t => !t.error)
    .map(t => `• <b>${t.symbol}</b>: ${formatPrice(t.price)}`)
    .join('\n');

  const message = `
📊 <b>OPtrack Status</b>

${lines}

<i>${new Date().toLocaleTimeString()}</i>
`.trim();

  return sendMessage(message);
}

/**
 * Send startup message with logo
 */
export async function sendStartupMessage() {
  const caption = `
🚀 <b>OPtrack Started</b>

Monitoring OP_NET tokens...
Alerts are active.

<i>${new Date().toLocaleTimeString()}</i>
`.trim();

  // Try to send with local logo file
  const { fileURLToPath } = await import('url');
  const { dirname, join } = await import('path');
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const logoPath = join(__dirname, '../public/logo.png');

  const result = await sendPhotoFile(logoPath, caption);

  // Fallback to text message if photo fails
  if (!result?.ok) {
    return sendMessage(caption);
  }
  return result;
}

/**
 * Get updates to find chat ID (helper function)
 */
export async function getUpdates() {
  if (!BOT_TOKEN) {
    console.error('BOT_TOKEN not set');
    return null;
  }

  try {
    const response = await fetch(`${TELEGRAM_API}/getUpdates`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get updates:', error.message);
    return null;
  }
}
