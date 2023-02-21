import React from "react";

// import "./app.css";
// import "./app.less";

// import { ThemeProvider } from "react-jss";
// import { ColorThemeContext } from "./providers/ThemeProvider";
// import { ConfigContextProvider } from "./providers/ConfigContextProvider";
// import { getDefaultTheme } from "./theme";
// import useThemeType from "./hooks/useThemeType";
// import CBridgeTransferHome from "./views/CBridgeTransferHome";
// import { useWindowWidth } from "./hooks";
// import { BridgeChainTokensProvider } from "./providers/BridgeChainTokensProvider";

// export default function App(): JSX.Element {
//   const [themeType, toggleTheme] = useThemeType();
//   useWindowWidth();
//   return (
//     <ConfigContextProvider>
//       <ColorThemeContext.Provider value={{ themeType, toggleTheme }}>
//         <ThemeProvider theme={getDefaultTheme(themeType)}>
//           <BridgeChainTokensProvider>
//             <CBridgeTransferHome />
//           </BridgeChainTokensProvider>
//         </ThemeProvider>
//       </ColorThemeContext.Provider>
//     </ConfigContextProvider>
//   );
// }
import "./app.less";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import useThemeType from "./hooks/useThemeType";
import { ColorThemeContext } from "./providers/ThemeProvider";
import Home from "./views/Home";

// // eslint-disable-next-line @typescript-eslint/no-namespace

export default function App(): JSX.Element {
  const [themeType, toggleTheme, isMobile] = useThemeType();

  return (
    <ColorThemeContext.Provider value={{ themeType, toggleTheme, isMobile }}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/bridge/:srcChainId" component={Home} />
          <Route exact path="/bridge/:srcChainId/:srcTokenSymbol" component={Home} />
          <Route exact path="/bridge/:srcChainId/:srcTokenSymbol/:dstChainId" component={Home} />
          <Route exact path="*" component={Home} />
        </Switch>
      </BrowserRouter>
    </ColorThemeContext.Provider>
  );
}
