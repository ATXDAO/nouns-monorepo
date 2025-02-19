import {
  ContractAddresses as NounsContractAddresses,
  getContractAddressesForChainOrThrow,
} from '@nouns/sdk';
import { ChainId } from '@usedapp/core';
import { ethers } from 'ethers';

export const WALLET_CONNECT_V2_PROJECT_ID = '501e80c0ce3d8633938fc821b41fabfd';

interface ExternalChainAgnosticAddresses {
  repTokensAddress: string | undefined;
  cadentDistributorAddress: string | undefined;
  atxDaoTreasury: string | undefined;
  usdcToken: string | undefined;
  usdtToken: string | undefined;
  maticToken: string | undefined;
  daiToken: string | undefined;
  wethToken: string | undefined;

  subgraphApiUri: string;
}

interface ExternalContractAddresses {
  lidoToken: string | undefined;
  usdcToken: string | undefined;
  usdtToken: string | undefined;
  chainlinkEthUsdc: string | undefined;
  payerContract: string | undefined;
  tokenBuyer: string | undefined;
  nounsStreamFactory: string | undefined;
  weth: string | undefined;
  atxDaoAddress: string | undefined;
  repTokensAddress: string | undefined;
  cadentDistributorAddress: string | undefined;
  atxDaoTreasury: string | undefined;

}

export type ContractAddresses = NounsContractAddresses & ExternalContractAddresses;

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
  // subgraphApiUri: string;
  enableHistory: boolean;
}

type SupportedChains = ChainId.Mainnet | ChainId.Polygon | ChainId.Hardhat | ChainId.Goerli;

interface CacheBucket {
  name: string;
  version: string;
}

export const cache: Record<string, CacheBucket> = {
  seed: {
    name: 'seed',
    version: 'v1',
  },
  ens: {
    name: 'ens',
    version: 'v1',
  },
};

export const cacheKey = (bucket: CacheBucket, ...parts: (string | number)[]) => {
  return [bucket.name, bucket.version, ...parts].join('-').toLowerCase();
};

export const IS_MAINNET: boolean = (process.env.REACT_APP_IS_MAINNET?.toLowerCase() === 'true' ?? false);
export const IS_OPTIMISM_MAINNET: boolean = (process.env.REACT_APP_IS_OPTIMISM_MAINNET?.toLowerCase() === 'true' ?? false);



export const CHAIN_ID: SupportedChains =  parseInt(process.env.REACT_APP_CHAIN_ID ?? '1');


export const ENVIRONMENT_TYPE: string = process.env.REACT_APP_ENVIRONMENT_TYPE ?? 'Mainnet';

export const INFURA_PROJECT_ID = '440a1bb7b2b6478ba46767b9640e138e';

export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY ?? '';

export const createNetworkHttpUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_JSONRPC`];
  return custom || `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
};

export const createNetworkWsUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_WSRPC`];
  return custom || `wss://${network}.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
};

const app: Record<SupportedChains, AppConfig> = {
  [ChainId.Goerli]: {
    jsonRpcUri: createNetworkHttpUrl('goerli'),
    wsRpcUri: createNetworkWsUrl('goerli'),
    // subgraphApiUri:
      // 'https://api.thegraph.com/subgraphs/name/hotmanics/test',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
  [ChainId.Mainnet]: {
    jsonRpcUri: createNetworkHttpUrl('mainnet'),
    wsRpcUri: createNetworkWsUrl('mainnet'),
    // subgraphApiUri:
      // 'https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns/0.1.0/gn',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
  [ChainId.Polygon]: {
    jsonRpcUri: createNetworkHttpUrl('polygon'),
    wsRpcUri: createNetworkWsUrl('polygon'),
    // subgraphApiUri:
      // 'https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns/0.1.0/gn',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
  [ChainId.Hardhat]: {
    jsonRpcUri: 'http://localhost:8545',
    wsRpcUri: 'ws://localhost:8545',
    // subgraphApiUri: 'http://localhost:8000/subgraphs/name/nounsdao/nouns-subgraph',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
};

const externalChainAgnosticAddresses: Record<string, ExternalChainAgnosticAddresses> = {
  "Mainnet": {
    repTokensAddress: '0x57AA5fd0914A46b8A426cC33DB842D1BB1aeADa2',
    cadentDistributorAddress: undefined,
    atxDaoTreasury: '0x407Cf0e5Dd3C2c4bCE5a32B92109c2c6f7f1ce23',
    usdcToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    usdtToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    maticToken: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    daiToken: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    wethToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    subgraphApiUri :
      'https://api.thegraph.com/subgraphs/name/hotmanics/test6',
  },
  "Testnet": {
    repTokensAddress: '0xF0535B9d8E98144BB4233fEdd252220d0152311E',
    cadentDistributorAddress: '0x88F1Af751ca23BB2B4efF893d6f45D041230FFb3',
    atxDaoTreasury: "0x3bEc6a181d6Ef7239F699DAf2fAa5FE3A5f01Edf",
    usdcToken: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    maticToken: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    usdtToken: undefined,
    daiToken: undefined,
    wethToken: undefined,
    subgraphApiUri :
      'https://api.thegraph.com/subgraphs/name/hotmanics/test6',
  },
  "Localhost": {
    repTokensAddress: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
    cadentDistributorAddress: '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE',
    atxDaoTreasury: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    maticToken: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    usdcToken: undefined,
    usdtToken: undefined,
    daiToken: undefined,
    wethToken: undefined,
    subgraphApiUri :
      'https://api.thegraph.com/subgraphs/name/hotmanics/test6',
  }
}

const externalAddresses: Record<SupportedChains, ExternalContractAddresses> = {
  [ChainId.Goerli]: {
    lidoToken: '0x2DD6530F136D2B56330792D46aF959D9EA62E276',
    usdcToken: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    usdtToken: undefined,
    weth: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    payerContract: '0xD4A3bf1dF54699E63A2ef7F490E8E22b27B945f0',
    tokenBuyer: '0x61Ec4584c5B5eBaaD9f21Aac491fBB5B2ff30779',
    chainlinkEthUsdc: undefined,
    nounsStreamFactory: '0xc08a287eCB16CeD801f28Bb011924f7DE5Cc53a3',

    atxDaoAddress: '0x373086C336B182b9D9e3874344E46FF0a9630D4E',
    repTokensAddress: '0xF0535B9d8E98144BB4233fEdd252220d0152311E',
    cadentDistributorAddress: '0x88F1Af751ca23BB2B4efF893d6f45D041230FFb3',
    atxDaoTreasury: "0x3bEc6a181d6Ef7239F699DAf2fAa5FE3A5f01Edf",
  },
  [ChainId.Mainnet]: {
    lidoToken: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    usdcToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    usdtToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    chainlinkEthUsdc: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    payerContract: '0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D',
    tokenBuyer: '0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5',
    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    nounsStreamFactory: '0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff',
    atxDaoAddress: '0x63f8F23ce0f3648097447622209E95A391c44b00',
    repTokensAddress: IS_OPTIMISM_MAINNET ? "0x65aD2263e658E75762253076E2EBFc9211E05D2F" : "0x57AA5fd0914A46b8A426cC33DB842D1BB1aeADa2", 
    cadentDistributorAddress: IS_OPTIMISM_MAINNET ? "0x9816093CfDFeB1ADe0b88B04F89310e1d8380637" : ethers.constants.AddressZero,
    atxDaoTreasury: '0x407Cf0e5Dd3C2c4bCE5a32B92109c2c6f7f1ce23'
  },
  [ChainId.Polygon]: {
    lidoToken: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    usdcToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    usdtToken: undefined,
    chainlinkEthUsdc: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    payerContract: '0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D',
    tokenBuyer: '0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5',
    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    nounsStreamFactory: '0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff',
    atxDaoAddress: undefined,
    repTokensAddress: "0x57AA5fd0914A46b8A426cC33DB842D1BB1aeADa2",
    cadentDistributorAddress: undefined,
    atxDaoTreasury: undefined

  },
  [ChainId.Hardhat]: {
    lidoToken: undefined,
    usdcToken: undefined,
    usdtToken: undefined,
    payerContract: undefined,
    tokenBuyer: undefined,
    chainlinkEthUsdc: undefined,
    weth: undefined,
    nounsStreamFactory: undefined,
    atxDaoAddress: '0x0B306BF915C4d645ff596e518fAf3F9669b97016',
    repTokensAddress: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
    cadentDistributorAddress: '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE',
    atxDaoTreasury: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  },
};

const getAddresses = (): ContractAddresses => {
  let nounsAddresses = {} as NounsContractAddresses;
  try {
    nounsAddresses = getContractAddressesForChainOrThrow(CHAIN_ID);

  } catch {}
  return { ...nounsAddresses, ...externalAddresses[CHAIN_ID] };
};

const getChainAgnosticAddresses = (): ExternalChainAgnosticAddresses => {
  return externalChainAgnosticAddresses[ENVIRONMENT_TYPE];
};

const config = {
  app: app[CHAIN_ID],
  addresses: getAddresses(),
  chainAgnosticAddresses: getChainAgnosticAddresses()
};

export default config;

export const multicallOnLocalhost = '0x9A676e781A523b5d0C0e43731313A708CB607508';
