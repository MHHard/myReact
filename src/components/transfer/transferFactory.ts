/* eslint-disable */
import { safeParseUnits } from "celer-web-utils/lib/format";
import { PeggedChainMode } from "../../hooks/usePeggedPairConfig";
import { OriginalTokenVaultV2, PeggedTokenBridgeV2 } from "../../typechain/typechain";

import OriginalTokenVaultV2Adapter from "./adapter/originalTokenVaultV2Adapter";
import PeggedBridgeV2Adapter from "./adapter/peggedBridgeV2Adapter";
import { RfqITransfer, MaxITransfer, BaseITransfer, ITransfer } from "../../constants/transferAdatper";
import PeggedBridgeAdapter from "./adapter/peggedBridgeAdapter";
import OriginalTokenVaultAdapter from "./adapter/originalTokenVaultAdapter";
import PoolBasedBridgeAdapter from "./adapter/poolBasedBridgeAdapter";
import RfqBridgeAdapter from "./adapter/rfqBridgeAdapter";

import CircleBridgeAdapter from "./adapter/circleBridgeAdapter";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRfqITransfer(obj: any): obj is RfqITransfer {
  return "type" in obj && obj.type === "RfqITransfer";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isCircleUSDCITransfer(obj: any): obj is RfqITransfer {
  return "type" in obj && obj.type === "CircleUSDCITransfer";
}

export default function transferFactory(params: MaxITransfer, transferConfig, multiBurnConfig) {
  if (params.value.isZero()) {
    return undefined;
  }

  const baseData: BaseITransfer = {
    fromChain: params.fromChain,
    toChain: params.toChain,
    isNativeToken: params.isNativeToken,
    address: params.address,
    dstAddress: params.dstAddress,
    value: params.value,
    selectedToken: params.selectedToken,
    contracts: params.contracts,
    transactor: params.transactor,
    getNetworkById: params.getNetworkById,
  };

  const commonParams: ITransfer = {
    ...baseData,
    pegConfig: params.pegConfig,
    pegSupply: params.pegSupply,
    selectedToChain: params.selectedToChain,
    maxSlippage: params.maxSlippage,
    toAccount: params.toAccount,
  };

  // rfq
  if (isRfqITransfer(params)) {
    return new RfqBridgeAdapter({
      ...baseData,
      quote: params.quote,
      msgFee: params.msgFee,
      type: params.type,
    });
  }

  // circle usdc
  if (isCircleUSDCITransfer(params)) {
    return new CircleBridgeAdapter({
      ...baseData,
      circleBridgeProxy: params.circleBridgeProxy,
    });
  }

  // nonEVM

  // OriginalVaultV2
  if (params.pegConfig.mode === PeggedChainMode.Deposit && params.pegConfig.config.vault_version > 0) {
    if (isOriginalV2Contracts(params.contracts.originalTokenVaultV2)) {
      return new OriginalTokenVaultV2Adapter(commonParams);
    }
  }

  // peggedV2
  let peggedV2BurnTokenAddress = "";
  if (multiBurnConfig) {
    peggedV2BurnTokenAddress = multiBurnConfig.burn_config_as_org.token.token.address;
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
    return new PeggedBridgeV2Adapter({
      ...commonParams,
      peggedV2BurnTokenAddress,
    });
  }

  // V0
  if (
    (params.pegConfig.mode === PeggedChainMode.Deposit &&
      (!params.contracts.originalTokenVault || params.contracts.originalTokenVault === undefined)) ||
    ((params.pegConfig.mode === PeggedChainMode.Burn || params.pegConfig.mode === PeggedChainMode.BurnThenSwap) &&
      (!params.contracts.peggedTokenBridge || params.contracts.peggedTokenBridge === undefined))
  ) {
    return undefined;
  }

  if (params.chainId !== params.fromChain?.id) {
    throw new Error("from chain id mismatch");
  }

  switch (params.pegConfig.mode) {
    case PeggedChainMode.Burn:
    case PeggedChainMode.TransitionPegV2:
    case PeggedChainMode.BurnThenSwap:
      return new PeggedBridgeAdapter(commonParams);
    case PeggedChainMode.Deposit:
      return new OriginalTokenVaultAdapter(commonParams);
    default:
      return new PoolBasedBridgeAdapter(commonParams);
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
