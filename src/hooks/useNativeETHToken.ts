import { useEffect, useState } from "react";
import { Chain, TokenInfo } from "../constants/type";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { useEthBalance } from ".";
import { isGasToken } from "../constants/network";

export const useNativeETHToken = (srcChain: Chain | undefined, tokenInfo: TokenInfo | undefined) => {
  const [isNativeToken, setIsNativeToken] = useState(false);
  const { provider, address } = useWeb3Context();

  const [ETHBalance] = useEthBalance(provider, address, isGasToken(srcChain?.id ?? 0, tokenInfo?.token.display_symbol ?? tokenInfo?.token.symbol ?? "" ));

  useEffect(() => {
    if (!srcChain || !tokenInfo || !provider) {
      return;
    }
    const chainIds = [
      1, // Ethereum
      42161, // Arbitrum
      10, // Optimism
      5, // Goerli
      288, // BOBA,
      42170, // Arbitrum Nova
    ];

    let isNativeGasToken = false;

    if (chainIds.includes(srcChain.id) && tokenInfo.token.display_symbol === "ETH") {
      isNativeGasToken = true;
    } else if (isGasToken(srcChain.id, tokenInfo.token.symbol)) {
      isNativeGasToken = true;
    }

    setIsNativeToken(isNativeGasToken);

  }, [srcChain, tokenInfo, provider]);

  return { isNativeToken, ETHBalance };
};

