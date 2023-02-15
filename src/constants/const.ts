export const storageConstants = {
  KEY_IS_CLOVER_WALLET: "isClover",
  KEY_ADD_LP_TRANSACTION_HASH: "addLpTransactionHash",
  KEY_LP_LIST: "LpList",
  KEY_TRANSFER_LIST_JSON: "transferListJson",
  KEY_CHAIN_NAME: "chainName",
  KEY_TAB_KEY: "tabkey",
  KEY_FROM_CHAIN_ID: "fromChainId",
  KEY_SELECTED_INDEX: "selectedIndex",
  KEY_TO_CHAIN_ID: "toChainId",
  KEY_TO_ADD_TOKEN: "ToAddToken",
  KEY_HAS_REWARD_EVENTS: "hasRewardEvents",
  KEY_RATIO: "ratio",
  KEY_SELECTED_TOKEN_SYMBOL: "selectedTokenSymbol",
  KEY_WEB3_PROVIDER_NAME: "web3providerName",
  KEY_CLEAR_TAG: "clearTag",
  KEY_NFT_SRC_CHAIN_ID: "nftSrcChainId",
  KEY_NFT_DST_CHAIN_ID: "nftDstChainId",
  KEY_NFT_CHAIN_PAIR: "nftChainPair",
  KEY_NFT_HISTORY_LIST_JSON: "nftHistoryListJson",
  KEY_TRANSFER_RELAY_TIME_LIST: "RelayList",
  KEY_DEBUG: "debug",
  KEY_CHAIN_ID_HIGH_PRIORITY: "providerChainIdHasHigherPriority",
  KEY_WAITING_FOR_FUND_RELEASE_TRANSFER_RELAY_CHECK: "TransferIdWhichDestinationRelayFinished",
  KEY_FARMING_SIGNER_ERR_NEED_UNLOCK: "FarmingClaimSignerErrorNeedUnlock",
  KEY_IS_APTOS_CONNECTED: "isAptosConnected",
  KEY_APTOS_CONNECTED_WALLET_NAME: "aptosConnectedWalletName",
  KEY_IS_SEI_CONNECTED: "isSeiConnected",
  KEY_SEI_CONNECTED_WALLET_NAME: "seiConnectedWalletName",
  KEY_IS_INJ_CONNECTED: "isSeiConnected",
  KEY_INJ_CONNECTED_WALLET_NAME: "seiConnectedWalletName",
  KEY_CONNECTED_WALLET_NAME: "connectedWalletName",
  KEY_FLOW_CONNECTED_WALLET_NAME: "flowConnectedWalletName",
};

export const coMinterChains = [1030, 47805];
export const schemaConstants = {};

export const pegV2ThirdPartDeployTokens = {
  73771: [
    "0x26b77eeF7A38E3FD8C631FF8a268a5BB98CE1552", // CRA
    "0x8d387660e172e239256062952B767b5A93f02f2e", // CRAM
    "0x57bf0eCe401d3126d37B3c23d35b1c1EE3EaE733", // TUS
  ],
  73772: [
    "0xC1a1F40D558a3E82C3981189f61EF21e17d6EB48", // CRA
    "0xE71928E2CB1A19986936bfcE7b1fFFd0657da655", // CRAM
    "0x9c765eEE6Eff9CF1337A1846c0D93370785F6C92", // TUS
    "0xdc7E0bE5ca46b433AA0b47165A506079978221E6", // avaxUSDC
  ],
  9372: [
    /// Oasys Hub Testnet
    "0xEf1C93A38Ea284cdc7F2a0edca7C4FFDe4D55CBa", // USDT
  ],
};

// special requirement for block add button/aggreate remove button
export const needToBlockAggrateOrAdd = chainId => {
  if (chainId === 1666600000) {
    return true;
  }

  return false;
};
