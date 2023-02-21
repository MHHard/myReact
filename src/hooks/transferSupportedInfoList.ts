/* eslint-disable camelcase */
import { useEffect, useState } from "react";

import { useAppSelector } from "../redux/store";
import { Chain, Token } from "../proto/chainhop/common_pb";

export const useTransferSupportedChainList = (
  useAsDestinationChain: boolean
): Chain.AsObject[] => {
  const { transferInfo } = useAppSelector((state) => state);
  const { fromChain, transferConfig } = transferInfo;
  const [fromChainList, setFromChainList] = useState<Chain.AsObject[]>([]);
  const [chainList, setChainList] = useState<Chain.AsObject[]>([]);

  useEffect(() => {
    setFromChainList(transferConfig.chains);
  }, [transferConfig]);

  useEffect(() => {
    setChainList(fromChainList);
  }, [fromChain, fromChainList, useAsDestinationChain, transferConfig]);

  return chainList;
};

export const useTransferSupportedTokenList = (): Token.AsObject[] => {
  const { transferInfo } = useAppSelector((state) => state);
  const { fromChain, toChain, transferConfig } = transferInfo;
  const { chainToken } = transferConfig;

  const [tokenList, setTokenList] = useState<Token.AsObject[]>([]);

  useEffect(() => {
    if (fromChain && fromChain !== undefined) {
      const fromChainId = fromChain.chainId;
      const fromChainTokens = chainToken[fromChainId]?.tokenList;

      if (toChain && toChain !== undefined) {
        const toChainId = toChain.chainId;
        const toChainToken: Token.AsObject[] = chainToken[toChainId]?.tokenList;
        setTokenList(toChainToken);
      } else {
        const poolBasedTokens: Token.AsObject[] = fromChainTokens;
        setTokenList(poolBasedTokens);
      }
    }
  }, [fromChain, toChain, chainToken, transferConfig]);

  return tokenList;
};
