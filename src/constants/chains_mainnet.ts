import { LocalChainConfigType } from "./type";

export const mainnetNetworks: LocalChainConfigType = {
  mainnet: {
    name: "Ethereum Mainnet",
    chainId: 1,
    rpcUrl: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    iconUrl: "./ETH.png",
    symbol: "ETH",
    blockExplorerUrl: "https://etherscan.io",
    tokenSymbolList: [
      "USDC",
      "USDT",
      "WETH",
      "BUSD",
      "DODO",
      "LYRA",
      "DOMI",
      "MCB",
      "oneDODO",
      "OLO",
      "BOBA",
      "PSP",
      "XTK",
      "Metis",
      "WXT",
      "PEOPLE",
      "SOS",
      "FRAX",
      "CEC",
      "STND",
      "WOO",
      "CELR",
      "KROM",
      "PERP",
      "SAFLE",
      "DAI",
      "PKEX",
      "WBTC",
      "GHX",
      "CONV",
      "TSD",
      "AAVE",
      "CRV",
      "SYS",
      "FXS",
      "DF",
      "USX",
      "AELIN",
      "REVA",
      "JPEG",
      "CGG",
      "AVG",
      "PERL",
      "WAGMIV1",
      "WAGMIV2",
      "MASK",
      "LUSD",
      "THALES",
      "MSU",
      "UCG",
      "MELOS",
      "REEF",
      "iZi",
      "ASTR",
      "MGH",
      "ANML",
      "HUH",
      "GOVI",
      "GEL",
      "DEVT",
      "DTR",
      "NFTY",
      "RLY",
      "AKRO",
      "iUSD",
      "SHI",
      "OOKI",
      "WAGMIV3",
      "PBR",
      "FLX",
      "PLOT",
      "XBP",
      "RAGE",
      "UMA",
      "SOLACE",
      "LFI",
      "cfUSDC",
      "GNO",
      "LUSD",
      "WING",
      "MUXLP",
      "muxUSD",
      "muxETH",
      "muxBTC",
      "GOV",
      "PSTAKE",
      "SEAN",
      "JPYC",
      "CERES",
      "DEO",
      "S2K",
      "LEAP",
      "NYM",
    ],
    lqMintTokenSymbolBlackList: [
      "DOMI",
      "oneDODO",
      "OLO",
      "PSP",
      "WXT",
      "PEOPLE",
      "SOS",
      "FRAX",
      "CELR",
      "SAFLE",
      "DAI",
      "PKEX",
      "WBTC",
      "GHX",
      "CONV",
      "TSD",
      "AAVE",
      "CRV",
      "SYS",
      "FXS",
      "AELIN",
      "REVA",
      "CGG",
      "AVG",
      "WAGMIV1",
      "WAGMIV2",
      "MSU",
      "UCG",
      "MELOS",
      "ASTR",
      "MGH",
      "GEL",
      "DEVT",
      "DTR",
      "NFTY",
      "RLY",
      "AKRO",
      "WAGMIV3",
      "PBR",
      "FLX",
      "PLOT",
      "XBP",
      "RAGE",
      "UMA",
      "SOLACE",
      "LFI",
      "cfUSDC",
      "GNO",
      "MUXLP",
      "muxUSD",
      "muxETH",
      "muxBTC",
      "GOV",
      "PSTAKE",
      "SEAN",
      "CERES",
      "DEO",
      "S2K",
      "LEAP",
      "NYM",
    ],
  },
  bsc: {
    name: "BNB Chain",
    chainId: 56,
    rpcUrl: "https://bscrpc.com/",
    iconUrl: "./bnbchain.png",
    symbol: "BNB",
    blockExplorerUrl: "https://bscscan.com",
    tokenSymbolList: [
      "USDC",
      "USDT",
      "WETH",
      "BUSD",
      "DODO",
      "DOMI",
      "MCB",
      "oneDODO",
      "OLO",
      "PSP",
      "ATL",
      "PEOPLE",
      "SOS",
      "FRAX",
      "CEC",
      "WOO",
      "PERP",
      "SAFLE",
      "WBNB",
      "BNB",
      "GHX",
      "TSD",
      "SYS",
      "FXS",
      "DF",
      "USX",
      "REVA",
      "JPEG",
      "AVG",
      "PERL",
      "MASK",
      "LUSD",
      "SWAY",
      "MSU",
      "UCG",
      "MELOS",
      "REEF",
      "MGH",
      "ANML",
      "HUH",
      "iZi",
      "DTR",
      "AKRO",
      "iUSD",
      "SHI",
      "OOKI",
      "PBR",
      "PEEL",
      "SHELL",
      "GNO",
      "OKSE",
      "WING",
      "WRT",
      "MUXLP",
      "muxUSD",
      "muxETH",
      "muxBTC",
      "muxBNB",
      "muxAVAX",
      "muxFTM",
      "GOV",
      "PSTAKE",
      "S2K",
      "LEAP",
      "NYM",
    ],
    lqMintTokenSymbolBlackList: [
      "oneDODO",
      "OLO",
      "PSP",
      "ATL",
      "PEOPLE",
      "SOS",
      "FRAX",
      "SAFLE",
      "BNB",
      "GHX",
      "TSD",
      "SYS",
      "FXS",
      "REVA",
      "AVG",
      "LUSD",
      "SWAY",
      "MSU",
      "UCG",
      "MELOS",
      "MGH",
      "DTR",
      "AKRO",
      "OOKI",
      "PBR",
      "PEEL",
      "SHELL",
      "GNO",
      "OKSE",
      "WRT",
      "MUXLP",
      "muxUSD",
      "muxETH",
      "muxBTC",
      "muxBNB",
      "muxAVAX",
      "muxFTM",
      "GOV",
      "PSTAKE",
      "S2K",
      "LEAP",
      "NYM",
    ],
  },

  polygon: {
    name: "Polygon (Matic)",
    chainId: 137,
    rpcUrl: "https://rpc.ankr.com/polygon",
    iconUrl: "./polygon.png",
    symbol: "MATIC",
    blockExplorerUrl: "https://polygonscan.com",
    tokenSymbolList: [
      "USDC",
      "USDT",
      "WETH",
      "WXT",
      "ATL",
      "FRAX",
      "WOO",
      "MAI",
      "SAFLE",
      "MATIC",
      "FXS",
      "REVA",
      "KROM",
      "SWAY",
      "USX",
      "DF",
      "ANML",
      "HUH",
      "GOVI",
      "DEVT",
      "THALES",
      "iUSD",
      "iZi",
      "GEL",
      "JPYC",
      "AX",
      "BIFI",
      "GREEN",
      "QI",
      "OOKI",
      "SOLACE",
      "OKSE",
    ],
    lqMintTokenSymbolBlackList: [
      "WXT",
      "ATL",
      "FRAX",
      "MAI",
      "SAFLE",
      "MATIC",
      "FXS",
      "REVA",
      "SWAY",
      "DEVT",
      "GEL",
      "AX",
      "BIFI",
      "GREEN",
      "QI",
      "SOLACE",
      "OKSE",
    ],
  },

  arbitrum: {
    name: "Arbitrum One",
    chainId: 42161,
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    iconUrl: "./arbitrum.png",
    symbol: "ETH",
    blockExplorerUrl: "https://arbiscan.io",
    tokenSymbolList: [
      "USDC",
      "USDT",
      "WETH",
      "DODO",
      "MCB",
      "XTK",
      "FRAX",
      "WOO",
      "KROM",
      "PERP",
      "FXS",
      "DF",
      "USX",
      "AMY",
      "REVA",
      "iZi",
      "GOVI",
      "AKRO",
      "iUSD",
      "OOKI",
      "MUXLP",
      "muxUSD",
      "muxETH",
      "muxBTC",
      "muxBNB",
      "muxAVAX",
      "muxFTM",
      "OKSE",
    ],
    lqMintTokenSymbolBlackList: [
      "FRAX",
      "FXS",
      "AMY",
      "REVA",
      "AKRO",
      "MUXLP",
      "muxUSD",
      "muxETH",
      "muxBTC",
      "muxBNB",
      "muxAVAX",
      "muxFTM",
      "OKSE",
    ],
  },
  Avalanche: {
    name: "Avalanche",
    chainId: 43114,
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    iconUrl: "./avalanche.png",
    symbol: "AVAX",
    blockExplorerUrl: "https://snowtrace.io",
    tokenSymbolList: [
      "USDC",
      "USDT",
      "WETH",
      "WXT",
      "PEOPLE",
      "SOS",
      "FRAX",
      "WOO",
      "ATL",
      "MAI",
      "TSD",
      "DOMI",
      "FXS",
      "AVAX",
      "REVA",
      "CGG",
      "LUSD",
      "JPEG",
      "CRA",
      "CRAM",
      "TUS",
      "JPYC",
      "USX",
      "GNO",
      "OKSE",
      "MUXLP",
      "muxUSD",
      "muxETH",
      "muxBTC",
      "muxBNB",
      "muxAVAX",
      "muxFTM",
      "avaxUSDC",
    ],
    lqMintTokenSymbolBlackList: [
      "WXT",
      "PEOPLE",
      "SOS",
      "FRAX",
      "ATL",
      "MAI",
      "TSD",
      "FXS",
      "AVAX",
      "REVA",
      "CGG",
      "LUSD",
      "CRA",
      "CRAM",
      "TUS",
      "GNO",
      "OKSE",
      "MUXLP",
      "muxUSD",
      "muxETH",
      "muxBTC",
      "muxBNB",
      "muxAVAX",
      "muxFTM",
      "avaxUSDC",
    ],
  },
  Optimism: {
    name: "Optimism",
    chainId: 10,
    rpcUrl: "https://opt-mainnet.g.alchemy.com/v2/PmGpTd85SWGf8488jy5H1--I09WBEkIl",
    walletRpcUrl: "https://mainnet.optimism.io",
    iconUrl: "./optimism.png",
    symbol: "ETH",
    blockExplorerUrl: "https://optimistic.etherscan.io",
    tokenSymbolList: [
      "USDC",
      "USDT",
      "WETH",
      "LYRA",
      "KROM",
      "PERP",
      "FRAX",
      "FXS",
      "DF",
      "USX",
      "AELIN",
      "REVA",
      "THALES",
      "LUSD",
      "OKSE",
    ],
    lqMintTokenSymbolBlackList: ["FRAX", "FXS", "AELIN", "REVA", "OKSE"],
  },
  Fantom: {
    name: "Fantom",
    chainId: 250,
    rpcUrl: "https://rpc.ankr.com/fantom",
    iconUrl: "./fantom.png",
    symbol: "FTM",
    blockExplorerUrl: "https://ftmscan.com",
    tokenSymbolList: [
      "USDC",
      "USDT",
      "WETH",
      "PEOPLE",
      "SOS",
      "FRAX",
      "WOO",
      "FXS",
      "FTM",
      "REVA",
      "LUSD",
      "GEL",
      "SOLACE",
      "GNO",
      "OKSE",
      "MUXLP",
      "muxUSD",
      "muxETH",
      "muxBTC",
      "muxBNB",
      "muxAVAX",
      "muxFTM",
    ],
    lqMintTokenSymbolBlackList: [
      "PEOPLE",
      "SOS",
      "FRAX",
      "FXS",
      "FTM",
      "REVA",
      "LUSD",
      "GEL",
      "SOLACE",
      "GNO",
      "OKSE",
      "MUXLP",
      "muxUSD",
      "muxETH",
      "muxBTC",
      "muxBNB",
      "muxAVAX",
      "muxFTM",
    ],
  },
  FantomTestnet: {
    name: "Fantom Testnet",
    chainId: 4002,
    rpcUrl: "https://rpc.testnet.fantom.network",
    iconUrl: "./fantom.png",
    symbol: "FTM",
    blockExplorerUrl: "https://testnet.ftmscan.com",
    tokenSymbolList: ["CELR", "USDT", "TCELR"],
    lqMintTokenSymbolBlackList: [],
  },

  Harmony: {
    name: "Harmony",
    chainId: 1666600000,
    rpcUrl: "https://a.api.s0.t.hmny.io",
    iconUrl: "./harmony.png",
    symbol: "ONE",
    blockExplorerUrl: "https://explorer.harmony.one",
    tokenSymbolList: ["FRAX", "PEOPLE", "SOS", "USDC", "WETH", "MAI", "FXS", "REVA"],
    lqMintTokenSymbolBlackList: ["FRAX", "PEOPLE", "SOS", "MAI", "FXS", "REVA"],
  },

  Moonriver: {
    name: "Moonriver",
    chainId: 1285,
    rpcUrl: "https://rpc.moonriver.moonbeam.network",
    iconUrl: "./moonriver.png",
    symbol: "MOVR",
    blockExplorerUrl: "https://moonriver.moonscan.io",
    tokenSymbolList: ["FRAX", "PEOPLE", "SOS", "MAI", "FXS", "DODO"],
    lqMintTokenSymbolBlackList: ["FRAX", "PEOPLE", "SOS", "MAI", "FXS", "DODO"],
  },

  BoBa: {
    name: "Boba Network",
    chainId: 288,
    rpcUrl: "https://mainnet.boba.network",
    iconUrl: "./boba.png",
    symbol: "ETH",
    blockExplorerUrl: "https://blockexplorer.boba.network",
    tokenSymbolList: ["USDC", "OLO", "BOBA", "FRAX", "FXS", "WAGMIV1", "WAGMIV2", "WAGMIV3"],
    lqMintTokenSymbolBlackList: ["OLO", "FRAX", "FXS", "WAGMIV1", "WAGMIV2", "WAGMIV3"],
  },

  CeloTestnet: {
    name: "Celo Testnet",
    chainId: 44787,
    rpcUrl: "https://alfajores-forno.celo-testnet.org",
    iconUrl: "./celo.png",
    symbol: "CELO",
    blockExplorerUrl: "https://alfajores-blockscout.celo-testnet.org",
    tokenSymbolList: ["USDC", "cUSD"],
    lqMintTokenSymbolBlackList: ["USDC", "cUSD"],
  },

  Metis: {
    name: "Metis",
    chainId: 1088,
    rpcUrl: "https://andromeda.metis.io/?owner=1088",
    iconUrl: "./metis_chain.png",
    symbol: "Metis",
    blockExplorerUrl: "https://andromeda-explorer.metis.io/",
    tokenSymbolList: ["Metis", "PEOPLE", "SOS", "STND", "ATL"],
    lqMintTokenSymbolBlackList: ["PEOPLE", "SOS", "ATL"],
  },

  OKXChain: {
    name: "OKX Chain",
    chainId: 66,
    rpcUrl: "https://exchainrpc.okex.org",
    iconUrl: "./oec.png",
    symbol: "OKT",
    blockExplorerUrl: "https://www.oklink.com/en/oec",
    tokenSymbolList: ["PEOPLE", "SOS", "PLATO", "MARK", "WING", "OKSE"],
    lqMintTokenSymbolBlackList: ["PEOPLE", "SOS", "PLATO", "MARK", "OKSE"],
  },

  xDai: {
    name: "Gnosis Chain",
    chainId: 100,
    rpcUrl: "https://rpc.gnosischain.com",
    iconUrl: "./gnosis.png",
    symbol: "xDai",
    blockExplorerUrl: "https://blockscout.com/xdai/mainnet",
    tokenSymbolList: ["PEOPLE", "SOS"],
    lqMintTokenSymbolBlackList: ["PEOPLE", "SOS"],
  },

  Heco: {
    name: "Heco",
    chainId: 128,
    rpcUrl: "https://http-mainnet.hecochain.com",
    iconUrl: "./heco.png",
    symbol: "HT",
    blockExplorerUrl: "https://hecoinfo.com",
    tokenSymbolList: ["PEOPLE", "SOS", "PLATO", "MARK"],
    lqMintTokenSymbolBlackList: ["PEOPLE", "SOS", "PLATO", "MARK"],
  },

  Aurora: {
    name: "Aurora",
    chainId: 1313161554,
    rpcUrl: "https://mainnet.aurora.dev",
    iconUrl: "./Aurora.png",
    symbol: "aETH",
    blockExplorerUrl: "https://aurorascan.dev/",
    tokenSymbolList: ["USDC", "USDT", "FRAX", "FXS", "BUSD", "FTM", "AURORA", "SOLACE", "OKSE"],
    lqMintTokenSymbolBlackList: ["FRAX", "FXS", "BUSD", "FTM", "AURORA", "SOLACE", "OKSE"],
  },

  Celo: {
    name: "Celo",
    chainId: 42220,
    rpcUrl: "https://forno.celo.org",
    iconUrl: "./celo.png",
    symbol: "CELO",
    blockExplorerUrl: "https://explorer.celo.org",
    tokenSymbolList: ["PEOPLE", "SOS"],
    lqMintTokenSymbolBlackList: ["PEOPLE", "SOS"],
  },

  Moonbeam: {
    name: "Moonbeam",
    chainId: 1284,
    rpcUrl: "https://rpc.api.moonbeam.network",
    iconUrl: "./moonbeam.png",
    symbol: "GLMR",
    blockExplorerUrl: "https://moonbeam.moonscan.io",
    tokenSymbolList: ["USDC", "USDT", "CELR", "PEOPLE", "FRAX", "CONV", "WETH", "WBTC", "BUSD", "FXS", "ZLK"],
    lqMintTokenSymbolBlackList: ["USDC", "USDT", "CELR", "PEOPLE", "FRAX", "CONV", "WETH", "WBTC", "BUSD", "FXS"],
  },
  Astar: {
    name: "Astar",
    chainId: 592,
    rpcUrl: "https://astar.public.blastapi.io",
    iconUrl: "./astar.png",
    symbol: "ASTR",
    blockExplorerUrl: "https://blockscout.com/astar",
    tokenSymbolList: [
      "WETH",
      "USDT",
      "USDC",
      "DAI",
      "BNB",
      "BUSD",
      "PKEX",
      "WBTC",
      "SDN",
      "MATIC",
      "AAVE",
      "CRV",
      "ASTR",
      "NFTY",
      "JPYC",
      "ZLK",
      "SEAN",
      "CERES",
      "DEO",
    ],
    lqMintTokenSymbolBlackList: [
      "WETH",
      "USDT",
      "DAI",
      "BNB",
      "BUSD",
      "WBTC",
      "SDN",
      "MATIC",
      "AAVE",
      "CRV",
      "ASTR",
      "NFTY",
      "SEAN",
      "CERES",
      "DEO",
    ],
  },
  Shiden: {
    name: "Shiden",
    chainId: 336,
    rpcUrl: "https://evm.shiden.astar.network",
    iconUrl: "./shiden.png",
    symbol: "SDN",
    blockExplorerUrl: "https://shiden.subscan.io",
    tokenSymbolList: ["SDN", "PKEX"],
    lqMintTokenSymbolBlackList: ["SDN"],
  },

  Oasis: {
    name: "Oasis Emerald",
    chainId: 42262,
    rpcUrl: "https://emerald.oasis.dev",
    iconUrl: "./oasis.png",
    symbol: "ROSE",
    blockExplorerUrl: "https://www.oasisscan.com",
    tokenSymbolList: ["USDC", "USDT", "WETH", "BNB", "AVAX", "FTM", "AMY", "DAI", "CELR"],
    lqMintTokenSymbolBlackList: ["USDC", "USDT", "WETH", "BNB", "AVAX", "FTM", "AMY", "DAI", "CELR"],
  },

  Milkomeda: {
    name: "Milkomeda Cardano",
    chainId: 2001,
    rpcUrl: "https://rpc-mainnet-cardano-evm.c1.milkomeda.com",
    iconUrl: "./milkomeda.png",
    symbol: "ADA",
    blockExplorerUrl: "https://explorer-mainnet-cardano-evm.c1.milkomeda.com",
    tokenSymbolList: ["PKEX", "USDT", "USDC", "WETH", "WBTC", "DAI", "BNB", "BUSD", "AVAX", "FTM", "MATIC", "WRT"],
    lqMintTokenSymbolBlackList: ["USDT", "USDC", "WETH", "WBTC", "DAI", "BNB", "BUSD", "AVAX", "FTM", "MATIC", "WRT"],
  },

  MilkomedaA1Mainnet: {
    name: "Milkomeda A1 Mainnet",
    chainId: 2002,
    rpcUrl: "https://rpc-mainnet-algorand-rollup.a1.milkomeda.com",
    iconUrl: "./milkomeda.png",
    symbol: "mALGO",
    blockExplorerUrl: "https://explorer-mainnet-algorand-rollup.a1.milkomeda.com/",
    tokenSymbolList: ["USDT", "USDC", "WETH", "WBTC", "DAI", "BNB", "BUSD", "AVAX", "FTM", "MATIC"],
    lqMintTokenSymbolBlackList: ["USDT", "USDC", "WETH", "WBTC", "DAI", "BNB", "BUSD", "AVAX", "FTM", "MATIC"],
  },

  CloverMainnet: {
    name: "Clover Mainnet",
    chainId: 1024,
    rpcUrl: "https://api-para.clover.finance",
    iconUrl: "./clover.png",
    symbol: "CLV",
    blockExplorerUrl: "https://clvscan.com",
    tokenSymbolList: ["WETH", "USDC", "USDT", "DAI", "WBTC"],
    lqMintTokenSymbolBlackList: ["WETH", "USDC", "USDT", "DAI", "WBTC"],
  },

  Conflux: {
    name: "Conflux",
    chainId: 1030,
    rpcUrl: "https://evm.confluxrpc.com",
    iconUrl: "./conflux.png",
    symbol: "CFX",
    blockExplorerUrl: "https://evm.confluxscan.net",
    tokenSymbolList: ["WETH", "USDC", "USDT", "DAI", "WBTC"],
    lqMintTokenSymbolBlackList: ["WETH", "USDC", "USDT", "DAI", "WBTC"],
  },

  REI: {
    name: "REI Network",
    chainId: 47805,
    rpcUrl: "https://rpc.rei.network",
    iconUrl: "./REI.png",
    symbol: "REI",
    blockExplorerUrl: "https://scan.rei.network/",
    tokenSymbolList: ["WETH", "USDC", "USDT", "DAI", "WBTC", "BUSD"],
    lqMintTokenSymbolBlackList: ["WETH", "USDC", "USDT", "DAI", "WBTC", "BUSD"],
  },

  // Syscoin: {
  //   name: "Syscoin",
  //   color: "#3099f2",
  //   chainId: 57,
  //   rpcUrl: "https://rpc.syscoin.org",
  //   blockTime: 5000,
  //   iconUrl: "./syscoin.png",
  //   blockDelay: 20,
  //   symbol: "SYS",
  //   blockExplorerUrl: "https://explorer.syscoin.org",
  //   tokenSymbolList: ["USDT", "USDC", "WETH", "WBTC", "BNB", "SYS", "DAI"],
  //   lqMintTokenSymbolBlackList: ["USDT", "USDC", "WETH", "WBTC", "BNB", "SYS", "DAI"],
  // },

  flowMainnet: {
    name: "Flow",
    chainId: 12340001,
    rpcUrl: "",
    iconUrl: "./FLOW.png",
    symbol: "FlowToken",
    blockExplorerUrl: "https://flowscan.org/",
    tokenSymbolList: ["AVAX", "BNB", "BUSD", "DAI", "FTM", "MATIC", "USDT", "WBTC", "WETH", "RLY", "cfUSDC"],
    lqMintTokenSymbolBlackList: ["AVAX", "BNB", "BUSD", "DAI", "FTM", "MATIC", "USDT", "WBTC", "WETH", "RLY", "cfUSDC"],
  },

  CrabSmartChain: {
    name: "Crab Smart Chain",
    chainId: 44,
    rpcUrl: "https://crab-rpc.darwinia.network",
    iconUrl: "./crab.png",
    symbol: "CRAB",
    blockExplorerUrl: "https://subview.xyz",
    tokenSymbolList: ["USDC", "USDT"],
    lqMintTokenSymbolBlackList: ["USDC", "USDT"],
  },

  PlatON: {
    name: "PlatON",
    chainId: 210425,
    rpcUrl: "https://openapi2.platon.network/rpc",
    iconUrl: "./platon.png",
    symbol: "LAT",
    blockExplorerUrl: "https://scan.platon.network/",
    tokenSymbolList: ["USDT", "USDC", "WETH", "DAI", "WBTC"],
    lqMintTokenSymbolBlackList: ["USDT", "USDC", "WETH", "DAI", "WBTC"],
  },

  Evmos: {
    name: "Evmos",
    chainId: 9001,
    rpcUrl: "https://evmos-mainnet.public.blastapi.io",
    iconUrl: "./evmos.png",
    symbol: "EVMOS",
    blockExplorerUrl: "https://evm.evmos.org/",
    tokenSymbolList: [
      "USDT",
      "USDC",
      "DAI",
      "WETH",
      "WBTC",
      "CELR",
      "BNB",
      "BUSD",
      "AVAX",
      "FTM",
      "AURORA",
      "FRAX",
      "FXS",
    ],
    lqMintTokenSymbolBlackList: [
      "USDT",
      "USDC",
      "DAI",
      "WETH",
      "WBTC",
      "CELR",
      "BNB",
      "BUSD",
      "AVAX",
      "FTM",
      "AURORA",
      "FRAX",
      "FXS",
    ],
  },

  Swimmer: {
    name: "Swimmer Network",
    chainId: 73772,
    rpcUrl: "https://subnets.avax.network/swimmer/mainnet/rpc",
    iconUrl: "./swimmer.png",
    symbol: "TUS",
    blockExplorerUrl: "https://explorer.swimmer.network/",
    tokenSymbolList: ["CRA", "CRAM", "TUS", "avaxUSDC"],
    lqMintTokenSymbolBlackList: ["CRA", "CRAM", "TUS", "avaxUSDC"],
  },

  SXNetwork: {
    name: "SX Network",
    chainId: 416,
    rpcUrl: "https://rpc.sx.technology",
    iconUrl: "./sx.png",
    symbol: "SX",
    blockExplorerUrl: "https://explorer.sx.technology",
    tokenSymbolList: [
      "USDC",
      "USDT",
      "WETH",
      "WBTC",
      "DAI",
      "MATIC",
      "UMA",
      "RAGE",
      "XBP",
      "FLX",
      "CELR",
      "PLOT",
      "AX",
      "MAI",
      "QI",
      "GREEN",
      "BIFI",
      "LFI",
    ],
    lqMintTokenSymbolBlackList: [
      "USDC",
      "USDT",
      "WETH",
      "WBTC",
      "DAI",
      "MATIC",
      "UMA",
      "RAGE",
      "XBP",
      "FLX",
      "CELR",
      "PLOT",
      "AX",
      "MAI",
      "QI",
      "GREEN",
      "BIFI",
      "LFI",
    ],
  },

  ApeChain: {
    name: "Ape Chain",
    chainId: 16350,
    rpcUrl: "https://bas.metaapesgame.com/bas_mainnet_full_rpc",
    iconUrl: "./ape.png",
    symbol: "PEEL",
    blockExplorerUrl: "https://explorer.bas.metaapesgame.com",
    tokenSymbolList: ["PEEL", "SHELL"],
    lqMintTokenSymbolBlackList: ["PEEL", "SHELL"],
  },

  KavaEVMCoChain: {
    name: "Kava EVM Co-Chain",
    chainId: 2222,
    rpcUrl: "https://evm.kava.io",
    iconUrl: "./kava.png",
    symbol: "KAVA",
    blockExplorerUrl: "https://explorer.kava.io",
    tokenSymbolList: ["USDC", "USDT", "DAI", "WETH", "WBTC", "USX"],
    lqMintTokenSymbolBlackList: ["USDC", "USDT", "DAI", "WETH", "WBTC"],
  },

  Ontology: {
    name: "Ontology",
    chainId: 58,
    rpcUrl: "https://dappnode10.ont.io:10339",
    iconUrl: "./ontology.svg",
    symbol: "ONG",
    blockExplorerUrl: "https://explorer.ont.io",
    tokenSymbolList: ["ONG", "USDC", "USDT", "WETH", "WBTC", "WING"],
    lqMintTokenSymbolBlackList: ["USDC", "USDT", "WETH", "WBTC"],
  },

  NervosGodwoken: {
    name: "Nervos Godwoken",
    chainId: 71402,
    rpcUrl: "https://v1.mainnet.godwoken.io/rpc",
    iconUrl: "./nervos.png",
    symbol: "pCKB",
    blockExplorerUrl: "https://gw-mainnet-explorer.nervosdao.community",
    tokenSymbolList: ["USDC", "USDT", "DAI", "WETH", "WBTC", "BUSD"],
    lqMintTokenSymbolBlackList: ["USDC", "USDT", "DAI", "WETH", "WBTC", "BUSD"],
  },

  Klaytn: {
    name: "Klaytn",
    chainId: 8217,
    rpcUrl: "https://public-node-api.klaytnapi.com/v1/cypress",
    iconUrl: "./klaytn.png",
    symbol: "KLAY",
    blockExplorerUrl: "https://www.klaytnfinder.io",
    tokenSymbolList: ["USDC", "USDT", "DAI", "WETH", "WBTC"],
    lqMintTokenSymbolBlackList: ["USDC", "USDT", "DAI", "WETH", "WBTC"],
  },
  AptosMainnet: {
    name: "Aptos Mainnet",
    chainId: 12360001,
    rpcUrl: "https://fullnode.mainnet.aptoslabs.com",
    iconUrl: "./aptos.png",
    symbol: "APTOS",
    blockExplorerUrl: "https://explorer.aptoslabs.com",
    tokenSymbolList: ["USDC", "USDT", "WETH", "WBTC", "DAI", "BUSD", "BNB"],
    lqMintTokenSymbolBlackList: ["USDC", "USDT", "WETH", "WBTC", "DAI", "BUSD", "BNB"],
  },
};
