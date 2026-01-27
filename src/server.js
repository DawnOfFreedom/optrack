import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getAllTokens } from './api.js';
import { config } from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(join(__dirname, '../public')));

// API endpoint
app.get('/api/tokens', async (req, res) => {
  try {
    const tokens = await getAllTokens();
    res.json({
      network: config.network.name,
      timestamp: Date.now(),
      tokens,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', network: config.network.name });
});

app.listen(PORT, () => {
  console.log(`OPtrack server running at http://localhost:${PORT}`);
  console.log(`Network: ${config.network.name}`);
});
