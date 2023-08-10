import { Token } from "../constants/type";

export const isETH = (token: Token | undefined) => {
    if (!token) {
        return false;
    }
    return ethSupportedChainIds.includes(token.chainId) && token.symbol === "WETH" && token.isNative;
}

export const unambiguousTokenSymbol = (token: Token | undefined) => {
    if (!token) {
        return "";
    }
    return isETH(token) ? "ETH" : token.symbol;
}

/// Chains which support ETH transfer(native)
export const ethSupportedChainIds = [
    1, // Ethereum
    42161, // Arbitrum
    10, // Optimism
    5, // Goerli
    288, // BOBA,
    42170, // Arbitrum Nova
    1101, // PolygonzkEVM
    324, // ZKSyncMainnet
    84531, // BaseGoerli
];