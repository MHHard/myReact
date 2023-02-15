import { JsonRpcProvider } from "@ethersproject/providers";
import { getNetworkById } from "../constants/network";
import {
  BridgeType,
  Chain,
  GetTransferConfigsResponse,
  TransferHistory,
  TransferHistoryStatus,
  TransferPair,
} from "../constants/type";
import { BridgeType as GatwayBridgeType } from "../proto/gateway/gateway_pb";
import { validateTransferPair } from "./transferPairValidation";
import { getNonEVMMode, NonEVMMode } from "../providers/NonEVMContextProvider";
import { readOnlyContract } from "../hooks/customReadyOnlyContractLoader";
import {
  Bridge__factory,
  Bridge,
  OriginalTokenVaultV2__factory,
  OriginalTokenVaultV2,
  OriginalTokenVault__factory,
  OriginalTokenVault,
  PeggedTokenBridge,
  PeggedTokenBridgeV2,
  PeggedTokenBridge__factory,
  PeggedTokenBridgeV2__factory,
} from "../typechain/typechain";
import { getPegBridgeMintRelayResult, getSafeBoxWithdrawRelayResult } from "../redux/NonEVMAPIs/flowAPIs";
import { storageConstants } from "../constants/const";
import { getDestinationTransferId } from "../redux/gateway";
import { nullTransferPair } from "../providers/BridgeChainTokensProvider";
import {
  getAptosOriginalVaultWithdrawRelayResult,
  getAptosPeggedBridgeMintRelayResult,
} from "../redux/NonEVMAPIs/aptosAPIs";
import { getSeiOriginalVaultWithdrawRelayResult, getSeiPeggedBridgeMintRelayResult } from "../redux/NonEVMAPIs/seiAPI";
import {
  getInjOriginalVaultWithdrawRelayResult,
  getInjPeggedBridgeMintRelayResult,
} from "../redux/NonEVMAPIs/injectiveAPI";

export const destinationRelayChecker = async (
  transferPair: TransferPair,
  destinationTransferId: string,
): Promise<boolean> => {
  if (!validateTransferPair(transferPair) || transferPair.bridgeType === BridgeType.Null) {
    return Promise.resolve(false);
  }

  const destinationChainId = transferPair.destinationChainInfo?.id ?? 0;
  const destinationContractAddress = transferPair.destinationChainContractAddress ?? "";
  const destinationChainContractVersion = transferPair.destinationChainContractVersion;

  const destinationChainNonEVMMode = getNonEVMMode(destinationChainId);
  switch (destinationChainNonEVMMode) {
    case NonEVMMode.flowTest:
    case NonEVMMode.flowMainnet: {
      return checkRelayInfoOnFlow(destinationTransferId, transferPair.bridgeType, destinationContractAddress);
    }
    case NonEVMMode.off: {
      return checkRelayInfoOnEVMChain(
        destinationTransferId,
        transferPair.bridgeType,
        destinationChainId,
        destinationContractAddress,
        destinationChainContractVersion,
      );
    }
    case NonEVMMode.aptosMainnet:
    case NonEVMMode.aptosTest:
    case NonEVMMode.aptosDevnet: {
      return checkRelayInfoOnAptos(destinationTransferId, transferPair.bridgeType, destinationContractAddress);
    }
    case NonEVMMode.seiDevnet:
    case NonEVMMode.seiMainnet:
    case NonEVMMode.seiTestnet: {
      return checkRelayInfoOnSei(destinationTransferId, transferPair.bridgeType, destinationContractAddress);
    }
    case NonEVMMode.injectiveTestnet:
    case NonEVMMode.injectiveMainnet: {
      return checkRelayInfoOnInj(destinationTransferId, transferPair.bridgeType, destinationContractAddress);
    }
    default: {
      throw new TypeError("Unknown NonEVM Mode: " + destinationChainNonEVMMode);
    }
  }
};

const checkRelayInfoOnFlow = async (
  destinationTransferId: string,
  bridgeType: BridgeType,
  destinationChainContractAddress: string,
): Promise<boolean> => {
  let relayFinished = false;
  switch (bridgeType) {
    case BridgeType.Null: {
      throw new TypeError("Null Bridge Type");
    }
    case BridgeType.LiquidityPool: {
      throw new TypeError("Liquidity Bridge Type Not Supported");
    }
    case BridgeType.PegBurn:
    case BridgeType.PegV2Burn: {
      relayFinished = await getSafeBoxWithdrawRelayResult(destinationChainContractAddress, destinationTransferId);
      break;
    }
    case BridgeType.PegDeposit:
    case BridgeType.PegV2Deposit:
    case BridgeType.PegBurnMint: {
      relayFinished = await getPegBridgeMintRelayResult(destinationChainContractAddress, destinationTransferId);
      break;
    }
    default: {
      throw new TypeError("Unknown Bridge Type: " + bridgeType);
    }
  }
  return relayFinished;
};

const checkRelayInfoOnAptos = async (
  destinationTransferId: string,
  bridgeType: BridgeType,
  destinationChainContractAddress: string,
): Promise<boolean> => {
  let relayFinished = false;
  switch (bridgeType) {
    case BridgeType.Null: {
      throw new TypeError("Null Bridge Type");
    }
    case BridgeType.LiquidityPool: {
      throw new TypeError("Liquidity Bridge Type Not Supported");
    }
    case BridgeType.PegBurn:
    case BridgeType.PegV2Burn: {
      relayFinished = await getAptosOriginalVaultWithdrawRelayResult(
        destinationChainContractAddress,
        destinationTransferId,
      );
      break;
    }
    case BridgeType.PegDeposit:
    case BridgeType.PegV2Deposit:
    case BridgeType.PegBurnMint: {
      relayFinished = await getAptosPeggedBridgeMintRelayResult(destinationChainContractAddress, destinationTransferId);
      break;
    }
    default: {
      throw new TypeError("Unknown Bridge Type: " + bridgeType);
    }
  }
  return relayFinished;
};

const checkRelayInfoOnEVMChain = async (
  destinationTransferId: string,
  bridgeType: BridgeType,
  destinationChainId: number,
  destinationChainContractAddress: string,
  destinationChainContractVersion: number,
): Promise<boolean> => {
  const provider = new JsonRpcProvider(getNetworkById(destinationChainId).rpcUrl);
  let relayFinished = false;
  switch (bridgeType) {
    case BridgeType.Null: {
      throw new TypeError("Null Bridge Type");
    }
    case BridgeType.LiquidityPool: {
      const bridge = (await readOnlyContract(provider, destinationChainContractAddress, Bridge__factory)) as
        | Bridge
        | undefined;
      if (bridge) {
        relayFinished = await bridge.transfers(destinationTransferId);
      } else {
        throw new TypeError("Failed to load destination chain contract: " + destinationChainContractAddress);
      }
      break;
    }
    case BridgeType.PegBurn:
    case BridgeType.PegV2Burn: {
      const bridge = (await readOnlyContract(
        provider,
        destinationChainContractAddress,
        destinationChainContractVersion > 0 ? OriginalTokenVaultV2__factory : OriginalTokenVault__factory,
      )) as OriginalTokenVaultV2 | OriginalTokenVault | undefined;
      if (bridge) {
        relayFinished = await bridge.records(destinationTransferId);
      } else {
        throw new TypeError("Failed to load destination chain contract: " + destinationChainContractAddress);
      }
      break;
    }
    case BridgeType.PegDeposit:
    case BridgeType.PegV2Deposit:
    case BridgeType.PegBurnMint: {
      const bridge = (await readOnlyContract(
        provider,
        destinationChainContractAddress,
        destinationChainContractVersion > 0 ? PeggedTokenBridgeV2__factory : PeggedTokenBridge__factory,
      )) as PeggedTokenBridgeV2 | PeggedTokenBridge | undefined;
      if (bridge) {
        relayFinished = await bridge.records(destinationTransferId);
      } else {
        throw new TypeError("Failed to load destination chain contract: " + destinationChainContractAddress);
      }
      break;
    }
    default: {
      throw new TypeError("Unknown Bridge Type: " + bridgeType);
    }
  }
  return relayFinished;
};

export const destinationRelayCheckerByTxHash = async (chainId: number, txHash: string): Promise<boolean> => {
  if (txHash.length > 0) {
    const rpcUrl = getNetworkById(chainId).rpcUrl;
    const myProvider = new JsonRpcProvider(rpcUrl);
    const res = await myProvider?.getTransactionReceipt(txHash);
    return res.status === 1;
  }
  return Promise.resolve(false);
};

export const getDestinationRelayFinishedTransferIds = () => {
  let destinationRelayFinishedTransferIds: string[] = [];

  try {
    const destinationRelayFinishedTransferIdsJSON = localStorage.getItem(
      storageConstants.KEY_WAITING_FOR_FUND_RELEASE_TRANSFER_RELAY_CHECK,
    );
    if (destinationRelayFinishedTransferIdsJSON) {
      destinationRelayFinishedTransferIds = JSON.parse(destinationRelayFinishedTransferIdsJSON) as string[];
    }
  } catch (error) {
    console.debug("error", error);
  }

  return destinationRelayFinishedTransferIds;
};

export const addNewDestinationRelayFinishedTransferId = (transferId: string) => {
  let destinationRelayFinishedTransferIds: string[] = [];

  try {
    const destinationRelayFinishedTransferIdsJSON = localStorage.getItem(
      storageConstants.KEY_WAITING_FOR_FUND_RELEASE_TRANSFER_RELAY_CHECK,
    );
    if (destinationRelayFinishedTransferIdsJSON) {
      destinationRelayFinishedTransferIds = JSON.parse(destinationRelayFinishedTransferIdsJSON) as string[];
    }
    destinationRelayFinishedTransferIds.push(transferId);
    localStorage.setItem(
      storageConstants.KEY_WAITING_FOR_FUND_RELEASE_TRANSFER_RELAY_CHECK,
      JSON.stringify(destinationRelayFinishedTransferIds),
    );
  } catch (error) {
    console.debug("error", error);
  }
};
export const generatePairFunction = (
  sourceChainInfo: Chain,
  destinationChainInfo: Chain,
  tokenSymbol: string,
  transferConfig: GetTransferConfigsResponse,
) => {
  let pair: TransferPair = nullTransferPair;

  /// Find deposit peg config
  const pegDepositConfig = transferConfig.pegged_pair_configs.find(peggedPairConfig => {
    return (
      peggedPairConfig.org_chain_id === sourceChainInfo.id &&
      peggedPairConfig.pegged_chain_id === destinationChainInfo.id &&
      peggedPairConfig.org_token.token.symbol === tokenSymbol &&
      peggedPairConfig.pegged_token.token.symbol === tokenSymbol
    );
  });

  if (pegDepositConfig) {
    pair = {
      sourceChainInfo,
      sourceChainToken: pegDepositConfig.org_token,
      sourceChainContractAddress: pegDepositConfig.pegged_deposit_contract_addr,
      sourceChainCanonicalTokenAddress: pegDepositConfig.canonical_token_contract_addr,
      sourceChainContractVersion: pegDepositConfig.vault_version,
      bridgeType: pegDepositConfig.vault_version > 0 ? BridgeType.PegV2Deposit : BridgeType.PegDeposit,
      destinationChainInfo,
      destinationToken: pegDepositConfig.pegged_token,
      destinationChainContractAddress: pegDepositConfig.pegged_burn_contract_addr,
      destinationCanonicalTokenAddress: pegDepositConfig.canonical_token_contract_addr,
      destinationChainContractVersion: pegDepositConfig.bridge_version,
      destinationChainMigrationPegBurnContractAddr: pegDepositConfig.migration_peg_burn_contract_addr,
    };
    return pair;
  }

  /// Find burn peg config
  const pegBurnConfig = transferConfig.pegged_pair_configs.find(peggedPairConfig => {
    return (
      peggedPairConfig.pegged_chain_id === sourceChainInfo.id &&
      peggedPairConfig.org_chain_id === destinationChainInfo.id &&
      peggedPairConfig.pegged_token.token.symbol === tokenSymbol &&
      peggedPairConfig.org_token.token.symbol === tokenSymbol
    );
  });

  if (pegBurnConfig) {
    pair = {
      sourceChainInfo,
      sourceChainToken: pegBurnConfig.pegged_token,
      sourceChainContractAddress: pegBurnConfig.pegged_burn_contract_addr,
      sourceChainCanonicalTokenAddress: pegBurnConfig.canonical_token_contract_addr,
      sourceChainContractVersion: pegBurnConfig.bridge_version,
      bridgeType: pegBurnConfig.bridge_version > 0 ? BridgeType.PegV2Burn : BridgeType.PegBurn,
      destinationChainInfo,
      destinationToken: pegBurnConfig.org_token,
      destinationChainContractAddress: pegBurnConfig.pegged_deposit_contract_addr,
      destinationCanonicalTokenAddress: pegBurnConfig.canonical_token_contract_addr,
      destinationChainContractVersion: pegBurnConfig.vault_version,
      destinationChainMigrationPegBurnContractAddr: pegBurnConfig.migration_peg_burn_contract_addr,
    };
    return pair;
  }

  const sourceChainIsPeggedChainPairs = transferConfig.pegged_pair_configs.filter(peggedPairConfig => {
    return (
      peggedPairConfig.pegged_chain_id === sourceChainInfo.id &&
      peggedPairConfig.pegged_token.token.symbol === tokenSymbol &&
      peggedPairConfig.bridge_version === 2 &&
      peggedPairConfig.org_token.token.symbol === tokenSymbol
    );
  });

  const burnMintConfigs: TransferPair[] = [];

  sourceChainIsPeggedChainPairs.forEach(peggedPairConfig => {
    const destinationChainSharesTheSameOrgChainWithSourceChain = transferConfig.pegged_pair_configs.find(
      targetPairConfig => {
        return (
          peggedPairConfig.org_chain_id === targetPairConfig.org_chain_id &&
          peggedPairConfig.org_token.token.symbol === targetPairConfig.org_token.token.symbol &&
          targetPairConfig.pegged_chain_id === destinationChainInfo.id &&
          targetPairConfig.bridge_version === 2
        );
      },
    );

    if (destinationChainSharesTheSameOrgChainWithSourceChain) {
      burnMintConfigs.push({
        sourceChainInfo,
        sourceChainToken: peggedPairConfig.pegged_token,
        sourceChainContractAddress: peggedPairConfig.pegged_burn_contract_addr,
        sourceChainCanonicalTokenAddress: peggedPairConfig.canonical_token_contract_addr,
        sourceChainContractVersion: peggedPairConfig.bridge_version,
        bridgeType: BridgeType.PegBurnMint,
        destinationChainInfo,
        destinationToken: destinationChainSharesTheSameOrgChainWithSourceChain.pegged_token,
        destinationChainContractAddress: destinationChainSharesTheSameOrgChainWithSourceChain.pegged_burn_contract_addr,
        destinationCanonicalTokenAddress:
          destinationChainSharesTheSameOrgChainWithSourceChain.canonical_token_contract_addr,
        destinationChainContractVersion: destinationChainSharesTheSameOrgChainWithSourceChain.bridge_version,
        destinationChainMigrationPegBurnContractAddr:
          destinationChainSharesTheSameOrgChainWithSourceChain.migration_peg_burn_contract_addr,
      });
    }
  });

  if (burnMintConfigs.length > 0) {
    return burnMintConfigs[0];
  }

  const sourceChainPoolBasedTokenBlackList = getNetworkById(sourceChainInfo.id).lqMintTokenSymbolBlackList;
  const sourceChainPoolBasedToken = transferConfig.chain_token[sourceChainInfo.id].token.find(tokenInfo => {
    return (
      tokenInfo.token.symbol === tokenSymbol &&
      !tokenInfo.token.xfer_disabled &&
      !sourceChainPoolBasedTokenBlackList.includes(tokenSymbol)
    );
  });

  const destinationChainPoolBasedTokenBlackList = getNetworkById(destinationChainInfo.id).lqMintTokenSymbolBlackList;
  const destinationChainPoolBasedToken = transferConfig.chain_token[destinationChainInfo.id].token.find(tokenInfo => {
    return (
      tokenInfo.token.symbol === tokenSymbol &&
      !tokenInfo.token.xfer_disabled &&
      !destinationChainPoolBasedTokenBlackList.includes(tokenSymbol)
    );
  });

  if (sourceChainPoolBasedToken && destinationChainPoolBasedToken) {
    pair = {
      sourceChainInfo,
      sourceChainToken: sourceChainPoolBasedToken,
      sourceChainContractAddress: sourceChainInfo.contract_addr,
      sourceChainCanonicalTokenAddress: "",
      sourceChainContractVersion: 0,
      bridgeType: BridgeType.LiquidityPool,
      destinationChainInfo,
      destinationToken: destinationChainPoolBasedToken,
      destinationChainContractAddress: destinationChainInfo.contract_addr,
      destinationCanonicalTokenAddress: "",
      destinationChainContractVersion: 0,
      destinationChainMigrationPegBurnContractAddr: undefined,
    };

    return pair;
  }

  return pair;
};
export const getTransferPairFunction = (
  transferConfig: GetTransferConfigsResponse | undefined,
  sourceChainId: number,
  destinationChainId: number,
  tokenSymbol: string,
) => {
  if (sourceChainId === destinationChainId || tokenSymbol.length === 0 || !transferConfig) {
    return nullTransferPair;
  }

  const tokenInSourceChainWhiteList = getNetworkById(sourceChainId).tokenSymbolList.includes(tokenSymbol);
  const tokenInDestinationChainWhiteList = getNetworkById(destinationChainId).tokenSymbolList.includes(tokenSymbol);
  const tokenInSourceChainTokenConfig = transferConfig.chain_token[sourceChainId]?.token.find(tokenInfo => {
    return tokenInfo.token.symbol === tokenSymbol;
  });
  const tokenInDestinationChainTokenConfig = transferConfig.chain_token[destinationChainId]?.token.find(tokenInfo => {
    return tokenInfo.token.symbol === tokenSymbol;
  });
  const sourceChainInfo = transferConfig.chains.find(chainInfo => {
    return chainInfo.id === sourceChainId;
  });
  const destinationChainInfo = transferConfig.chains.find(chainInfo => {
    return chainInfo.id === destinationChainId;
  });

  if (
    tokenInSourceChainWhiteList &&
    tokenInDestinationChainWhiteList &&
    tokenInSourceChainTokenConfig &&
    tokenInDestinationChainTokenConfig &&
    sourceChainInfo &&
    destinationChainInfo
  ) {
    const pair = generatePairFunction(sourceChainInfo, destinationChainInfo, tokenSymbol, transferConfig);
    return pair;
  }

  return nullTransferPair;
};

export const queryWaitingForFundReleaseHistoryRelay = async (
  transferConfig: GetTransferConfigsResponse,
  histories: TransferHistory[],
) => {
  const filterList = histories?.filter(item => item.status === TransferHistoryStatus.TRANSFER_WAITING_FOR_FUND_RELEASE);
  const filterListPromise = filterList.map(async history => {
    const isRfq = history.bridge_type && history.bridge_type === GatwayBridgeType.BRIDGETYPE_RFQ;
    if (isRfq) {
      if (history.dst_block_tx_link.length > 0) {
        const txHash = history.dst_block_tx_link.split("/tx/")[1];
        const relayFinished = await destinationRelayCheckerByTxHash(history.dst_received_info.chain.id, txHash);
        if (relayFinished) {
          history.status = TransferHistoryStatus.TRANSFER_COMPLETED;
        }
      }
    } else {
      const transferPair = getTransferPairFunction(
        transferConfig,
        history.src_send_info.chain.id,
        history.dst_received_info.chain.id,
        history.src_send_info.token.symbol,
      );
      const destinationChainTransferId = await getDestinationTransferId(history.transfer_id);
      if (destinationChainTransferId.length > 0) {
        const relayFinished = await destinationRelayChecker(transferPair, destinationChainTransferId);
        if (relayFinished) {
          history.status = TransferHistoryStatus.TRANSFER_COMPLETED;
        }
      }
    }
    return history;
  });
  const filterHistoryList = await Promise.all(filterListPromise);
  histories?.map(item => {
    filterHistoryList?.forEach(iitem => {
      if (item.transfer_id === iitem.transfer_id) {
        item.status = iitem.status;
      }
    });
    return item;
  });
  return histories;
};

const checkRelayInfoOnSei = async (
  destinationTransferId: string,
  bridgeType: BridgeType,
  destinationChainContractAddress: string,
): Promise<boolean> => {
  let relayFinished = false;
  switch (bridgeType) {
    case BridgeType.Null: {
      throw new TypeError("Null Bridge Type");
    }
    case BridgeType.LiquidityPool: {
      throw new TypeError("Liquidity Bridge Type Not Supported");
    }
    case BridgeType.PegBurn:
    case BridgeType.PegV2Burn: {
      relayFinished = await getSeiOriginalVaultWithdrawRelayResult(
        destinationChainContractAddress,
        destinationTransferId,
      );
      break;
    }
    case BridgeType.PegDeposit:
    case BridgeType.PegV2Deposit:
    case BridgeType.PegBurnMint: {
      relayFinished = await getSeiPeggedBridgeMintRelayResult(destinationChainContractAddress, destinationTransferId);
      break;
    }
    default: {
      throw new TypeError("Unknown Bridge Type: " + bridgeType);
    }
  }
  return relayFinished;
};

const checkRelayInfoOnInj = async (
  destinationTransferId: string,
  bridgeType: BridgeType,
  destinationChainContractAddress: string,
): Promise<boolean> => {
  let relayFinished = false;
  switch (bridgeType) {
    case BridgeType.Null: {
      throw new TypeError("Null Bridge Type");
    }
    case BridgeType.LiquidityPool: {
      throw new TypeError("Liquidity Bridge Type Not Supported");
    }
    case BridgeType.PegBurn:
    case BridgeType.PegV2Burn: {
      relayFinished = await getInjOriginalVaultWithdrawRelayResult(
        destinationChainContractAddress,
        destinationTransferId,
      );
      break;
    }
    case BridgeType.PegDeposit:
    case BridgeType.PegV2Deposit:
    case BridgeType.PegBurnMint: {
      relayFinished = await getInjPeggedBridgeMintRelayResult(destinationChainContractAddress, destinationTransferId);
      break;
    }
    default: {
      throw new TypeError("Unknown Bridge Type: " + bridgeType);
    }
  }
  return relayFinished;
};
