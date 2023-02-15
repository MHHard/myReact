import { BigNumber } from "ethers";
import { useMemo } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getNetworkById } from "../constants/network";
import { MultiBridgeToken, MultiBridgeToken__factory } from "../typechain/typechain";
import { readOnlyContract } from "./customReadyOnlyContractLoader";
import { PeggedChainMode, usePeggedPairConfig } from "./usePeggedPairConfig";
import { UpgradeableERC20__factory } from "../typechain/typechain/conflux/UpgradeableERC20__factory";
import { UpgradeableERC20 } from "../typechain/typechain/conflux/UpgradeableERC20";
import { BridgedERC20 } from "../typechain/typechain/REI/BridgedERC20";
import { BridgedERC20__factory } from "../typechain/typechain/REI/BridgedERC20__factory";

export interface PegTokenSupply {
  v0PegTokenSupply: BigNumber;
  v2PegTokenSupply: BigNumber;
}
export function usePegV2Transition(): { onPegSupplyCallback: null | (() => Promise<PegTokenSupply>) } {
  const pegConfig = usePeggedPairConfig();

  return useMemo(() => {
    if (pegConfig && pegConfig.mode === PeggedChainMode.TransitionPegV2) {
      const pegChain = getNetworkById(pegConfig.config.pegged_chain_id);

      const getSupply = async () => {
        let pegTokenSupply: PegTokenSupply ;
        if(pegChain.chainId === 1030) {
          const confluxTokenContract = (await readOnlyContract(
            new JsonRpcProvider(pegChain.rpcUrl),
            pegConfig.config.pegged_token.token.address,
            UpgradeableERC20__factory,
          )) as UpgradeableERC20;

          const minterSupplyResult = await Promise.all([
            confluxTokenContract.minterSupply(pegConfig.config.migration_peg_burn_contract_addr),
            confluxTokenContract.minterSupply(pegConfig.config.pegged_burn_contract_addr)
          ]);

          pegTokenSupply = {
            v0PegTokenSupply: minterSupplyResult[0].total,
            v2PegTokenSupply: minterSupplyResult[1].total,
          };
        } else if (pegChain.chainId === 47805) {
          const REITokenContract = (await readOnlyContract(
            new JsonRpcProvider(pegChain.rpcUrl),
            pegConfig.config.pegged_token.token.address,
            BridgedERC20__factory,
          )) as BridgedERC20;

          const minterSupplyResult = await Promise.all([
            REITokenContract.minterSupply(pegConfig.config.migration_peg_burn_contract_addr),
            REITokenContract.minterSupply(pegConfig.config.pegged_burn_contract_addr)
          ]);

          pegTokenSupply = {
            v0PegTokenSupply: minterSupplyResult[0].total,
            v2PegTokenSupply: minterSupplyResult[1].total,
          };
        } else {
          const multiBridgeTokenContract = (await readOnlyContract(
            new JsonRpcProvider(pegChain.rpcUrl),
            pegConfig.config.pegged_token.token.address,
            MultiBridgeToken__factory,
          )) as MultiBridgeToken;
  
          const result = await Promise.all([
            multiBridgeTokenContract.bridges(pegConfig.config.migration_peg_burn_contract_addr),
            multiBridgeTokenContract.bridges(pegConfig.config.pegged_burn_contract_addr),
          ]);
  
          pegTokenSupply = {
            v0PegTokenSupply: result[0].total,
            v2PegTokenSupply: result[1].total,
          };
        }
        return pegTokenSupply;
      };

      return { onPegSupplyCallback: getSupply };
    }

    return {onPegSupplyCallback: null}

  }, [pegConfig]);
}
