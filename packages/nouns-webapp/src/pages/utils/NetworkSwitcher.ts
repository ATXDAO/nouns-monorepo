export async function switchNetworkToLocalhost() {
  await switchNetworkToChain('0x7A69', 'Localhost', ['http://localhost:8545']);
}

export async function switchNetworkToPolygon() {
  await switchNetworkToChain('0x89', 'Polygon', ['https://polygon-rpc.com']);
}

export async function switchNetworkToEthereum() {
  await switchNetworkToChain('0x1', 'Ethereum Mainnet', ['https://mainnet.infura.io/v3/']);
}

export async function switchNetworkToGoerli() {
  await switchNetworkToChain('0x5', 'Goerli', ['https://goerli.infura.io/v3/']);
}

export async function switchNetworkToOPMainnet() {
  await switchNetworkToChain('0xa', 'Optimism', ['https://mainnet.optimism.io']);
}

export async function switchNetworkToChain(chainIdHex: string, chainName: string, chainRpcUrls: string[]) {
  try {
    await (window as any).ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if ((switchError as any).code === 4902) {
      try {
        const nativeCurrency = {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        };

        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainIdHex,
              chainName: chainName,
              rpcUrls: chainRpcUrls /* ... */,
              nativeCurrency
            },
          ],
        });
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
}