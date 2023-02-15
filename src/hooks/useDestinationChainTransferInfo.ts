import { useMemo } from "react";
import { BigNumber } from "ethers";
import { safeParseUnits } from "celer-web-utils/lib/format";
import { formatUnits } from "ethers/lib/utils";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BridgeType, Chain, DestinationChainTransferInfo, TokenInfo, TransferPair } from "../constants/type";
import { getNonEVMMode, NonEVMMode } from "../providers/NonEVMContextProvider";
import { burnConfigFromFlow, depositConfigFromFlow, getFlowDelayPeriodInMinute } from "../redux/NonEVMAPIs/flowAPIs";
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
} from "../typechain/typechain";
import { validateTransferPair } from "../helpers/transferPairValidation";
import { getNetworkById } from "../constants/network";
import {
  getAptosDelayPeriodInfo,
  getAptosOriginalVaultSafeGuardingInfo,
  getAptosPeggedBridgeSafeGuardingInfo,
} from "../redux/NonEVMAPIs/aptosAPIs";
import { getSeiSafeGuardingInfo } from "../redux/NonEVMAPIs/seiAPI";
import { getInjSafeGuardingInfo } from "../redux/NonEVMAPIs/injectiveAPI";

export function useDestinationChainTransferInfo(transferPair: TransferPair): {
  destinationChainTransferInfoCallback: null | (() => Promise<DestinationChainTransferInfo>);
} {
  return useMemo(() => {
    if (transferPair.bridgeType === BridgeType.Null) {
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
            transferPair.sourceChainToken?.token.decimal
          ) {
            const destinationNonEVMMode = getNonEVMMode(transferPair.destinationChainInfo.id);

            switch (destinationNonEVMMode) {
              case NonEVMMode.flowTest:
              case NonEVMMode.flowMainnet: {
                return getFlowDelayInfo(
                  transferPair.bridgeType,
                  transferPair.sourceChainToken.token.decimal,
                  transferPair.destinationToken,
                  transferPair.destinationChainContractAddress,
                );
              }
              case NonEVMMode.aptosMainnet:
              case NonEVMMode.aptosTest:
              case NonEVMMode.aptosDevnet: {
                return getAptosDelayInfo(
                  transferPair.bridgeType,
                  transferPair.sourceChainToken.token.decimal,
                  transferPair.destinationToken,
                  transferPair.destinationChainContractAddress,
                );
              }
              case NonEVMMode.seiMainnet:
              case NonEVMMode.seiDevnet:
              case NonEVMMode.seiTestnet: {
                return getSeiDelayInfo(
                  transferPair.bridgeType,
                  transferPair.sourceChainToken.token.decimal,
                  transferPair.destinationToken,
                  transferPair.destinationChainContractAddress,
                );
              }
              case NonEVMMode.injectiveTestnet:
              case NonEVMMode.injectiveMainnet: {
                return getInjDelayInfo(
                  transferPair.bridgeType,
                  transferPair.sourceChainToken.token.decimal,
                  transferPair.destinationToken,
                  transferPair.destinationChainContractAddress,
                );
              }
              case NonEVMMode.off: {
                return getEVMDelayInfo(
                  transferPair.bridgeType,
                  transferPair.sourceChainToken.token.decimal,
                  transferPair.destinationChainInfo,
                  transferPair.destinationToken,
                  transferPair.destinationChainContractAddress,
                  transferPair.destinationChainContractVersion,
                );
              }
              default: {
                throw new TypeError("Unknown NonEVM Mode: " + destinationNonEVMMode);
              }
            }
          }
          throw new TypeError("Transfer Pair info not ready");
        },
    };
  }, [transferPair]);
}

const getFlowDelayInfo = async (
  bridgeType: BridgeType,
  sourceChainTokenDecimal: number,
  destinationToken: TokenInfo,
  destinationChainContractAddress: string,
): Promise<DestinationChainTransferInfo> => {
  let delayThresholdsInNumber = 0;
  let epochVolumeCapsInNumber = 0;

  switch (bridgeType) {
    case BridgeType.PegBurn:
    case BridgeType.PegV2Burn: {
      const depositConfig = await depositConfigFromFlow(
        destinationChainContractAddress ?? "",
        destinationToken.token.address,
      );
      delayThresholdsInNumber = depositConfig.delayThreshold;
      epochVolumeCapsInNumber = depositConfig.cap;
      break;
    }
    case BridgeType.PegDeposit:
    case BridgeType.PegV2Deposit:
    case BridgeType.PegBurnMint: {
      const burnConfig = await burnConfigFromFlow(destinationChainContractAddress, destinationToken.token.address);
      delayThresholdsInNumber = burnConfig.delayThreshold;
      epochVolumeCapsInNumber = burnConfig.cap;
      break;
    }
    case BridgeType.LiquidityPool: {
      throw new TypeError("Flow should not support pool based transfer");
    }
    case BridgeType.Null: {
      throw new TypeError("Null Bridge Type");
    }
    default: {
      throw new TypeError("Unknown Bridge Type: " + bridgeType);
    }
  }

  const delayThresholds = safeParseUnits(delayThresholdsInNumber.toString() || "0", sourceChainTokenDecimal);
  const epochVolumeCaps = safeParseUnits(epochVolumeCapsInNumber.toString() || "0", sourceChainTokenDecimal)
    .mul(98)
    .div(100);

  const delayPeriod = await getFlowDelayPeriodInMinute(destinationChainContractAddress);

  return { delayPeriod: BigNumber.from(delayPeriod + 10), delayThresholds, epochVolumeCaps };
};

const getEVMDelayInfo = async (
  bridgeType: BridgeType,
  sourceChainTokenDecimal: number,
  destinationChainInfo: Chain,
  destinationToken: TokenInfo,
  destinationChainContractAddress: string,
  destinationChainContractVersion: number,
): Promise<DestinationChainTransferInfo> => {
  let delayThresholds = BigNumber.from(0);
  let delayPeriod = BigNumber.from(0);
  let epochVolumeCaps = BigNumber.from(0);
  const provider = new JsonRpcProvider(getNetworkById(destinationChainInfo.id).rpcUrl);
  switch (bridgeType) {
    case BridgeType.Null: {
      throw new TypeError("Null Bridge Type");
    }
    case BridgeType.LiquidityPool: {
      const bridge = (await readOnlyContract(provider, destinationChainContractAddress, Bridge__factory)) as
        | Bridge
        | undefined;
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
        throw new TypeError("Failed to load destination chain contract: " + destinationChainContractAddress);
      }
      break;
    }
    case BridgeType.PegBurn:
    case BridgeType.PegV2Burn: {
      const bridge = (await readOnlyContract(
        provider,
        destinationChainContractAddress,
        destinationChainContractVersion > 0 ? OriginalTokenVaultV2__factory : OriginalTokenVault__factory,
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
        throw new TypeError("Failed to load destination chain contract: " + destinationChainContractAddress);
      }
      break;
    }
    case BridgeType.PegDeposit:
    case BridgeType.PegV2Deposit: {
      const bridge = (await readOnlyContract(
        provider,
        destinationChainContractAddress,
        destinationChainContractVersion > 0 ? PeggedTokenBridgeV2__factory : PeggedTokenBridge__factory,
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
        throw new TypeError("Failed to load destination chain contract: " + destinationChainContractAddress);
      }
      break;
    }
    case BridgeType.PegBurnMint: {
      const bridge = (await readOnlyContract(
        provider,
        destinationChainContractAddress,
        PeggedTokenBridgeV2__factory,
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
        throw new TypeError("Failed to load destination chain contract: " + destinationChainContractAddress);
      }
      break;
    }
    default: {
      throw new TypeError("Unknown Bridge Type: " + bridgeType);
    }
  }

  delayThresholds = safeParseUnits(
    formatUnits(delayThresholds, destinationToken.token.decimal),
    sourceChainTokenDecimal,
  );

  delayPeriod = delayPeriod.div(60).add(10);

  epochVolumeCaps = safeParseUnits(
    formatUnits(epochVolumeCaps, destinationToken.token.decimal),
    sourceChainTokenDecimal,
  )
    .mul(98)
    .div(100);

  return { delayPeriod, delayThresholds, epochVolumeCaps };
};

const getAptosDelayInfo = async (
  bridgeType: BridgeType,
  sourceChainTokenDecimal: number,
  destinationToken: TokenInfo,
  destinationChainContractAddress: string,
): Promise<DestinationChainTransferInfo> => {
  let delayThresholdsInNumber = "0";
  let epochVolumeCapsInNumber = "0";

  switch (bridgeType) {
    case BridgeType.PegBurn:
    case BridgeType.PegV2Burn: {
      const safeGuardingInfo = await getAptosOriginalVaultSafeGuardingInfo(
        destinationChainContractAddress,
        destinationToken.token.address,
      );
      delayThresholdsInNumber = safeGuardingInfo.delay_threshold;
      epochVolumeCapsInNumber = safeGuardingInfo.vol_cap;
      break;
    }
    case BridgeType.PegDeposit:
    case BridgeType.PegV2Deposit:
    case BridgeType.PegBurnMint: {
      const safeGuardingInfo = await getAptosPeggedBridgeSafeGuardingInfo(
        destinationChainContractAddress,
        destinationToken.token.address,
      );
      delayThresholdsInNumber = safeGuardingInfo.delay_threshold;
      epochVolumeCapsInNumber = safeGuardingInfo.vol_cap;
      break;
    }
    case BridgeType.LiquidityPool: {
      throw new TypeError("Aptos should not support pool based transfer");
    }
    case BridgeType.Null: {
      throw new TypeError("Null Bridge Type");
    }
    default: {
      throw new TypeError("Unknown Bridge Type: " + bridgeType);
    }
  }

  const delayThresholds = safeParseUnits(
    formatUnits(delayThresholdsInNumber, destinationToken.token.decimal),
    sourceChainTokenDecimal,
  );

  const epochVolumeCaps = safeParseUnits(
    formatUnits(epochVolumeCapsInNumber, destinationToken.token.decimal),
    sourceChainTokenDecimal,
  )
    .mul(98)
    .div(100);

  const delayPeriod = ((await getAptosDelayPeriodInfo(destinationChainContractAddress)) ?? 1800) / 60;

  return { delayPeriod: BigNumber.from(delayPeriod + 10), delayThresholds, epochVolumeCaps };
};

const getSeiDelayInfo = async (
  bridgeType: BridgeType,
  sourceChainTokenDecimal: number,
  destinationToken: TokenInfo,
  destinationChainContractAddress: string,
): Promise<DestinationChainTransferInfo> => {
  let delayThresholdsInNumber = "0";
  let epochVolumeCapsInNumber = "0";
  let delayPeriodInSecond = 0;

  switch (bridgeType) {
    case BridgeType.PegBurn:
    case BridgeType.PegV2Burn:
    case BridgeType.PegDeposit:
    case BridgeType.PegV2Deposit:
    case BridgeType.PegBurnMint: {
      const safeGuardingInfo = await getSeiSafeGuardingInfo(
        destinationChainContractAddress,
        destinationToken.token.address,
      );
      delayThresholdsInNumber = safeGuardingInfo.delay_threshold;
      epochVolumeCapsInNumber = safeGuardingInfo.vol_cap;
      delayPeriodInSecond = safeGuardingInfo.delay_period;
      break;
    }
    case BridgeType.LiquidityPool: {
      throw new TypeError("Sei should not support pool based transfer");
    }
    case BridgeType.Null: {
      throw new TypeError("Null Bridge Type");
    }
    default: {
      throw new TypeError("Unknown Bridge Type: " + bridgeType);
    }
  }

  const delayThresholds = safeParseUnits(
    formatUnits(delayThresholdsInNumber, destinationToken.token.decimal),
    sourceChainTokenDecimal,
  );

  const epochVolumeCaps = safeParseUnits(
    formatUnits(epochVolumeCapsInNumber, destinationToken.token.decimal),
    sourceChainTokenDecimal,
  )
    .mul(98)
    .div(100);
  let delayPeriodInMin = delayPeriodInSecond;
  delayPeriodInMin = Math.floor(delayPeriodInSecond / 60) + 10;
  return { delayPeriod: delayPeriodInMin.toString(), delayThresholds, epochVolumeCaps };
};
const getInjDelayInfo = async (
  bridgeType: BridgeType,
  sourceChainTokenDecimal: number,
  destinationToken: TokenInfo,
  destinationChainContractAddress: string,
): Promise<DestinationChainTransferInfo> => {
  let delayThresholdsInNumber = "0";
  let epochVolumeCapsInNumber = "0";
  let delayPeriodInSecond = 0;

  switch (bridgeType) {
    case BridgeType.PegBurn:
    case BridgeType.PegV2Burn:
    case BridgeType.PegDeposit:
    case BridgeType.PegV2Deposit:
    case BridgeType.PegBurnMint: {
      const safeGuardingInfo = await getInjSafeGuardingInfo(
        destinationChainContractAddress,
        destinationToken.token.address,
      );
      delayThresholdsInNumber = safeGuardingInfo.delay_threshold;
      epochVolumeCapsInNumber = safeGuardingInfo.vol_cap;
      delayPeriodInSecond = safeGuardingInfo.delay_period;
      break;
    }
    case BridgeType.LiquidityPool: {
      throw new TypeError("Sei should not support pool based transfer");
    }
    case BridgeType.Null: {
      throw new TypeError("Null Bridge Type");
    }
    default: {
      throw new TypeError("Unknown Bridge Type: " + bridgeType);
    }
  }

  const delayThresholds = safeParseUnits(
    formatUnits(delayThresholdsInNumber, destinationToken.token.decimal),
    sourceChainTokenDecimal,
  );

  const epochVolumeCaps = safeParseUnits(
    formatUnits(epochVolumeCapsInNumber, destinationToken.token.decimal),
    sourceChainTokenDecimal,
  )
    .mul(98)
    .div(100);
  let delayPeriodInMin = delayPeriodInSecond;
  delayPeriodInMin = Math.floor(delayPeriodInSecond / 60) + 10;
  return { delayPeriod: delayPeriodInMin.toString(), delayThresholds, epochVolumeCaps };
};
