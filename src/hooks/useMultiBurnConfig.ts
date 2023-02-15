import { useEffect, useState } from "react";
import { MultiBurnPairConfig } from "../constants/type";
import { setPTContractAddrV2 } from "../redux/globalInfoSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

export const useMultiBurnConfig = (fromChainId?:number, toChainId?:number, selectedTokenSymbol?:string) => {
  const { fromChain, toChain, selectedToken, multiBurnConfigs } = useAppSelector(state => state.transferInfo);
  const [multiBurnConfig, setMultiBurnConfig] = useState<MultiBurnPairConfig | undefined>(undefined);
  const [multiBurnSpenderAddress, setMultiBurnSpenderAddress] = useState("");
  const dispatch = useAppDispatch();
  useEffect(() => {
    const targetBurnConfig = multiBurnConfigs.find(burnConfig => {
      if (
        burnConfig.burn_config_as_org.chain_id === (fromChainId || fromChain?.id) &&
        burnConfig.burn_config_as_org.token.token.symbol === (selectedTokenSymbol || selectedToken?.token.symbol) &&
        burnConfig.burn_config_as_dst.chain_id === (toChainId || toChain?.id)
      ) {
        if (burnConfig.burn_config_as_org.canonical_token_contract_addr.length > 0) {
          setMultiBurnSpenderAddress(burnConfig.burn_config_as_org.token.token.address);
        } else {
          setMultiBurnSpenderAddress(burnConfig.burn_config_as_org.burn_contract_addr);
        }
        return true;
      }
      return false;
    });

    if (targetBurnConfig) {
      dispatch(setPTContractAddrV2(targetBurnConfig.burn_config_as_org.burn_contract_addr));
    }

    setMultiBurnConfig(targetBurnConfig);
  }, [fromChain, toChain, selectedToken, multiBurnConfigs, fromChainId, toChainId, selectedTokenSymbol, dispatch]);

  return { multiBurnConfig, multiBurnSpenderAddress };
};
