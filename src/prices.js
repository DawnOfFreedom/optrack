import { getContract, MotoswapPoolAbi } from 'opnet';
import { config, provider } from './config.js';

const poolCache = new Map();

function getPool(poolHex) {
  if (!poolCache.has(poolHex)) {
    const pool = getContract(poolHex, MotoswapPoolAbi, provider, config.network.btcNetwork);
    poolCache.set(poolHex, pool);
  }
  return poolCache.get(poolHex);
}

export async function getPoolReserves(poolHex) {
  try {
    const pool = getPool(poolHex);
    const [reserves, token0, token1] = await Promise.all([
      pool.getReserves(),
      pool.token0(),
      pool.token1(),
    ]);

    return {
      reserve0: reserves.properties.reserve0,
      reserve1: reserves.properties.reserve1,
      token0: token0.properties.token0,
      token1: token1.properties.token1,
    };
  } catch (e) {
    console.error(`Error getting pool reserves: ${e.message}`);
    return null;
  }
}

export function calculatePrice(reserves, tokenHex, tokenDecimals) {
  if (!reserves) return null;

  const r0 = reserves.reserve0;
  const r1 = reserves.reserve1;

  // Bepaal welke reserve bij de token hoort
  const token0Hex = '0x' + Buffer.from(reserves.token0).toString('hex');
  const isToken0 = token0Hex.toLowerCase() === tokenHex.toLowerCase();

  let tokenReserve, btcReserve;
  if (isToken0) {
    tokenReserve = r0;
    btcReserve = r1;
  } else {
    tokenReserve = r1;
    btcReserve = r0;
  }

  // Beide reserves hebben 18 decimals in MotoSwap pools
  // Prijs = btcReserve / tokenReserve
  const tokenAmount = Number(tokenReserve) / Math.pow(10, tokenDecimals);
  const btcAmount = Number(btcReserve) / Math.pow(10, 18);

  if (tokenAmount === 0) return null;

  // Return prijs in sats per token
  return btcAmount / tokenAmount;
}

export function formatPrice(sats) {
  if (sats === null) return 'N/A';

  if (sats < 0.01) return sats.toExponential(2) + ' sats';
  if (sats < 1) return sats.toFixed(4) + ' sats';
  if (sats < 1000) return sats.toFixed(2) + ' sats';
  if (sats < 100000000) return sats.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' sats';

  // Convert to BTC for large values
  const btc = sats / 100000000;
  return btc.toFixed(4) + ' BTC';
}
