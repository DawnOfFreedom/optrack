import { getContract, OP_20_ABI } from 'opnet';
import { config, provider } from './config.js';
import { getPoolReserves, calculatePrice, formatPrice } from './prices.js';

async function getTokenInfo(tokenAddress) {
  const contract = getContract(tokenAddress, OP_20_ABI, provider, config.network.btcNetwork);

  const [nameResult, symbolResult, decimalsResult, totalSupplyResult] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.totalSupply(),
  ]);

  return {
    address: tokenAddress,
    name: nameResult.properties.name,
    symbol: symbolResult.properties.symbol,
    decimals: Number(decimalsResult.properties.decimals),
    totalSupply: totalSupplyResult.properties.totalSupply,
  };
}

function formatSupply(supply, decimals) {
  const value = Number(supply) / Math.pow(10, decimals);
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

async function main() {
  console.log('OPtrack - OP_NET Token Tracker');
  console.log(`Network: ${config.network.name}`);
  console.log('─'.repeat(50));

  for (const [key, token] of Object.entries(config.tokens)) {
    try {
      console.log(`\n${key}:`);
      const info = await getTokenInfo(token.address);

      console.log(`  Name:         ${info.name}`);
      console.log(`  Symbol:       ${info.symbol}`);
      console.log(`  Decimals:     ${info.decimals}`);
      console.log(`  Total Supply: ${formatSupply(info.totalSupply, info.decimals)}`);

      if (token.poolHex) {
        const reserves = await getPoolReserves(token.poolHex);
        const price = calculatePrice(reserves, token.addressHex, info.decimals);
        console.log(`  Price:        ${formatPrice(price)}`);
      }
    } catch (error) {
      console.error(`  Error: ${error.message}`);
    }
  }
}

main();
