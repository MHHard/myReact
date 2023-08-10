import { message } from "antd";
import { createContext, ReactChild, ReactChildren, useCallback, useContext, useEffect, useState } from "react";
import { useAsync } from "react-use";
import { useHistory } from "react-router-dom";

import Web3Modal from "@celer-network/web3modal";
import { StaticJsonRpcProvider, JsonRpcSigner, Web3Provider } from "@ethersproject/providers"; // InfuraProvider,
import WalletConnectProvider from "@walletconnect/web3-provider";
import { NetworkInfo } from "../constants/network"; // INFURA_ID
import { storageConstants } from "../constants/const";
import { TabKeys, generateTabKey } from "../helpers/viewTabKeyGeneration";
import { LocalChainConfigType } from "../constants/type";

// const targetNetworkId = Number(process.env.REACT_APP_NETWORK_ID) || 3;
const defaultChain = {
  name: "",
  chainId: 883,
  rpcUrl: "http://localhost:8545",
  iconUrl: "./noChain.png",
  symbol: "",
  blockExplorerUrl: "",
  tokenSymbolList: [],
  lqMintTokenSymbolBlackList: [],
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

let web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  network: "mainnet",
  providerOptions: {
    injected: {
      display: {
        // logo: "data:image/gif;base64,INSERT_BASE64_STRING",
        name: "Injected",
        description: "Connect with the provider in your Browser",
      },
      package: null,
    },
    // Example with WalletConnect provider
    walletconnect: {
      display: {
        // logo: "data:image/gif;base64,INSERT_BASE64_STRING",
        name: "Mobile",
        description: "Scan qrcode with your mobile wallet",
      },
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID, // required
        rpc: {},
      },
    },
  },
  theme: "dark",
});
interface Web3ContextProps {
  provider: StaticJsonRpcProvider | undefined;
  signer: JsonRpcSigner | undefined;
  network: string;
  address: string;
  rpcUrl: string;
  chainId: number;
  web3Modal: Web3Modal;
  connecting: boolean;
  CHAIN_LIST: NetworkInfo[];
  basicConfiguration: LocalChainConfigType;
  loadWeb3Modal: (providerName: string, catchMethod?: () => void) => Promise<void>;
  logoutOfWeb3Modal: () => Promise<void>;
  setWbe3Config: (providerIn: StaticJsonRpcProvider | undefined, config: LocalChainConfigType) => Promise<void>;
  getNetworkById: (cId: number | string) => NetworkInfo;
}

interface Web3ContextProviderProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export const Web3Context = createContext<Web3ContextProps>({
  provider: undefined,
  signer: undefined,
  address: "",
  rpcUrl: "",
  network: "",
  chainId: 0,
  web3Modal,
  connecting: false,
  CHAIN_LIST: [],
  basicConfiguration: {},
  loadWeb3Modal: async () => {},
  logoutOfWeb3Modal: async () => {},
  setWbe3Config: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getNetworkById: cId => {
    const test: NetworkInfo = defaultChain;
    return test;
  },
});

export const Web3ContextProvider = ({ children }: Web3ContextProviderProps): JSX.Element => {
  // const networkObject = getNetworkById(targetNetworkId);
  const [provider, setProvider] = useState<StaticJsonRpcProvider>();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [network, setNetwork] = useState("");
  const [address, setAddress] = useState("");
  const [rpcUrl, setRpcUrl] = useState("");
  const [chainId, setChainId] = useState(0);
  const [connectName, setConnectName] = useState("injected");
  const [connecting, setConnecting] = useState(false);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [web3Connection, setWeb3Connection] = useState<any>();
  const [shouldReload, setShouldReload] = useState(false);
  const [chainList, setChainList] = useState<NetworkInfo[]>([]);
  const [basicConfig, setBasicConfig] = useState<LocalChainConfigType>({});
  const [newChainId, setNewChainId] = useState(0);
  const history = useHistory();

  useAsync(async () => {
    if (!web3Connection) {
      return;
    }
    web3Connection.on("accountsChanged", () => {
      window.location.reload();
    });

    web3Connection.on("chainChanged", web3ChainId => {
      setNewChainId(parseInt(web3ChainId, 16));
      setShouldReload(true);
    });

    web3Connection.on("disconnect", () => {
      if (web3Modal.cachedProvider && web3Modal.cachedProvider === "walletconnect") {
        web3Modal.clearCachedProvider();
        window.location.reload();
      }
    });
  }, [web3Connection, shouldReload]);

  useEffect(() => {
    if (shouldReload) {
      const sessionRefId = sessionStorage.getItem("refId") ?? "";
      let refIdSuffix = "";

      if (sessionRefId.length > 0) {
        refIdSuffix = "?ref=" + sessionRefId;
      }

      if (generateTabKey(history.location.pathname.toLowerCase()) === TabKeys.Transfer) {
        const localSourceChainId = localStorage.getItem(storageConstants.KEY_FROM_CHAIN_ID);
        const localDestinationChainId = localStorage.getItem(storageConstants.KEY_TO_CHAIN_ID);
        if (newChainId.toString() === localDestinationChainId) {
          history.push(
            `/${newChainId}/${localSourceChainId ?? 0}/${localStorage.getItem(
              storageConstants.KEY_SELECTED_TOKEN_SYMBOL,
            )}${refIdSuffix}`,
          );
        } else {
          history.push(
            `/${newChainId}/${localStorage.getItem(storageConstants.KEY_TO_CHAIN_ID) ?? 0}/${localStorage.getItem(
              storageConstants.KEY_SELECTED_TOKEN_SYMBOL,
            )}${refIdSuffix}`,
          );
        }
      }

      window.location.reload();
    }
    // eslint-disable-next-line
  }, [shouldReload, newChainId]);

  // useAsync(async () => {
  //   if (web3Modal.cachedProvider && localStorage.getItem("loginReload") === "false") {
  //     localStorage.setItem("loginReload", "true");
  //     window.location.reload();
  //   }
  //   if (!web3Modal.cachedProvider) {
  //     localStorage.setItem("loginReload", "false");
  //   }
  // }, [web3Modal.cachedProvider]);

  useAsync(async () => {
    if (!provider) {
      return;
    }
    const networkData = await provider.getNetwork();
    console.debug("provider", provider, networkData);
    setChainId(networkData.chainId);
    setNetwork(networkData.name);
    const url = getNetworkById(networkData.chainId).rpcUrl;
    setRpcUrl(url);
  }, [provider]);

  const loadWeb3Modal = useCallback(async (providerName: string, catchMethod?: () => void) => {
    setConnecting(true);
    setConnectName(providerName);
    const cachedIsClover = localStorage.getItem(storageConstants.KEY_IS_CLOVER_WALLET) === "true";
    if (cachedIsClover) {
      await sleep(500);
    }

    const connection = await web3Modal.connectTo(providerName).catch(() => setConnecting(false));
    if (!connection) {
      if (catchMethod) {
        catchMethod();
      } else {
        message.error("connection failed!");
      }
      return;
    }
    setConnecting(false);
    setWeb3Connection(connection);
    const newProvider = new Web3Provider(connection);
    setProvider(newProvider);
    const newSigner = newProvider.getSigner();
    setSigner(newSigner);

    const walletAddress = await newSigner.getAddress();
    setAddress(walletAddress);
    localStorage.setItem(storageConstants.KEY_WEB3_PROVIDER_NAME, providerName);
  }, []);

  const getNetworkById: (cId: number | string) => NetworkInfo = (cId: number | string) => {
    for (let i = 0; i < chainList.length; i++) {
      if (chainList[i]?.chainId === cId || chainList[i].chainId === Number(cId)) {
        return chainList[i];
      }
    }
    return defaultChain;
  };
  useEffect(() => {
    const rpcMap = {};
    const chains: NetworkInfo[] = Object.values(basicConfig) as NetworkInfo[];
    /* eslint-disable-next-line no-restricted-syntax */
    for (const net of chains) {
      rpcMap[net.chainId] = net.rpcUrl;
    }
    web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      network: "mainnet",
      providerOptions: {
        injected: {
          display: {
            // logo: "data:image/gif;base64,INSERT_BASE64_STRING",
            name: "Injected",
            description: "Connect with the provider in your Browser",
          },
          package: null,
        },
        // Example with WalletConnect provider
        walletconnect: {
          display: {
            // logo: "data:image/gif;base64,INSERT_BASE64_STRING",
            name: "Mobile",
            description: "Scan qrcode with your mobile wallet",
          },
          package: WalletConnectProvider,
          options: {
            infuraId: process.env.REACT_APP_INFURA_ID, // required
            rpc: rpcMap,
          },
        },
      },
      theme: "dark",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicConfig]);

  const setWbe3Config = async (providerIn: StaticJsonRpcProvider | undefined, config: LocalChainConfigType) => {
    console.log(6666666, providerIn, config);

    if (!providerIn) {
      return;
    }
    setBasicConfig(config);
    const chains: NetworkInfo[] = Object.values(config) as NetworkInfo[];
    console.log(6665555, chains);
    setChainList(chains);
    setConnectName("");
    setProvider(provider);
    const newSigner = await providerIn.getSigner();
    setSigner(newSigner);
    const walletAddress = await newSigner.getAddress();
    setAddress(walletAddress);
    localStorage.setItem(storageConstants.KEY_WEB3_PROVIDER_NAME, "");
  };

  const logoutOfWeb3Modal = useCallback(async () => {
    if (web3Connection && web3Connection.close) {
      web3Connection.close();
    }
    web3Modal.clearCachedProvider();
    localStorage.setItem(storageConstants.KEY_TAB_KEY, "transfer");
    localStorage.removeItem(storageConstants.KEY_IS_CLOVER_WALLET);
    localStorage.setItem(storageConstants.KEY_CONNECTED_WALLET_NAME, "");
    window.location.reload();
  }, [web3Connection]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal(web3Modal.cachedProvider);
    }
  }, [loadWeb3Modal, connectName]);

  // useEffect(() => {
  //   let infuraProvider: StaticJsonRpcProvider | undefined;
  //   try {
  //     infuraProvider = new InfuraProvider(network, INFURA_ID);
  //   } catch (e) {
  //     // Ignored
  //   }
  //   setProvider(infuraProvider);
  // }, [network]);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        network,
        address,
        rpcUrl,
        chainId,
        web3Modal,
        connecting,
        CHAIN_LIST: chainList,
        basicConfiguration: basicConfig,
        loadWeb3Modal,
        logoutOfWeb3Modal,
        setWbe3Config,
        getNetworkById,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3Context: () => Web3ContextProps = () => useContext(Web3Context);
