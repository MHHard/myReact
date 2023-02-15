import { injected } from "@celer-network/web3modal";
import { useEffect, useState } from "react";
import cloverLogo from "../../providers/logos/clover.svg";
import dcentLogo from "../../providers/logos/dcent.png";
import tokenPocketLogo from "../../providers/logos/token-pocket.jpg";
import coinbaseLogo from "../../providers/logos/coinbase.png";
import safepalLogo from "../../providers/logos/safepal.jpeg";
import bitkeepLogo from "../../providers/logos/bitkeep.svg";
import flowBlocktoWallet from "../../providers/logos/flowBlocktoWallet.png";
import flowLilicoWallet from "../../providers/logos/flowLilicoWallet.png";
import walletconnectLogo from "../../providers/logos/walletconnect.png";
import { aptosWallets, getNonEVMMode, NonEVMMode } from "../../providers/NonEVMContextProvider";
import { storageConstants } from "../../constants/const";
import { useAppDispatch, useAppSelector } from "../../redux/store";

export default function WalletIcon(): JSX.Element {
  const walletIconMap = {
    tokenPocket: tokenPocketLogo,
    coinbase: coinbaseLogo,
    clover: cloverLogo,
    dcent: dcentLogo,
    safePal: safepalLogo,
    bitkeep: bitkeepLogo,
    walletconnect: walletconnectLogo,
    flowBlockto: flowBlocktoWallet,
    flowLilico: flowLilicoWallet,
  };

  const { fromChain } = useAppSelector(state => state.transferInfo);
  const dispatch = useAppDispatch();
  const [iconUrl, setIconUrl] = useState("");
  const { isMobile } = useAppSelector(state => state.windowWidth);
  useEffect(() => {
    const nonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
    switch (nonEVMMode) {
      case NonEVMMode.flowMainnet:
      case NonEVMMode.flowTest: {
        getFlowWalletIcon();
        break;
      }
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        getAptosWalletIcon();
        break;
      }
      default: {
        getEvmWalletIcon();
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fromChain]);

  const getFlowWalletIcon = () => {
    const walletName = localStorage.getItem(storageConstants.KEY_FLOW_CONNECTED_WALLET_NAME);
    if (walletName) {
      let newUrl = "";
      newUrl = walletIconMap[walletName];
      setIconUrl(newUrl);
    }
  };

  const getEvmWalletIcon = () => {
    const walletName = localStorage.getItem(storageConstants.KEY_CONNECTED_WALLET_NAME);
    if (walletName) {
      let newUrl = "";
      newUrl = walletIconMap[walletName];
      if (!newUrl) {
        const evmChainKeylist = Object.keys(injected);
        evmChainKeylist?.forEach(item => {
          if (injected[item].name === walletName) {
            newUrl = injected[item].logo;
          }
        });
      }
      setIconUrl(newUrl);
    }
  };

  const getAptosWalletIcon = () => {
    const walletName = localStorage.getItem(storageConstants.KEY_APTOS_CONNECTED_WALLET_NAME);
    if (walletName) {
      let newUrl = "";
      newUrl = walletIconMap[walletName];
      if (!newUrl) {
        aptosWallets?.forEach(item => {
          if (item.name === walletName) {
            newUrl = item.icon;
          }
        });
      }
      setIconUrl(newUrl);
    }
  };

  return (
    <>
      {iconUrl ? (
        <img
          src={iconUrl}
          style={{ width: isMobile ? 16 : 24, maxHeight: 24, borderRadius: "50%", marginRight: 4 }}
          alt=""
        />
      ) : (
        <span />
      )}
    </>
  );
}
