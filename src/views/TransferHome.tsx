import { useCallback, useContext, useEffect, useState } from "react";
import { Layout } from "antd";
import { createUseStyles } from "react-jss";
import { useAsync } from "react-use";
import { Route, Switch, useHistory } from "react-router-dom";
import { GithubFilled, TwitterCircleFilled } from "@ant-design/icons";
import { debounce } from "lodash";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { DiscordCircleFilled, TelegramCircleFilled } from "../icons";
import docIcon from "../images/doc.svg";
import { Theme } from "../theme";

import { useAppDispatch, useAppSelector } from "../redux/store";

import { setIsFromSEO } from "../redux/transferSlice";
import { TokenInfo as LocalTokenInfo, Token as LocalToken } from "../constants/type";
import { isGasToken } from "../constants/network";
import HomeCircleFilled from "../icons/HomeCircleFilled";
import { testNetworks } from "../constants/chains_testnet";
import { mainnetNetworks } from "../constants/chains_mainnet";

import { storageConstants } from "../constants/const";
import { ColorThemeContext } from "../providers/ThemeProvider";

import DebugBtn from "../components/debug/DebugBtn";
import NFTBridgeTab from "./nft/NFTBridgeTab";
import { isCircleUSDCToken } from "../utils/saveSelectedTokenSymbolToLocalStorage";
import { isETH, unambiguousTokenSymbol } from "../helpers/tokenInfo";

import { TokenInfo } from "../proto/gateway/gateway_pb";
import { Token } from "../proto/sgn/cbridge/v1/query_pb";
import CBridgeTransfer from "./transfer/CBridgeTransfer";
import { useTransferSupportedTokenList } from "../hooks/transferSupportedInfoList";

/* eslint-disable */
/* eslint-disable camelcase */
export const convertProtoStructToLocalTokenType = (token: Token.AsObject | undefined, chainId: number) => {
  if (token) {
    const tokenLocal: LocalToken = {
      symbol: token?.symbol,
      address: token?.address,
      decimal: token?.decimal,
      xfer_disabled: token?.xferDisabled,
      chainId,
      isNative: isGasToken(chainId, token.symbol),
    };
    return tokenLocal;
  } else {
    const tokenLocal: LocalToken = {
      symbol: "",
      address: "",
      decimal: 6,
      xfer_disabled: false,
      chainId,
      isNative: false,
    };
    return tokenLocal;
  }
};
export const convertProtoStructToLocalTokenInfoType = (
  tokenInfoObject: TokenInfo.AsObject | undefined,
  chainId: number,
) => {
  if (!tokenInfoObject) {
    const tokenInfoLocal: LocalTokenInfo = {
      token: convertProtoStructToLocalTokenType(undefined, chainId),
      name: "",
      icon: "",
      inbound_epoch_cap: "",
      inbound_lmt: "",
      transfer_disabled: false,
      liq_add_disabled: false,
      liq_agg_rm_src_disabled: false,
      liq_rm_disabled: false,
      delay_threshold: "",
      delay_period: 0,
    };
    return tokenInfoLocal;
  }
  const tokenInfoLocal: LocalTokenInfo = {
    token: convertProtoStructToLocalTokenType(tokenInfoObject.token, chainId),
    name: tokenInfoObject.name,
    icon: tokenInfoObject.icon,
    inbound_epoch_cap: tokenInfoObject.inboundEpochCap,
    inbound_lmt: tokenInfoObject.inboundLmt,
    transfer_disabled: tokenInfoObject.transferDisabled,
    liq_add_disabled: tokenInfoObject.liqAddDisabled,
    liq_agg_rm_src_disabled: tokenInfoObject.liqAggRmSrcDisabled,
    liq_rm_disabled: tokenInfoObject.liqRmDisabled,
    delay_threshold: tokenInfoObject.delayThreshold,
    delay_period: tokenInfoObject.delayPeriod,
  };
  return tokenInfoLocal;
};
export const convertProtoStructToLocalTokenInfoList = (
  protoTokenListStruct: Array<TokenInfo.AsObject>,
  chainId: number,
) => {
  return protoTokenListStruct.map(tokenInfo => {
    return convertProtoStructToLocalTokenInfoType(tokenInfo, chainId);
  });
};
const showDebugTool = process.env.REACT_APP_ENV === "TEST";

const { Content, Footer } = Layout;

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  [`@media (max-width: ${768}px)`]: {
    "@global": {
      body: {
        background: `${theme.secondBackground}`,
      },
    },
  },

  [`@media (min-width: ${769}px)`]: {
    "@global": {
      body: {
        background: `${theme.globalBg}`,
      },
    },
  },
  ".ant-select-dropdown": {
    // backgroundColor: `${theme.componentPrimary} !important`,
    "& .ant-select-item-option-selected:not(.ant-select-item-option-disabled)": {
      //   backgroundColor: `${theme.componentPrimary} !important`,
      //   color: theme.infoPrimary,
    },
    "& .ant-select-item": {
      //   color: theme.infoThird,
    },
  },
  app: {
    background: theme.globalBg,
  },
  layout: {
    background: props => (props.isMobile ? theme.secondBackground : theme.globalBg),
    padding: props => (props.isMobile ? 0 : "0 30px"),
    minHeight: props => (props.isMobile ? 0 : "100vh"),
    maxWidth: "100%",
    "@global": {
      body: {
        backgroundColor: "yellow",
      },
      ".ant-card": {
        //   background: theme.surface,
      },
      ".ant-dropdown": {
        backgroundColor: "yellow",
      },
      "ant-dropdown-menu-title-content": {
        color: "yellow",
      },
    },
  },
  "@global": {
    ".ant-modal-mask": {
      backgroundColor: theme.blurBg,
    },
  },
  headerTip: {
    width: "100%",
    height: 48,
    fontSize: 14,
    lineHeight: "48px",
    color: theme.surfacePrimary,
    fontWeight: 500,
    textAlign: "center",
    borderBottom: `0.5px solid ${theme.primaryBorder}`,
  },

  headerTipMobile: {
    width: "100%",
    height: 115,
    fontSize: 14,
    lineHeight: "26px",
    color: theme.surfacePrimary,
    fontWeight: 500,
    textAlign: "center",
    borderBottom: `0.5px solid ${theme.primaryBorder}`,
  },

  nav: {
    display: "flex",
    alignItems: "center",
    marginTop: 10,
  },

  fromSeoTitle: {
    marginTop: 10,
    fontSize: 36,
    fontWeight: 700,
    textAlign: "center",
    color: theme.surfacePrimary,
  },

  footer: {
    margin: props => (props.isMobile ? "20px 16px 16px 16px" : "40px 10px 70px 10px"),
    padding: 0,
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
    alignItems: props => (props.isMobile ? "flex-start" : "center"),
    background: props => (props.isMobile ? theme.secondBackground : "transparent"),
    "& p, button": {
      color: theme.secondBrand,
      marginBottom: 5,
    },
    fontSize: 12,
    fontWeight: 400,
  },
  footerContent: {
    textAlign: "center",
  },
  footerLink: {
    marginRight: -8,
    "& span": {
      textDecoration: "underline",
    },
    "&:hover": {
      color: "rgb(143, 155, 179)",
    },
  },
  footerContainer: {
    display: "table-row",
    alignItems: "center",
    justifyContent: "space-between",
    color: theme.secondBrand,
    width: "100%",
  },
  footerContainerEnd: {
    marginTop: 25,
    alignItems: "center",
    textDecoration: "underline",
    color: theme.secondBrand,
    fontSize: 12,
    width: "100%",
  },
  footBy: {
    display: "inline-block",
  },
  social: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
    color: theme.secondBrand,
    marginTop: 18,
    fontSize: 24,
  },
  content: {
    // width: props => (props.isMobile ? "100%" : 1200),
    width: "100%",
    padding: 0,
    margin: "0px auto",
    position: "relative",
  },
  footerText: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.secondBrand,
  },
  footerURLText: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.secondBrand,
    marginLeft: 7,
  },
  tipContainer: {
    display: "flex",
    flex: 1,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 24,
    background: "#FFF",
  },
}));

function FooterContent() {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  if (isMobile) {
    return null;
  }
  return (
    <div className={classes.footerContainer}>
      <div className={classes.footerText}>Powered by Celer Network</div>
      <div className={classes.social}>
        <HomeCircleFilled onClick={() => window.open("https://www.celer.network", "_blank")} />

        {/* eslint-disable-next-line */}
        <img
          alt="cBridgeDocIcon"
          style={{ cursor: "pointer" }}
          src={docIcon}
          onClick={() => window.open("https://cbridge-docs.celer.network", "_blank")}
        />
        <DiscordCircleFilled onClick={() => window.open("https://discord.gg/uGx4fjQ", "_blank")} />
        <TelegramCircleFilled onClick={() => window.open("https://t.me/celernetwork", "_blank")} />
        <TwitterCircleFilled onClick={() => window.open("https://twitter.com/CelerNetwork", "_blank")} />
        <GithubFilled onClick={() => window.open("https://github.com/celer-network", "_blank")} />
      </div>
      <div className={classes.footerContainerEnd}>
        {/* eslint-disable-next-line */}
        <label style={{ cursor: "pointer" }} onClick={() => window.open("https://form.typeform.com/to/Q4LMjUaK")}>
          Contact Support
        </label>
        {/* eslint-disable-next-line */}
        <label
          style={{ marginLeft: 24, cursor: "pointer" }}
          onClick={() => window.open("https://get.celer.app/cbridge-v2-doc/tos-cbridge-2.pdf")}
        >
          Terms of Service
        </label>
        <label
          style={{ marginLeft: 24, cursor: "pointer" }}
          onClick={() => window.open("https://get.celer.app/cbridge-v2-doc/privacy-policy.pdf")}
        >
          Privacy Policy
        </label>

        {/* eslint-disable-next-line */}
        <label
          style={{ marginLeft: 24, cursor: "pointer" }}
          onClick={() => window.open("https://cbridge.celer.network/sitemap.xml")}
        >
          Site map
        </label>
      </div>
    </div>
  );
}

function TransferHome(): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const { themeType } = useContext(ColorThemeContext);
  const provider = new StaticJsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
  const basicConfiguration = process.env.REACT_APP_ENV_TYPE === "test" ? testNetworks : mainnetNetworks;
  const classes = useStyles({ isMobile });
  const history = useHistory();
  const { transferInfo } = useAppSelector(state => state);
  const { transferConfig, fromChain, toChain, isFromSEO, selectedToken } = transferInfo;
  const dispatch = useAppDispatch();
  const [headerTitle, setHeaderTitle] = useState("");
  const { supportTokenList } = useTransferSupportedTokenList();

  useAsync(async () => {
    const seoDefalutKey = `seo_default_${getPathKey()}`;
    const hadSetSeoDefault = sessionStorage.getItem(seoDefalutKey) ?? "";
    if (isFromSEO && transferConfig && hadSetSeoDefault != "1") {
      const refIdForSeo = sessionStorage.getItem("refIdForSeoChainId") ?? "";
      const segments = refIdForSeo.split("-").filter(p => p);
      if (segments.length >= 2) {
        const seoFromChain = transferConfig.chains.find(chainInfo => {
          return chainInfo.id === Number(segments[0]);
        });
        if (seoFromChain !== undefined) {
          localStorage.setItem(storageConstants.KEY_FROM_CHAIN_ID, seoFromChain.id.toString() || "");
        }

        const seoToChain = transferConfig.chains.find(chainInfo => {
          return chainInfo.id === Number(segments[1]);
        });
        if (seoToChain !== undefined) {
          localStorage.setItem(storageConstants.KEY_TO_CHAIN_ID, seoToChain.id.toString() || "");
        }

        if (segments.length > 2) {
          const seoTokenSymbol = segments[2];
          if (seoFromChain && seoFromChain !== undefined && seoToChain && seoToChain !== undefined) {
            if (supportTokenList.length > 0) {
              const potentialTokenList = supportTokenList.filter(tokenInfo => {
                if (seoTokenSymbol === "ETH") {
                  return isETH(tokenInfo.token);
                } else {
                  return tokenInfo.token.symbol.indexOf(seoTokenSymbol) > -1;
                }
              });
              if (potentialTokenList.length === 0) {
                localStorage.setItem(
                  storageConstants.KEY_SELECTED_TOKEN_SYMBOL,
                  unambiguousTokenSymbol(supportTokenList[0].token),
                );
                sessionStorage.setItem(seoDefalutKey, "1");
              } else {
                localStorage.setItem(
                  storageConstants.KEY_SELECTED_TOKEN_SYMBOL,
                  unambiguousTokenSymbol(potentialTokenList[0].token),
                );
                sessionStorage.setItem(seoDefalutKey, "1");
              }
            }
          }
        }
      }
    }
  }, [isFromSEO, transferConfig, supportTokenList]);

  useAsync(async () => {
    const parentWin = window.parent;
    var segments = parentWin.location.pathname.split("/").filter(p => p);
    const isFromSEO = sessionStorage.getItem("isFromSeo");
    if (isFromSEO === "true" && segments.includes("bridge")) {
      dispatch(setIsFromSEO(true));
    }
  }, []);

  const getPathKey = () => {
    const parentWin = window.parent;
    var segments = parentWin.location.pathname.split("/").filter(p => p);
    let titleKey = "seo-cbridge-title";
    if (segments.includes("bridge")) {
      let tempIndex = 1;
      if (segments.includes("index.html")) {
        tempIndex = 0;
      }
      if (segments.length === 3 - tempIndex) {
        titleKey = segments[1];
      } else if (segments.length === 4 - tempIndex) {
        titleKey = `${segments[1]}-${segments[2]}`;
      }

      if (headerTitle.length === 0) {
        const tempTitle = sessionStorage.getItem(titleKey.toLocaleLowerCase());
        if (tempTitle && tempTitle.length > 0) {
          setHeaderTitle(tempTitle);
        }
      }
    }
    return titleKey;
  };

  useEffect(() => {
    const parentWin = window.parent;
    parentWin.postMessage(themeType, location.origin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeType]);

  const getValueFromHref = (key: string, hrefString: string) => {
    let replaceHrefString = hrefString;
    let search = history.location.search;
    if (hrefString.indexOf("/#/") > -1) {
      replaceHrefString = hrefString?.replace("/#/", "/");
      if (history.location.hash.indexOf("?") > -1) {
        search = "?" + history.location.hash.split("?")[1];
      }
    }
    const hrefURLParams = new URLSearchParams(replaceHrefString);
    const historyLocationParams = new URLSearchParams(search);
    return hrefURLParams.get(key) ?? historyLocationParams.get(key) ?? "";
  };

  useEffect(() => {
    if (location.hash === "#selenium-webdriver-bot") sessionStorage.setItem("bot", "bot");

    const refId = getValueFromHref("ref", location.href)?.toLowerCase() ?? "";
    const sessionRefId = sessionStorage.getItem("refId") ?? "";
    let refIdSuffix = "";

    const avoidRefCodeUpdateForOtherTabs =
      location.href.includes("liquidity") || location.href.includes("nft") || location.href.includes("rewards");

    if (refId !== sessionRefId && !avoidRefCodeUpdateForOtherTabs) {
      sessionStorage.setItem("refId", refId);
    }

    if (refId.length > 0) {
      refIdSuffix = "?ref=" + refId;
    }

    prepareTargetPairIfNeeded(location.href);

    if (location.href.toLowerCase().includes("/#/liquidity") || location.href.toLowerCase().includes("/liquidity")) {
      history.push("/liquidity");
    } else if (location.href.toLowerCase().includes("/#/nft") || location.href.toLowerCase().includes("/nft")) {
      history.push("/nft");
    } else if (location.href.toLowerCase().includes("/#/rewards") || location.href.toLowerCase().includes("/rewards")) {
      history.push("/rewards");
    } else {
      const fromChainId = localStorage.getItem(storageConstants.KEY_FROM_CHAIN_ID);
      const toChainId = localStorage.getItem(storageConstants.KEY_TO_CHAIN_ID);
      const tokenSymbol = localStorage.getItem(storageConstants.KEY_SELECTED_TOKEN_SYMBOL);
      if (fromChainId && fromChainId !== "0" && toChainId && tokenSymbol) {
        history.push(`/${fromChainId}/${toChainId}/${tokenSymbol}${refIdSuffix}`);
      } else {
        history.push("/" + refIdSuffix);
      }
    }
  }, []);

  useEffect(() => {
    if (
      fromChain &&
      selectedToken &&
      toChain &&
      history.location.pathname !== "/liquidity" &&
      history.location.pathname !== "/nft" &&
      history.location.pathname !== "/rewards"
    ) {
      debouncedHistoryPush({
        fromChain,
        selectedToken,
        toChain,
      });
    }
  }, [fromChain, toChain, selectedToken]);

  const debouncedHistoryPush = useCallback(
    debounce(nextValue => {
      if (nextValue === undefined) {
        return;
      }

      const sessionRefId = sessionStorage.getItem("refId") ?? "";
      let refIdSuffix = "";

      if (sessionRefId.length > 0) {
        refIdSuffix = "?ref=" + sessionRefId;
      }

      history.push(
        `/${nextValue.fromChain?.id}/${nextValue.toChain?.id}/${
          isCircleUSDCToken(nextValue.selectedToken) ? "USDC" : unambiguousTokenSymbol(nextValue.selectedToken?.token)
        }${refIdSuffix}`,
      );
    }, 10),
    [],
  );

  const prepareTargetPairIfNeeded = (href: string) => {
    const targetSourceChainIdString = getValueFromHref("sourceChainId", href)?.toLowerCase() ?? "";
    const targetTargetDestinationChainIdString = getValueFromHref("destinationChainId", href)?.toLowerCase() ?? "";
    const targetTokenSymbol = getValueFromHref("tokenSymbol", href) ?? "";

    if (targetSourceChainIdString && targetTargetDestinationChainIdString && targetTokenSymbol) {
      const sourceChainId = Number(targetSourceChainIdString);
      const destinationChainId = Number(targetTargetDestinationChainIdString);
      localStorage.setItem(storageConstants.KEY_FROM_CHAIN_ID, sourceChainId.toString() || "");
      localStorage.setItem(storageConstants.KEY_TO_CHAIN_ID, destinationChainId.toString() || "");
      localStorage.setItem(storageConstants.KEY_SELECTED_TOKEN_SYMBOL, targetTokenSymbol || "");
      return;
    }

    /// Skip parameter analysis for static urls
    if (href.includes("/bridge")) {
      return;
    }

    const pathValues = href.split("/");

    if (pathValues.length < 3) {
      return;
    }

    const lastSymbols = pathValues[pathValues.length - 1].split("?");

    if (
      lastSymbols.length > 0 &&
      !isNaN(Number(pathValues[pathValues.length - 2])) &&
      !isNaN(Number(pathValues[pathValues.length - 3]))
    ) {
      localStorage.setItem(storageConstants.KEY_FROM_CHAIN_ID, pathValues[pathValues.length - 3].toString());
      localStorage.setItem(storageConstants.KEY_TO_CHAIN_ID, pathValues[pathValues.length - 2].toString());
      localStorage.setItem(storageConstants.KEY_SELECTED_TOKEN_SYMBOL, lastSymbols[0]);
    } else {
      const parentWin = window.parent;
      var segments = parentWin.location.pathname.split("/").filter(p => p);

      if (segments.includes("bridge")) {
        return;
      }
      localStorage.setItem(storageConstants.KEY_CHAIN_ID_HIGH_PRIORITY, "1");
    }
  };

  return (
    <div className={classes.app}>
      <Layout className={classes.layout}>
        {/* {isFromSEO ? (
          <h1 className={classes.fromSeoTitle}>{headerTitle}</h1>
        ) : (
          <div className="smallTabBodyOut">
            <div className="smallTabBody">
              <ViewTab />
            </div>
          </div>
        )} */}
        <Content className={classes.content}>
          <Switch>
            <Route path="/nft">
              <NFTBridgeTab />
            </Route>
            <Route path="/">
              <CBridgeTransfer showHistory configuration={basicConfiguration} provider={provider} />
            </Route>
          </Switch>
        </Content>
        {!isFromSEO && (
          <Footer className={classes.footer}>
            <div className={classes.footerContent}>
              <FooterContent />
            </div>
          </Footer>
        )}
      </Layout>

      {showDebugTool && <DebugBtn />}
    </div>
  );
}

export default TransferHome;
