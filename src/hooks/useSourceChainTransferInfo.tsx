import { useMemo } from "react";
import { BigNumber } from "ethers";
import { BridgeType, Chain, TokenInfo, TransferPair, SourceChainTransferInfo } from "../constants/type";
import { readOnlyContract } from "./customReadyOnlyContractLoader";
import { validateTransferPair } from "../helpers/transferPairValidation";

import {
  Bridge__factory,
  Bridge,
  PeggedTokenBridge__factory,
  PeggedTokenBridge,
  PeggedTokenBridgeV2__factory,
  PeggedTokenBridgeV2,
  OriginalTokenVault__factory,
  OriginalTokenVaultV2__factory,
  OriginalTokenVaultV2,
  OriginalTokenVault,
} from "../typechain/typechain";
import { useWeb3Context } from "../providers/Web3ContextProvider";

export function useSourceChainTransferInfo(transferPair: TransferPair): {
  sourceChainTransferInfoCallback: null | (() => Promise<SourceChainTransferInfo>);
} {
  const { getNetworkById } = useWeb3Context();
  return useMemo(() => {
    if (transferPair.bridgeType === BridgeType.Null) {
      return { sourceChainTransferInfoCallback: null };
    }

    if (!validateTransferPair(transferPair)) {
      return { sourceChainTransferInfoCallback: null };
    }

    const sourceChainInfo = transferPair.sourceChainInfo;
    const sourceChainToken = transferPair.sourceChainToken;
    const sourceChainContractAddress = transferPair.sourceChainContractAddress;

    if (!sourceChainInfo || !sourceChainToken || !sourceChainContractAddress) {
      return { sourceChainTransferInfoCallback: null };
    }
    return {
      sourceChainTransferInfoCallback:
        async function onSourceChainTransferInfoFound(): Promise<SourceChainTransferInfo> {
          let maxAmountOnSourceChain = BigNumber.from(0);
          let minAmountOnSourceChain = BigNumber.from(0);
          const EVMSourceChainSafeGuard = await getSafeGuardInfoForEVMChainAsSourceChain(
            transferPair.bridgeType,
            sourceChainInfo,
            sourceChainToken,
            sourceChainContractAddress,
            getNetworkById,
          );
          maxAmountOnSourceChain = EVMSourceChainSafeGuard.maxAmount;
          minAmountOnSourceChain = EVMSourceChainSafeGuard.minAmount;

          return { maxAmount: maxAmountOnSourceChain, minAmount: minAmountOnSourceChain };
        },
    };
  }, [getNetworkById, transferPair]);
}

const getSafeGuardInfoForEVMChainAsSourceChain = async (
  bridgeType: BridgeType,
  sourceChainInfo: Chain,
  sourceChainToken: TokenInfo,
  sourceChainContractAddress: string,
  getNetworkById,
): Promise<SourceChainTransferInfo> => {
  let maxAmount = BigNumber.from(0);
  let minAmount = BigNumber.from(0);

  switch (bridgeType) {
    case BridgeType.Null: {
      throw new TypeError("Null Bridge Type");
    }

    case BridgeType.LiquidityPool: {
      const bridge = (await readOnlyContract(
        sourceChainInfo.id,
        sourceChainContractAddress,
        Bridge__factory,
        getNetworkById,
      )) as Bridge | undefined;
      if (bridge) {
        const maxAmountPromise = bridge.maxSend(sourceChainToken.token.address);
        const minAmountPromise = bridge.minSend(sourceChainToken.token.address);
        const result = await Promise.all([maxAmountPromise, minAmountPromise]);
        maxAmount = result[0];
        minAmount = result[1];
      } else {
        throw new TypeError("Failed to load source chain contract: " + sourceChainContractAddress);
      }
      break;
    }

    case BridgeType.PegDeposit: {
      const bridge = (await readOnlyContract(
        sourceChainInfo.id,
        sourceChainContractAddress,
        OriginalTokenVault__factory,
        getNetworkById,
      )) as OriginalTokenVault | undefined;
      if (bridge) {
        const parameters = await Promise.all([
          bridge.maxDeposit(sourceChainToken.token.address),
          bridge.minDeposit(sourceChainToken.token.address),
        ]);

        maxAmount = parameters[0];
        minAmount = parameters[1];
      } else {
        throw new TypeError("Failed to load source chain contract: " + sourceChainContractAddress);
      }
      break;
    }

    case BridgeType.PegV2Deposit: {
      const bridge = (await readOnlyContract(
        sourceChainInfo.id,
        sourceChainContractAddress,
        OriginalTokenVaultV2__factory,
        getNetworkById,
      )) as OriginalTokenVaultV2 | undefined;
      if (bridge) {
        const parameters = await Promise.all([
          bridge.maxDeposit(sourceChainToken.token.address),
          bridge.minDeposit(sourceChainToken.token.address),
        ]);
        maxAmount = parameters[0];
        minAmount = parameters[1];
      } else {
        throw new TypeError("Failed to load source chain contract: " + sourceChainContractAddress);
      }
      break;
    }

    case BridgeType.PegBurn: {
      const bridge = (await readOnlyContract(
        sourceChainInfo.id,
        sourceChainContractAddress,
        PeggedTokenBridge__factory,
        getNetworkById,
      )) as PeggedTokenBridge | undefined;
      if (bridge) {
        const parameters = await Promise.all([
          bridge.maxBurn(sourceChainToken.token.address),
          bridge.minBurn(sourceChainToken.token.address),
        ]);
        maxAmount = parameters[0];
        minAmount = parameters[1];
      } else {
        throw new TypeError("Failed to load source chain contract: " + sourceChainContractAddress);
      }
      break;
    }

    case BridgeType.PegV2Burn:
    case BridgeType.PegBurnMint: {
      const bridge = (await readOnlyContract(
        sourceChainInfo.id,
        sourceChainContractAddress,
        PeggedTokenBridgeV2__factory,
        getNetworkById,
      )) as PeggedTokenBridgeV2 | undefined;
      if (bridge) {
        const paramters = await Promise.all([
          bridge.maxBurn(sourceChainToken.token.address),
          bridge.minBurn(sourceChainToken.token.address),
        ]);

        maxAmount = paramters[0];
        minAmount = paramters[1];
      } else {
        throw new TypeError("Failed to load source chain contract: " + sourceChainContractAddress);
      }
      break;
    }

    default: {
      throw new TypeError("Unknown Bridge Type: " + bridgeType);
    }
  }

  return { minAmount, maxAmount };
};
