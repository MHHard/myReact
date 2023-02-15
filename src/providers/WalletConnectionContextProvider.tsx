import { createContext, ReactChild, ReactChildren, useContext, useEffect, useState } from "react";
import { useWeb3Context } from "./Web3ContextProvider";
import { useNonEVMContext, getNonEVMMode, NonEVMMode } from "./NonEVMContextProvider";
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
  const { nonEVMAddress, nonEVMConnected } = useNonEVMContext();

  useEffect(() => {
    const fromChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
    switch (fromChainNonEVMMode) {
      case NonEVMMode.flowMainnet:
      case NonEVMMode.flowTest: {
        setConnected(nonEVMConnected);
        setWalletAddress(nonEVMConnected ? nonEVMAddress : "");
        setWalletConnectionButtonTitle(nonEVMConnected ? "" : "Connect Flow Wallet");
        break;
      }
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        setConnected(nonEVMConnected);
        setWalletAddress(nonEVMConnected ? nonEVMAddress : "");
        setWalletConnectionButtonTitle(nonEVMConnected ? "" : "Connect Aptos Wallet");
        break;
      }
      case NonEVMMode.seiMainnet:
      case NonEVMMode.seiDevnet:
      case NonEVMMode.seiTestnet: {
        setConnected(nonEVMConnected);
        setWalletAddress(nonEVMConnected ? nonEVMAddress : "");
        setWalletConnectionButtonTitle(nonEVMConnected ? "" : "Connect Sei Wallet");
        break;
      }
      case NonEVMMode.injectiveTestnet:
      case NonEVMMode.injectiveMainnet: {
        setConnected(nonEVMConnected);
        setWalletAddress(nonEVMConnected ? nonEVMAddress : "");
        setWalletConnectionButtonTitle(nonEVMConnected ? "" : "Connect Injective Wallet");
        break;
      }
      case NonEVMMode.off: {
        if (signer) {
          setConnected(true);
          setWalletAddress(address);
          setWalletConnectionButtonTitle("");
        } else {
          setWalletAddress("");
          setConnected(false);
          setWalletConnectionButtonTitle("Connect Wallet");
        }
        break;
      }
      default: {
        console.error("Unsupported nonEVMMode", fromChainNonEVMMode);
        if (signer) {
          setConnected(true);
          setWalletAddress(address);
          setWalletConnectionButtonTitle("");
        } else {
          setWalletAddress("");
          setConnected(false);
          setWalletConnectionButtonTitle("Connect Wallet");
        }
      }
    }
  }, [signer, address, nonEVMAddress, nonEVMConnected, fromChain]);

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
