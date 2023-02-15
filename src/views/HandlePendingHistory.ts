/* eslint-disable camelcase */
import _ from "lodash";
import { storageConstants } from "../constants/const";
import { LPHistory, LPHistoryStatus, LPType, TransferHistory, TransferHistoryStatus } from "../constants/type";
import { getPendingHistory, lpHistory, transferHistory } from "../redux/gateway";
import { filteredLocalTransferHistory } from "../utils/localTransferHistoryList";
import { getLPActionNum, mergeLiquidityHistory } from "../utils/mergeLiquidityHistory";
import { getTransferActionNum, mergeTransactionHistory } from "../utils/mergeTransferHistory";
import { getLpOnChainQueryPromiseList, getTransactionOnchainQueryPromiseList } from "./History";

const defaultPageSize = 15;
export const mergeTransferRemotePendingListAndHistoryPendingList = (
  remotePendingList: TransferHistory[],
  historyPendingList: TransferHistory[],
) => {
  const deduplicationArray: TransferHistory[] = [];
  remotePendingList?.forEach(item => {
    let flag = true;
    historyPendingList?.forEach(item1 => {
      if (Number(item.transfer_id) === Number(item1.transfer_id)) {
        flag = false;
      }
    });
    if (flag) {
      deduplicationArray.push(item);
    }
  });
  const newArray = deduplicationArray.concat(historyPendingList);
  newArray?.sort((a, b) => Number(b.ts) - Number(a.ts));
  const { actionNum } = getTransferActionNum(newArray);
  return { newList: newArray, actionNum };
};

export const mergeLPRemotePendingListAndHistoryPendingList = (
  remotePendingList: LPHistory[],
  historyPendingList: LPHistory[],
) => {
  const deduplicationArray: LPHistory[] = [];
  remotePendingList?.forEach(item => {
    let flag = true;
    historyPendingList?.forEach(item1 => {
      if (
        (Number(item.nonce) === Number(item1.nonce) && item.type === LPType.LP_TYPE_ADD) ||
        (Number(item.seq_num) === Number(item1.seq_num) && item.type === LPType.LP_TYPE_REMOVE)
      ) {
        flag = false;
      }
    });
    if (flag) {
      deduplicationArray.push(item);
    }
  });
  const newArray = deduplicationArray.concat(historyPendingList);
  newArray?.sort((a, b) => Number(b.ts) - Number(a.ts));
  const { actionNum } = getLPActionNum(newArray);
  return { newList: newArray, actionNum };
};

export const getLPPending = async (address, provider, chainId) => {
  const pendingHistoryPromise = getPendingHistory([address]);
  const res = await lpHistory({
    addr: address,
    page_size: defaultPageSize,
    next_page_token: new Date().getTime().toString(),
  });
  let localLpList;
  const localLpListStr = localStorage.getItem(storageConstants.KEY_LP_LIST);
  if (localLpListStr) {
    localLpList = JSON.parse(localLpListStr)[address] as LPHistory[];
  }
  const promiseList = getLpOnChainQueryPromiseList(provider, chainId, localLpList);
  const mergeResultPromise = Promise.all(promiseList).then(result => {
    return mergeLiquidityHistory(
      address,
      new Date().getTime(),
      res.history,
      localLpList,
      result,
      defaultPageSize,
      true,
    );
  });
  const mergeResult = Promise.all([pendingHistoryPromise, mergeResultPromise]).then(result => {
    const actionList = result[0]?.action_lp_history?.concat(result[0]?.pending_lp_history);
    const filterList =
      result[1]?.mergedLpHistory?.filter(item => {
        return (
          item.status !== LPHistoryStatus.LP_COMPLETED &&
          item.status !== LPHistoryStatus.LP_FAILED &&
          item.status !== LPHistoryStatus.LP_UNKNOWN
        );
      }) ?? [];
    return mergeLPRemotePendingListAndHistoryPendingList(actionList, filterList);
  });
  return mergeResult;
};

export const getTransferPending = async (provider, chainId, remoteRequestAddress: string[], localAddresses: string[], transferConfig) => {
  const pendingHistoryPromise = getPendingHistory(remoteRequestAddress);

  const res = await transferHistory({
    acct_addr: remoteRequestAddress,
    page_size: defaultPageSize,
    next_page_token: new Date().getTime().toString(),
  });

  const localHistoryList = filteredLocalTransferHistory(localAddresses);
  const allItemTxQueryPromise = getTransactionOnchainQueryPromiseList(provider, chainId, localHistoryList);
  const mergeResultPromise = Promise.all(allItemTxQueryPromise).then(result => {
    return mergeTransactionHistory({
      pageToken: new Date().getTime(),
      historyList: res?.history,
      localHistoryList,
      pageSize: defaultPageSize,
      onChainResult: result,
      transferConfig,
      onlyshowPending: true,
    });
  });
  const mergeResult = Promise.all([pendingHistoryPromise, mergeResultPromise]).then(result => {
    const actionList = result[0]?.action_transfer_history?.concat(result[0]?.pending_transfer_history);
    const filterList =
      result[1]?.mergedHistoryList?.filter(item => {
        return (
          item.status !== TransferHistoryStatus.TRANSFER_UNKNOWN &&
          item.status !== TransferHistoryStatus.TRANSFER_FAILED &&
          item.status !== TransferHistoryStatus.TRANSFER_REFUNDED &&
          item.status !== TransferHistoryStatus.TRANSFER_COMPLETED
        );
      }) ?? [];
    return mergeTransferRemotePendingListAndHistoryPendingList(actionList, filterList);
  });
  return mergeResult;
};

export const getLPPendingOnePageList = (list: LPHistory[], pageNum, pageSize) => {
  let pageList: LPHistory[] = [];
  if (list?.length === 0) {
    return { pageList, nowPage: 0 };
  }
  const paginationList: LPHistory[][] = _.chunk(list, pageSize);
  const pageLength = paginationList?.length;
  if (pageNum >= paginationList?.length && pageNum !== 0) {
    pageList = paginationList[pageLength - 1];
    return { pageList, nowPage: pageLength - 1 };
  }
  pageList = paginationList[pageNum];
  return { pageList, nowPage: pageNum };
};

export const getTransferPendingOnePageList = (list: TransferHistory[], pageNum, pageSize) => {
  let pageList: TransferHistory[] = [];
  if (list?.length === 0) {
    return { pageList, nowPage: 0 };
  }
  const paginationList: TransferHistory[][] = _.chunk(list, pageSize);
  const pageLength = paginationList?.length;
  if (pageNum >= paginationList?.length && pageNum !== 0) {
    pageList = paginationList[pageLength - 1];
    return { pageList, nowPage: pageLength - 1 };
  }
  pageList = paginationList[pageNum];
  return { pageList, nowPage: pageNum };
};
