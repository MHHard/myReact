import { useMemo } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import { ERC20, ERC20__factory } from "../typechain";
import { getNonEVMMode, NonEVMMode } from "../helpers/nonEVMModeHelper";
import { validateTransferPair } from "../helpers/transferPairValidation";
import { TransferPair, BridgeTypeForBridgeConfig } from "../constants/type";
import { getNetworkById } from "../constants/network";
import { GetTokenBoundRequest } from "../proto/gateway/gateway_pb";
import { getTokenBound } from "../redux/gateway";
import { readOnlyContract } from "./customReadyOnlyContractLoader";

export function useBurnSwapTotalSupply(transferPair: TransferPair): {
  burnSwapTotalSupplyCallback: null | (() => Promise<BigNumber | undefined>);
} {
  return useMemo(() => {
    switch (transferPair.bridgeType) {
      case BridgeTypeForBridgeConfig.PegBurn:
      case BridgeTypeForBridgeConfig.PegV2Burn:
      case BridgeTypeForBridgeConfig.PegBurnMint: {
        break
      }
      default: {
        return { burnSwapTotalSupplyCallback: null };
      }
    }

    if (getNonEVMMode(transferPair.sourceChainInfo?.id ?? 0) !== NonEVMMode.off) {
      return { burnSwapTotalSupplyCallback: null };
    }

    if (!validateTransferPair(transferPair)) {
      return { burnSwapTotalSupplyCallback: null };
    }

    if ((transferPair.sourceChainCanonicalTokenAddress?.length ?? 0) === 0) {
      return { burnSwapTotalSupplyCallback: null };
    }

    const sourceChainInfo = transferPair.sourceChainInfo;
    const sourceChainToken = transferPair.sourceChainToken;
    const sourceChainContractAddress = transferPair.sourceChainContractAddress;

    if (!sourceChainInfo || !sourceChainToken || !sourceChainContractAddress) {
      return { burnSwapTotalSupplyCallback: null };
    }

    return {
      burnSwapTotalSupplyCallback:
        async function onBurnSwapTotalSupplyFound(): Promise<BigNumber | undefined> {
          const provider = new JsonRpcProvider(getNetworkById(sourceChainInfo.id).rpcUrl);
          const tokenContract = await readOnlyContract(provider, sourceChainToken.token.address, ERC20__factory) as ERC20 | undefined;
          const maxAmount = await tokenContract?.totalSupply();
          return maxAmount          
        },
    };
  }, [transferPair]);
}

export function useInBoundTokenLimit(transferPair: TransferPair) : {
  inBoundTokenLimitCallback: null | (() => Promise<BigNumber>);
} {
  return useMemo(() => {
    if (!validateTransferPair(transferPair)) {
      return { inBoundTokenLimitCallback: null };
    }

    const sourceChainInfo = transferPair.sourceChainInfo;
    const sourceChainToken = transferPair.sourceChainToken;
    const sourceChainContractAddress = transferPair.sourceChainContractAddress;

    if (!sourceChainInfo || !sourceChainToken || !sourceChainContractAddress) {
      return { inBoundTokenLimitCallback: null };
    }

    if ((sourceChainToken.inbound_lmt?.length ?? 0) === 0) {
      return { inBoundTokenLimitCallback: null };
    }

    return {
      inBoundTokenLimitCallback:
        async function onInBoundLimitFound(): Promise<BigNumber> {
          const getTokenBoundRequest = new GetTokenBoundRequest();
          getTokenBoundRequest.setChainId(sourceChainInfo.id)
          getTokenBoundRequest.setTokenAddr(sourceChainToken.token.address)
          const response = await getTokenBound(getTokenBoundRequest)
          let value = BigNumber.from(0)
          try {
             value = BigNumber.from(response.getValue())
          } catch {
            ///
          }
          return value        
        },
    };
  }, [transferPair]);
}