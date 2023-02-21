import { BigNumber } from "ethers";
import { useMemo } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getNetworkById } from "../constants/network";
import { BridgeTypeForBridgeConfig, CoMinterCap, TransferPair } from "../constants/type";
import { UpgradeableERC20__factory } from "../typechain/conflux/UpgradeableERC20__factory";
import { readOnlyContract } from "./customReadyOnlyContractLoader";
import { UpgradeableERC20 } from "../typechain/conflux/UpgradeableERC20";
import { BridgedERC20__factory } from "../typechain/REI/BridgedERC20__factory";
import { BridgedERC20 } from "../typechain/REI/BridgedERC20";
import { validateTransferPair } from "../helpers/transferPairValidation";

export function useCoMinterCaps(
  transferPair: TransferPair,
): { coMinterCapCallback: null | (() => Promise<CoMinterCap>) } {
  return useMemo(() => {
    let tokenAddress = ""
    let burnBridgeContractAddress = ""
    const chainId = transferPair.sourceChainInfo?.id ?? 0

    if (!validateTransferPair(transferPair)) {
      return { coMinterCapCallback: null };
    }

    switch (transferPair.bridgeType) {
      case BridgeTypeForBridgeConfig.PegBurn:
      case BridgeTypeForBridgeConfig.PegV2Burn:
      case BridgeTypeForBridgeConfig.PegBurnMint: {
        tokenAddress = transferPair.sourceChainToken?.token.address ?? ""
        burnBridgeContractAddress = transferPair.sourceChainContractAddress ?? ""
        break
      }
      default: {
        break
      }
    }

    if (!tokenAddress || !burnBridgeContractAddress || !chainId) {
      return { coMinterCapCallback: null };
    }

    return {
      coMinterCapCallback: async function onBurnCaps(): Promise<CoMinterCap> {
        const rpcUrl = getNetworkById(chainId)?.rpcUrl;

        if (!rpcUrl) {
          return { minterSupply: BigNumber.from(0) };
        }

        if (chainId === 1030) {
          // conflux
          const confluxTokenContract = (await readOnlyContract(
            new JsonRpcProvider(rpcUrl),
            tokenAddress,
            UpgradeableERC20__factory,
          )) as UpgradeableERC20;
          const minterSupply = await confluxTokenContract.minterSupply(burnBridgeContractAddress);
          const { total } = minterSupply;
          return { minterSupply: total };
        }
        if (chainId === 47805) {
          // REI
          const tokenContract = (await readOnlyContract(
            new JsonRpcProvider(rpcUrl),
            tokenAddress,
            BridgedERC20__factory,
          )) as BridgedERC20;
          const minterSupply = await tokenContract.minterSupply(burnBridgeContractAddress);
          const { total } = minterSupply;
          return { minterSupply: total };
        }
        return { minterSupply: BigNumber.from(0) };
      },
    };
  }, [transferPair]);
}
