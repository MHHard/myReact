/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useWallet,
  WalletName,
  MartianWalletAdapter,
  AptosWalletAdapter,
  FewchaWalletAdapter,
  BitkeepWalletAdapter,
  BloctoWalletAdapter,
  WalletAdapterNetwork,
} from "@manahippo/aptos-wallet-adapter";
import { OfflineSigner } from "@cosmjs/proto-signing";

import * as fcl from "@onflow/fcl";
import { connect as connectSei, WalletWindowKey } from "@sei-js/core";

import { Types } from "aptos";
import { createContext, ReactChild, ReactChildren, useCallback, useContext, useEffect, useState } from "react";
import { storageConstants } from "../constants/const";
import { convertSeiToCanonicalAddress } from "../redux/NonEVMAPIs/seiAPI";

import { useAppDispatch, useAppSelector } from "../redux/store";
import { setFromChain } from "../redux/transferSlice";
import { convertInjToCanonicalAddress } from "../redux/NonEVMAPIs/injectiveAPI";

const networkType: WalletAdapterNetwork =
  process.env.REACT_APP_APTOS_NET === "Testnet" ? WalletAdapterNetwork.Testnet : WalletAdapterNetwork.Mainnet;
const adapterConfig = {
  network: networkType,
  bloctoAppId: "727c7c49-ac2e-49b2-a2dc-e8ce54d5337d",
};

export const aptosWallets = [
  new AptosWalletAdapter(),
  new BloctoWalletAdapter(adapterConfig),
  new MartianWalletAdapter(),
  new BitkeepWalletAdapter(),
  new FewchaWalletAdapter(),
];
// eslint-disable-next-line
export enum NonEVMMode {
  off, // Both from and to chains are EVM
  flowMainnet, // 12340001
  flowTest, // 12340002
  aptosMainnet, // 12360001
  aptosTest, // 12360002
  aptosDevnet, // 12360003
  seiMainnet, // atlantic
  seiTestnet, // atlantic-1
  seiDevnet, // sei-devnet-1
  injectiveTestnet, // injective-888
  injectiveMainnet, // injective-1
}

// eslint-disable-next-line
export enum FlowProvider {
  blocto,
  lilico,
}

interface NonEVMContextProps {
  nonEVMMode: NonEVMMode;
  nonEVMAddress: string;
  nonEVMConnected: boolean;
  // eslint-disable-next-line
  flowUser: any;
  flowConnected: boolean;
  flowAddress: string;
  aptosConnected: boolean;
  aptosAddress: string;
  seiConnected: boolean;
  seiAddress: string;
  seiProvider: any;
  injConnected: boolean;
  injAddress: string;
  shouldNotifyUserSwitchToCorrectWalletEndpoint: boolean;
  loadNonEVMModal: (mode: NonEVMMode, walletName?: WalletName<string> | undefined) => Promise<void>;
  logoutNonEVMModal: () => Promise<void>;
  setFlowInToChain: () => void;
  setAptosInToChain: () => void;
  setFlowProviderConfig: (flowProvider: FlowProvider) => void;
  signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any,
  ): Promise<{ hash: Types.HexEncodedBytes }>;
}

export const NonEVMContext = createContext<NonEVMContextProps>({
  nonEVMMode: NonEVMMode.off,
  nonEVMAddress: "",
  nonEVMConnected: false,
  flowUser: {},
  flowConnected: false,
  flowAddress: "",
  aptosConnected: false,
  aptosAddress: "",
  seiConnected: false,
  seiAddress: "",
  seiProvider: undefined,
  injConnected: false,
  injAddress: "",
  shouldNotifyUserSwitchToCorrectWalletEndpoint: false,
  loadNonEVMModal: async (_: NonEVMMode, _walletName: WalletName<string> | undefined) => {},
  logoutNonEVMModal: async () => {},
  setFlowInToChain: () => {},
  setAptosInToChain: () => {},
  setFlowProviderConfig: (_: FlowProvider) => {},
} as NonEVMContextProps);

interface NonEVMContextProviderProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export const NonEVMContextProvider = ({ children }: NonEVMContextProviderProps): JSX.Element => {
  const { fromChain, toChain, transferConfig } = useAppSelector(state => state.transferInfo);
  const [nonEVMMode, setNonEVMMode] = useState<NonEVMMode>(NonEVMMode.off);
  const [nonEVMAddress, setNonEVMAddress] = useState("");
  const [nonEVMConnected, setNonEVMConnected] = useState(false);

  const [flowUser, setFlowUser] = useState({});
  const [flowConnected, setFlowConnected] = useState(false);
  const [flowAddress, setFlowAddress] = useState("");
  const [shouldSwitchToFlow, setShouldSwitchToFlow] = useState(false);
  const [shouldLetFlowStayInToChain, setShouldLetFlowStayInToChain] = useState(false);

  const [aptosAddress, setAptosAddress] = useState("");
  const [aptosConnected, setAptosConnected] = useState(false);
  const [shouldSwitchToAptos, setShouldSwitchToAptos] = useState(false);

  const [seiAddress, setSeiAddress] = useState("");
  const [seiProvider, setSeiProvider] = useState<OfflineSigner>();
  const [seiConnected, setSeiConnected] = useState(false);
  const [injConnected, setInjConnected] = useState(false);
  const [injAddress, setInjAddress] = useState("");

  // const [shouldSwitchToSei, setShouldSwitchToSei] = useState(false);

  const [shouldLetAptosStayInToChain, setShouldLetAptosStayInToChain] = useState(false);
  const [shouldNotifyUserSwitchToCorrectWalletEndpoint, setshouldNotifyUserSwitchToCorrectWalletEndpoint] =
    useState(false);
  const { connect, disconnect, connected, network, account, signAndSubmitTransaction } = useWallet();

  const dispatch = useAppDispatch();
  const loadNonEVMModal = useCallback(
    async (mode: NonEVMMode, walletName = "") => {
      switch (mode) {
        case NonEVMMode.flowMainnet:
        case NonEVMMode.flowTest: {
          if (!flowConnected) {
            setShouldSwitchToFlow(true);
            fcl.authenticate();
          }
          break;
        }
        case NonEVMMode.aptosMainnet:
        case NonEVMMode.aptosTest:
        case NonEVMMode.aptosDevnet: {
          if (!aptosConnected) {
            setShouldSwitchToAptos(true);
            connectAptosWallet(walletName);
          }
          break;
        }
        case NonEVMMode.seiMainnet:
        case NonEVMMode.seiDevnet:
        case NonEVMMode.seiTestnet: {
          if (!seiConnected) {
            // setShouldSwitchToSei(true);
            connectSeiWallet(walletName);
          }
          break;
        }
        case NonEVMMode.injectiveTestnet:
        case NonEVMMode.injectiveMainnet: {
          if (!injConnected) {
            // setShouldSwitchToSei(true);
            connectInjWallet(walletName);
          }
          break;
        }
        default: {
          console.debug("Unsupported NonEVM mode login", mode);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flowConnected, aptosConnected, seiConnected, injConnected, connect],
  );

  const logoutNonEVMModal = useCallback(async () => {
    switch (nonEVMMode) {
      case NonEVMMode.flowMainnet:
      case NonEVMMode.flowTest: {
        if (flowConnected) {
          fcl.unauthenticate();
          localStorage.setItem(storageConstants.KEY_FLOW_CONNECTED_WALLET_NAME, "");
        }
        break;
      }
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        if (aptosConnected) {
          disconnect().then(() => {
            localStorage.setItem(storageConstants.KEY_IS_APTOS_CONNECTED, "false");
            localStorage.setItem(storageConstants.KEY_APTOS_CONNECTED_WALLET_NAME, "");
          });
        }
        break;
      }
      case NonEVMMode.seiMainnet:
      case NonEVMMode.seiDevnet:
      case NonEVMMode.seiTestnet: {
        if (seiConnected) {
          // disconnectSei();
          setSeiConnected(false);
          localStorage.setItem(storageConstants.KEY_IS_SEI_CONNECTED, "false");
          localStorage.setItem(storageConstants.KEY_SEI_CONNECTED_WALLET_NAME, "");
        }
        break;
      }
      case NonEVMMode.injectiveTestnet:
      case NonEVMMode.injectiveMainnet: {
        if (injConnected) {
          setInjConnected(false);
          localStorage.setItem(storageConstants.KEY_IS_INJ_CONNECTED, "false");
          localStorage.setItem(storageConstants.KEY_INJ_CONNECTED_WALLET_NAME, "");
        }
        break;
      }
      default: {
        console.debug("Unsupported NonEVM mode logout", nonEVMMode);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonEVMMode, flowConnected, aptosConnected, seiConnected, injConnected]);

  useEffect(() => {
    const isAptosConnected = localStorage.getItem(storageConstants.KEY_IS_APTOS_CONNECTED) === "true";
    const connectName = localStorage.getItem(storageConstants.KEY_APTOS_CONNECTED_WALLET_NAME);
    const fromChainIsAptos = isAptosChain(fromChain?.id || 1);
    const toChainIsAptos = isAptosChain(toChain?.id || 1);
    if (isAptosConnected && connectName) {
      setAptosConnected(true);
      if (fromChainIsAptos || toChainIsAptos) {
        connectAptosWallet(connectName);
      }
    }
    const isSeiConnected = localStorage.getItem(storageConstants.KEY_IS_SEI_CONNECTED) === "true";
    const seiConnectName = localStorage.getItem(storageConstants.KEY_SEI_CONNECTED_WALLET_NAME);
    const fromChainIsSei = isSeiChain(fromChain?.id || 1);
    const toChainIsSei = isSeiChain(toChain?.id || 1);
    if (isSeiConnected && seiConnectName) {
      setSeiConnected(true);
      if (fromChainIsSei || toChainIsSei) {
        connectSeiWallet(seiConnectName);
      }
    }
    const isInjConnected = localStorage.getItem(storageConstants.KEY_IS_INJ_CONNECTED) === "true";
    const injConnectName = localStorage.getItem(storageConstants.KEY_INJ_CONNECTED_WALLET_NAME);
    const fromChainIsInj = isInjChain(fromChain?.id || 1);
    const toChainIsInj = isInjChain(toChain?.id || 1);
    if (isInjConnected && injConnectName) {
      setInjConnected(true);
      if (fromChainIsInj || toChainIsInj) {
        connectInjWallet(injConnectName);
      }
    }
    const fromChainMode = getNonEVMMode(fromChain?.id ?? 0);
    if (fromChainMode !== NonEVMMode.off) {
      setNonEVMMode(fromChainMode);
      return;
    }
    setNonEVMMode(getNonEVMMode(toChain?.id ?? 0));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromChain, toChain]);

  useEffect(() => {
    switch (nonEVMMode) {
      case NonEVMMode.off: {
        setNonEVMConnected(false);
        setNonEVMAddress("");
        break;
      }
      case NonEVMMode.flowMainnet:
      case NonEVMMode.flowTest: {
        setNonEVMConnected(flowConnected);
        setNonEVMAddress(flowAddress);
        break;
      }
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        setNonEVMConnected(aptosConnected);
        setNonEVMAddress(aptosAddress);
        break;
      }
      case NonEVMMode.seiMainnet:
      case NonEVMMode.seiDevnet:
      case NonEVMMode.seiTestnet: {
        setNonEVMConnected(seiConnected);
        setNonEVMAddress(seiAddress);
        break;
      }
      case NonEVMMode.injectiveTestnet:
      case NonEVMMode.injectiveMainnet: {
        setNonEVMConnected(injConnected);
        setNonEVMAddress(injAddress);
        break;
      }
      default: {
        console.debug("Unknown nonEVMMode", nonEVMMode);
        setNonEVMConnected(false);
        setNonEVMAddress("");
        break;
      }
    }
  }, [
    nonEVMMode,
    flowConnected,
    flowAddress,
    aptosConnected,
    aptosAddress,
    seiConnected,
    seiAddress,
    injConnected,
    injAddress,
  ]);

  useEffect(() => {
    fcl
      .config()
      .put("accessNode.api", process.env.REACT_APP_FLOW_ACCESS_NODE)
      .put("discovery.wallet.method", "HTTP/POST")
      .put("discovery.wallet", process.env.REACT_APP_FLOW_GENERAL_DISCOVERY);

    // eslint-disable-next-line
  }, []);

  const connectAptosWallet = connectName => {
    connect(connectName as WalletName)
      .then(() => {
        localStorage.setItem(storageConstants.KEY_IS_APTOS_CONNECTED, "true");
        localStorage.setItem(storageConstants.KEY_APTOS_CONNECTED_WALLET_NAME, connectName);
      })
      .catch(e => {
        console.log("connect error:", e);
      });
  };

  const connectSeiWallet = connectName => {
    if (connectName) {
      connectSei(connectName as WalletWindowKey)
        .then(res => {
          if (res) {
            setSeiProvider(res.offlineSigner);
            setSeiAddress(res?.accounts[0]?.address);
            setSeiConnected(true);
            localStorage.setItem(storageConstants.KEY_IS_SEI_CONNECTED, "true");
            localStorage.setItem(storageConstants.KEY_SEI_CONNECTED_WALLET_NAME, connectName);
          }
        })
        .catch(e => {
          console.log("connect error:", e);
        });
    }
  };
  const connectInjWallet = async connectName => {
    if (connectName && window) {
      await window?.walletStrategy.setWallet(connectName);
      const accounts = await window?.walletStrategy.getAddresses();
      setInjAddress(accounts[0]);
      setInjConnected(true);
      localStorage.setItem(storageConstants.KEY_IS_INJ_CONNECTED, "true");
      localStorage.setItem(storageConstants.KEY_INJ_CONNECTED_WALLET_NAME, connectName);
    }
  };

  useEffect(() => {
    // window.addEventListener("keplr_keystorechange", () => {
    //   console.log("Key store in Keplr is changed. You may need to refetch the account info.");
    // });
    // window.addEventListener("onAccountChange", e => {
    //   console.log("8889999:", (e as CustomEvent).detail);
    // });
    // console.log(111, window);
    // window?.walletStrategy.onAccountChange(() => {
    //   console.log(124);
    // });
    // const injConnectName = localStorage.getItem(storageConstants.KEY_INJ_CONNECTED_WALLET_NAME);
    // if (isInjChain(fromChain?.id || 1)) {
    //   connectInjWallet(injConnectName);
    // }
    // return () => {
    //   window.removeEventListener("keplr_keystorechange", () => {});
    // };
  }, []);

  useEffect(() => {
    /// FCL config
    fcl.currentUser().subscribe(user => {
      const { loggedIn, addr } = user;

      if (loggedIn && loggedIn !== undefined) {
        setFlowConnected(loggedIn);
        if (loggedIn === true) {
          const fromChainId = fromChain?.id ?? 0;
          if (shouldSwitchToFlow) {
            const targetChainIdForFlow = targetChainIdForNonEVMMode(
              process.env.REACT_APP_ENV === "TEST" || process.env.REACT_APP_ENV === "DEV"
                ? NonEVMMode.flowTest
                : NonEVMMode.flowMainnet,
            );
            if (fromChainId !== targetChainIdForFlow) {
              const chain = transferConfig.chains.find(chainInfo => {
                return chainInfo.id === targetChainIdForFlow;
              });
              if (chain !== undefined && !shouldLetFlowStayInToChain) {
                dispatch(setFromChain(chain));
              }
              setShouldLetFlowStayInToChain(false);
            }
          }
          setShouldSwitchToFlow(false);
        }
      } else {
        setFlowConnected(false);
      }
      if (addr && addr !== undefined) {
        setFlowAddress(addr);
      } else {
        setFlowAddress("");
      }
      setFlowUser({ ...user });
    });
  }, [fromChain, toChain, transferConfig, shouldSwitchToFlow, shouldLetFlowStayInToChain, dispatch]);

  useEffect(() => {
    if (aptosConnected) {
      const fromChainId = fromChain?.id ?? 0;
      if (shouldSwitchToAptos) {
        const targetChainIdForFlow = targetChainIdForNonEVMMode(
          process.env.REACT_APP_ENV === "TEST" || process.env.REACT_APP_ENV === "DEV"
            ? NonEVMMode.aptosDevnet
            : NonEVMMode.aptosTest,
        );
        if (fromChainId !== targetChainIdForFlow) {
          const chain = transferConfig.chains.find(chainInfo => {
            return chainInfo.id === targetChainIdForFlow;
          });
          if (chain !== undefined && !shouldLetAptosStayInToChain) {
            dispatch(setFromChain(chain));
          }
          setShouldLetAptosStayInToChain(false);
        }
      }
      setShouldSwitchToAptos(false);
    }
  }, [aptosConnected, transferConfig, shouldSwitchToAptos, fromChain, shouldLetAptosStayInToChain, dispatch]);

  useEffect(() => {
    setAptosConnected(connected);
    setAptosAddress(convertNonEVMAddressToEVMCompatible(account?.address?.toString() ?? "", NonEVMMode.aptosMainnet));
    setshouldNotifyUserSwitchToCorrectWalletEndpoint(
      network?.name?.toLowerCase() !== (process.env.REACT_APP_APTOS_NET?.toLowerCase() ?? ""),
    );
  }, [connected, account, network]);

  const setFlowInToChain = () => {
    setShouldLetFlowStayInToChain(true);
  };

  const setAptosInToChain = () => {
    setShouldLetAptosStayInToChain(true);
  };

  const setFlowProviderConfig = (flowProvider: FlowProvider) => {
    switch (flowProvider) {
      case FlowProvider.blocto: {
        fcl
          .config()
          .put("discovery.wallet.method", "HTTP/POST")
          .put("discovery.wallet", process.env.REACT_APP_FLOW_BLOCTO_DISCOVERY);
        break;
      }
      case FlowProvider.lilico: {
        fcl
          .config()
          .put("discovery.wallet.method", "EXT/RPC")
          .put("discovery.wallet", "chrome-extension://hpclkefagolihohboafpheddmmgdffjm/popup.html");
        break;
      }
      default: {
        console.error("Unsupported flow wallet");
      }
    }
  };
  return (
    <NonEVMContext.Provider
      value={{
        nonEVMMode,
        nonEVMAddress,
        nonEVMConnected,
        flowUser,
        flowConnected,
        flowAddress,
        aptosConnected,
        aptosAddress,
        seiConnected,
        seiAddress,
        seiProvider,
        injConnected,
        injAddress,
        shouldNotifyUserSwitchToCorrectWalletEndpoint,
        loadNonEVMModal,
        logoutNonEVMModal,
        setFlowInToChain,
        setAptosInToChain,
        setFlowProviderConfig,
        signAndSubmitTransaction,
      }}
    >
      {children}
    </NonEVMContext.Provider>
  );
};
export const useNonEVMContext: () => NonEVMContextProps = () => useContext(NonEVMContext);

export const isNonEVMChain = (chainId: number) => {
  return getNonEVMMode(chainId) !== NonEVMMode.off;
};

export const getNonEVMMode = (targetChainId: number | string) => {
  if (targetChainId === 12340001) {
    return NonEVMMode.flowMainnet;
  }

  if (targetChainId === 12340002) {
    return NonEVMMode.flowTest;
  }

  if (targetChainId === 12360001) {
    return NonEVMMode.aptosMainnet;
  }

  if (targetChainId === 12360002) {
    return NonEVMMode.aptosTest;
  }

  if (targetChainId === 12360003) {
    return NonEVMMode.aptosDevnet;
  }
  if (targetChainId === 999999998) {
    return NonEVMMode.seiTestnet;
  }
  if (targetChainId === 999999998) {
    return NonEVMMode.seiDevnet;
  }
  if (targetChainId === "atlantic") {
    return NonEVMMode.seiMainnet;
  }
  if (targetChainId === 999999997) {
    return NonEVMMode.injectiveTestnet;
  }
  if (targetChainId === 999999997) {
    return NonEVMMode.injectiveMainnet;
  }

  return NonEVMMode.off;
};

export const isAptosChain = (chainId: number) => {
  const nonEVMMode = getNonEVMMode(chainId);
  return (
    nonEVMMode === NonEVMMode.aptosMainnet ||
    nonEVMMode === NonEVMMode.aptosTest ||
    nonEVMMode === NonEVMMode.aptosDevnet
  );
};
export const isSeiChain = (chainId: number) => {
  const nonEVMMode = getNonEVMMode(chainId);
  return (
    nonEVMMode === NonEVMMode.seiMainnet || nonEVMMode === NonEVMMode.seiTestnet || nonEVMMode === NonEVMMode.seiDevnet
  );
};
export const isInjChain = (chainId: number) => {
  const nonEVMMode = getNonEVMMode(chainId);
  return nonEVMMode === NonEVMMode.injectiveTestnet;
};

const targetChainIdForNonEVMMode = (mode: NonEVMMode) => {
  if (mode === NonEVMMode.flowMainnet) {
    return 12340001;
  }

  if (mode === NonEVMMode.flowTest) {
    return 12340002;
  }

  if (mode === NonEVMMode.aptosMainnet) {
    return 12360001;
  }

  if (mode === NonEVMMode.aptosTest) {
    return 12360002;
  }

  if (mode === NonEVMMode.aptosDevnet) {
    return 12360003;
  }
  if (mode === NonEVMMode.seiTestnet) {
    return 999999998;
  }
  if (mode === NonEVMMode.seiDevnet) {
    return 999999998;
  }
  if (mode === NonEVMMode.seiMainnet) {
    return "atlantic";
  }
  if (mode === NonEVMMode.injectiveTestnet) {
    return 999999997;
  }

  console.debug("Unexpect code path for nonEVMMode", mode);
  return 0;
};

export const convertNonEVMAddressToEVMCompatible = (address: string, mode: NonEVMMode) => {
  if (address.length === 0) {
    return "";
  }
  let newAddress = address;
  const addressWithoutOx = address.toLowerCase().replace("0x", "");
  switch (mode) {
    case NonEVMMode.flowMainnet:
    case NonEVMMode.flowTest: {
      newAddress = "0x" + addressWithoutOx.padStart(40, "0");
      break;
    }
    case NonEVMMode.aptosMainnet:
    case NonEVMMode.aptosTest:
    case NonEVMMode.aptosDevnet: {
      newAddress = "0x" + addressWithoutOx.padStart(64, "0");
      break;
    }
    case NonEVMMode.seiMainnet:
    case NonEVMMode.seiDevnet:
    case NonEVMMode.seiTestnet: {
      newAddress = convertSeiToCanonicalAddress(address); // "0x" + addressWithoutOx.padStart(64, "0");
      break;
    }
    case NonEVMMode.injectiveTestnet:
    case NonEVMMode.injectiveMainnet: {
      newAddress = convertInjToCanonicalAddress(address); // "0x" + addressWithoutOx.padStart(64, "0");
      break;
    }

    default: {
      break;
    }
  }

  return newAddress;
};
