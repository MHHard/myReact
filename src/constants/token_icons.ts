import { Token } from "../proto/chainhop/common_pb";
import { ChainHopTokenInfo } from "./type";
import tokenNoIcon from "../images/tokenNoIcon.svg";

export const localTokenIcons = {
  USDT: "USDT.png",
  fUSDT: "USDT.png",
  USDC: "USDC.png",
  DAI: "DAI.png",
  WETH: "WETH.png",
  ETH: "ETH.png",
  DOMI: "Domi.png",
  WBTC: "WBTC.png",
  cUSD: "CUSD.png",
  BNB: "BNB-coin.png",
  FTM: "FTM.png",
  AVAX: "AVAX.png",
  MATIC: "MATIC.png",
};

export const getLocalTokenIcon = (token: Token.AsObject | undefined) => {
  let tokenIcon = token?.logoUri;
  const tempIcon = localTokenIcons[token?.symbol ?? ""];
  if (tempIcon && tempIcon.length > 0) {
    tokenIcon = "./tokenIcons/" + tempIcon;
  }

  if (!token) {
    return undefined;
  }
  return tokenIcon ?? "./tokenIcons/tokenNoIcon.svg";
};

export const getLocalTokenIconBySymbol = (tokenSymbol: string) => {
  const tempIcon = localTokenIcons[tokenSymbol ?? ""];
  if (tempIcon && tempIcon.length > 0) {
    return "./tokenIcons/" + tempIcon;
  }
  return "";
};

export const getTokenIcon: (
  chainToken: Record<string, ChainHopTokenInfo>,
  chainId: number,
  token,
  isLocalFind?: boolean
) => string = (
  chainToken: Record<string, ChainHopTokenInfo>,
  chainId: number,
  token?: Token.AsObject,
  isLocalFind = true
) => {
  let tokenIcon = "";
  if (isLocalFind) {
    tokenIcon = getLocalTokenIcon(token) || ""; // find from local config
  }

  if (!tokenIcon) {
    const tokenList: Token.AsObject[] = chainToken[chainId ?? 0].tokenList;
    for (let i = 0; i < tokenList.length; i++) {
      // find from tokenList
      if (
        tokenList[i]?.symbol === token?.symbol ||
        tokenList[i]?.address === token?.address
      ) {
        tokenIcon = tokenList[i].logoUri;
      }
    }
  }
  if (!tokenIcon) {
    // if token icon existence return
    return token?.logoUri || tokenNoIcon;
  }
  return tokenIcon;
};
