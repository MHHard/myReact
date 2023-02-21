import { BigNumber } from "ethers";
import { useMemo, useState } from "react";
import {
  BridgeTypeForBridgeConfig,
  CoMinterCap,
  DestinationChainTransferInfo,
  SourceChainTransferInfo,
  TransferPair,
} from "../constants/type";
import { validateTransferPair } from "../helpers/transferPairValidation";
import { useBridgeChainTokensContext } from "../providers/BridgeChainTokensProvider";
import { useCoMinterCaps } from "./useCoMinterCaps";
import { useDestinationChainTransferInfo } from "./useDestinationChainTransferInfo";
import {
  useIsWrapTokenTransferAtLimit,
  WrapTokenCaps,
} from "./useIsWrapTokenTransferAtLimit";
import {
  useBurnSwapTotalSupply,
  useInBoundTokenLimit,
} from "./useBurnSwapTotalSupply";
import { useSourceChainTransferInfo } from "./useSourceChainTransferInfo";

export interface SafeGuardParmeters {
  destinationChainDelayThresholds: BigNumber;
  destinationChainDelayTimeInMinutes: string;
  transferSourceChainTokenDecimal: number;
  coMinterBurnCaps: BigNumber;
  burnSwapTotalSupplyLimit: BigNumber | undefined;
  tokenInBoundLimit: BigNumber;
  wrapTokenCap: BigNumber;
  maxSendValue: BigNumber | undefined;
  minSendValue: BigNumber | undefined;
  transferPairSnapshot: string;
}

export interface SafeGuardResult {
  safeGuardParameters: SafeGuardParmeters | undefined;
  safeguardException: Error | undefined;
  isSafeGuardTaskInProgress: boolean;
}

export function useSafeGuardCheck(transferPair: TransferPair): SafeGuardResult {
  const { sourceChainTransferInfoCallback } =
    useSourceChainTransferInfo(transferPair);
  const { destinationChainTransferInfoCallback } =
    useDestinationChainTransferInfo(transferPair);
  const { coMinterCapCallback } = useCoMinterCaps(transferPair);
  const { burnSwapTotalSupplyCallback } = useBurnSwapTotalSupply(transferPair);
  const { inBoundTokenLimitCallback } = useInBoundTokenLimit(transferPair);
  const { onWrapTokenLiquidityCallback } =
    useIsWrapTokenTransferAtLimit(transferPair);
  const { getTransferSnapshot } = useBridgeChainTokensContext();

  const [safeGuardResult, setSafeGuardResult] = useState<SafeGuardResult>({
    safeGuardParameters: undefined,
    safeguardException: undefined,
    isSafeGuardTaskInProgress: true,
  });

  useMemo(() => {
    // reset safeguard before the new quering
    setSafeGuardResult({
      safeGuardParameters: undefined,
      safeguardException: undefined,
      isSafeGuardTaskInProgress: true,
    });

    if (!validateTransferPair(transferPair)) {
      return;
    }

    if (transferPair.bridgeType === BridgeTypeForBridgeConfig.LiquidityPool) {
      return;
    }

    if (
      !sourceChainTransferInfoCallback &&
      !destinationChainTransferInfoCallback &&
      !coMinterCapCallback &&
      !burnSwapTotalSupplyCallback &&
      !inBoundTokenLimitCallback &&
      !onWrapTokenLiquidityCallback
    ) {
      return;
    }

    const getTransferInfoConfigs = async () => {
      let sourceChainMinAmount = BigNumber.from(0);
      let sourceChainMaxAmount = BigNumber.from(0);
      let destinationEpochVolumeCaps = BigNumber.from(0);

      let sourceChainInfoPromise: Promise<SourceChainTransferInfo>;
      let destinationChainInfoPromise: Promise<DestinationChainTransferInfo>;
      let coMinterCapPromise: Promise<CoMinterCap>;
      let burnSwapTotalSupplyPromise: Promise<BigNumber | undefined>;
      let inBoundTokenLimitPromise: Promise<BigNumber>;
      let wrapTokenCapPromise: Promise<WrapTokenCaps>;

      if (sourceChainTransferInfoCallback) {
        sourceChainInfoPromise = sourceChainTransferInfoCallback();
      } else {
        sourceChainInfoPromise = Promise.resolve({
          minAmount: BigNumber.from(0),
          maxAmount: BigNumber.from(0),
        });
      }

      if (destinationChainTransferInfoCallback) {
        destinationChainInfoPromise = destinationChainTransferInfoCallback();
      } else {
        destinationChainInfoPromise = Promise.resolve({
          delayPeriod: BigNumber.from(0),
          delayThresholds: BigNumber.from(0),
          epochVolumeCaps: BigNumber.from(0),
        });
      }

      if (coMinterCapCallback) {
        coMinterCapPromise = coMinterCapCallback();
      } else {
        coMinterCapPromise = Promise.resolve({
          minterSupply: BigNumber.from(0),
        });
      }

      if (burnSwapTotalSupplyCallback) {
        burnSwapTotalSupplyPromise = burnSwapTotalSupplyCallback();
      } else {
        burnSwapTotalSupplyPromise = Promise.resolve(undefined);
      }

      if (inBoundTokenLimitCallback) {
        inBoundTokenLimitPromise = inBoundTokenLimitCallback();
      } else {
        inBoundTokenLimitPromise = Promise.resolve(BigNumber.from(0));
      }

      if (onWrapTokenLiquidityCallback) {
        wrapTokenCapPromise = onWrapTokenLiquidityCallback();
      } else {
        wrapTokenCapPromise = Promise.resolve({
          totalLiquidity: BigNumber.from(0),
        });
      }

      const checkSafeguardStart = new Date().getTime();

      Promise.all([
        sourceChainInfoPromise,
        destinationChainInfoPromise,
        coMinterCapPromise,
        burnSwapTotalSupplyPromise,
        inBoundTokenLimitPromise,
        wrapTokenCapPromise,
      ])
        .then((value) => {
          const sourceChainInfo = value[0];
          const destinationChainInfo = value[1];
          const coMinterInfo = value[2];
          const burnSwapTotalSupplyInfo = value[3];
          const inboundTokenLimitInfo = value[4];
          const wrapTokenCapInfo = value[5];

          sourceChainMinAmount = sourceChainInfo.minAmount;
          sourceChainMaxAmount = sourceChainInfo.maxAmount;
          destinationEpochVolumeCaps = destinationChainInfo.epochVolumeCaps;

          let minSend: BigNumber | undefined;
          let maxSend: BigNumber | undefined;

          if (sourceChainMinAmount.gt(0)) {
            minSend = sourceChainInfo?.minAmount;
          }

          if (sourceChainMaxAmount.gt(0) && destinationEpochVolumeCaps.gt(0)) {
            maxSend = sourceChainMaxAmount.lte(destinationEpochVolumeCaps)
              ? sourceChainMaxAmount
              : destinationEpochVolumeCaps;
          } else if (sourceChainMaxAmount.gt(0)) {
            maxSend = sourceChainMaxAmount;
          } else if (destinationEpochVolumeCaps.gt(0)) {
            maxSend = destinationEpochVolumeCaps;
          } else {
            // setExceedsSafeguard(false);
            maxSend = undefined;
          }

          const parameters: SafeGuardParmeters = {
            destinationChainDelayThresholds:
              destinationChainInfo.delayThresholds,
            destinationChainDelayTimeInMinutes:
              destinationChainInfo.delayPeriod.toString(),
            transferSourceChainTokenDecimal:
              transferPair.sourceChainToken?.token.decimals ?? 18,
            coMinterBurnCaps: coMinterInfo.minterSupply,
            burnSwapTotalSupplyLimit: burnSwapTotalSupplyInfo,
            tokenInBoundLimit: inboundTokenLimitInfo,
            wrapTokenCap: wrapTokenCapInfo.totalLiquidity,
            maxSendValue: maxSend,
            minSendValue: minSend,
            transferPairSnapshot: getTransferSnapshot(transferPair),
          };

          setSafeGuardResult({
            safeGuardParameters: parameters,
            safeguardException: undefined,
            isSafeGuardTaskInProgress: false,
          });

          const checkSafeguardFinished = new Date().getTime();
          console.log(
            "[performance][safeguardCheck][" +
              transferPair.sourceChainToken?.token.symbol +
              "] : " +
              (checkSafeguardFinished - checkSafeguardStart)
          );
        })
        .catch((e) => {
          setSafeGuardResult({
            safeGuardParameters: undefined,
            safeguardException: e,
            isSafeGuardTaskInProgress: false,
          });
        });
    };
    getTransferInfoConfigs();
  }, [
    sourceChainTransferInfoCallback,
    destinationChainTransferInfoCallback,
    coMinterCapCallback,
    burnSwapTotalSupplyCallback,
    inBoundTokenLimitCallback,
    onWrapTokenLiquidityCallback,
    transferPair,
    getTransferSnapshot,
  ]);

  // console.log("safeGuardResult",safeGuardResult)
  return safeGuardResult;
}
