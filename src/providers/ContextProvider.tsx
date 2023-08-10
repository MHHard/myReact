import { createContext, ReactChild, ReactChildren, useCallback, useContext } from "react";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "react-jss";

import store, { persistor } from "../redux/store";
import { Web3ContextProvider } from "../providers/Web3ContextProvider";
import { ContractsContextProvider } from "../providers/ContractsContextProvider";
import { WalletConnectionContextProvider } from "../providers/WalletConnectionContextProvider";
import BlockList from "../components/blockList";
import { ColorThemeContext } from "./ThemeProvider";
import { BridgeChainTokensProvider } from "./BridgeChainTokensProvider";
import { getDefaultTheme } from "../theme";
import useThemeType from "../hooks/useThemeType";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

interface CbridgeContextProps {
  loadWeb3Modal: (providerName: string, catchMethod?: () => void) => Promise<void>;
  logoutOfWeb3Modal: () => Promise<void>;
}

interface CbridgeContextProviderProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export const CbridgeContext = createContext<CbridgeContextProps>({
  loadWeb3Modal: async () => {},
  logoutOfWeb3Modal: async () => {},
});

export const CbridgeContextProvider = ({ children }: CbridgeContextProviderProps): JSX.Element => {
  const [themeType, toggleTheme] = useThemeType();

  const loadWeb3Modal = useCallback(async () => {
    console.log(33333333);
  }, []);

  const logoutOfWeb3Modal = useCallback(async () => {
    console.log(4444444);
  }, []);

  return (
    <CbridgeContext.Provider
      value={{
        loadWeb3Modal,
        logoutOfWeb3Modal,
      }}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ColorThemeContext.Provider value={{ themeType, toggleTheme }}>
            <ThemeProvider theme={getDefaultTheme(themeType)}>
              <BridgeChainTokensProvider>
                <QueryClientProvider client={queryClient}>
                  <BrowserRouter>
                    <Web3ContextProvider>
                      <BlockList>
                        <WalletConnectionContextProvider>
                          <ContractsContextProvider>{children}</ContractsContextProvider>
                        </WalletConnectionContextProvider>
                      </BlockList>
                    </Web3ContextProvider>
                  </BrowserRouter>
                </QueryClientProvider>
              </BridgeChainTokensProvider>
            </ThemeProvider>
          </ColorThemeContext.Provider>
        </PersistGate>
      </Provider>
    </CbridgeContext.Provider>
  );
};

export const useCbridgeContext: () => CbridgeContextProps = () => useContext(CbridgeContext);
