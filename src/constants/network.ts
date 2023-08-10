import { mainnetNetworks } from "./chains_mainnet";
import { testNetworks } from "./chains_testnet";
import { LocalChainConfigType } from "./type";

export interface NetworkInfo {
  name: string;
  chainId: number | string;
  rpcUrl: string;
  walletRpcUrl?: string; // specific RPC for wallets.
  iconUrl: string;
  symbol: string;
  blockExplorerUrl: string;
  tokenSymbolList: string[];
  lqMintTokenSymbolBlackList: string[];
}

export const INFURA_ID = process.env.REACT_APP_INFURA_ID;
export const type = process.env.REACT_APP_ENV_TYPE;

export const isTestNet = process.env.REACT_APP_ENV_TYPE === "test";
// type NetType = typeof stagingNetworks;
let newNetworks: LocalChainConfigType;
switch (type) {
  case "mainnet":
    newNetworks = mainnetNetworks;
    break;
  case "test":
    newNetworks = testNetworks;
    break;
  default:
    newNetworks = mainnetNetworks;
    break;
}
export const NETWORKS = newNetworks;

const defaultChain = {
  name: "",
  chainId: 883,
  rpcUrl: "http://localhost:8545",
  iconUrl: "./noChain.png",
  symbol: "",
  blockExplorerUrl: "",
  tokenSymbolList: [],
  lqMintTokenSymbolBlackList: [],
};

export const CHAIN_LIST: NetworkInfo[] = Object.values(NETWORKS) as NetworkInfo[];
export const getNetworkById: (chainId: number | string) => NetworkInfo = (chainId: number | string) => {
  for (let i = 0; i < CHAIN_LIST.length; i++) {
    if (CHAIN_LIST[i]?.chainId === chainId || CHAIN_LIST[i].chainId === Number(chainId)) {
      return CHAIN_LIST[i];
    }
  }
  return defaultChain;
};

export const USD_TOKENS = {
  BUSD: true,
  USDC: true,
  USDT: true,
  DAI: true,
};

export const isGasToken = (chainId: number, tokenSymbol: string) => {
  const localChainWithGasToken = Object.values(NETWORKS).find(
    localChain => chainId === localChain.chainId && tokenSymbol === localChain.symbol,
  );
  if (localChainWithGasToken) {
    return true;
  }
  return false;
};
