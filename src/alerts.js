// OPtrack Alert System
import 'dotenv/config';
import { sendMessage, sendPriceAlert, sendStatusUpdate } from './telegram.js';
import { getAllTokens } from './api.js';

// Store previous prices for comparison
let previousPrices = {};
let knownTokens = new Set();
let isFirstRun = true;

// Settings from env
const THRESHOLD = parseFloat(process.env.ALERT_THRESHOLD) || 5; // percentage
const INTERVAL = parseInt(process.env.ALERT_INTERVAL) || 300; // seconds
const STATUS_INTERVAL = parseInt(process.env.STATUS_INTERVAL) || 3600; // seconds (1 hour default)

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
 * Check for price threshold alerts
 */
async function checkPriceThresholds(tokens) {
  for (const token of tokens) {
    if (token.error || !token.price) continue;

    const symbol = token.symbol;
    const currentPrice = token.price;
    const previousPrice = previousPrices[symbol];

    if (previousPrice && previousPrice !== currentPrice) {
      const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;

      // Alert if change exceeds threshold
      if (Math.abs(changePercent) >= THRESHOLD) {
        const emoji = changePercent >= 0 ? '🟢' : '🔴';
        const direction = changePercent >= 0 ? '📈' : '📉';
        const sign = changePercent >= 0 ? '+' : '';

        const message = `
${emoji} <b>${symbol} Price Alert</b>

${direction} ${sign}${changePercent.toFixed(2)}%

Old: ${formatPrice(previousPrice)}
New: ${formatPrice(currentPrice)}

<i>Threshold: ${THRESHOLD}%</i>
<i>OPtrack • ${new Date().toLocaleTimeString()}</i>
`.trim();

        await sendMessage(message);
        console.log(`📢 Alert sent: ${symbol} ${sign}${changePercent.toFixed(2)}%`);
      }
    }

    // Update stored price
    previousPrices[symbol] = currentPrice;
  }
}

/**
 * Check for new tokens
 */
async function checkNewTokens(tokens) {
  for (const token of tokens) {
    if (token.error) continue;

    const symbol = token.symbol;

    if (!knownTokens.has(symbol)) {
      // Skip alert on first run (initial population)
      if (!isFirstRun) {
        const message = `
🆕 <b>New Token Detected!</b>

<b>${token.name}</b> (${symbol})

Price: ${formatPrice(token.price)}
Supply: ${token.totalSupply?.toLocaleString() || 'N/A'}
Decimals: ${token.decimals}

Contract: <code>${token.address?.slice(0, 20)}...</code>

<i>OPtrack • ${new Date().toLocaleTimeString()}</i>
`.trim();

        await sendMessage(message);
        console.log(`🆕 New token alert: ${symbol}`);
      }

      knownTokens.add(symbol);
    }
  }
}

/**
 * Send periodic status update
 */
async function sendPeriodicStatus(tokens) {
  const validTokens = tokens.filter(t => !t.error && t.price);

  if (validTokens.length === 0) {
    console.log('No valid tokens for status update');
    return;
  }

  const lines = validTokens.map(t => {
    const prev = previousPrices[t.symbol];
    let change = '';
    if (prev && prev !== t.price) {
      const pct = ((t.price - prev) / prev) * 100;
      const emoji = pct >= 0 ? '↗️' : '↘️';
      const sign = pct >= 0 ? '+' : '';
      change = ` ${emoji} ${sign}${pct.toFixed(1)}%`;
    }
    return `• <b>${t.symbol}</b>: ${formatPrice(t.price)}${change}`;
  }).join('\n');

  const totalValue = validTokens.reduce((sum, t) => {
    return sum + (t.price * (t.totalSupply || 0));
  }, 0);

  const message = `
📊 <b>OPtrack Status Update</b>

${lines}

Total Market Cap: ${formatPrice(totalValue)}

<i>${new Date().toLocaleTimeString()}</i>
`.trim();

  await sendMessage(message);
  console.log('📊 Status update sent');
}

/**
 * Main check function - runs periodically
 */
export async function runAlertCheck() {
  try {
    console.log(`\n🔍 Checking prices... (${new Date().toLocaleTimeString()})`);

    const tokens = await getAllTokens();

    // Check for new tokens
    await checkNewTokens(tokens);

    // Check price thresholds (skip on first run)
    if (!isFirstRun) {
      await checkPriceThresholds(tokens);
    }

    isFirstRun = false;

    return tokens;
  } catch (error) {
    console.error('Alert check failed:', error.message);
    return null;
  }
}

/**
 * Start the alert monitoring system
 */
export async function startAlertMonitor() {
  console.log('🚀 Starting OPtrack Alert Monitor');
  console.log(`   Threshold: ${THRESHOLD}%`);
  console.log(`   Check interval: ${INTERVAL}s`);
  console.log(`   Status interval: ${STATUS_INTERVAL}s`);

  // Send startup message
  await sendMessage(`
🚀 <b>OPtrack Alert Monitor Started</b>

Settings:
• Price threshold: ${THRESHOLD}%
• Check interval: ${INTERVAL}s
• Status updates: every ${Math.round(STATUS_INTERVAL / 60)} min

Monitoring for:
✓ Price changes
✓ New tokens
✓ Periodic updates

<i>${new Date().toLocaleTimeString()}</i>
`.trim());

  // Initial check
  const tokens = await runAlertCheck();

  // Send initial status
  if (tokens) {
    await sendPeriodicStatus(tokens);
  }

  // Set up periodic checks
  setInterval(runAlertCheck, INTERVAL * 1000);

  // Set up periodic status updates
  setInterval(async () => {
    const tokens = await getAllTokens().catch(() => null);
    if (tokens) {
      await sendPeriodicStatus(tokens);
    }
  }, STATUS_INTERVAL * 1000);

  console.log('✅ Alert monitor running');
}

// Export for manual status update
export { sendPeriodicStatus };
