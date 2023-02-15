import React from "react";

import "./app.css";
import "./app.less";

import { ThemeProvider } from "react-jss";
import { ColorThemeContext } from "./providers/ThemeProvider";
import { ConfigContextProvider } from "./providers/ConfigContextProvider";
import { getDefaultTheme } from "./theme";
import useThemeType from "./hooks/useThemeType";
import CBridgeTransferHome from "./views/CBridgeTransferHome";
import { useWindowWidth } from "./hooks";
import { BridgeChainTokensProvider } from "./providers/BridgeChainTokensProvider";

export default function App(): JSX.Element {
  const [themeType, toggleTheme] = useThemeType();
  useWindowWidth();
  return (
    <ConfigContextProvider>
      <ColorThemeContext.Provider value={{ themeType, toggleTheme }}>
        <ThemeProvider theme={getDefaultTheme(themeType)}>
          <BridgeChainTokensProvider>
            <CBridgeTransferHome />
          </BridgeChainTokensProvider>
        </ThemeProvider>
      </ColorThemeContext.Provider>
    </ConfigContextProvider>
  );
}
