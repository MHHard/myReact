/* eslint-disable camelcase */
import { useEffect, useState } from "react";
import { useToggle } from "react-use";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import useEthBalance from "./ethBalance";
import { getNetworkById } from "../constants/network";
import { useAppSelector } from "../redux/store";
import { Chain, Token } from "../proto/chainhop/common_pb";

export const useNativeETHToken = (
  srcChain: Chain.AsObject | undefined,
  tokenInfo: Token.AsObject | undefined
) => {
  const [isNativeToken, setIsNativeToken] = useState(false);
  const [reloadETH, refreshETH] = useToggle(false);
  const [tokenDisplayName, setTokenDisplayName] = useState(
    tokenInfo?.name ?? ""
  );
  const { address } = useWeb3Context();
  const [ETHBalance, loading, , reload] = useEthBalance(
    srcChain?.chainId,
    address
  );
  const { transferInfo } = useAppSelector((state) => state);
  const { transferConfig } = transferInfo;
  const { chainToken } = transferConfig;
  useEffect(() => {
    reload();
    if (!srcChain || !tokenInfo) {
      return;
    }
    let nativeETHToken = false;
    const LocalChain = getNetworkById(srcChain?.chainId);
    if (tokenInfo.symbol === LocalChain?.symbol) {
      nativeETHToken = true;
    }
    setIsNativeToken(nativeETHToken);
    if (nativeETHToken && tokenInfo?.symbol === "ETH") {
      setTokenDisplayName("Ethereum Token");
    } else {
      setTokenDisplayName(tokenInfo?.name ?? "");
    }
  }, [srcChain, tokenInfo, chainToken, reloadETH, reload]);

  return {
    isNativeToken,
    ETHBalance,
    refreshETH,
    tokenDisplayName,
    nativeTokenLoading: loading,
  };
};
