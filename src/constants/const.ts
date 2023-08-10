import { BigNumber } from "ethers";

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
  KEY_IS_AURA_CONNECTED: "isAuraConnected",
  KEY_AURA_CONNECTED_WALLET_NAME: "auraConnectedWalletName",
  KEY_CONNECTED_WALLET_NAME: "connectedWalletName",
  KEY_FLOW_CONNECTED_WALLET_NAME: "flowConnectedWalletName",
  KEY_DESTINATION_TOKEN_LIST_UPDATE: "destinationTokenListUpdate",
  KEY_IS_SUI_CONNECTED: "isSuiConnected",
  KEY_SUI_CONNECTED_WALLET_NAME: "suiConnectedWalletName",
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
  248: [
    /// Oasys Mainnet
    "0xdc3af65ecbd339309ec55f109cb214e0325c5ed4", // USDT
    "0xe1ab220e37ac55a4e2dd5ba148298a9c09fbd716", // USDC
    "0x5b1cc635e524cabb63a581c050c895534755f297", // MCHC
    "0xddb07cc0f2f9fb7899dba5a21964f3c6d2740e44", // TCGC
    "0xc885f4ee4e4c0c3a36e11bac28e2e1a2ba644d39", // RAYS
    "0xd2e426eA2fFa72DD1DC75e7bD148fb959E3E04b2", // EPL
  ],
};

export const pegNativeDeployTokens = {
  20221: [
    // Antimatter B2 Testnet
    "0x0000000000000000000000000000000000007006", // MATTER
  ],
  1990: [
    "0x0000000000000000000000000000000000007006", // MATTER
  ],
};

// special requirement for block add button/aggreate remove button
export const needToBlockAggrateOrAdd = chainId => {
  if (chainId === 1666600000) {
    return true;
  }

  return false;
};

// uint 2^96-1 = 79228162514264337593543950335
// 16 hex = "0xffffffffffffffffffffffff"
export const MaxUint96: BigNumber = BigNumber.from("0xffffffffffffffffffffffff");

export const kavaPegTokens = ["USDC", "USDT", "DAI", "WBTC", "WETH", "IDIA"];
export const tokenDisplaySymbols = {
  43114: {
    USDT: "USDT.e",
    DAI: "DAI.e",
    USDC: "USDC.e",
    WETH: "WETH.e",
    IMX: "IMX.a",
    WOO: "WOO.e",
  },
  250: {
    USDT: "fUSDT",
    WETH: "ETH",
  },
  56: {
    WETH: "ETH",
    SYS: "WSYS",
  },
  1666600000: {
    WETH: "ETH",
  },
  42220: {
    USDC: "openUSDC",
    USDT: "openUSDT",
    WETH: "openWETH",
  },
  42262: {
    USDC: "ceUSDC",
    USDT: "ceUSDT",
    WETH: "ceWETH",
    BNB: "cbBNB",
    AVAX: "caAVAX",
    FTM: "cfFTM",
    DAI: "ceDAI",
  },
  1284: {
    USDC: "ceUSDC",
    USDT: "ceUSDT",
  },
  1: {
    SYS: "WSYS",
    cfUSDC: "USDC",
    celrWFLOW: "WFLOW",
    WING: "pWING",
  },
  9001: {
    WETH: "ceWETH",
    USDC: "ceUSDC",
    USDT: "ceUSDT",
    DAI: "ceDAI",
    WBTC: "ceWBTC",
    BNB: "ceBNB",
    BUSD: "ceBUSD",
    AVAX: "ceAVAX",
    FTM: "ceFTM",
    AURORA: "ceAURORA",
  },
  12340001: {
    AVAX: "ceAVAX",
    BNB: "ceBNB",
    BUSD: "ceBUSD",
    DAI: "ceDAI",
    FTM: "ceFTM",
    MATIC: "ceMATIC",
    USDT: "ceUSDT",
    WBTC: "ceWBTC",
    WETH: "ceWETH",
    cfUSDC: "USDC",
    celrWFLOW: "Flow",
  },
  73772: {
    TUS: "WTUS",
  },
  12340002: {
    FLOWUSDC: "USDC",
  },
};
export const errorMessages = {
  3: "there is not enough liquidity to bridge your transfer",
  4: "the bridge rate has moved unfavorably by your slippage tolerance",
};
export const sortedChainIds = [
  1, // Ethereum
  592, // Astar
  56, // BNB Chain
  43114, // Avalanche
  137, // Polygon
  42161, // Arbitrum
  10, // Optimism
  42170, // Arbitrum Nova
  12360001, // Aptos
  250, // Fantom
  12340001, // Flow
  1088, // Metis
  42262, // Oasis
  9001, // Evmos
  1313161554, // Aurora
  1666600000, // Harmony
  1284, // Moonbeam
  1285, // "Moonriver",
  288, // "Boba",
  66, // "OKXChain",
  128, // "Heco",
  42220, // "Celo",
  100, // "xDai",
];
export const validFloatRegex = /^[0-9]+[.]?[0-9]*$/;
