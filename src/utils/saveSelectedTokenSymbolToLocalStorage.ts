import { storageConstants } from "../constants/const";
import { TokenInfo } from "../constants/type";
import { unambiguousTokenSymbol } from "../helpers/tokenInfo";

export const isCircleUSDCToken = (tokenInfo: TokenInfo | undefined) => {
   return tokenInfo?.token.symbol === "USDC_CIRCLE"
}

export const notOnlyUSDCTokenOnThisChain = (tokenInfo: TokenInfo | undefined) => {
    return tokenInfo?.token.symbol === "USDC" && (tokenInfo.token.chainId === 42161 || tokenInfo.token.chainId === 43114)
 }

export const saveTokenSymbolIntoLocalStorage = (
    tokenInfo: TokenInfo
) => {
    localStorage.setItem(
        storageConstants.KEY_SELECTED_TOKEN_SYMBOL,
        isCircleUSDCToken(tokenInfo) ? "USDC" : unambiguousTokenSymbol(tokenInfo.token),
    );
}