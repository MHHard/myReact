import { clone } from "lodash";
import { storageConstants } from "../constants/const";
import { TransferHistory } from "../constants/type";

export const filteredLocalTransferHistory = (addresses: string[]) => {
  const addressesWithoutEmptyString = addresses.filter(address => {
    return address.length > 0;
  });

  try {
    const localTransferListStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
    let transferHistoryList: TransferHistory[] = [];
    if (localTransferListStr) {
      transferHistoryList = JSON.parse(localTransferListStr) as TransferHistory[];
    }

    let result: TransferHistory[];
    if (addressesWithoutEmptyString.length === 0) {
      result = [];
    } else if (addressesWithoutEmptyString.length === 1) {
      result = transferHistoryList.filter(transferHistory => {
        return (
          addressesWithoutEmptyString.includes(transferHistory.dstAddress) ||
          addressesWithoutEmptyString.includes(transferHistory.srcAddress)
        );
      });
    } else {
      result = transferHistoryList.filter(transferHistory => {
        return (
          addressesWithoutEmptyString.includes(transferHistory.dstAddress) &&
          addressesWithoutEmptyString.includes(transferHistory.srcAddress)
        );
      });
    }

    return result;
  } catch (error) {
    const cleanHistory: TransferHistory[] = [];
    localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(cleanHistory));
    return [];
  }
};

export const updateTransferId = (
  previousTransferId: string, 
  updatedTransferId: string
) => {
    try {
      const localTransferListStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
      let transferHistoryList: TransferHistory[] = [];
      if (localTransferListStr) {
        transferHistoryList = JSON.parse(localTransferListStr) as TransferHistory[];
      }
    
      const existingHistoryItem = transferHistoryList.find(transferHistory => {
        return transferHistory.transfer_id === previousTransferId
      })
      if (existingHistoryItem) {
        const index = transferHistoryList.indexOf(existingHistoryItem)
        const updatedHistoryItem = clone(existingHistoryItem)
        // eslint-disable-next-line
        updatedHistoryItem.transfer_id = updatedTransferId
        transferHistoryList[index] = updatedHistoryItem
      }

      localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(transferHistoryList));
    } catch (error) {
      console.debug("error", error)
    }
}

