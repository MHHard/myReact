import { BigNumber } from "ethers";
import { useMemo, useState } from "react";
import { LPCheckpair, ChainSafeguardInfo, ChainDelayInfo } from "../constants/type";
import { useDelayInfo } from "./useDelayInfo";
import { useSafeguardInfo } from "./useSafeguardInfo";

export interface SafeGuardParmeters {
  chainDelayThresholds: string;
  chainDelayTimeInMinutes: string;
  epochVolumCaps: BigNumber | undefined;
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
      let chainEpochVolumeCaps = BigNumber.from(0);
      let safeguardInfoPromise: Promise<ChainSafeguardInfo>;
      let delayInfoPromise: Promise<ChainDelayInfo>;

      if (chainSafeguardInfoCallback) {
        safeguardInfoPromise = chainSafeguardInfoCallback();
      } else {
        safeguardInfoPromise = Promise.resolve({
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
          chainEpochVolumeCaps = safeguardChainInfo.epochVolumeCaps.mul(98).div(100);

          let volumeCap: BigNumber | undefined;

          if (chainEpochVolumeCaps.gt(0)) {
            volumeCap = chainEpochVolumeCaps;
          } else {
            volumeCap = undefined;
          }

          const parameters: SafeGuardParmeters = {
            chainDelayThresholds: delayChainInfo.delayThresholds,
            chainDelayTimeInMinutes: delayChainInfo.delayPeriod.toString(),
            epochVolumCaps: volumeCap,
            isBigAmountDelayed: delayChainInfo.isBigAmountDelayed,
            currentEpochVolume: safeguardChainInfo.epochVolumes,
            lastOpTimestamps: safeguardChainInfo.lastOpTimestamps,
          };

          setSafeGuardResult({
            safeGuardParameters: parameters,
            safeguardException: undefined,
            isSafeGuardTaskInProgress: false,
          });

          console.log(`withdraw safeguard results, chainDelayThresholds:${parameters.chainDelayThresholds},\n
            chainDelayTimeInMinutes: ${parameters.chainDelayTimeInMinutes},\n
            epochVolumCaps: ${parameters.epochVolumCaps?.toString()},\n
            currentEpochVolume: ${parameters.currentEpochVolume?.toString()},\n
            isBigAmountDelayed: ${parameters.isBigAmountDelayed},\n
            lastOpTimestamps: ${parameters.lastOpTimestamps},\n
          `)

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