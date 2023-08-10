import { createContext, ReactChild, ReactChildren, useContext, useEffect, useState } from "react";
import { useWeb3Context } from "./Web3ContextProvider";
import { useAppSelector } from "../redux/store";

interface WalletConnectionContextProps {
  walletAddress: string;
  connected: boolean;
  walletConnectionButtonTitle: string;
}

export const WalletConnectionContext = createContext<WalletConnectionContextProps>({
  walletAddress: "",
  connected: false,
  walletConnectionButtonTitle: "Connect Wallet",
});

interface WalletConnectionContextProviderProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export const WalletConnectionContextProvider = ({ children }: WalletConnectionContextProviderProps): JSX.Element => {
  const [walletAddress, setWalletAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [walletConnectionButtonTitle, setWalletConnectionButtonTitle] = useState("Connect Wallet");
  const { fromChain } = useAppSelector(state => state.transferInfo);
  const { signer, address } = useWeb3Context();

  useEffect(() => {
    if (signer) {
      setConnected(true);
      setWalletAddress(address);
      setWalletConnectionButtonTitle("");
    } else {
      setWalletAddress("");
      setConnected(false);
      setWalletConnectionButtonTitle("Connect Wallet");
    }
  }, [signer, address, fromChain]);

  return (
    <WalletConnectionContext.Provider
      value={{
        walletAddress,
        connected,
        walletConnectionButtonTitle,
      }}
    >
      {children}
    </WalletConnectionContext.Provider>
  );
};

export const useWalletConnectionContext: () => WalletConnectionContextProps = () => useContext(WalletConnectionContext);
