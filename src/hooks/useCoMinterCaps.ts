import { useMemo } from "react";
import { BridgeType, CoMinterCap, TransferPair } from "../constants/type";
import { readOnlyContract } from "./customReadyOnlyContractLoader";
import { validateTransferPair } from "../helpers/transferPairValidation";
import { PeggedTokenBridgeV2__factory } from "../typechain/typechain/factories/PeggedTokenBridgeV2__factory";
import { PeggedTokenBridgeV2 } from "../typechain/typechain/PeggedTokenBridgeV2";
import { useWeb3Context } from "../providers/Web3ContextProvider";

export function useCoMinterCaps(transferPair: TransferPair): {
  coMinterCapCallback: null | (() => Promise<CoMinterCap>);
} {
  const { getNetworkById } = useWeb3Context();
  return useMemo(() => {
    let tokenAddress = "";
    let burnBridgeContractAddress = "";
    const chainId = transferPair.sourceChainInfo?.id ?? 0;

    if (!validateTransferPair(transferPair)) {
      return { coMinterCapCallback: null };
    }

    switch (transferPair.bridgeType) {
      case BridgeType.PegBurn:
      case BridgeType.PegV2Burn:
      case BridgeType.PegBurnMint: {
        tokenAddress = transferPair.sourceChainToken?.token.address ?? "";
        burnBridgeContractAddress = transferPair.sourceChainContractAddress ?? "";
        break;
      }
      default: {
        break;
      }
    }

    if (!tokenAddress || !burnBridgeContractAddress || !chainId) {
      return { coMinterCapCallback: null };
    }

    return {
      coMinterCapCallback: async function onBurnCaps(): Promise<CoMinterCap> {
        const rpcUrl = getNetworkById(chainId)?.rpcUrl;

        if (!rpcUrl) {
          return { minterSupply: undefined };
        }
        if (chainId === 73772) {
          const confluxTokenContract = (await readOnlyContract(
            73772,
            transferPair.sourceChainContractAddress || "",
            PeggedTokenBridgeV2__factory,
            getNetworkById,
          )) as PeggedTokenBridgeV2;
          const minterSupply = await confluxTokenContract.supplies(tokenAddress);
          return { minterSupply };
        }
        // if (chainId === 1030) {
        //   // conflux
        //   const confluxTokenContract = (await readOnlyContract(
        //     new StaticJsonRpcProvider(rpcUrl),
        //     tokenAddress,
        //     UpgradeableERC20__factory,
        //   )) as UpgradeableERC20;
        //   const minterSupply = await confluxTokenContract.minterSupply(burnBridgeContractAddress);
        //   const { total } = minterSupply;
        //   return { minterSupply: total };
        // }
        // if (chainId === 47805) {
        //   // REI
        //   const tokenContract = (await readOnlyContract(
        //     new StaticJsonRpcProvider(rpcUrl),
        //     tokenAddress,
        //     BridgedERC20__factory,
        //   )) as BridgedERC20;
        //   const minterSupply = await tokenContract.minterSupply(burnBridgeContractAddress);
        //   const { total } = minterSupply;
        //   return { minterSupply: total };
        // }
        return { minterSupply: undefined };
      },
    };
  }, [getNetworkById, transferPair]);
}
