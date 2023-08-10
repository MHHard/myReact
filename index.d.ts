import { StaticJsonRpcProvider } from "@ethersproject/providers"; // InfuraProvider,
import { LocalChainConfigType } from "./src/constants/type";

interface ICBridgeTransfer {
  showHistory: boolean;
  provider: StaticJsonRpcProvider | undefined;
  configuration: LocalChainConfigType;
}
export declare const CBridgeTransfer: React.FC<ICBridgeTransfer>;
