import ReactDOM from "react-dom";
import App from "./App";

import { LogHelper } from "./utils/LogHelper";
import { CbridgeContextProvider, useCbridgeContext } from "./providers/ContextProvider";
import Test99 from "./views/transfer/Test";
import CBridgeTransfer from "./views/transfer/CBridgeTransfer";
// ReactDOM.render(
//   <CbridgeContextProvider>
//     <App />
//   </CbridgeContextProvider>,
//   document.getElementById("root"),
// );

// import { CbridgeContextProvider, useCbridgeContext } from "./src/providers/ContextProvider";

LogHelper.Init();

export { CBridgeTransfer, Test99, CbridgeContextProvider, useCbridgeContext };
