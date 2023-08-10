/* eslint-disable no-case-declarations */
import { PeggedChainMode, PeggedPair } from "../hooks/usePeggedPairConfig";
import { Chain, MultiBurnPairConfig, TokenInfo } from "../constants/type";

export default function getReceivedToken(
  fromChain: number | undefined,
  toChain: number | undefined,
  pegConfig: PeggedPair | undefined,
  multiBurnConfig: MultiBurnPairConfig | undefined,
) {
  let token: TokenInfo | null = null;

  if (multiBurnConfig) {
    token = multiBurnConfig.burn_config_as_dst.token;
  }

  switch (pegConfig?.mode) {
    case PeggedChainMode.BurnThenSwap:
      const burnSwapToken: TokenInfo = JSON.parse(JSON.stringify(pegConfig?.config.org_token));
      // burnSwapToken.token.address = pegConfig?.config.canonical_token_contract_addr;
      token = burnSwapToken;
      break;
    case PeggedChainMode.Burn:
    case PeggedChainMode.TransitionPegV2:
      token = pegConfig?.config.org_token;
      break;
    case PeggedChainMode.Deposit:
      const receiveToken: TokenInfo = JSON.parse(JSON.stringify(pegConfig?.config.pegged_token));

      // frax mode
      if (pegConfig?.config.canonical_token_contract_addr.length > 0) {
        receiveToken.token.address = pegConfig.config.canonical_token_contract_addr;
      }

      if (
        pegConfig.config.org_chain_id === 999999997 &&
        pegConfig.config.pegged_chain_id === 592 &&
        receiveToken.token.symbol === "INJ"
      ) {
        // bridge INJ from Injective to Astar
        receiveToken.token.address = pegConfig?.config.canonical_token_contract_addr;
      }

      token = receiveToken;
      break;
    default:
      break;
  }

  return token;
}

export const getTokenContractLink = (ch: Chain | undefined, address: string | undefined, getNetworkById) => {
  let link = "";
  if (ch && address) {
    if (ch.id === 314 || ch.id === 324) {
      link = `${getNetworkById(ch.id).blockExplorerUrl}/address/${address}`;
    } else {
      link = `${getNetworkById(ch.id).blockExplorerUrl}/token/${address}`;
    }
  }
  return link;
};
