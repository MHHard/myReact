import { useMemo } from "react";
import { BigNumber } from "ethers";
import { safeParseUnits } from "number-format-utils/lib/format";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  BridgeTypeForBridgeConfig,
  Chain,
  TokenInfoFromBridgeConfig,
  TransferPair,
  SourceChainTransferInfo,
} from "../constants/type";
import { getNonEVMMode, NonEVMMode } from "../helpers/nonEVMModeHelper";
import {
  burnConfigFromFlow,
  depositConfigFromFlow,
} from "../redux/NonEVMAPIs/flowAPIs";
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
} from "../typechain";
import { getNetworkById } from "../constants/network";

export function useSourceChainTransferInfo(transferPair: TransferPair): {
  sourceChainTransferInfoCallback:
    | null
    | (() => Promise<SourceChainTransferInfo>);
} {
  return useMemo(() => {
    if (transferPair.bridgeType === BridgeTypeForBridgeConfig.Null) {
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

          const sourceChainNonEVMMode = getNonEVMMode(sourceChainInfo.id);

          switch (sourceChainNonEVMMode) {
            case NonEVMMode.flowTest:
            case NonEVMMode.flowMainnet: {
              const flowAsSourceChainSafeGuard =
                await getSafeGuardInfoForFlowAsSourceChain(
                  transferPair.bridgeType,
                  sourceChainToken,
                  sourceChainContractAddress
                );

              maxAmountOnSourceChain = flowAsSourceChainSafeGuard.maxAmount;
              minAmountOnSourceChain = flowAsSourceChainSafeGuard.minAmount;
              break;
            }
            case NonEVMMode.terraTest:
            case NonEVMMode.terraMainnet: {
              console.error("Terra Not Available", transferPair);
              break;
            }
            case NonEVMMode.off: {
              const EVMSourceChainSafeGuard =
                await getSafeGuardInfoForEVMChainAsSourceChain(
                  transferPair.bridgeType,
                  sourceChainInfo,
                  sourceChainToken,
                  sourceChainContractAddress
                );
              maxAmountOnSourceChain = EVMSourceChainSafeGuard.maxAmount;
              minAmountOnSourceChain = EVMSourceChainSafeGuard.minAmount;
              break;
            }
            default: {
              console.error("Unsupported NonEVM Mode", sourceChainNonEVMMode);
              throw new TypeError("Unsupported NonEVM Mode");
            }
          }

          return {
            maxAmount: maxAmountOnSourceChain,
            minAmount: minAmountOnSourceChain,
          };
        },
    };
  }, [transferPair]);
}

const getSafeGuardInfoForFlowAsSourceChain = async (
  bridgeType: BridgeTypeForBridgeConfig,
  sourceChainToken: TokenInfoFromBridgeConfig,
  sourceChainContractAddress: string
): Promise<SourceChainTransferInfo> => {
  let maxAmount = BigNumber.from(0);
  let minAmount = BigNumber.from(0);
  switch (bridgeType) {
    case BridgeTypeForBridgeConfig.Null: {
      throw new TypeError("Null Bridge Type");
    }

    case BridgeTypeForBridgeConfig.LiquidityPool: {
      throw new TypeError("Flow should not support pool based transfer");
    }

    case BridgeTypeForBridgeConfig.PegBurn:
    case BridgeTypeForBridgeConfig.PegV2Burn:
    case BridgeTypeForBridgeConfig.PegBurnMint: {
      const tokenConfig = await burnConfigFromFlow(
        sourceChainContractAddress,
        sourceChainToken.token.address
      );
      maxAmount = safeParseUnits(
        tokenConfig.maxBurn.toString() || "0",
        sourceChainToken.token.decimals
      );
      minAmount = safeParseUnits(
        tokenConfig.minBurn.toString() || "0",
        sourceChainToken.token.decimals
      );
      break;
    }

    case BridgeTypeForBridgeConfig.PegDeposit:
    case BridgeTypeForBridgeConfig.PegV2Deposit: {
      const tokenConfig = await depositConfigFromFlow(
        sourceChainContractAddress,
        sourceChainToken.token.address
      );
      maxAmount = safeParseUnits(
        tokenConfig.maxDepo.toString() || "0",
        sourceChainToken.token.decimals
      );
      minAmount = safeParseUnits(
        tokenConfig.minDepo.toString() || "0",
        sourceChainToken.token.decimals
      );
      break;
    }

    default: {
      throw new TypeError("Unknown Bridge Type: " + bridgeType);
    }
  }
  return { minAmount, maxAmount };
};

const getSafeGuardInfoForEVMChainAsSourceChain = async (
  bridgeType: BridgeTypeForBridgeConfig,
  sourceChainInfo: Chain,
  sourceChainToken: TokenInfoFromBridgeConfig,
  sourceChainContractAddress: string
): Promise<SourceChainTransferInfo> => {
  let maxAmount = BigNumber.from(0);
  let minAmount = BigNumber.from(0);

  const provider = new JsonRpcProvider(
    getNetworkById(sourceChainInfo.id).rpcUrl
  );

  switch (bridgeType) {
    case BridgeTypeForBridgeConfig.Null: {
      throw new TypeError("Null Bridge Type");
    }

    case BridgeTypeForBridgeConfig.LiquidityPool: {
      const bridge = (await readOnlyContract(
        provider,
        sourceChainContractAddress,
        Bridge__factory
      )) as Bridge | undefined;
      if (bridge) {
        const maxAmountPromise = bridge.maxSend(sourceChainToken.token.address);
        const minAmountPromise = bridge.minSend(sourceChainToken.token.address);
        const result = await Promise.all([maxAmountPromise, minAmountPromise]);
        maxAmount = result[0];
        minAmount = result[1];
      } else {
        throw new TypeError(
          "Failed to load source chain contract: " + sourceChainContractAddress
        );
      }
      break;
    }

    case BridgeTypeForBridgeConfig.PegDeposit: {
      const bridge = (await readOnlyContract(
        provider,
        sourceChainContractAddress,
        OriginalTokenVault__factory
      )) as OriginalTokenVault | undefined;
      if (bridge) {
        const parameters = await Promise.all([
          bridge.maxDeposit(sourceChainToken.token.address),
          bridge.minDeposit(sourceChainToken.token.address),
        ]);

        maxAmount = parameters[0];
        minAmount = parameters[1];
      } else {
        throw new TypeError(
          "Failed to load source chain contract: " + sourceChainContractAddress
        );
      }
      break;
    }

    case BridgeTypeForBridgeConfig.PegV2Deposit: {
      const bridge = (await readOnlyContract(
        provider,
        sourceChainContractAddress,
        OriginalTokenVaultV2__factory
      )) as OriginalTokenVaultV2 | undefined;
      if (bridge) {
        const parameters = await Promise.all([
          bridge.maxDeposit(sourceChainToken.token.address),
          bridge.minDeposit(sourceChainToken.token.address),
        ]);
        maxAmount = parameters[0];
        minAmount = parameters[1];
      } else {
        throw new TypeError(
          "Failed to load source chain contract: " + sourceChainContractAddress
        );
      }
      break;
    }

    case BridgeTypeForBridgeConfig.PegBurn: {
      const bridge = (await readOnlyContract(
        provider,
        sourceChainContractAddress,
        PeggedTokenBridge__factory
      )) as PeggedTokenBridge | undefined;
      if (bridge) {
        const parameters = await Promise.all([
          bridge.maxBurn(sourceChainToken.token.address),
          bridge.minBurn(sourceChainToken.token.address),
        ]);
        maxAmount = parameters[0];
        minAmount = parameters[1];
      } else {
        throw new TypeError(
          "Failed to load source chain contract: " + sourceChainContractAddress
        );
      }
      break;
    }

    case BridgeTypeForBridgeConfig.PegV2Burn:
    case BridgeTypeForBridgeConfig.PegBurnMint: {
      const bridge = (await readOnlyContract(
        provider,
        sourceChainContractAddress,
        PeggedTokenBridgeV2__factory
      )) as PeggedTokenBridgeV2 | undefined;
      if (bridge) {
        const paramters = await Promise.all([
          bridge.maxBurn(sourceChainToken.token.address),
          bridge.minBurn(sourceChainToken.token.address),
        ]);

        maxAmount = paramters[0];
        minAmount = paramters[1];
      } else {
        throw new TypeError(
          "Failed to load source chain contract: " + sourceChainContractAddress
        );
      }
      break;
    }

    default: {
      throw new TypeError("Unknown Bridge Type: " + bridgeType);
    }
  }

  return { minAmount, maxAmount };
};
