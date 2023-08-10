import { ethers } from "ethers";
import { createContext, ReactChild, ReactChildren, useContext } from "react";
import { BridgeType, TransferPair } from "../constants/type";
import { getTransferPairFunction } from "../helpers/transferPairGeneration";

/* eslint-disable*/

interface BridgeChainTokensContextProps {
  getTransferPair: (transferConfig, sourceChainId, destinationChainId, tokenSymbol, getNetworkById) => TransferPair;
  getTransferSnapshot: (transferPair: TransferPair) => string;
}

interface BridgeChainTokensProviderProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}
export const nullTransferPair: TransferPair = {
  sourceChainInfo: undefined,
  sourceChainToken: undefined,
  sourceChainContractAddress: undefined,
  sourceChainCanonicalTokenAddress: undefined,
  sourceChainContractVersion: 0,
  bridgeType: BridgeType.Null,
  destinationChainInfo: undefined,
  destinationToken: undefined,
  destinationChainContractAddress: undefined,
  destinationCanonicalTokenAddress: undefined,
  destinationChainContractVersion: 0,
  destinationChainMigrationPegBurnContractAddr: undefined,
};

export const BridgeChainTokensContext = createContext<BridgeChainTokensContextProps>({
  getTransferPair: () => {
    return nullTransferPair;
  },
  getTransferSnapshot: () => {
    return "";
  },
});

export const BridgeChainTokensProvider = ({ children }: BridgeChainTokensProviderProps): JSX.Element => {
  const getTransferPair = getTransferPairFunction;
  // get hash of the uniq string
  const getTransferSnapshot = (transferPair: TransferPair) => {
    const str = `${transferPair.sourceChainInfo?.id}-${transferPair.sourceChainToken?.token.address}-${transferPair.destinationChainInfo?.id}-${transferPair.destinationToken?.token.address}`;
    return ethers.utils.id(str);
  };

  return (
    <BridgeChainTokensContext.Provider
      value={{
        getTransferPair,
        getTransferSnapshot,
      }}
    >
      {children}
    </BridgeChainTokensContext.Provider>
  );
};

export const useBridgeChainTokensContext: () => BridgeChainTokensContextProps = () =>
  useContext(BridgeChainTokensContext);
