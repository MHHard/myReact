import ReactDOM from "react-dom";
import App from "./App";

import { LogHelper } from "./utils/LogHelper";
import { CbridgeContextProvider, useCbridgeContext } from "./providers/ContextProvider";
import Test99 from "./views/transfer/Test";
import CBridgeTransfer from "./views/transfer/CBridgeTransfer";

ReactDOM.render(
  <CbridgeContextProvider>
    <App />
  </CbridgeContextProvider>,
  document.getElementById("root"),
);

LogHelper.Init();

export { CBridgeTransfer, Test99, CbridgeContextProvider, useCbridgeContext };
