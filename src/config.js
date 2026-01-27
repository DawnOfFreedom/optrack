import { networks } from '@btc-vision/bitcoin';
import { JSONRpcProvider } from 'opnet';

export const config = {
  network: {
    name: 'regtest',
    rpcUrl: 'https://regtest.opnet.org',
    btcNetwork: networks.regtest,
  },

  tokens: {
    MOTO: {
      address: 'opr1sqp5pkzs9w8ktx020jymxvs05ekc7jahl45r5t9pz',
      addressHex: '0x0a6732489a31e6de07917a28ff7df311fc5f98f6e1664943ac1c3fe7893bdab5',
      poolHex: '0x1c95032e05257bb66e71434b82440801983069055e89498479b9ebfa3442a336',
      decimals: 18,
    },
    PILL: {
      address: 'opr1sqq2quumshz8tvr78n3f69fqxsxkqjycc8yz9vzyg',
      addressHex: '0xfb7df2f08d8042d4df0506c0d4cee3cfa5f2d7b02ef01ec76dd699551393a438',
      poolHex: '0xc81087dd127d3d3fed8f198b3da6f36064ca359d3179ef6fa61bb61ddb1b5bfa',
      decimals: 18,
    },
  },
};

export const provider = new JSONRpcProvider(
  config.network.rpcUrl,
  config.network.btcNetwork
);
