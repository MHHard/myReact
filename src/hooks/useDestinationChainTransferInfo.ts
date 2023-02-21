import { useMemo } from "react";
import { BigNumber } from "ethers";
import { safeParseUnits } from "number-format-utils/lib/format";
import { formatUnits } from "ethers/lib/utils";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  BridgeTypeForBridgeConfig,
  Chain,
  DestinationChainTransferInfo,
  TokenInfoFromBridgeConfig,
  TransferPair,
} from "../constants/type";
import { getNonEVMMode, NonEVMMode } from "../helpers/nonEVMModeHelper";
import {
  burnConfigFromFlow,
  depositConfigFromFlow,
  getFlowDelayPeriodInMinute,
} from "../redux/NonEVMAPIs/flowAPIs";
import { readOnlyContract } from "./customReadyOnlyContractLoader";
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
import { validateTransferPair } from "../helpers/transferPairValidation";
import { getNetworkById } from "../constants/network";

export function useDestinationChainTransferInfo(transferPair: TransferPair): {
  destinationChainTransferInfoCallback:
    | null
    | (() => Promise<DestinationChainTransferInfo>);
} {
  return useMemo(() => {
    if (transferPair.bridgeType === BridgeTypeForBridgeConfig.Null) {
      return { destinationChainTransferInfoCallback: null };
    }
    if (!validateTransferPair(transferPair)) {
      return { destinationChainTransferInfoCallback: null };
    }
    return {
      destinationChainTransferInfoCallback:
        async function onDestinationChainTransferInfoFound(): Promise<DestinationChainTransferInfo> {
          if (
            transferPair.destinationToken &&
            transferPair.destinationChainInfo &&
            transferPair.destinationChainContractAddress &&
            transferPair.sourceChainToken?.token.decimals
          ) {
            const destinationNonEVMMode = getNonEVMMode(
              transferPair.destinationChainInfo.id
            );

            switch (destinationNonEVMMode) {
              case NonEVMMode.flowTest:
              case NonEVMMode.flowMainnet: {
                return getFlowDelayInfo(
                  transferPair.bridgeType,
                  transferPair.sourceChainToken.token.decimals,
                  transferPair.destinationToken,
                  transferPair.destinationChainContractAddress
                );
              }
              case NonEVMMode.terraTest:
              case NonEVMMode.terraMainnet: {
                throw new TypeError("TERRA NOT SUPPORTED");
              }
              case NonEVMMode.off: {
                return getEVMDelayInfo(
                  transferPair.bridgeType,
                  transferPair.sourceChainToken.token.decimals,
                  transferPair.destinationChainInfo,
                  transferPair.destinationToken,
                  transferPair.destinationChainContractAddress,
                  transferPair.destinationChainContractVersion
                );
              }
              default: {
                throw new TypeError(
                  "Unknown NonEVM Mode: " + destinationNonEVMMode
                );
              }
            }
          }
          throw new TypeError("Transfer Pair info not ready");
        },
    };
  }, [transferPair]);
}

const getFlowDelayInfo = async (
  bridgeType: BridgeTypeForBridgeConfig,
  sourceChainTokenDecimal: number,
  destinationToken: TokenInfoFromBridgeConfig,
  destinationChainContractAddress: string
): Promise<DestinationChainTransferInfo> => {
  let delayThresholdsInNumber = 0;
  let epochVolumeCapsInNumber = 0;

  switch (bridgeType) {
    case BridgeTypeForBridgeConfig.PegBurn:
    case BridgeTypeForBridgeConfig.PegV2Burn: {
      const depositConfig = await depositConfigFromFlow(
        destinationChainContractAddress ?? "",
        destinationToken.token.address
      );
      delayThresholdsInNumber = depositConfig.delayThreshold;
      epochVolumeCapsInNumber = depositConfig.cap;
      break;
    }
    case BridgeTypeForBridgeConfig.PegDeposit:
    case BridgeTypeForBridgeConfig.PegV2Deposit:
    case BridgeTypeForBridgeConfig.PegBurnMint: {
      const burnConfig = await burnConfigFromFlow(
        destinationChainContractAddress,
        destinationToken.token.address
      );
      delayThresholdsInNumber = burnConfig.delayThreshold;
      epochVolumeCapsInNumber = burnConfig.cap;
      break;
    }
    case BridgeTypeForBridgeConfig.LiquidityPool: {
      throw new TypeError("Flow should not support pool based transfer");
    }
    case BridgeTypeForBridgeConfig.Null: {
      throw new TypeError("Null Bridge Type");
    }
    default: {
      throw new TypeError("Unknown Bridge Type: " + bridgeType);
    }
  }

  const delayThresholds = safeParseUnits(
    delayThresholdsInNumber.toString() || "0",
    sourceChainTokenDecimal
  );
  const epochVolumeCaps = safeParseUnits(
    epochVolumeCapsInNumber.toString() || "0",
    sourceChainTokenDecimal
  )
    .mul(98)
    .div(100);

  const delayPeriod = await getFlowDelayPeriodInMinute(
    destinationChainContractAddress
  );

  return {
    delayPeriod: BigNumber.from(delayPeriod + 10),
    delayThresholds,
    epochVolumeCaps,
  };
};

const getEVMDelayInfo = async (
  bridgeType: BridgeTypeForBridgeConfig,
  sourceChainTokenDecimal: number,
  destinationChainInfo: Chain,
  destinationToken: TokenInfoFromBridgeConfig,
  destinationChainContractAddress: string,
  destinationChainContractVersion: number
): Promise<DestinationChainTransferInfo> => {
  let delayThresholds = BigNumber.from(0);
  let delayPeriod = BigNumber.from(0);
  let epochVolumeCaps = BigNumber.from(0);
  const provider = new JsonRpcProvider(
    getNetworkById(destinationChainInfo.id).rpcUrl
  );
  switch (bridgeType) {
    case BridgeTypeForBridgeConfig.Null: {
      throw new TypeError("Null Bridge Type");
    }
    case BridgeTypeForBridgeConfig.LiquidityPool: {
      const bridge = (await readOnlyContract(
        provider,
        destinationChainContractAddress,
        Bridge__factory
      )) as Bridge | undefined;
      if (bridge) {
        const bigAmounts = await Promise.all([
          bridge.delayPeriod(),
          bridge.delayThresholds(destinationToken.token.address),
          bridge.epochVolumeCaps(destinationToken.token.address),
        ]);
        delayPeriod = bigAmounts[0];
        delayThresholds = await bigAmounts[1];
        epochVolumeCaps = await bigAmounts[2];
      } else {
        throw new TypeError(
          "Failed to load destination chain contract: " +
            destinationChainContractAddress
        );
      }
      break;
    }
    case BridgeTypeForBridgeConfig.PegBurn:
    case BridgeTypeForBridgeConfig.PegV2Burn: {
      const bridge = (await readOnlyContract(
        provider,
        destinationChainContractAddress,
        destinationChainContractVersion > 0
          ? OriginalTokenVaultV2__factory
          : OriginalTokenVault__factory
      )) as OriginalTokenVaultV2 | OriginalTokenVault | undefined;
      if (bridge) {
        const parameters = await Promise.all([
          bridge.delayPeriod(),
          bridge.delayThresholds(destinationToken.token.address),
          bridge.epochVolumeCaps(destinationToken.token.address),
        ]);
        delayPeriod = parameters[0];
        delayThresholds = parameters[1];
        epochVolumeCaps = parameters[2];
      } else {
        throw new TypeError(
          "Failed to load destination chain contract: " +
            destinationChainContractAddress
        );
      }
      break;
    }
    case BridgeTypeForBridgeConfig.PegDeposit:
    case BridgeTypeForBridgeConfig.PegV2Deposit: {
      const bridge = (await readOnlyContract(
        provider,
        destinationChainContractAddress,
        destinationChainContractVersion > 0
          ? PeggedTokenBridgeV2__factory
          : PeggedTokenBridge__factory
      )) as PeggedTokenBridgeV2 | PeggedTokenBridge | undefined;
      if (bridge) {
        const parameters = await Promise.all([
          bridge.delayPeriod(),
          bridge.delayThresholds(destinationToken.token.address),
          bridge.epochVolumeCaps(destinationToken.token.address),
        ]);
        delayPeriod = parameters[0];
        delayThresholds = parameters[1];
        epochVolumeCaps = parameters[2];
      } else {
        throw new TypeError(
          "Failed to load destination chain contract: " +
            destinationChainContractAddress
        );
      }
      break;
    }
    case BridgeTypeForBridgeConfig.PegBurnMint: {
      const bridge = (await readOnlyContract(
        provider,
        destinationChainContractAddress,
        PeggedTokenBridgeV2__factory
      )) as PeggedTokenBridgeV2 | undefined;
      if (bridge) {
        const parameters = await Promise.all([
          bridge.delayPeriod(),
          bridge.delayThresholds(destinationToken.token.address),
          bridge.epochVolumeCaps(destinationToken.token.address),
        ]);
        delayPeriod = parameters[0];
        delayThresholds = parameters[1];
        epochVolumeCaps = parameters[2];
      } else {
        throw new TypeError(
          "Failed to load destination chain contract: " +
            destinationChainContractAddress
        );
      }
      break;
    }
    default: {
      throw new TypeError("Unknown Bridge Type: " + bridgeType);
    }
  }

  delayThresholds = safeParseUnits(
    formatUnits(delayThresholds, destinationToken.token.decimals),
    sourceChainTokenDecimal
  );

  delayPeriod = delayPeriod.div(60).add(10);

  epochVolumeCaps = safeParseUnits(
    formatUnits(epochVolumeCaps, destinationToken.token.decimals),
    sourceChainTokenDecimal
  )
    .mul(98)
    .div(100);

  return { delayPeriod, delayThresholds, epochVolumeCaps };
};
