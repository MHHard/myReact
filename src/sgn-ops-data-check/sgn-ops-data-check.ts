export const affectedUserAddresses: string[] = [
  "0x7a0f8622ed9189841a781bde8f2d551f175bc321",
  "0x24f7936613a023cab475a23b97207195b92bcee2",
  "0xab819b3e80c23673d9b87abad97a56d37b6aa6fb",
  "0x8176d7b793a73626880bc43dfd9a9f97d338ca88",
  "0x8594d8e9483473626908648a5539d9d65ca2fe8d",
  "0x42121810a2e73c5f384ebf9ce9dbcf6c2154305d",
  "0xf12e7057bd3163a7f0af7d1783a62c63d68d151b",
  "0xb3962f88ae49761618e4e2bacac22d6be55c4be6",
  "0xfe55b12c6e40ce789882004948d5dfd40091245a",
  "0xaadf465695b80d5f8a1079b6646ba0bdbbaa4307",
  "0x34327028c727613872cd80122b9a489a4b9c0bfa",
  "0x6f0ce8537a420948619c0f5081328ff1d0ee649d",
  "0x87c73367e547261b63c96662d9725c9f1c36652f",
  "0xd846a701f5a33f1eeca75dcc3fe7475274ffe9de",
  "0x8583c25e2c787f182b7e8282382e35c9b06578ca",
  "0x204636753b992df51dcdd983abd175f79e29e9e5",
  "0xe70003dcaa8d27759df7cef06afe68416ffdb98c",
  "0xb4d58f74d2b77e4317d465e073a281b7f4b27e39",
  "0x401d1343a4a108e34c93b80eadcb94b588e5a72b",
  "0xd681b82c0e9234b3eb9416c07fba6f7ac78fc7ce",
  "0x039e2604295ba89a83588107391aed3cce36b97f",
  "0x1dec34e2c690e6f197a5d9f63c6d8e2bb94f54c1",
  "0x12195f54b64661a7b273c2880bf6274c09c37852",
  "0x436584bd1e58a81b76bd2b54d1fd1cacfbffc01f",
  "0x74746fb798d7325e00feb3673d1e3b7c6a199f05",
  "0xec5f4daea9e5347a79e7346ca7300787b9b864cf",
  "0x99c5f24e179f3b1d11c35a2a022233b693cc8e31",
  "0x08C88ce7C97d38Bdc9A5D92eA2c125Bcf92E4A41",
  "0x99C5F24e179f3B1D11c35a2A022233b693cc8e31",
  "0xe9afb95356954786f48d06147da82956449fb870",
  "0xb0f5fa0cd2726844526e3f70e76f54c6d91530dd",
  "0x5dc2b84856b4b7d087974113bacfaf3cb20a635e",
];

export const sgnOpsDataCheck = {
  1: {
    /// "Ethereum mainnet"
    cbridge: "0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820",
    otvault: "0xB37D31b2A74029B5951a2778F959282E2D518595",
    otvault2: "0x7510792A3B1969F9307F3845CE88e39578f2bAE1",
    ptbridge: "0x16365b45EB269B5B5dACB34B4a15399Ec79b95eB",
    ptbridge2: "0x52E4f244f380f8fA51816c8a10A63105dd4De084",
    rfqContract: "0x6e380ad5D15249eF2DE576E3189fc49B5713BE4f",
    transferAgent: "0x9b274BC73940d92d0Af292Bde759cbFCCE661a0b",
  },
  56: {
    /// "BSC"
    cbridge: "0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF",
    otvault: "0x78bc5Ee9F11d133A08b331C2e18fE81BE0Ed02DC",
    otvault2: "0x11a0c9270D88C99e221360BCA50c2f6Fda44A980",
    ptbridge: "0xd443FE6bf23A4C9B78312391A30ff881a097580E",
    ptbridge2: "0x26c76F7FeF00e02a5DD4B5Cc8a0f717eB61e1E4b",
    rfqContract: "0x309b97ECc8eFA45831aB50d532Ac862da79bfB69",
    transferAgent: "0x3d85B598B734a0E7c8c1b62B00E972e9265dA541",
  },
  42161: {
    /// "Arbitrum"
    cbridge: "0x1619DE6B6B20eD217a58d00f37B9d47C7663feca",
    otvault: "0xFe31bFc4f7C9b69246a6dc0087D91a91Cb040f76",
    otvault2: "0xEA4B1b0aa3C110c55f650d28159Ce4AD43a4a58b",
    ptbridge: "0xbdd2739AE69A054895Be33A22b2D2ed71a1DE778",
    ptbridge2: "",
    rfqContract: "0x52A9A7F9b22C31218d26a4e91e2Ba01eD04520EE",
    transferAgent: "",
  },
  137: {
    /// "Polygon"
    cbridge: "0x88DCDC47D2f83a99CF0000FDF667A468bB958a78",
    otvault: "0xc1a2D967DfAa6A10f3461bc21864C23C1DD51EeA",
    otvault2: "0x4C882ec256823eE773B25b414d36F92ef58a7c0C",
    ptbridge: "0x4d58FDC7d0Ee9b674F49a0ADE11F26C3c9426F7A",
    ptbridge2: "0xb51541df05DE07be38dcfc4a80c05389A54502BB",
    rfqContract: "0x243b40e96c6bF21511E53d85c86F6Ec982f9a879",
    transferAgent: "",
  },
  43114: {
    /// "Avalanche"
    cbridge: "0xef3c714c9425a8F3697A9C969Dc1af30ba82e5d4",
    otvault: "0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820",
    otvault2: "0xb51541df05DE07be38dcfc4a80c05389A54502BB",
    ptbridge: "0x88DCDC47D2f83a99CF0000FDF667A468bB958a78",
    ptbridge2: "0xb774C6f82d1d5dBD36894762330809e512feD195",
    rfqContract: "0x697aC93c9263346c5Ad0412F9356D5789a3AA687",
    transferAgent: "",
  },
  250: {
    /// "Fantom"
    cbridge: "0x374B8a9f3eC5eB2D97ECA84Ea27aCa45aa1C57EF",
    otvault: "0x7D91603E79EA89149BAf73C9038c51669D8F03E9",
    otvault2: "",
    ptbridge: "0x38D1e20B0039bFBEEf4096be00175227F8939E51",
    ptbridge2: "0x30F7Aa65d04d289cE319e88193A33A8eB1857fb9",
    rfqContract: "",
    transferAgent: "",
  },
  10: {
    /// "Optimism"
    cbridge: "0x9D39Fc627A6d9d9F8C831c16995b209548cc3401",
    otvault: "0xbCfeF6Bb4597e724D720735d32A9249E0640aA11",
    otvault2: "",
    ptbridge: "0x61f85fF2a2f4289Be4bb9B72Fc7010B3142B5f41",
    ptbridge2: "",
    rfqContract: "0x44435a66aE25d4e7F2FB054A68Bf6a0A44ae05DC",
    transferAgent: "",
  },
  288: {
    /// "Boba"
    cbridge: "0x841ce48F9446C8E281D3F1444cB859b4A6D0738C",
    otvault: "0x8db213bE5268a2b8B78Af08468ff1EA422073Da0",
    otvault2: "0x4C882ec256823eE773B25b414d36F92ef58a7c0C",
    ptbridge: "0xC5Ef662b833De914B9bA7a3532C6BB008a9b23a6",
    ptbridge2: "",
    rfqContract: "",
    transferAgent: "",
  },
  1666600000: {
    /// "Harmony"
    cbridge: "0x78a21c1d3ed53a82d4247b9ee5bf001f4620ceec",
    otvault: "",
    otvault2: "",
    ptbridge: "0xdd90e5e87a2081dcf0391920868ebc2ffb81a1af",
    ptbridge2: "",
    rfqContract: "",
    transferAgent: "",
  },
  42220: {
    /// "Celo"
    cbridge: "0xBB7684Cc5408F4DD0921E5c2Cadd547b8f1AD573",
    otvault: "0xD9d1034ef3d21221F008C7e96346CA999966752C",
    otvault2: "",
    ptbridge: "0xDA1DD66924B0470501aC7736372d4171cDd1162E",
    ptbridge2: "",
    rfqContract: "",
    transferAgent: "",
  },
  1088: {
    /// "Metis Andromeda Mainnet"
    cbridge: "0x841ce48F9446C8E281D3F1444cB859b4A6D0738C",
    otvault: "",
    otvault2: "",
    ptbridge: "0x3bbaDFf9aeee4a74D3Cf6da05C30868C9Ff85BB8",
    ptbridge2: "0xb3833Ecd19D4Ff964fA7bc3f8aC070ad5e360E56",
    rfqContract: "",
    transferAgent: "",
  },
  1313161554: {
    /// "Aurora MainNet"
    cbridge: "0x841ce48F9446C8E281D3F1444cB859b4A6D0738C",
    otvault: "",
    otvault2: "0xbCfeF6Bb4597e724D720735d32A9249E0640aA11",
    ptbridge: "0x4384d5a9D7354C65cE3aee411337bd40493Ad1bC",
    ptbridge2: "0xbdd2739AE69A054895Be33A22b2D2ed71a1DE778",
    rfqContract: "",
    transferAgent: "",
  },
  1285: {
    /// "Moonriver"
    cbridge: "0x841ce48F9446C8E281D3F1444cB859b4A6D0738C",
    otvault: "",
    otvault2: "",
    ptbridge: "0x374B8a9f3eC5eB2D97ECA84Ea27aCa45aa1C57EF",
    ptbridge2: "0x0D71D18126E03646eb09FEc929e2ae87b7CAE69d",
    rfqContract: "",
    transferAgent: "",
  },
  100: {
    /// "xDai"
    cbridge: "0x3795C36e7D12A8c252A20C5a7B455f7c57b60283",
    otvault: "",
    otvault2: "",
    ptbridge: "0xd4c058380D268d85bC7c758072f561e8f2dB5975",
    ptbridge2: "",
    rfqContract: "",
    transferAgent: "",
  },
  66: {
    /// "OEC"
    cbridge: "0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98",
    otvault: "",
    otvault2: "",
    ptbridge: "0x48284Eb583a1F3058F4BCe0a685D44FE29d4539e",
    ptbridge2: "",
    rfqContract: "",
    transferAgent: "",
  },
  128: {
    /// "Heco"
    cbridge: "0xBB7684Cc5408F4DD0921E5c2Cadd547b8f1AD573",
    otvault: "0x5d96d4287D1ff115eE50faC0526cf43eCf79bFc6",
    otvault2: "",
    ptbridge: "0x81ECac0D6Be0550A00FF064a4f9dd2400585FE9c",
    ptbridge2: "",
    rfqContract: "",
    transferAgent: "",
  },
  42262: {
    /// "OASIS"
    cbridge: "0x841ce48F9446C8E281D3F1444cB859b4A6D0738C",
    otvault: "",
    otvault2: "",
    ptbridge: "0xBB7684Cc5408F4DD0921E5c2Cadd547b8f1AD573",
    ptbridge2: "0x3b53D2C7B44d40BE05Fa5E2309FFeB6eB2492d88",
    rfqContract: "",
    transferAgent: "",
  },
  1284: {
    /// "Moonbeam"
    cbridge: "0x841ce48F9446C8E281D3F1444cB859b4A6D0738C",
    otvault: "",
    otvault2: "",
    ptbridge: "0xBB7684Cc5408F4DD0921E5c2Cadd547b8f1AD573",
    ptbridge2: "0x3b53D2C7B44d40BE05Fa5E2309FFeB6eB2492d88",
    rfqContract: "",
    transferAgent: "",
  },
  592: {
    /// "Astar"
    cbridge: "0x841ce48F9446C8E281D3F1444cB859b4A6D0738C",
    otvault: "0xbCfeF6Bb4597e724D720735d32A9249E0640aA11",
    otvault2: "0x243F56Bad0170a6c050a91925245AD8360350108",
    ptbridge: "0xBB7684Cc5408F4DD0921E5c2Cadd547b8f1AD573",
    ptbridge2: "0x3b53D2C7B44d40BE05Fa5E2309FFeB6eB2492d88",
    rfqContract: "",
    transferAgent: "",
  },
  57: {
    /// "Syscoin"
    cbridge: "0x841ce48f9446c8e281d3f1444cb859b4a6d0738c",
    otvault: "0x1E6b1ceAF75936f153ABB7B65FBa57AbaE14e6CE",
    otvault2: "",
    ptbridge: "0xBB7684Cc5408F4DD0921E5c2Cadd547b8f1AD573",
    ptbridge2: "0x3b53D2C7B44d40BE05Fa5E2309FFeB6eB2492d88",
    rfqContract: "",
    transferAgent: "",
  },
  336: {
    /// "ShidenNetworkMainnet"
    cbridge: "0x841ce48F9446C8E281D3F1444cB859b4A6D0738C",
    otvault: "0xBB7684Cc5408F4DD0921E5c2Cadd547b8f1AD573",
    otvault2: "",
    ptbridge: "",
    ptbridge2: "",
    rfqContract: "",
    transferAgent: "",
  },
  2001: {
    /// "Milkomeda Cardano"
    cbridge: "0x841ce48f9446c8e281d3f1444cb859b4a6d0738c",
    otvault: "",
    otvault2: "0xb51541df05DE07be38dcfc4a80c05389A54502BB",
    ptbridge: "0xBB7684Cc5408F4DD0921E5c2Cadd547b8f1AD573",
    ptbridge2: "0x3b53D2C7B44d40BE05Fa5E2309FFeB6eB2492d88",
    rfqContract: "",
    transferAgent: "",
  },
  9001: {
    /// "Evmos"
    cbridge: "0x5F52B9d1C0853da636e178169e6B426E4cCfA813",
    otvault: "",
    otvault2: "",
    ptbridge: "0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820",
    ptbridge2: "0xC1d6E421a062Fdbb26C31Db4a2113dF0F678CD04",
    rfqContract: "",
    transferAgent: "",
  },
  1024: {
    /// "Clover"
    cbridge: "0x841ce48F9446C8E281D3F1444cB859b4A6D0738C",
    otvault: "",
    otvault2: "",
    ptbridge: "0xBB7684Cc5408F4DD0921E5c2Cadd547b8f1AD573",
    ptbridge2: "0x3b53D2C7B44d40BE05Fa5E2309FFeB6eB2492d88",
    rfqContract: "",
    transferAgent: "",
  },
  47805: {
    /// "REI Network"
    cbridge: "0x841ce48F9446C8E281D3F1444cB859b4A6D0738C",
    otvault: "",
    otvault2: "",
    ptbridge: "0xBB7684Cc5408F4DD0921E5c2Cadd547b8f1AD573",
    ptbridge2: "0x9B36f165baB9ebe611d491180418d8De4b8f3a1f",
    rfqContract: "",
    transferAgent: "",
  },
  1030: {
    /// "Conflux"
    cbridge: "0x841ce48F9446C8E281D3F1444cB859b4A6D0738C",
    otvault: "",
    otvault2: "",
    ptbridge: "0xBB7684Cc5408F4DD0921E5c2Cadd547b8f1AD573",
    ptbridge2: "0x3b53D2C7B44d40BE05Fa5E2309FFeB6eB2492d88",
    rfqContract: "",
    transferAgent: "",
  },
  12340001: {
    /// "Flow Mainnet"
    cbridge: "08dd120226ec2213",
    otvault: "08dd120226ec2213",
    otvault2: "",
    ptbridge: "08dd120226ec2213",
    ptbridge2: "",
    rfqContract: "",
    transferAgent: "",
  },
  44: {
    /// "Crab Mainnet"
    cbridge: "0x841ce48F9446C8E281D3F1444cB859b4A6D0738C",
    otvault: "",
    otvault2: "",
    ptbridge: "0xBB7684Cc5408F4DD0921E5c2Cadd547b8f1AD573",
    ptbridge2: "0x3b53D2C7B44d40BE05Fa5E2309FFeB6eB2492d88",
    rfqContract: "",
    transferAgent: "",
  },
  210425: {
    /// "PlatON"
    cbridge: "0xBf2B2757F0B2a2f70136C4A6627e99d8ec5cC7b9",
    otvault: "",
    otvault2: "",
    ptbridge: "0x31d95c7fc6b5520B4BdCD78Efa689dD1CCa5741E",
    ptbridge2: "0xD340BC3Ec35e63BcF929C5A9ad3AE5B1EBDbE678",
    rfqContract: "",
    transferAgent: "",
  },
  73772: {
    /// "Swimmer Network"
    cbridge: "0xb51541df05DE07be38dcfc4a80c05389A54502BB",
    otvault: "",
    otvault2: "",
    ptbridge: "",
    ptbridge2: "0xF8Bf9988206c4de87F52A3c24486E4367B7088CB",
    rfqContract: "",
    transferAgent: "",
  },
  416: {
    ///  "SX Network"
    cbridge: "0x9B36f165baB9ebe611d491180418d8De4b8f3a1f",
    otvault: "",
    otvault2: "",
    ptbridge: "",
    ptbridge2: "0x9Bb46D5100d2Db4608112026951c9C965b233f4D",
    rfqContract: "",
    transferAgent: "",
  },
  16350: {
    /// "Ape Chain"
    cbridge: "0x9B36f165baB9ebe611d491180418d8De4b8f3a1f",
    otvault: "",
    otvault2: "0x9Bb46D5100d2Db4608112026951c9C965b233f4D",
    ptbridge: "",
    ptbridge2: "",
    rfqContract: "",
    transferAgent: "",
  },
  2222: {
    /// "Kava EVM Co-Chain"
    cbridge: "0xb51541df05DE07be38dcfc4a80c05389A54502BB",
    otvault: "",
    otvault2: "",
    ptbridge: "",
    ptbridge2: "0xF8Bf9988206c4de87F52A3c24486E4367B7088CB",
    rfqContract: "",
    transferAgent: "",
  },
  58: {
    /// "Ontology EVM"
    cbridge: "0x841ce48F9446C8E281D3F1444cB859b4A6D0738C",
    otvault: "",
    otvault2: "",
    ptbridge: "",
    ptbridge2: "0xd4c058380D268d85bC7c758072f561e8f2dB5975",
    rfqContract: "",
    transferAgent: "",
  },
  71402: {
    /// "NERVOS EVM"
    cbridge: "0x4C882ec256823eE773B25b414d36F92ef58a7c0C",
    otvault: "",
    otvault2: "",
    ptbridge: "",
    ptbridge2: "0xb3833Ecd19D4Ff964fA7bc3f8aC070ad5e360E56",
    rfqContract: "",
    transferAgent: "",
  },
  8217: {
    /// "Klaytn"
    cbridge: "0x4C882ec256823eE773B25b414d36F92ef58a7c0C",
    otvault: "",
    otvault2: "",
    ptbridge: "",
    ptbridge2: "0xb3833Ecd19D4Ff964fA7bc3f8aC070ad5e360E56",
    rfqContract: "",
    transferAgent: "",
  },
  42170: {
    /// "Arbitrum Nova"
    cbridge: "0xb3833Ecd19D4Ff964fA7bc3f8aC070ad5e360E56",
    otvault: "",
    otvault2: "",
    ptbridge: "",
    ptbridge2: "",
    rfqContract: "",
    transferAgent: "",
  },
  2002: {
    /// "Milkomeda A1 Mainnet"
    cbridge: "0xa7C9FeDe809b6af10dC52590804c69F40f6f8154",
    otvault: "",
    otvault2: "",
    ptbridge: "",
    ptbridge2: "0x422849B355039bC58F2780cc4854919fC9cfaF94",
    rfqContract: "",
    transferAgent: "",
  },
  73: {
    /// "FNCY Chain"
    cbridge: "0x9B36f165baB9ebe611d491180418d8De4b8f3a1f",
    otvault: "",
    otvault2: "0x9Bb46D5100d2Db4608112026951c9C965b233f4D",
    ptbridge: "",
    ptbridge2: "0xf5C6825015280CdfD0b56903F9F8B5A2233476F5",
    rfqContract: "",
    transferAgent: "",
  },
  12360001: {
    /// Aptos Mainnet
    cbridge: "8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d",
    otvault: "8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d",
    otvault2: "8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d",
    ptbridge: "8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d",
    ptbridge2: "8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d",
    rfqContract: "",
    transferAgent: "",
  },

// Testnet chains
//
//
//
//  
  12360002: {
    /// Aptos Testnet
    cbridge: "",
    otvault: "5c341dec2396029a7713cb59decee89635a6f851a5fe528fc39761ec2ddbf99a",
    otvault2: "",
    ptbridge: "5c341dec2396029a7713cb59decee89635a6f851a5fe528fc39761ec2ddbf99a",
    ptbridge2: "",
    rfqContract: "",
    transferAgent: "",
  },
  5: {
    /// goerli
    cbridge: "",
    otvault: "",
    otvault2: "0x1B4aCcDEB6d67FE706D5BeB1FAdb3Cd092905707",
    ptbridge: "",
    ptbridge2: "0x0C33583c0c8267B20368299A45cE118eac90A258",
    rfqContract: "",
    transferAgent: "0xBC06BA73f674E3eECDF05ddC7B946351889A5cB6",
  }
};
