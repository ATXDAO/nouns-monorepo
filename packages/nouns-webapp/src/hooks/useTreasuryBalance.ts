import { useEtherBalance } from '@usedapp/core';
import useLidoBalance from './useLidoBalance';
import { useUSDCBalance, useMaticBalance, useDaiBalance, useWethBalance } from './useUSDCBalance';
import useUSDTBalance from './useUSDTBalance';
import useTokenBuyerBalance from './useTokenBuyerBalance';
import { useCoingeckoPrice } from '@usedapp/coingecko';
import config, { ENVIRONMENT_TYPE } from '../config';
// import { formatEther } from '@ethersproject/units'
import { BigNumber, ethers } from 'ethers';
// import { CHAIN_ID } from '../config';
import { useState } from 'react'
import { useEffect } from 'react'

/**
 * Computes treasury balance (ETH + Lido)
 *
 * @returns Total balance of treasury (ETH + Lido) as EthersBN
 */
export const useTreasuryBalance = () => {
  
  const ethBalance = useEtherBalance('0x407Cf0e5Dd3C2c4bCE5a32B92109c2c6f7f1ce23');
  const lidoBalanceAsETH = useLidoBalance();
  const tokenBuyerBalanceAsETH = useTokenBuyerBalance();

  const zero = BigNumber.from(0);
  return ethBalance?.add(lidoBalanceAsETH ?? zero).add(tokenBuyerBalanceAsETH ?? zero) ?? zero;
};


/**
 * Computes treasury usd value of treasury assets (ETH + Lido) at current ETH-USD exchange rate
 *
 * @returns USD value of treasury assets (ETH + Lido + USDC) at current exchange rate
 */
export const useTreasuryUSDValue = () => {
  const zero = BigNumber.from(0);

  const etherPrice = Number(useCoingeckoPrice('ethereum', 'usd'));

  const treasuryBalanceETH = Number(
    ethers.utils.formatEther(useEtherBalanceUsingEthers(config.chainAgnosticAddresses.atxDaoTreasury)?.toString() || "1337"),
  );
  const ethValue = Number(etherPrice * treasuryBalanceETH);


  const { value: usdtValue } = useUSDTBalance();
  const { value: usdcValue } = useUSDCBalance();
  const { value: maticValue } = useMaticBalance();
  const { value: daiValue } = useDaiBalance();
  const { value: wethValue } = useWethBalance();

  const usdtBalance = usdtValue?.div(10**6);
    const usdcBalance = usdcValue?.div(10**6);
    let maticBalance = 0;
    if (maticValue)
    maticBalance = Number(ethers.utils.formatEther(maticValue));

    let daiBalance = 0;
    if (daiValue)
      daiBalance = Number(ethers.utils.formatEther(daiValue));

      let wethBalance = 0;
      if (wethValue)
        wethBalance = Number(ethers.utils.formatEther(wethValue));
      
  return Number((usdcBalance ?? zero).add(usdtBalance ?? zero)) + ethValue + maticBalance + daiBalance + wethBalance;
};


export function useEtherBalanceUsingEthers(address: string | undefined): BigNumber | undefined {
  const [balance, setBalance] = useState<BigNumber>();

  useEffect(()=> {
    async function get() {
      if (!address)
        return;

      let provider;

      if (ENVIRONMENT_TYPE === "Mainnet") {
        provider = ethers.getDefaultProvider("https://eth-mainnet.g.alchemy.com/v2/wEdkAUlsWlrcGPvQseMu2CWlOBuikWd-");
      } else if (ENVIRONMENT_TYPE === "Testnet") {
        provider = ethers.getDefaultProvider("https://eth-goerli.g.alchemy.com/v2/WhEZSVFYZ4deQ07SrL9J0XY33dQLsd9r");
      } else if (ENVIRONMENT_TYPE === "Localhost") {
        provider = ethers.getDefaultProvider("http://localhost:8545");
      }

      if (provider !== undefined)
      {
        const balance = await provider.getBalance(address);
        setBalance(balance);
      }

    }
      get();
  }, [address]);

  return balance;
}