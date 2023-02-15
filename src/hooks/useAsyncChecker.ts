import { BigNumber } from "ethers";
import { useMemo, useState } from "react";
import { LPCheckpair, ChainSafeguardInfo, ChainDelayInfo } from "../constants/type";
import { useDelayInfo } from "./useDelayInfo";
import { useSafeguardInfo } from "./useSafeguardInfo";

export interface SafeGuardParmeters {
  chainDelayThresholds: string;
  chainDelayTimeInMinutes: string;
  maxSendValue: BigNumber | undefined;
  minSendValue: BigNumber | undefined;
  isBigAmountDelayed: boolean;
  currentEpochVolume: BigNumber | undefined;
  lastOpTimestamps: BigNumber | undefined;
}

export interface SafeGuardResult {
  safeGuardParameters: SafeGuardParmeters | undefined;
  safeguardException: Error | undefined;
  isSafeGuardTaskInProgress: boolean;
}
export const validateTransferPair = (checkPair: LPCheckpair): boolean => {
  if (
    checkPair.amount &&
    checkPair.amount !== "0" &&
    checkPair.chainInfo &&
    checkPair.chainToken &&
    checkPair.chainContractAddress &&
    checkPair.chainContractAddress.length > 0
  ) {
    return true;
  }

  return false;
};

export function useAsyncChecker(checkPair: LPCheckpair): SafeGuardResult {
  const { chainSafeguardInfoCallback } = useSafeguardInfo(checkPair);
  const { chainDelayInfoCallback } = useDelayInfo(checkPair);

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

    if (!validateTransferPair(checkPair)) {
      return;
    }

    if (!chainSafeguardInfoCallback && !chainDelayInfoCallback) {
      return;
    }

    const getTransferInfoConfigs = async () => {
      let chainMinAmount = BigNumber.from(0);
      let chainMaxAmount = BigNumber.from(0);
      let chainEpochVolumeCaps = BigNumber.from(0);
      let safeguardInfoPromise: Promise<ChainSafeguardInfo>;
      let delayInfoPromise: Promise<ChainDelayInfo>;

      if (chainSafeguardInfoCallback) {
        safeguardInfoPromise = chainSafeguardInfoCallback();
      } else {
        safeguardInfoPromise = Promise.resolve({
          minAmount: BigNumber.from(0),
          maxAmount: BigNumber.from(0),
          epochVolumeCaps: BigNumber.from(0),
          epochVolumes: BigNumber.from(0),
          lastOpTimestamps: BigNumber.from(0),
        });
      }

      if (chainDelayInfoCallback) {
        delayInfoPromise = chainDelayInfoCallback();
      } else {
        delayInfoPromise = Promise.resolve({
          delayPeriod: "0",
          delayThresholds: "0",
          isBigAmountDelayed: false,
        });
      }
      const checkSafeguardStart = new Date().getTime();

      Promise.all([safeguardInfoPromise, delayInfoPromise])
        .then(value => {
          const safeguardChainInfo = value[0];
          const delayChainInfo = value[1];
          chainMinAmount = safeguardChainInfo.minAmount;
          chainMaxAmount = safeguardChainInfo.maxAmount;
          chainEpochVolumeCaps = safeguardChainInfo.epochVolumeCaps.mul(98).div(100);

          let minSend: BigNumber | undefined;
          let maxSend: BigNumber | undefined;

          if (chainMinAmount.gt(0)) {
            minSend = safeguardChainInfo?.minAmount;
          }

          if (chainMaxAmount.gt(0) && chainEpochVolumeCaps.gt(0)) {
            maxSend = chainMaxAmount.lte(chainEpochVolumeCaps) ? chainMaxAmount : chainEpochVolumeCaps;
          } else if (chainMaxAmount.gt(0)) {
            maxSend = chainMaxAmount;
          } else if (chainEpochVolumeCaps.gt(0)) {
            maxSend = chainEpochVolumeCaps;
          } else {
            maxSend = undefined;
          }

          const parameters: SafeGuardParmeters = {
            chainDelayThresholds: delayChainInfo.delayThresholds,
            chainDelayTimeInMinutes: delayChainInfo.delayPeriod.toString(),
            maxSendValue: maxSend,
            minSendValue: minSend,
            isBigAmountDelayed: delayChainInfo.isBigAmountDelayed,
            currentEpochVolume: safeguardChainInfo.epochVolumes,
            lastOpTimestamps: safeguardChainInfo.lastOpTimestamps,
          };

          setSafeGuardResult({
            safeGuardParameters: parameters,
            safeguardException: undefined,
            isSafeGuardTaskInProgress: false,
          });

          const checkSafeguardFinished = new Date().getTime();
          console.debug("[performance][safeguardCheck]", checkSafeguardFinished - checkSafeguardStart);
        })
        .catch(e => {
          console.error("safeguard error", e);
          setSafeGuardResult({
            safeGuardParameters: undefined,
            safeguardException: e,
            isSafeGuardTaskInProgress: false,
          });
        });
    };
    getTransferInfoConfigs();
  }, [chainSafeguardInfoCallback, chainDelayInfoCallback, checkPair]);

  return safeGuardResult;
}
