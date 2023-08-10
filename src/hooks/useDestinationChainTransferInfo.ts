import { useMemo } from "react";
import { BigNumber } from "ethers";
import { safeParseUnits } from "celer-web-utils/lib/format";
import { formatUnits } from "ethers/lib/utils";
import { BridgeType, Chain, DestinationChainTransferInfo, TokenInfo, TransferPair } from "../constants/type";
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
import { useWeb3Context } from "../providers/Web3ContextProvider";

export function useDestinationChainTransferInfo(transferPair: TransferPair): {
  destinationChainTransferInfoCallback: null | (() => Promise<DestinationChainTransferInfo>);
} {
  const { getNetworkById } = useWeb3Context();
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
            return getEVMDelayInfo(
              transferPair.bridgeType,
              transferPair.sourceChainToken.token.decimal,
              transferPair.destinationChainInfo,
              transferPair.destinationToken,
              transferPair.destinationChainContractAddress,
              transferPair.destinationChainContractVersion,
              getNetworkById,
            );
          }
          throw new TypeError("Transfer Pair info not ready");
        },
    };
  }, [getNetworkById, transferPair]);
}

const getEVMDelayInfo = async (
  bridgeType: BridgeType,
  sourceChainTokenDecimal: number,
  destinationChainInfo: Chain,
  destinationToken: TokenInfo,
  destinationChainContractAddress: string,
  destinationChainContractVersion: number,
  getNetworkById,
): Promise<DestinationChainTransferInfo> => {
  let delayThresholds = BigNumber.from(0);
  let delayPeriod = BigNumber.from(0);
  let epochVolumeCaps = BigNumber.from(0);
  switch (bridgeType) {
    case BridgeType.Null: {
      throw new TypeError("Null Bridge Type");
    }
    case BridgeType.LiquidityPool: {
      const bridge = (await readOnlyContract(
        destinationChainInfo.id,
        destinationChainContractAddress,
        Bridge__factory,
        getNetworkById,
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
        throw new TypeError("Failed to load destination chain contract: " + destinationChainContractAddress);
      }
      break;
    }
    case BridgeType.PegBurn:
    case BridgeType.PegV2Burn: {
      const bridge = (await readOnlyContract(
        destinationChainInfo.id,
        destinationChainContractAddress,
        destinationChainContractVersion > 0 ? OriginalTokenVaultV2__factory : OriginalTokenVault__factory,
        getNetworkById,
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
        destinationChainInfo.id,
        destinationChainContractAddress,
        destinationChainContractVersion > 0 ? PeggedTokenBridgeV2__factory : PeggedTokenBridge__factory,
        getNetworkById,
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
        destinationChainInfo.id,
        destinationChainContractAddress,
        PeggedTokenBridgeV2__factory,
        getNetworkById,
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
