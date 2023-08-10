/* eslint-disable camelcase */
import { useEffect, useState } from "react";
import { TokenInfo } from "../constants/type";
import { getTransferPairFunction } from "../helpers/transferPairGeneration";
import { useAppSelector } from "../redux/store";
import { useWeb3Context } from "../providers/Web3ContextProvider";

export const useDestinationChainTokenList = (): TokenInfo[] => {
  const { transferInfo } = useAppSelector(state => state);
  const { getNetworkById } = useWeb3Context();

  const { fromChain, toChain, selectedToken, transferConfig, circleUSDCConfig } = transferInfo;
  const { chaintokensList: circleUSDCTokens } = circleUSDCConfig;

  const [destinationChainTokenList, setDestinationChainTokenList] = useState<TokenInfo[]>([]);

  useEffect(() => {
    let targetTokenList: TokenInfo[] = [];

    if (
      transferConfig &&
      fromChain &&
      toChain &&
      selectedToken &&
      (selectedToken.token.symbol === "USDC" || selectedToken.token.symbol === "USDC_CIRCLE")
    ) {
      const sourceChainCircleUSDCToken = circleUSDCTokens.find(token => {
        return token.chainId === fromChain.id;
      });

      const destinationChainCircleUSDCToken = circleUSDCTokens.find(token => {
        return token.chainId === toChain.id;
      });

      // Circle USDC bridge available
      if (
        sourceChainCircleUSDCToken &&
        destinationChainCircleUSDCToken &&
        sourceChainCircleUSDCToken.tokenAddr === selectedToken.token.address
      ) {
        targetTokenList.push({
          token: {
            symbol: "USDC_CIRCLE",
            address: destinationChainCircleUSDCToken.tokenAddr,
            decimal: destinationChainCircleUSDCToken.tokenDecimal,
            xfer_disabled: false,
            chainId: toChain.id,
            isNative: false,
          },
          name: "USD Coin",
          icon: "https://get.celer.app/cbridge-icons/USDC.png",
          max_amt: "",
          transfer_disabled: false,
        });
      }

      const destinationChainUSDCToken = getTransferPairFunction(
        transferConfig,
        fromChain.id,
        toChain.id,
        selectedToken.token.symbol,
        getNetworkById,
      ).destinationToken;

      if (destinationChainUSDCToken) {
        targetTokenList.push(destinationChainUSDCToken);
      }

      if (
        targetTokenList.length > 1 &&
        targetTokenList[0].token.address.toLowerCase() === targetTokenList[1].token.address.toLowerCase()
      ) {
        const usdcFromTransferConfig = targetTokenList[1];
        targetTokenList = [usdcFromTransferConfig];
      }
    }

    setDestinationChainTokenList(targetTokenList);
  }, [fromChain, toChain, selectedToken, transferConfig, circleUSDCTokens, getNetworkById]);

  return destinationChainTokenList;
};
