import { useContext, useMemo } from "react";
import { Tooltip } from "antd";
import { useToggle } from "react-use";
import { ColorThemeContext } from "../../providers/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setRefreshGlobalTokenBalance } from "../../redux/globalInfoSlice";
import faucetIcon from "../../images/faucet.png";
import analytics from "../../images/analytics.svg";
import analyticsLight from "../../images/analyticsLight.svg";
import sgnIcon from "../../images/sgnIcon.svg";
import imscanExplorer from "../../images/imscanExplorer.svg";
import FaucetModal from "../../components/FaucetModal";
import { useTransferSupportedTokenList } from "../../hooks/transferSupportedInfoList";

interface ILinkItem {
  linkIcon: string;
  linkText: string;
  isTestShow?: boolean;
  isMainnetShow?: boolean;
  isMobileShow?: boolean;
}
export const getHeaderLinkList = themeType => {
  const list: ILinkItem[] = [
    {
      linkIcon: faucetIcon,
      linkText: "Faucets",
      isTestShow: true,
      isMainnetShow: false,
      isMobileShow: true,
    },
    {
      linkIcon: themeType === "dark" ? analytics : analyticsLight,
      linkText: "Analytics",
      isTestShow: true,
      isMainnetShow: true,
      isMobileShow: true,
    },
    {
      linkIcon: imscanExplorer,
      linkText: "Explorer",
      isTestShow: false,
      isMainnetShow: true,
      isMobileShow: true,
    },
    {
      linkIcon: sgnIcon,
      linkText: "Staking",
      isTestShow: true,
      isMainnetShow: true,
      isMobileShow: true,
    },
  ];
  return list;
};
export const urlList = {
  Analytics: "https://cbridge-analytics.celer.network/",
  Explorer: "http://celerscan.com/",
  Staking: "https://sgn.celer.network",
};

export const openLink = urlKey => {
  window.open(urlList[urlKey], "_blank");
};
export default function LinkList({ classStyle }): JSX.Element {
  const { windowWidth } = useAppSelector(state => state.windowWidth);
  const { themeType } = useContext(ColorThemeContext);
  const { transferInfo } = useAppSelector(state => state);
  const { supportTokenList } = useTransferSupportedTokenList();
  const { fromChain } = transferInfo;
  const dispatch = useAppDispatch();

  const [showFaucet, toggleFaucet] = useToggle(false);

  const faucetUrls = {
    43113: "https://faucet.avax-test.network/",
    73771: "https://faucet.swimmer.network/",
    80001: "https://faucet.polygon.technology/",
    14000: "https://faucet.dev-01.bas.ankr.com/",
    117: "https://bas-aries-faucet.nodereal.io/",
    15001: "https://faucet-bas-testnet.ankr.com",
    230: "https://bas-galaxy-testnet-faucet.nodereal.io",
    231: " https://bas-rns-testnet-faucet.nodereal.io",
    232: "https://bas-cube-testnet-faucet.nodereal.io",
    97: "https://testnet.binance.org/faucet-smart",
    999999998: "https://www.allthatnode.com/faucet/sei.dsrv"
  };

  const tokenInfo = useMemo(() => {
    /// For Aptos Dev, we should provide WETH faucet
    if (process.env.REACT_APP_ENV_TYPE === "aptos") {
      return supportTokenList
        ?.filter(token => token?.token?.symbol !== "ETH" && token?.token?.display_symbol !== "ETH")
        ?.map(token => ({ symbol: token?.token?.symbol || "", address: token?.token?.address || "" }));
    }

    return supportTokenList
      ?.filter(token => token?.token?.symbol !== "ETH" && token?.token?.symbol !== "WETH")
      ?.map(token => ({ symbol: token?.token?.symbol || "", address: token?.token?.address || "" }));
  }, [supportTokenList]);

  const openFaucetSite = (cId: number) => {
    window.open(faucetUrls[cId], "_blank");
  };

  const closeFaucet = () => {
    dispatch(setRefreshGlobalTokenBalance());
    toggleFaucet();
  };

  const openFaucet = () => {
    if (fromChain?.id && Object.keys(faucetUrls)?.includes(`${fromChain.id}`)) {
      openFaucetSite(fromChain.id);
    } else {
      toggleFaucet();
    }
  };

  const functionList = {
    Faucets: () => openFaucet(),
    Analytics: () => openLink("Analytics"),
    Explorer: () => openLink("Explorer"),
    Staking: () => openLink("Staking"),
  };

  const renderItem = (item: ILinkItem) => {
    const isTest = process.env.REACT_APP_ENV_TYPE === "test";
    const isMainnet = process.env.REACT_APP_ENV === "MAINNET";
    const shouldShowFaucet = process.env.REACT_APP_ENV_TYPE === "aptos";
    return (
      ((item.isTestShow && isTest) ||
        (item.isMainnetShow && isMainnet) ||
        (item.linkText === "Faucets" && shouldShowFaucet)) && (
        <Tooltip
          title={item?.linkText}
          color="#fff"
          overlayClassName="headerTooltips"
          zIndex={windowWidth <= 1800 ? 1000 : -1000}
          overlayInnerStyle={{ color: "#000", backgroundColor: "#fff" }}
          key={item?.linkText}
        >
          <div className={classStyle.leaderboardBox} onClick={functionList[item?.linkText]}>
            <img src={item?.linkIcon} className={classStyle.historyIconLeft} alt={item?.linkText} />
            <span className="menuLeftText">{item?.linkText}</span>
          </div>
        </Tooltip>
      )
    );
  };
  const linkList = getHeaderLinkList(themeType);
  return (
    <>
      {linkList?.map(item => renderItem(item))}
      {showFaucet && <FaucetModal tokenInfos={tokenInfo} onClose={closeFaucet} />}
    </>
  );
}
