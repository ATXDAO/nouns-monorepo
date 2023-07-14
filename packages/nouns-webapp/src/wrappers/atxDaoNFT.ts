
import { useContractCall } from '@usedapp/core';
import atxDaoABI from './atxDaoNFTAbi';
import { ethers, BigNumber as EthersBN, utils } from 'ethers';
import config from '../config';
import { useEffect, useState } from 'react';
import { CHAIN_ID } from '../config';
import { ChainId, useEthers } from '@usedapp/core';

const abi = new utils.Interface(atxDaoABI);

export interface AtxDaoNFT {
    mintCount: EthersBN;
  }


export const useGetBalance = (address?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const { chainId, library } = useEthers();
    const [balance, setBalance] = useState(0);
    useEffect(()=> {
        const getBalance = async ()=> {
            setIsLoading(true);
            console.log("is loading...");
            if (address) {
                
                const contract = new ethers.Contract(
                    config.addresses.atxDaoAddress!,
                    abi, 
                    (chainId === ChainId.Mainnet ? library : undefined)
                );
                console.log(contract);
                console.log(address);
                let balance = await contract.balanceOf(address);
                console.log(`${balance}`)
                setBalance(2 ?? balance);
            }
            console.log("done loading!");

            setIsLoading(false);        
        }

        console.log('here i am');
        getBalance();
    }, [address])


    return { balance, isLoading};
}