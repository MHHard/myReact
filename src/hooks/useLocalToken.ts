/* eslint-disable camelcase */

import { ChainHopTokenInfo } from "../constants/type";
import { Token } from "../proto/chainhop/common_pb";

export const getTokenByChainIdAndAddress = (
  chainId: number,
  tokenAddr: string | undefined,
  chainToken: Record<string, ChainHopTokenInfo>
) => {
  let tempToken: Token.AsObject | undefined;

  const originTokens = chainToken[chainId]?.tokenList;

  originTokens?.forEach((item) => {
    if (item?.address === tokenAddr) {
      tempToken = item;
    }
  });
  return tempToken;
};
