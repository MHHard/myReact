import { BigNumber } from "ethers";
import { useMemo } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { safeParseUnits } from "celer-web-utils/lib/format";
import { formatDecimal } from "../helpers/format";
import { ChainDelayInfo, LPCheckpair } from "../constants/type";
import { validateTransferPair } from "./useAsyncChecker";
import { getNetworkById } from "../constants/network";
import { readOnlyContract } from "./customReadyOnlyContractLoader";
import { Bridge, Bridge__factory } from "../typechain/typechain";

export function useDelayInfo(checkPair: LPCheckpair): {
  chainDelayInfoCallback: null | (() => Promise<ChainDelayInfo>);
} {
  return useMemo(() => {
    if (!validateTransferPair(checkPair)) {
      return { chainDelayInfoCallback: null };
    }

    const chainInfo = checkPair.chainInfo;
    const chainToken = checkPair.chainToken;
    const chainContractAddress = checkPair.chainContractAddress;
    const amount = checkPair.amount;
    if (!chainInfo || !chainToken || !chainContractAddress) {
      return { chainDelayInfoCallback: null };
    }
    let delayPeriod = "";
    let delayThresholds = "";
    let isBigAmountDelayed = false;

    const provider = new JsonRpcProvider(getNetworkById(chainInfo?.id).rpcUrl);

    return {
      chainDelayInfoCallback: async function chainDelayInfo(): Promise<ChainDelayInfo> {
        const bridge = (await readOnlyContract(provider, chainContractAddress, Bridge__factory)) as Bridge | undefined;
        if (bridge) {
          const periodPromise = bridge.delayPeriod();
          const thresholdsPromise = bridge.delayThresholds(chainToken?.token?.address || "");
          const result = await Promise.all([periodPromise, thresholdsPromise]);
          const period = result[0];
          const thresholds = result[1];
          delayPeriod = period.div(60).add(10).toString();
          delayThresholds = formatDecimal(thresholds, chainToken?.token?.decimal, chainToken?.token?.decimal);
          const bigAmount = safeParseUnits(amount || "", chainToken?.token?.decimal);
          isBigAmountDelayed =
            bigAmount.gte(thresholds) && bigAmount.gt(BigNumber.from(0)) && thresholds.gt(BigNumber.from(0));
        } else {
          throw new TypeError("Failed to load chain contract: " + chainContractAddress);
        }
        return { delayPeriod, delayThresholds, isBigAmountDelayed };
      },
    };
  }, [checkPair]);
}
