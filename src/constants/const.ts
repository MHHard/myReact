export const storageConstants = {
  KEY_CLEAR_LOCAL_CACHE: "clearTag",
  KEY_TOKEN_NEED_ADD: "ToAddToken",
  KEY_CHACHE_FROM_CHAIN_ID: "fromChainId",
  KEY_TOKEN_SYMBOL: "tokenSymbol",
  KEY_TOCHAIN_ID: "toChainId",
  KEY_SELECTED_TOKEN_SYMBOL: "selectedTokenSymbol",
  KEY_SELECETD_TOCHAIN_TOKEN_SYMBOL: "selectedToTokenSymbol",
  KEY_IS_FROM_SCHEMA_URL: "sourceFromUrl",
  KEY_SWAP_LIST_JSON: "swapListJson",
  KEY_IS_CLOVER_WALLET: "isClover",
  KEY_CHACHE_FROM_CHAIN_INFO: "fromChainInfo",
  KEY_LOCAL_CUSTOM_TOKENS: "localCustomTokens",
  KEY_PREVIOUS_TOKEN_FOR_CHAIN: "previousSelectedTokenForChain",
  KEY_SWAP_RELAY_CHECK: "swapRelayCheck",
  KEY_QUOTE_NONCE: "quoteNonce",
};

export const schemaConstants = {
  SCHAME_SOURCE_CHAIN_ID: "sourceChainId",
  SCHAME_SOURCE_DST_CHAIN_ID: "destinationChainId",
  SCHAME_TOKEN_SYMBOL: "tokenSymbol",
};

export const historyGetTokenInfoType = {
  TYPE_SRC: "source",
  TYPE_DST: "destination",
  TYPE_DST_REFUND: "destination_refund",
};
// eslint-disable-next-line no-shadow

export const TransactionType = {
  WRAP_NATIVE_TOKEN: "WRAP_NATIVE_TOKEN",
  UNWRAP_NATIVE_TOKEN: "UNWRAP_NATIVE_TOKEN",
  SAME_CHAIN: "SAME_CHAIN",
  CROSS_CHAIN: "CROSS_CHAIN",
};

type AddressMap = { [chainId: number]: string };

export const MULTICALL_ADDRESS: AddressMap = {
  1: "0xeb8ff19066415e797c213faa7d16161401c754cf", // ethereum
  10: "0x504490f7528E3D046C8F55a1750f4A325783AfA6", // optimism
  56: "0x6CF652A83f55382a98f5dCFf7015eFF034E29FB3", // bsc
  250: "0x7D0087dd83D50B73A926d83ba08e194ff6c961b6", // fantom
  137: "0x42e6Af231bA8eE39f1bf185d452061283bfB324b", // polygon
  43114: "0x42e6Af231bA8eE39f1bf185d452061283bfB324b", // avax
  42161: "0xA8e9020f9a1908b520d1577A7d1292fA9D44a9BA", // Arbitrum
  5: "0x9c1e3ACe5B7F8B5B6816F7e346F5a53b0F1f8060", // goerli
  97: "0xeEbb6638D27086123aA5DBe0ef06CEeB17ee0D02", // BSC Testnet
};

export const disableAllActionButton = false;
