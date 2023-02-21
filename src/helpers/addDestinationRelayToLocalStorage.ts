import { storageConstants } from "../constants/const";
 
 export const addNewDestinationRelayFinishedTransferId = (swapId: string) => {
    let swapRelayFinishedIds: string[] = [];
    
    try {
      const swapRelayFinishedIdsJSON = localStorage.getItem(storageConstants.KEY_SWAP_RELAY_CHECK);
      if (swapRelayFinishedIdsJSON) {
        swapRelayFinishedIds = JSON.parse(swapRelayFinishedIdsJSON) as string[];
      }
      swapRelayFinishedIds.push(swapId)
      localStorage.setItem(storageConstants.KEY_SWAP_RELAY_CHECK, JSON.stringify(swapRelayFinishedIds));
    } catch (error) {
      console.debug("error", error)
    }
  }