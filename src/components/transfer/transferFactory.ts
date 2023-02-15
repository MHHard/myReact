/* eslint-disable */
import { safeParseUnits } from "celer-web-utils/lib/format";
import { PeggedChainMode } from "../../hooks/usePeggedPairConfig";
import { OriginalTokenVaultV2, PeggedTokenBridgeV2 } from "../../typechain/typechain";
import FlowBridgeAdapter from "./adapter/flowBridgeAdapter";
import OriginalTokenVaultV2Adapter from "./adapter/originalTokenVaultV2Adapter";
import PeggedBridgeV2Adapter from "./adapter/peggedBridgeV2Adapter";
import { getNonEVMMode, NonEVMMode } from "../../providers/NonEVMContextProvider";
import { ITransfer, IRfqTransfer } from "../../constants/transferAdatper";
import PeggedBridgeAdapter from "./adapter/peggedBridgeAdapter";
import OriginalTokenVaultAdapter from "./adapter/originalTokenVaultAdapter";
import PoolBasedBridgeAdapter from "./adapter/poolBasedBridgeAdapter";
import RfqBridgeAdapter from "./adapter/rfqBridgeAdapter";
import TransferAgentOriginalTokenVaultV2Adapter from "./adapter/transferAgentOriginalTokenVaultV2Adapter";
import AptosPeggedBridgeAdapter from "./adapter/aptosPeggedBridgeAdapter";
import TransferAgentPeggedBridgeV2Adapter from "./adapter/transferAgentPeggedBridgeV2Adapter";
import AptosOriginalTokenVaultAdapter from "./adapter/aptosOriginalTokenVaultAdapter";
import TransferAgentPeggedBridgeAdapter from "./adapter/transferAgentPeggedBridgeAdapter";
import TransferAgentOriginalTokenVaultAdapter from "./adapter/transferAgentOriginalTokenVaultAdapter";
import SeiOriginalTokenVaultAdapter from "./adapter/seiOriginalTokenVaultAdapter";
import SeiPeggedBridgeAdapter from "./adapter/seiPeggedBridgeAdapter";
import InjPeggedBridgeAdapter from "./adapter/injPeggedBridgeAdapter";
import InjOriginalTokenVaultAdapter from "./adapter/injOriginalTokenVaultAdapter";

function isRfqITransfer(obj: any): obj is IRfqTransfer {
  return "type" in obj && obj.type === "IRfqTransfer";
}

export default function transferFactory(params: ITransfer | IRfqTransfer) {
  if (params.value.isZero()) return;

  // rfq
  if (isRfqITransfer(params)) {
    return new RfqBridgeAdapter(params);
  }

  // nonEVM
  const fromChainNonEVMMode = getNonEVMMode(params.fromChain?.id ?? 0);
  if (fromChainNonEVMMode !== NonEVMMode.off) {
    switch (fromChainNonEVMMode) {
      case NonEVMMode.flowMainnet:
      case NonEVMMode.flowTest: {
        let flowDepositContractAddress = "";
        let flowBurnContractAddress = "";

        if (params.multiBurnConfig) {
          flowBurnContractAddress = params.multiBurnConfig.burn_config_as_org.burn_contract_addr;
        }
        const deposit = params.transferConfig.pegged_pair_configs.find(config => {
          return (
            config.org_chain_id === params.fromChain?.id &&
            config.pegged_chain_id === params.toChain?.id &&
            config.org_token.token.symbol === params.selectedToken?.token.symbol
          );
        });

        const burn = params.transferConfig.pegged_pair_configs.find(config => {
          return (
            config.pegged_chain_id === params.fromChain?.id &&
            config.org_chain_id === params.toChain?.id &&
            config.pegged_token.token.symbol === params.selectedToken?.token.symbol
          );
        });
        if (deposit) flowDepositContractAddress = deposit.pegged_deposit_contract_addr;
        if (burn) flowBurnContractAddress = burn.pegged_burn_contract_addr;
        return new FlowBridgeAdapter(params, flowDepositContractAddress, flowBurnContractAddress);
      }
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        if (params.multiBurnConfig) {
          return new AptosPeggedBridgeAdapter(params, params.multiBurnConfig.burn_config_as_org.burn_contract_addr);
        }
        const deposit = params.transferConfig.pegged_pair_configs.find(config => {
          return (
            config.org_chain_id === params.fromChain?.id &&
            config.pegged_chain_id === params.toChain?.id &&
            config.org_token.token.symbol === params.selectedToken?.token.symbol
          );
        });

        const burn = params.transferConfig.pegged_pair_configs.find(config => {
          return (
            config.pegged_chain_id === params.fromChain?.id &&
            config.org_chain_id === params.toChain?.id &&
            config.pegged_token.token.symbol === params.selectedToken?.token.symbol
          );
        });

        if (deposit) {
          return new AptosOriginalTokenVaultAdapter(params, deposit.pegged_deposit_contract_addr);
        }

        if (burn) {
          return new AptosPeggedBridgeAdapter(params, burn.pegged_burn_contract_addr);
        }

        throw new Error("Unsupported Aptos Bridge Type");
      }
      case NonEVMMode.seiMainnet:
      case NonEVMMode.seiTestnet:
      case NonEVMMode.seiDevnet: {
        if (params.multiBurnConfig) {
          return new SeiPeggedBridgeAdapter(params, params.multiBurnConfig.burn_config_as_org.burn_contract_addr);
        }
        const deposit = params.transferConfig.pegged_pair_configs.find(config => {
          return (
            config.org_chain_id === params.fromChain?.id &&
            config.pegged_chain_id === params.toChain?.id &&
            config.org_token.token.symbol === params.selectedToken?.token.symbol
          );
        });

        const burn = params.transferConfig.pegged_pair_configs.find(config => {
          return (
            config.pegged_chain_id === params.fromChain?.id &&
            config.org_chain_id === params.toChain?.id &&
            config.pegged_token.token.symbol === params.selectedToken?.token.symbol
          );
        });

        if (deposit) {
          return new SeiOriginalTokenVaultAdapter(params, deposit.pegged_deposit_contract_addr);
        }

        if (burn) {
          return new SeiPeggedBridgeAdapter(params, burn.pegged_burn_contract_addr);
        }

        throw new Error("Unsupported Sei Bridge Type");
      }
      case NonEVMMode.injectiveTestnet:
      case NonEVMMode.injectiveMainnet: {
        if (params.multiBurnConfig) {
          return new InjPeggedBridgeAdapter(params, params.multiBurnConfig.burn_config_as_org.burn_contract_addr);
        }
        const deposit = params.transferConfig.pegged_pair_configs.find(config => {
          return (
            config.org_chain_id === params.fromChain?.id &&
            config.pegged_chain_id === params.toChain?.id &&
            config.org_token.token.symbol === params.selectedToken?.token.symbol
          );
        });

        const burn = params.transferConfig.pegged_pair_configs.find(config => {
          return (
            config.pegged_chain_id === params.fromChain?.id &&
            config.org_chain_id === params.toChain?.id &&
            config.pegged_token.token.symbol === params.selectedToken?.token.symbol
          );
        });

        if (deposit) {
          return new InjOriginalTokenVaultAdapter(params, deposit.pegged_deposit_contract_addr,);
        }

        if (burn) {
          return new InjPeggedBridgeAdapter(params, burn.pegged_burn_contract_addr);
        }

        throw new Error("Unsupported Inj Bridge Type");
      }
    }
  }

  const destinationChainNonEVMMode = getNonEVMMode(params.toChain?.id ?? 0);
  switch (destinationChainNonEVMMode) {
    case NonEVMMode.aptosMainnet:
    case NonEVMMode.aptosTest:
    case NonEVMMode.aptosDevnet: {
      switch (params.pegConfig.mode) {
        case PeggedChainMode.Burn:
        case PeggedChainMode.TransitionPegV2:
        case PeggedChainMode.BurnThenSwap:
          if (params.pegConfig.config.bridge_version === 2) {
            return new TransferAgentPeggedBridgeV2Adapter(params, params.pegConfig.config.pegged_burn_contract_addr);
          } else {
            return new TransferAgentPeggedBridgeAdapter(params);
          }
        case PeggedChainMode.Deposit:
          if (params.pegConfig.config.vault_version === 2) {
            return new TransferAgentOriginalTokenVaultV2Adapter(
              params,
              params.pegConfig.config.pegged_deposit_contract_addr,
              params.isNativeToken,
            );
          } else {
            return new TransferAgentOriginalTokenVaultAdapter(params, params.isNativeToken);
          }
        default:
          throw new Error("Pool based not supported for Aptos");
      }
    }
    default: {
      break;
    }
  }

  // OriginalVaultV2
  if (params.pegConfig.mode === PeggedChainMode.Deposit && params.pegConfig.config.vault_version > 0) {
    if (isOriginalV2Contracts(params.contracts.originalTokenVaultV2)) {
      return new OriginalTokenVaultV2Adapter(params);
    }
  }

  // peggedV2
  let peggedV2BurnTokenAddress = "";
  if (params.multiBurnConfig) {
    peggedV2BurnTokenAddress = params.multiBurnConfig.burn_config_as_org.token.token.address;
  }
  if (params.pegConfig.mode === PeggedChainMode.TransitionPegV2) {
    if (params.pegSupply) {
      const amountBig = safeParseUnits(params.amount, params.selectedToken.token.decimal);
      if (params.pegSupply.v2PegTokenSupply.gt(0) && amountBig.gt(params.pegSupply.v0PegTokenSupply)) {
        peggedV2BurnTokenAddress = params.pegConfig.config.pegged_token.token.address;
      }
    }
  }
  if (
    (params.pegConfig.mode === PeggedChainMode.Burn || params.pegConfig.mode === PeggedChainMode.BurnThenSwap) &&
    params.pegConfig.config.bridge_version > 0
  ) {
    peggedV2BurnTokenAddress = params.pegConfig.config.pegged_token.token.address;
  }
  if (peggedV2BurnTokenAddress && isPeggedV2Contracts(params.contracts.peggedTokenBridgeV2)) {
    return new PeggedBridgeV2Adapter(params, peggedV2BurnTokenAddress);
  }

  // V0
  if (
    (params.pegConfig.mode === PeggedChainMode.Deposit &&
      (!params.contracts.originalTokenVault || params.contracts.originalTokenVault === undefined)) ||
    ((params.pegConfig.mode === PeggedChainMode.Burn || params.pegConfig.mode === PeggedChainMode.BurnThenSwap) &&
      (!params.contracts.peggedTokenBridge || params.contracts.peggedTokenBridge === undefined))
  ) {
    return;
  }

  if (params.chainId !== params.fromChain?.id) {
    throw new Error("from chain id mismatch");
  }

  switch (params.pegConfig.mode) {
    case PeggedChainMode.Burn:
    case PeggedChainMode.TransitionPegV2:
    case PeggedChainMode.BurnThenSwap:
      return new PeggedBridgeAdapter(params);
    case PeggedChainMode.Deposit:
      return new OriginalTokenVaultAdapter(params);
    default:
      return new PoolBasedBridgeAdapter(params);
  }
}

function isOriginalV2Contracts(contract: OriginalTokenVaultV2 | undefined): boolean {
  if (!contract || contract === undefined) {
    console.log("Warning: Original Token Vault V2 not ready");
    return false;
  }
  return true;
}

function isPeggedV2Contracts(contract: PeggedTokenBridgeV2 | undefined): boolean {
  if (!contract || contract === undefined) {
    console.log("Warning: Pegged Bridge V2 not ready");
    return false;
  }
  return true;
}
