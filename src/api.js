import { getContract, OP_20_ABI } from 'opnet';
import { config, provider } from './config.js';
import { getPoolReserves, calculatePrice } from './prices.js';

export async function getTokenData(key, token) {
  const contract = getContract(token.address, OP_20_ABI, provider, config.network.btcNetwork);

  const [nameResult, symbolResult, decimalsResult, totalSupplyResult] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.totalSupply(),
  ]);

  const decimals = Number(decimalsResult.properties.decimals);
  const totalSupply = Number(totalSupplyResult.properties.totalSupply) / Math.pow(10, decimals);

  let price = null;
  if (token.poolHex) {
    const reserves = await getPoolReserves(token.poolHex);
    price = calculatePrice(reserves, token.addressHex, decimals);
  }

  return {
    key,
    name: nameResult.properties.name,
    symbol: symbolResult.properties.symbol,
    decimals,
    totalSupply,
    price,
    address: token.address,
  };
}

export async function getAllTokens() {
  const tokens = [];

  for (const [key, token] of Object.entries(config.tokens)) {
    try {
      const data = await getTokenData(key, token);
      tokens.push(data);
    } catch (error) {
      tokens.push({
        key,
        symbol: key,
        error: error.message,
      });
    }
  }

  return tokens;
}
