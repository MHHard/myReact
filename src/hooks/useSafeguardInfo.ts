import { BigNumber } from "ethers";
import { useMemo } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ChainSafeguardInfo, LPCheckpair } from "../constants/type";
import { validateTransferPair } from "./useAsyncChecker";
import { getNetworkById } from "../constants/network";
import { readOnlyContract } from "./customReadyOnlyContractLoader";
import { Bridge } from "../typechain/typechain";
import { Bridge__factory } from "../typechain/typechain/factories/Bridge__factory";

export function useSafeguardInfo(checkPair: LPCheckpair): {
  chainSafeguardInfoCallback: null | (() => Promise<ChainSafeguardInfo>);
} {
  return useMemo(() => {
    if (!validateTransferPair(checkPair)) {
      return { chainSafeguardInfoCallback: null };
    }

    const sourceChainInfo = checkPair.chainInfo;
    const chainToken = checkPair.chainToken;
    const sourceChainContractAddress = checkPair.chainContractAddress;

    if (!sourceChainInfo || !chainToken || !sourceChainContractAddress) {
      return { chainSafeguardInfoCallback: null };
    }
    let maxAmount = BigNumber.from(0);
    let minAmount = BigNumber.from(0);
    let epochVolumes = BigNumber.from(0);
    let epochVolumeCaps = BigNumber.from(0);
    let lastOpTimestamps = BigNumber.from(0);
    const provider = new JsonRpcProvider(getNetworkById(sourceChainInfo?.id).rpcUrl);

    return {
      chainSafeguardInfoCallback: async function chainSafeguardInfo(): Promise<ChainSafeguardInfo> {
        const bridge = (await readOnlyContract(provider, sourceChainContractAddress, Bridge__factory)) as
          | Bridge
          | undefined;
        if (bridge) {
          const minAmountPromise = bridge.minSend(chainToken?.token?.address || "");
          const maxAmountPromise = bridge.maxSend(chainToken?.token?.address || "");
          const epochVolumesPromise = bridge.epochVolumes(chainToken?.token?.address || "");
          const epochCapsPromise = bridge.epochVolumeCaps(chainToken?.token?.address || "");
          const lastOpTimestampsPromise = bridge.lastOpTimestamps(chainToken?.token?.address || "");

          const result = await Promise.all([
            maxAmountPromise,
            minAmountPromise,
            epochVolumesPromise,
            epochCapsPromise,
            lastOpTimestampsPromise,
          ]);
          maxAmount = result[0];
          minAmount = result[1];
          epochVolumes = result[2];
          epochVolumeCaps = result[3];
          lastOpTimestamps = result[4];
        } else {
          throw new TypeError("Failed to load chain contract: " + sourceChainContractAddress);
        }
        return { minAmount, maxAmount, epochVolumes, epochVolumeCaps, lastOpTimestamps };
      },
    };
  }, [checkPair]);
}
