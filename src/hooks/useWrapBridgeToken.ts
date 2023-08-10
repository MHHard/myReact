import { clone } from "lodash";
import { useMemo } from "react";
import { useAppSelector } from "../redux/store";
import { Token } from "../constants/type";

interface WrapBridgeTokens {
  wrapBridgeTokenAddr: string | undefined;
  canonicalToken: Token | undefined;
}

export function useWrapBridgeToken(selectedChainId: number, selectedTokenSymbol: string): WrapBridgeTokens {
  const { transferInfo } = useAppSelector(state => state);
  const { transferConfig } = transferInfo;
  const pegConfigs = transferConfig.pegged_pair_configs;

  return useMemo(() => {
    if (!selectedChainId || !selectedTokenSymbol || !pegConfigs) {
      return { wrapBridgeTokenAddr: undefined, canonicalToken: undefined };
    }

    const pegConfig = pegConfigs.find(
      it =>
        it.canonical_token_contract_addr &&
        it.pegged_chain_id === selectedChainId &&
        selectedTokenSymbol === it.pegged_token.token.symbol,
    );

    if (pegConfig) {
      const newToken = clone(pegConfig.pegged_token.token);
      newToken.address = pegConfig.canonical_token_contract_addr
      const result: WrapBridgeTokens = {
        wrapBridgeTokenAddr: pegConfig.pegged_token.token.address,
        canonicalToken: newToken,
      };
      return result;
    }

    return { wrapBridgeTokenAddr: undefined, canonicalToken: undefined };
  }, [selectedChainId, selectedTokenSymbol, pegConfigs]);
}
