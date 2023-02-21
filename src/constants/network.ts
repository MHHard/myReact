// import { TypeOfTag } from "typescript";
// import { mainnetNetworks } from "./chains_mainnet";
// import { stagingNetworks } from "./chains_staging_mainnet";
import { mainnetNetworks } from "./chains_mainnet";
import { stagingNetworks } from "./chains_staging_mainnet";
import { preMainnetNetworks } from "./chains_pre_mainnet";
import { testNetworks } from "./chains_testnet";

export interface NetworkInfo {
  name: string;
  color: string;
  chainId: number;
  rpcUrl: string;
  walletRpcUrl?: string;
  iconUrl: string;
  symbol: string;
  wrapTokenAddress: string;
  blockExplorerUrl: string;
}

export const INFURA_ID = process.env.REACT_APP_INFURA_ID;
export const type = process.env.REACT_APP_ENV_TYPE;
// type NetType = typeof stagingNetworks;
let newNetworks;
switch (type) {
  case "staging":
    newNetworks = stagingNetworks;
    break;
  case "preMainnet":
    newNetworks = preMainnetNetworks;
    break;
  case "mainnet":
    newNetworks = mainnetNetworks;
    break;
  case "test":
    newNetworks = testNetworks;
    break;
  default:
  // newNetworks = mainnetNetworks;
  // break;
}
export const NETWORKS = newNetworks;
export const CHAIN_LIST: NetworkInfo[] = Object.values(
  NETWORKS
) as NetworkInfo[];
export const getNetworkById: (chainId: number | undefined) => NetworkInfo = (
  chainId: number | undefined
) => {
  if (!chainId) {
    return NETWORKS.localhost;
  }
  /* eslint-disable-next-line no-restricted-syntax */
  for (let i = 0; i < CHAIN_LIST.length; i++) {
    if (
      CHAIN_LIST[i]?.chainId === chainId ||
      CHAIN_LIST[i].chainId === Number(chainId)
    ) {
      return CHAIN_LIST[i];
    }
  }
  return NETWORKS.localhost;
};

export const USD_TOKENS = {
  BUSD: true,
  USDC: true,
  USDT: true,
  DAI: true,
};

export const isGasToken = (chainId: number, tokenSymbol: string) => {
  const localChainWithGasToken = Object.values(NETWORKS).find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (localChain: any) =>
      chainId === localChain.chainId && tokenSymbol === localChain.symbol
  );

  /// Remote config uses TUS as WTUS.
  /// Treat TUS not gas token for Swimmer for this special case
  if (chainId === 73772 && tokenSymbol === "TUS") {
    return false;
  }

  if (localChainWithGasToken) {
    return true;
  }
  return false;
};
