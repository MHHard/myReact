import { TransferPair } from "../constants/type";

export const validateTransferPair = (transferPair: TransferPair): boolean => {
  if (
    transferPair.sourceChainInfo &&
    transferPair.sourceChainToken &&
    transferPair.sourceChainContractAddress &&
    transferPair.sourceChainContractAddress.length > 0 &&
    transferPair.destinationChainInfo &&
    transferPair.destinationToken &&
    transferPair.destinationChainContractAddress &&
    transferPair.destinationChainContractAddress.length > 0
  ) {
    return true;
  }

  return false;
};
