import { useContext } from "react";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { ColorThemeContext } from "../providers/ThemeProvider";
import { getNetworkById } from "../constants/network";
import { setIsChainShow } from "../redux/transferSlice";
import { useAppDispatch } from "../redux/store";

export default function CurrentChainOfWallet(): JSX.Element {
  const { isMobile } = useContext(ColorThemeContext);
  const { chainId, network, web3Modal } = useWeb3Context();
  const dispatch = useAppDispatch();

  return (
    <>
      {web3Modal.cachedProvider !== "" && (
        <div
          className="currentChainBtn"
          onClick={() => {
            dispatch(setIsChainShow(true));
          }}
        >
          <img
            style={{ marginRight: 0 }}
            alt="Icon"
            src={getNetworkById(chainId)?.iconUrl}
          />
          {!isMobile && (
            <div className="currentChainBtnText">
              {getNetworkById(chainId)?.name !== "--"
                ? getNetworkById(chainId)?.name
                : network}
            </div>
          )}
          <div className="dot" />
        </div>
      )}
    </>
  );
}
