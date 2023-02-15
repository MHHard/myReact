/* eslint-disable camelcase */
import { useEffect, useState } from "react";
import { isGasToken, isSeiChainNativeToken } from "../constants/network";
import { getNonEVMMode, isAptosChain, NonEVMMode, useNonEVMContext } from "../providers/NonEVMContextProvider";
import { getAptosResources } from "../redux/NonEVMAPIs/aptosAPIs";
import { checkTokenBalanceForFlowAccount } from "../redux/NonEVMAPIs/flowAPIs";
import { getInjNativeTokenBalance, getInjTokenBalance } from "../redux/NonEVMAPIs/injectiveAPI";
import { checkTokenBelongToChain, getSeiNativeTokenBalance, getSeiTokenBalance } from "../redux/NonEVMAPIs/seiAPI";
import { useAppSelector } from "../redux/store";

export type UseBalanceReturn = [string];

function useNonEVMTokenBalance(): UseBalanceReturn {
  const [nonEVMTokenBalance, setNonEVMTokenBalance] = useState<string>("0");
  const { flowAddress, flowConnected, aptosAddress, aptosConnected, seiAddress, injAddress } = useNonEVMContext();
  const { flowTokenPathConfigs, fromChain, selectedToken } = useAppSelector(state => state.transferInfo);
  // eslint-disable-next-line
  const [aptosResources, setAptosResources] = useState<any | undefined>(undefined);
  const { transferInfo } = useAppSelector(state => state);
  const { transferConfig } = transferInfo;
  // eslint-disable-next-line camelcase
  const { chain_token } = transferConfig;
  const getFlowBalance = async () => {
    const tokenSymbol = selectedToken?.token.symbol ?? "";
    if (tokenSymbol.length === 0) {
      setNonEVMTokenBalance("0");
      return;
    }

    const flowTokenPath = flowTokenPathConfigs.find(config => {
      return config.Symbol === selectedToken?.token.symbol;
    });

    await checkTokenBalanceForFlowAccount(flowAddress, flowTokenPath?.BalancePath ?? "")
      .then(balance => {
        setNonEVMTokenBalance(balance.toString());
      })
      .catch(_ => {
        setNonEVMTokenBalance("--");
      });
  };

  const getResources = async () => {
    await getAptosResources(aptosAddress)
      .then(resources => {
        if (resources !== undefined) {
          setAptosResources(resources);
        }
      })
      .catch(_ => {});
  };
  const getSeiBalance = async () => {
    if (!selectedToken || !seiAddress || !fromChain) {
      setNonEVMTokenBalance("0");
      return;
    }
    if (isSeiChainNativeToken(fromChain?.id || 1, selectedToken.token.symbol)) {
      const balance = await getSeiNativeTokenBalance(seiAddress, selectedToken.token);
      setNonEVMTokenBalance(balance.toString());
    } else {
      const checkState = checkTokenBelongToChain(chain_token[fromChain?.id].token, selectedToken?.token);
      if (!checkState) {
        setNonEVMTokenBalance("0");
        return;
      }
      const balance = await getSeiTokenBalance(selectedToken.token, seiAddress);
      setNonEVMTokenBalance(balance.toString());
    }
  };
  const getInjBalance = async () => {
    if (!selectedToken || !injAddress || !fromChain) {
      setNonEVMTokenBalance("0");
      return;
    }
    if (isGasToken(fromChain?.id || 1, selectedToken.token.symbol)) {
      const balance = await getInjNativeTokenBalance(injAddress, selectedToken.token);
      setNonEVMTokenBalance(balance.toString());
    } else {
      const checkState = checkTokenBelongToChain(chain_token[fromChain?.id].token, selectedToken?.token);
      if (!checkState) {
        setNonEVMTokenBalance("0");
        return;
      }
      const balance = await getInjTokenBalance(selectedToken.token, injAddress);
      setNonEVMTokenBalance(balance.toString());
    }
  };

  useEffect(() => {
    const fromChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
    switch (fromChainNonEVMMode) {
      case NonEVMMode.flowMainnet:
      case NonEVMMode.flowTest: {
        getFlowBalance();
        break;
      }
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        if (!aptosConnected) {
          setAptosResources(undefined);
        } else {
          getResources();
        }
        break;
      }
      case NonEVMMode.seiMainnet:
      case NonEVMMode.seiDevnet:
      case NonEVMMode.seiTestnet: {
        if (seiAddress) {
          getSeiBalance();
        }
        break;
      }
      case NonEVMMode.injectiveTestnet:
      case NonEVMMode.injectiveMainnet: {
        if (injAddress) {
          getInjBalance();
        }
        break;
      }
      case NonEVMMode.off: {
        break;
      }
      default: {
        console.error("Unsupported nonevm mode", fromChainNonEVMMode);
        setNonEVMTokenBalance("0");
        break;
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    flowAddress,
    flowConnected,
    aptosAddress,
    seiAddress,
    injAddress,
    aptosConnected,
    fromChain,
    selectedToken,
    aptosResources,
  ]);

  useEffect(() => {
    if (!isAptosChain(fromChain?.id ?? 0)) {
      return;
    }
    if (!selectedToken) {
      return;
    }
    if (!aptosResources) {
      setNonEVMTokenBalance("--");
      return;
    }

    const typeTag = `0x1::coin::CoinStore<${selectedToken.token.address}>`;
    const resource = aptosResources.find(r => r.type === typeTag);
    if (!resource) {
      setNonEVMTokenBalance("--");
      return;
    }
    // eslint-disable-next-line
    const balance = (resource?.data as any).coin.value / 10 ** selectedToken.token.decimal;
    setNonEVMTokenBalance(balance.toString());
  }, [fromChain, selectedToken, aptosResources]);

  return [nonEVMTokenBalance];
}

export default useNonEVMTokenBalance;
