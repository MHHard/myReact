import _ from "lodash";
import { LPHistory, LPHistoryStatus } from "../constants/type";
import { LPType } from "../proto/gateway/gateway_pb";
import { dataClone } from "../helpers/dataClone";

/* eslint-disable camelcase */
/* eslint-disable no-debugger */

interface MergedLpHistoryResult {
  mergedLpHistory: LPHistory[];
  lpActionNum: number;
  lpPendingNum: number;
}
export type MergedLPHistroryResult = [LPHistory[], number, number, boolean];

export const mergeLiquidityHistory = (
  address: string,
  pageToken: number,
  lpHistory: LPHistory[],
  localLpHistoryList: LPHistory[],
  /* eslint-disable-next-line */
  onChainResult: any[],
  pageSize = 5,
  onlyshowPending = false,
): MergedLpHistoryResult => {
  if (pageToken === undefined || !address) {
    return { mergedLpHistory: [], lpActionNum: 0, lpPendingNum: 0 };
  }
  let comparePageToken = new Date().getTime();
  if (pageToken !== 0) {
    comparePageToken = pageToken;
  }
  onChainResult?.map((pItem, i) => {
    const localItem = localLpHistoryList[i];
    if (pItem) {
      localItem.txIsFailed = Number(pItem.status) !== 1;
      if (localItem.type === LPType.LP_TYPE_ADD) {
        localItem.status = Number(pItem.status) === 1 ? LPHistoryStatus.LP_SUBMITTING : LPHistoryStatus.LP_FAILED;
      }
    }
    return pItem;
  });

  const newList = getLPMergeList(lpHistory, localLpHistoryList, comparePageToken, address);
  if (newList.length > 0) {
    const arrList: LPHistory[][] = _.chunk(newList, pageSize);
    let nowList = arrList[0];
    if (onlyshowPending) {
      nowList = newList;
    }
    const { actionNum, pendingNum } = getLPActionNum(nowList);
    return { mergedLpHistory: nowList, lpActionNum: actionNum, lpPendingNum: pendingNum };
  }
  return { mergedLpHistory: [], lpActionNum: 0, lpPendingNum: 0 };
};

export const getLPMergeList = (lpList, localLpList, comparePageToken, address) => {
  const [mergedList, localKeepList] = handleLocalLPList(lpList, localLpList, comparePageToken);
  const localKeepHistoryJson = { [address]: localKeepList };
  localStorage.setItem("LpList", JSON.stringify(localKeepHistoryJson));
  mergedList?.sort((a, b) => Number(b.ts) - Number(a.ts));
  return mergedList;
};

const handleLocalLPList = (lpList: LPHistory[], localLpList: LPHistory[], comparePageToken) => {
  if (!localLpList || localLpList?.length === 0) {
    return [lpList, []];
  }

  const combineList: LPHistory[] = [];
  const copyedLocalHistory = dataClone(localLpList);
  const copyedRemoteLpHistory = dataClone(lpList);

  // keep the items can't ne clear in local storage
  const localKeepList: LPHistory[] = [];

  copyedRemoteLpHistory.forEach(remoteItem => {
    copyedLocalHistory.forEach(localItem => {
      // resolve the confict data bettween remote and local
      if (
        (Number(remoteItem.nonce) === Number(localItem.nonce) && remoteItem.type === LPType.LP_TYPE_ADD) ||
        (Number(remoteItem.seq_num) === Number(localItem.seq_num) && remoteItem.type === LPType.LP_TYPE_REMOVE)
      ) {
        // select which item can be used
        if (remoteItem.type === LPType.LP_TYPE_ADD) {
          combineList.push(remoteItem);
        } else if (remoteItem.type === LPType.LP_TYPE_REMOVE) {
          if (remoteItem.status === LPHistoryStatus.LP_WAITING_FOR_LP) {
            combineList.push(localItem);

            const localSeqNumList = localKeepList.map(todoItem => Number(todoItem.seq_num));
            if (!localSeqNumList.includes(Number(localItem.seq_num))) {
              localKeepList.push(localItem);
            }
          } else {
            combineList.push(remoteItem);
          }
        }
      }
    });
  });

  // get the remaining valid local history records
  const remainingLocalHistory: LPHistory[] = [];
  // collect record which not valid in current page
  copyedLocalHistory.forEach(localItem => {
    if (localItem.type === LPType.LP_TYPE_ADD) {
      const nonceList = combineList.map(it => Number(it.nonce));
      if (!nonceList.includes(Number(localItem.nonce))) {
        localKeepList.push(localItem);

        if (!(Number(localItem.ts) >= Number(comparePageToken))) {
          remainingLocalHistory.push(localItem);
        }
      }
    } else if (localItem.type === LPType.LP_TYPE_REMOVE) {
      const seqNumList = combineList.map(it => Number(it.seq_num));
      if (!seqNumList.includes(Number(localItem.seq_num))) {
        localKeepList.push(localItem);

        if (!(Number(localItem.ts) >= Number(comparePageToken))) {
          remainingLocalHistory.push(localItem);
        }
      }
    }
  });

  // get the remaining remote history records
  const remainingRemoteHistory: LPHistory[] = [];

  copyedRemoteLpHistory.forEach(remoteItem => {
    if (remoteItem.type === LPType.LP_TYPE_ADD) {
      const nonceList = combineList.map(it => Number(it.nonce));
      if (!nonceList.includes(Number(remoteItem.nonce))) {
        remainingRemoteHistory.push(remoteItem);
      }
    } else if (remoteItem.type === LPType.LP_TYPE_REMOVE) {
      const seqNumList = combineList.map(it => Number(it.seq_num));
      if (!seqNumList.includes(Number(remoteItem.seq_num))) {
        remainingRemoteHistory.push(remoteItem);
      }
    }
  });

  // get the merge collection
  const mergedList = [...remainingLocalHistory, ...combineList, ...remainingRemoteHistory];
  return [mergedList, localKeepList];
};

export const isConfirmToRemoveLq = (lpHistory: LPHistory) => {
  if (lpHistory.status === LPHistoryStatus.LP_WAITING_FOR_LP) {
    return true;
  }
  if (
    lpHistory.txIsFailed &&
    lpHistory.status === LPHistoryStatus.LP_SUBMITTING &&
    lpHistory.type === LPType.LP_TYPE_REMOVE
  ) {
    return true;
  }
  return false;
};

export const getLPActionNum = lpList => {
  let actionNum = 0;
  let pendingNum = 0;
  lpList?.forEach(item => {
    if (item.status === LPHistoryStatus.LP_WAITING_FOR_LP || isConfirmToRemoveLq(item)) {
      actionNum += 1;
    }
    if (
      item.status !== LPHistoryStatus.LP_COMPLETED &&
      item.status !== LPHistoryStatus.LP_FAILED &&
      item.status !== LPHistoryStatus.LP_UNKNOWN
    ) {
      pendingNum += 1;
    }
    return item;
  });
  return { actionNum, pendingNum };
};
