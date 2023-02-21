import { ethers } from "ethers";
import {
  createContext,
  ReactChild,
  ReactChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import transactorWithNotifier, {
  Transactor,
} from "../helpers/transactorWithNotifier";
import { useContractLoader } from "../hooks";
import { BridgeContracts, bridgeContracts } from "../hooks/contractLoader";
import { useAppSelector } from "../redux/store";
import { useWeb3Context } from "./Web3ContextProvider";
/* eslint-disable no-debugger */
interface ContractsContextProps {
  contracts: BridgeContracts;
  transactor: Transactor<ethers.ContractTransaction> | undefined;
}

interface ContractsContextProviderProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export const ContractsContext = createContext<ContractsContextProps>({
  contracts: bridgeContracts,
  transactor: undefined,
});

export const ContractsContextProvider = ({
  children,
}: ContractsContextProviderProps): JSX.Element => {
  const { provider, chainId } = useWeb3Context();
  const [addresses, setAddresses] = useState<
    Record<string, string | undefined>
  >({});

  const { swapAddresses, swapContractAddr, faucetAddresses } = useAppSelector(
    (state) => state.globalInfo
  );
  useEffect(() => {
    setAddresses({
      bridge: swapAddresses,
      transferSwapper: swapContractAddr,
      faucet: faucetAddresses[chainId],
    });
  }, [swapAddresses, swapContractAddr, chainId, faucetAddresses]);
  const contracts = useContractLoader(provider, addresses);
  const transactor =
    transactorWithNotifier<ethers.ContractTransaction>(provider);

  return (
    <ContractsContext.Provider
      value={{
        contracts,
        transactor,
      }}
    >
      {children}
    </ContractsContext.Provider>
  );
};

export const useContractsContext: () => ContractsContextProps = () =>
  useContext(ContractsContext);
