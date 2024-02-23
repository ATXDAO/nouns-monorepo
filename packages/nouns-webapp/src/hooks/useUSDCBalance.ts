import { utils, BigNumber } from 'ethers';
import config, { ENVIRONMENT_TYPE, INFURA_PROJECT_ID } from '../config';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { createNetworkHttpUrl } from '../config';

const contractInterface = new utils.Interface([
  "function balanceOf(address owner) view returns (uint256)",
])

export function useErc20Balance(address: string | null | undefined, tokenAddress: string | undefined, provider: any) {

  const [value, setValue] = useState();

  async function get(address: string | null | undefined, tokenAddress: string | undefined, provider: any) {
      if (!address || !tokenAddress || !provider)
          return;

      const contract = new ethers.Contract(tokenAddress, contractInterface, provider);
      let balance = await contract.balanceOf(address);

      setValue(balance);
  }

  useEffect(() => {
    if (value === undefined)
      get(address, tokenAddress, provider);
  }, [value, address, tokenAddress, provider])

  return { value, setValue, get };
}

export function useUSDCBalance(): { value: BigNumber | undefined } {

  let chosen;
  if (ENVIRONMENT_TYPE === "Mainnet") {
    chosen = createNetworkHttpUrl("mainnet")
  } else if (ENVIRONMENT_TYPE === "Testnet") {
    chosen = createNetworkHttpUrl("goerli")
  }

  const provider = ethers.getDefaultProvider("https://eth-mainnet.g.alchemy.com/v2/wEdkAUlsWlrcGPvQseMu2CWlOBuikWd-");
  return useErc20Balance(config.chainAgnosticAddresses.atxDaoTreasury, config.chainAgnosticAddresses.usdcToken, provider);
}

export function useMaticBalance(): { value: BigNumber | undefined } {

  let chosen;
  if (ENVIRONMENT_TYPE === "Mainnet") {
    chosen = createNetworkHttpUrl("mainnet")
  } else if (ENVIRONMENT_TYPE === "Testnet") {
    chosen = createNetworkHttpUrl("goerli")
  }

  const provider = ethers.getDefaultProvider("https://eth-mainnet.g.alchemy.com/v2/wEdkAUlsWlrcGPvQseMu2CWlOBuikWd-");
  return useErc20Balance(config.chainAgnosticAddresses.atxDaoTreasury, config.chainAgnosticAddresses.maticToken, provider);
}

export function useDaiBalance(): { value: BigNumber | undefined } {

  let chosen;
  if (ENVIRONMENT_TYPE === "Mainnet") {
    chosen = createNetworkHttpUrl("mainnet")
  } else if (ENVIRONMENT_TYPE === "Testnet") {
    chosen = createNetworkHttpUrl("goerli")
  }

  ;

  const provider = ethers.getDefaultProvider("https://eth-mainnet.g.alchemy.com/v2/wEdkAUlsWlrcGPvQseMu2CWlOBuikWd-");
  return useErc20Balance(config.chainAgnosticAddresses.atxDaoTreasury, config.chainAgnosticAddresses.daiToken, provider);
}

export function useWethBalance(): { value: BigNumber | undefined } {

  let chosen;
  if (ENVIRONMENT_TYPE === "Mainnet") {
    chosen = createNetworkHttpUrl("mainnet")
  } else if (ENVIRONMENT_TYPE === "Testnet") {
    chosen = createNetworkHttpUrl("goerli")
  }

  const provider = ethers.getDefaultProvider("https://eth-mainnet.g.alchemy.com/v2/wEdkAUlsWlrcGPvQseMu2CWlOBuikWd-");
  return useErc20Balance(config.chainAgnosticAddresses.atxDaoTreasury, config.chainAgnosticAddresses.wethToken, provider);
}

