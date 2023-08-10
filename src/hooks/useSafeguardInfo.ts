import { BigNumber } from "ethers";
import { useMemo } from "react";
import { ChainSafeguardInfo, LPCheckpair } from "../constants/type";
import { validateTransferPair } from "./useAsyncChecker";
import { readOnlyContract } from "./customReadyOnlyContractLoader";
import { Bridge } from "../typechain/typechain";
import { Bridge__factory } from "../typechain/typechain/factories/Bridge__factory";
import { useWeb3Context } from "../providers/Web3ContextProvider";

export function useSafeguardInfo(checkPair: LPCheckpair): {
  chainSafeguardInfoCallback: null | (() => Promise<ChainSafeguardInfo>);
} {
  const { getNetworkById } = useWeb3Context();

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
    let epochVolumes = BigNumber.from(0);
    let epochVolumeCaps = BigNumber.from(0);
    let lastOpTimestamps = BigNumber.from(0);

    return {
      chainSafeguardInfoCallback: async function chainSafeguardInfo(): Promise<ChainSafeguardInfo> {
        const bridge = (await readOnlyContract(
          sourceChainInfo?.id,
          sourceChainContractAddress,
          Bridge__factory,
          getNetworkById,
        )) as Bridge | undefined;
        if (bridge) {
          const epochVolumesPromise = bridge.epochVolumes(chainToken?.token?.address || "");
          const epochCapsPromise = bridge.epochVolumeCaps(chainToken?.token?.address || "");
          const lastOpTimestampsPromise = bridge.lastOpTimestamps(chainToken?.token?.address || "");

          const result = await Promise.all([epochVolumesPromise, epochCapsPromise, lastOpTimestampsPromise]);
          epochVolumes = result[0];
          epochVolumeCaps = result[1];
          lastOpTimestamps = result[2];
        } else {
          throw new TypeError("Failed to load chain contract: " + sourceChainContractAddress);
        }
        return { epochVolumes, epochVolumeCaps, lastOpTimestamps };
      },
    };
  }, [checkPair, getNetworkById]);
}
