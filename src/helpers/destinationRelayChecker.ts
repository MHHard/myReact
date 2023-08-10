import { StaticJsonRpcProvider } from "@ethersproject/providers";

import {
  BridgeType,
  GetTransferConfigsResponse,
  TransferHistory,
  TransferHistoryStatus,
  TransferPair,
} from "../constants/type";
import { BridgeType as GatwayBridgeType } from "../proto/gateway/gateway_pb";
import { validateTransferPair } from "./transferPairValidation";
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
import { storageConstants } from "../constants/const";
import { getDestinationTransferId } from "../redux/gateway";
import { getTransferPairFunction } from "./transferPairGeneration";

export const destinationRelayChecker = async (
  transferPair: TransferPair,
  destinationTransferId: string,
  getNetworkById,
): Promise<boolean> => {
  if (!validateTransferPair(transferPair) || transferPair.bridgeType === BridgeType.Null) {
    return Promise.resolve(false);
  }

  const destinationChainId = transferPair.destinationChainInfo?.id ?? 0;
  const destinationContractAddress = transferPair.destinationChainContractAddress ?? "";
  const destinationChainContractVersion = transferPair.destinationChainContractVersion;
  return checkRelayInfoOnEVMChain(
    destinationTransferId,
    transferPair.bridgeType,
    destinationChainId,
    destinationContractAddress,
    destinationChainContractVersion,
    getNetworkById,
  );
};

const checkRelayInfoOnEVMChain = async (
  destinationTransferId: string,
  bridgeType: BridgeType,
  destinationChainId: number,
  destinationChainContractAddress: string,
  destinationChainContractVersion: number,
  getNetworkById,
): Promise<boolean> => {
  let relayFinished = false;
  switch (bridgeType) {
    case BridgeType.Null: {
      throw new TypeError("Null Bridge Type");
    }
    case BridgeType.LiquidityPool: {
      const bridge = (await readOnlyContract(
        destinationChainId,
        destinationChainContractAddress,
        Bridge__factory,
        getNetworkById,
      )) as Bridge | undefined;
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
        destinationChainId,
        destinationChainContractAddress,
        destinationChainContractVersion > 0 ? OriginalTokenVaultV2__factory : OriginalTokenVault__factory,
        getNetworkById,
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
        destinationChainId,
        destinationChainContractAddress,
        destinationChainContractVersion > 0 ? PeggedTokenBridgeV2__factory : PeggedTokenBridge__factory,
        getNetworkById,
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

export const destinationRelayCheckerByTxHash = async (
  chainId: number,
  txHash: string,
  getNetworkById,
): Promise<boolean> => {
  if (txHash.length > 0) {
    const rpcUrl = getNetworkById(chainId).rpcUrl;
    const myProvider = new StaticJsonRpcProvider(rpcUrl);
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

export const queryWaitingForFundReleaseHistoryRelay = async (
  transferConfig: GetTransferConfigsResponse,
  histories: TransferHistory[],
  getNetworkById,
) => {
  const filterList = histories?.filter(item => item.status === TransferHistoryStatus.TRANSFER_WAITING_FOR_FUND_RELEASE);
  const filterListPromise = filterList.map(async history => {
    const isRfq = history.bridge_type && history.bridge_type === GatwayBridgeType.BRIDGETYPE_RFQ;
    if (isRfq) {
      if (history.dst_block_tx_link.length > 0) {
        const txHash = history.dst_block_tx_link.split("/tx/")[1];
        const relayFinished = await destinationRelayCheckerByTxHash(
          history.dst_received_info.chain.id,
          txHash,
          getNetworkById,
        );
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
        getNetworkById,
      );
      const destinationChainTransferId = await getDestinationTransferId(history.transfer_id);
      if (destinationChainTransferId.length > 0) {
        const relayFinished = await destinationRelayChecker(transferPair, destinationChainTransferId, getNetworkById);
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
