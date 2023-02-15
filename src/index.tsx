import React from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { WalletProvider } from "@manahippo/aptos-wallet-adapter";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";
import { Wallet, WalletStrategy } from "@injectivelabs/wallet-ts";
import App from "./App";
import store, { persistor } from "./redux/store";

import { Web3ContextProvider } from "./providers/Web3ContextProvider";
import { ContractsContextProvider } from "./providers/ContractsContextProvider";
import { WalletConnectionContextProvider } from "./providers/WalletConnectionContextProvider";
import { aptosWallets, NonEVMContextProvider } from "./providers/NonEVMContextProvider";
import BlockList from "./components/blockList";
import { LogHelper } from "./utils/LogHelper";

const root = document.getElementById("root");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {
    walletStrategy: WalletStrategy;
  }
}
interface globalThis {
  [walletStrategy: string]: WalletStrategy;
}
const getEthereumOptions = () => {
  const getRpcUrlsForChainIds = (): Record<EthereumChainId, string> => {
    return {
      [EthereumChainId.Ganache]: "http://localhost:8545",
      [EthereumChainId.HardHat]: "http://localhost:8545",
      [EthereumChainId.Goerli]: `https://eth-goerli.alchemyapi.io/v2/${process.env.APP_ALCHEMY_GOERLI_KEY}`,
      [EthereumChainId.Kovan]: `https://eth-kovan.alchemyapi.io/v2/${process.env.APP_ALCHEMY_KOVAN_KEY}`,
      [EthereumChainId.Mainnet]: `https://eth-mainnet.alchemyapi.io/v2/${process.env.APP_ALCHEMY_KEY}`,
      [EthereumChainId.Injective]: "",
      [EthereumChainId.Rinkeby]: "",
      [EthereumChainId.Ropsten]: "",
    };
  };

  const getRpcWsUrlsForChainIds = (): Record<EthereumChainId, string> => {
    return {
      [EthereumChainId.Ganache]: "ws://localhost:1318",
      [EthereumChainId.HardHat]: "ws://localhost:1318",
      [EthereumChainId.Goerli]: `wss://eth-goerli.ws.alchemyapi.io/v2/${process.env.APP_ALCHEMY_GOERLI_KEY}`,
      [EthereumChainId.Kovan]: `wss://eth-kovan.ws.alchemyapi.io/v2/${process.env.APP_ALCHEMY_KOVAN_KEY}`,
      [EthereumChainId.Mainnet]: `wss://eth-mainnet.ws.alchemyapi.io/v2/${process.env.APP_ALCHEMY_KEY}`,
      [EthereumChainId.Injective]: "",
      [EthereumChainId.Rinkeby]: "",
      [EthereumChainId.Ropsten]: "",
    };
  };

  const rpcUrls = getRpcUrlsForChainIds();
  const wsRpcUrls = getRpcWsUrlsForChainIds();

  return {
    ethereumChainId: EthereumChainId.Goerli,
    wsRpcUrl: rpcUrls[EthereumChainId.Goerli],
    rpcUrl: wsRpcUrls[EthereumChainId.Goerli],
  };
};

const walletStrategy = new WalletStrategy({
  chainId: ChainId.Testnet,
  wallet: Wallet.Keplr,
  /** optional, if you want to use ethereum native wallets */
  ethereumOptions: getEthereumOptions(),
});

(global as unknown as globalThis).walletStrategy = walletStrategy;

LogHelper.Init();

if (root) {
  createRoot(root).render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            {/* eslint-disable-next-line */}
            <Web3ContextProvider>
              <WalletProvider
                wallets={aptosWallets}
                // autoConnect={true | false} /** allow auto wallet connection or not * */
                onError={(error: Error) => {
                  console.log("Handle Error Message", error);
                }}
              >
                <BlockList>
                  <NonEVMContextProvider>
                    <WalletConnectionContextProvider>
                      <ContractsContextProvider>
                        <App />
                      </ContractsContextProvider>
                    </WalletConnectionContextProvider>
                  </NonEVMContextProvider>
                </BlockList>
              </WalletProvider>
            </Web3ContextProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>,
  );
}
