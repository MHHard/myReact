import React, { useCallback, useContext, useEffect, useState } from "react";
import { Layout } from "antd";
import { createUseStyles } from "react-jss";
import { useAsync } from "react-use";
import { Route, Switch, useHistory } from "react-router-dom";
import { GithubFilled, TwitterCircleFilled } from "@ant-design/icons";
import { debounce } from "lodash";
import { JsonRpcProvider } from "@ethersproject/providers";
// import Vconsole from "vconsole";
import { MapLike } from "typescript";
import { DiscordCircleFilled, TelegramCircleFilled } from "../icons";
// import tipIcon from "../images/bell.svg";
import docIcon from "../images/doc.svg";
import { Theme } from "../theme";
import Transfer from "./Transfer";
import Liquidity from "./Liquidity";
import Rewards from "./Rewards";
import HistoryModal from "./HistoryModal";
import Header from "../components/header/Header";
import SystemNotificationView, { PrivateNotificationView } from "../views/systemNotification/SystemNotificationView";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { closeModal, ModalName, openModal } from "../redux/modalSlice";
import ProviderModal from "../components/ProviderModal";
import FlowProviderModal from "../components/nonEVM/FlowProviderModal";
import ChainList from "../components/ChainList";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { filteredLocalTransferHistory } from "../utils/localTransferHistoryList";
import {
  setCBridgeAddresses,
  setCBridgeDesAddresses,
  setFarmingRewardAddresses,
  setRfqContractAddr,
  setTransferAgentAddress,
} from "../redux/globalInfoSlice";

import {
  getTransferConfigs,
  transferHistory,
  lpHistory,
  getRetentionRewardsInfo,
  getPercentageFeeRebateInfo,
  nftHistory,
  getSystemAnnouncement,
  pingUserAddress,
  getDestinationTransferId,
  getPriceOfTokens,
  getPendingHistory,
  getRfqConfig,
} from "../redux/gateway";
import {
  setIsChainShow,
  setTransferConfig,
  setTokenList,
  setFromChain,
  setToChain,
  setSelectedToken,
  switchChain,
  setGetConfigsFinish,
  addChainToken,
  setTotalActionNum,
  setTotalPendingNum,
  setSingleChainList,
  setRefreshTransferAndLiquidity,
  setFlowTokenPathConfigs,
  setIsFromSEO,
  setPriceOfTokens,
  setHistoryActionNum,
  setHistoryPendingNum,
  setLpActionNum,
  setLpPendingNum,
  setRfqConfig,
} from "../redux/transferSlice";
import { setConfig } from "../redux/configSlice";
import {
  Chain,
  TokenInfo as LocalTokenInfo,
  TransferHistoryStatus,
  TransferHistory,
  LPHistory,
  LPHistoryStatus,
  GetTransferConfigsResponse,
  NFTHistory,
  NFTBridgeStatus,
  ChainTokenInfo,
  Token as LocalToken,
  PeggedPairConfig as LocalPeggedPairConfig,
} from "../constants/type";
import { PRE_UPGRADE_LINK } from "../constants";
import { CHAIN_LIST, getNetworkById } from "../constants/network";
import HomeCircleFilled from "../icons/HomeCircleFilled";
import { dataClone } from "../helpers/dataClone";
import ViewTab from "../components/ViewTab";
import {
  GetBscCampaignInfoRequest,
  GetSystemAnnouncementRequest,
  GetTransferConfigsRequest,
  PeggedPairConfig,
  TokenInfo,
  GetRfqConfigsRequest,
} from "../proto/gateway/gateway_pb";
import { getBscCampaignInfo } from "../redux/gatewayCbridge";
import { setHasEvents } from "../redux/rewardSectionSlice";
import { mergeTransactionHistory } from "../utils/mergeTransferHistory";
import { mergeLiquidityHistory } from "../utils/mergeLiquidityHistory";
import { mergeNFTHistory } from "../utils/mergeNFTHistory";
import { useTransferSupportedChainList, useTransferSupportedTokenList } from "../hooks/transferSupportedInfoList";
import { storageConstants } from "../constants/const";
import {
  NonEVMMode,
  useNonEVMContext,
  getNonEVMMode,
  isNonEVMChain,
  convertNonEVMAddressToEVMCompatible,
} from "../providers/NonEVMContextProvider";
import { getFlowTokenPathConfigs, queryFlowTransactionStatus } from "../redux/NonEVMAPIs/flowAPIs";
import NFTBridgeTab from "./nft/NFTBridgeTab";
import DebugBtn from "../components/debug/DebugBtn";
import { setTransferRelatedFeatureDisabled } from "../redux/serviceInfoSlice";
import { ColorThemeContext } from "../providers/ThemeProvider";
import { useBridgeChainTokensContext } from "../providers/BridgeChainTokensProvider";
import {
  addNewDestinationRelayFinishedTransferId,
  destinationRelayChecker,
  getDestinationRelayFinishedTransferIds,
} from "../helpers/destinationRelayChecker";
import { affectedUserAddresses } from "../sgn-ops-data-check/sgn-ops-data-check";
import { Token } from "../proto/sgn/cbridge/v1/query_pb";
import UserIsBlockedModal from "../components/UserIsBlockedModal";
import {
  mergeLPRemotePendingListAndHistoryPendingList,
  mergeTransferRemotePendingListAndHistoryPendingList,
} from "./HandlePendingHistory";
import AptosProviderModal from "../components/nonEVM/AptosProviderModal";
import { useContractsContext } from "../providers/ContractsContextProvider";
import { queryAptosTransactionStatus } from "../redux/NonEVMAPIs/aptosAPIs";
import SeiProviderModal from "../components/nonEVM/SeiProviderModal";
import InjProviderModal from "../components/nonEVM/InjProviderModal";
import { convertSeiToCanonicalAddress } from "../redux/NonEVMAPIs/seiAPI";
import { convertInjToCanonicalAddress } from "../redux/NonEVMAPIs/injectiveAPI";

/* eslint-disable */
/* eslint-disable camelcase */

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
export const getToken = (token: Token.AsObject | undefined) => {
  if (token) {
    const tokenLocal: LocalToken = {
      symbol: token?.symbol,
      address: token?.address,
      decimal: token?.decimal,
      xfer_disabled: token?.xferDisabled,
    };
    return tokenLocal;
  } else {
    const tokenLocal: LocalToken = {
      symbol: "",
      address: "",
      decimal: 6,
      xfer_disabled: false,
    };
    return tokenLocal;
  }
};
export const getTokenInfoByProto = (itoken: TokenInfo.AsObject | undefined) => {
  if (!itoken) {
    const tokenInfoLocal: LocalTokenInfo = {
      token: getToken(undefined),
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
    token: getToken(itoken?.token),
    name: itoken?.name,
    icon: itoken?.icon,
    inbound_epoch_cap: itoken?.inboundEpochCap,
    inbound_lmt: itoken?.inboundLmt,
    transfer_disabled: itoken?.transferDisabled,
    liq_add_disabled: itoken?.liqAddDisabled,
    liq_agg_rm_src_disabled: itoken?.liqAggRmSrcDisabled,
    liq_rm_disabled: itoken?.liqRmDisabled,
    delay_threshold: itoken?.delayThreshold,
    delay_period: itoken?.delayPeriod,
  };
  return tokenInfoLocal;
};
export const getTokenList = data => {
  const tokenList: Array<LocalTokenInfo> = [];
  data?.tokenList?.map(itoken => {
    if (itoken?.token) {
      const tokenInfoLocal = getTokenInfoByProto(itoken);
      if (tokenInfoLocal) {
        tokenList.push(tokenInfoLocal);
      }
    }
    return itoken;
  });
  return tokenList;
};
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
        <label style={{ marginLeft: 24, cursor: "pointer" }} onClick={() => window.open(PRE_UPGRADE_LINK)}>
          Migrate Liquidity from Pre-upgrade Pools
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

let inter;
function CBridgeTransferHome(): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const { themeType } = useContext(ColorThemeContext);
  const classes = useStyles({ isMobile });
  const history = useHistory();
  const { chainId, address, provider } = useWeb3Context();
  const {
    flowConnected,
    nonEVMAddress,
    flowAddress,
    aptosConnected,
    aptosAddress,
    seiAddress,
    injAddress,
    seiConnected,
    injConnected,
  } = useNonEVMContext();
  const { modal, transferInfo } = useAppSelector(state => state);

  const {
    contracts: { transferAgent },
    transactor,
  } = useContractsContext();
  const { lpList, selectedLP } = useAppSelector(state => state.lp);
  const {
    showProviderModal,
    showHistoryModal,
    showFlowProviderModal,
    userIsBlockedModal,
    showAptosProviderModal,
    showSeiProviderModal,
    showInjProviderModal,
  } = modal;

  const {
    transferConfig,
    isChainShow,
    chainSource,
    fromChain,
    toChain,
    refreshHistory,
    singleChainList,
    singleChainSelectIndex,
    refreshTransferAndLiquidity,
    supportTransferChains,
    isFromSEO,
    selectedToken,
    rfqConfig,
  } = transferInfo;
  const { chains, chain_token } = transferConfig;
  const transferSupportedChainList = useTransferSupportedChainList(true);
  const { supportTokenList } = useTransferSupportedTokenList();
  const dispatch = useAppDispatch();
  const [historyAction, setHistoryAction] = useState<number>(0);
  const [historyPending, setHistoryPending] = useState<number>(0);
  const [lpAction, setLpAction] = useState<number>(0);
  const [lpPending, setLpPending] = useState<number>(0);
  const [nftActionNum, setNftActionNum] = useState<number>(0);
  const [nftPendingNum, setNftPendingNum] = useState<number>(0);
  const [transferConfigsResponse, setTransferConfigsResponse] = useState<GetTransferConfigsResponse>();
  const [chainList, setChainList] = useState<Chain[]>([]);
  const [systemAnnouncement, setSystemAnnouncement] = useState<string>("");
  const [systemAnnouncementEnabled, setSystemAnnouncementEnbled] = useState<boolean>(false);
  const [headerTitle, setHeaderTitle] = useState("");
  const { getTransferPair } = useBridgeChainTokensContext();
  const [shouldShowAffectedNotification, setShouldShowAffectedNotification] = useState(false);

  const handleCloseProviderModal = () => {
    dispatch(closeModal(ModalName.provider));
  };
  const handleCloseHistoryModal = () => {
    dispatch(setRefreshTransferAndLiquidity(!refreshTransferAndLiquidity));
    // refreshTransferAndLPHistory();
    dispatch(closeModal(ModalName.history));
  };
  const handleCloseFlowProviderModal = () => {
    dispatch(closeModal(ModalName.flowProvider));
  };

  const handleCloseAptosProviderModal = () => {
    dispatch(closeModal(ModalName.aptosProvider));
  };
  const handleCloseSeiProviderModal = () => {
    dispatch(closeModal(ModalName.seiProvider));
  };
  const handleCloseInjProviderModal = () => {
    dispatch(closeModal(ModalName.injProvider));
  };

  const getHistoryOnchainQueryPromiseList = (provider, chainId, localStorageHistoryList: TransferHistory[]) => {
    // eslint-disable-next-line
    const promiseList: Array<Promise<any>> = [];
    if (localStorageHistoryList) {
      localStorageHistoryList?.forEach(localItem => {
        if (localItem && localItem.toString() !== "null") {
          if (localItem?.status === TransferHistoryStatus.TRANSFER_FAILED || localItem?.txIsFailed) {
            // Failed transactions filter
            const nullPromise = new Promise(resolve => {
              resolve(0);
            });
            promiseList.push(nullPromise);
          } else {
            const sourceChainNonEVMMode = getNonEVMMode(localItem.src_send_info.chain.id);

            switch (sourceChainNonEVMMode) {
              case NonEVMMode.flowTest:
              case NonEVMMode.flowMainnet: {
                promiseList.push(sendQueryFlowTransactionStatusRequest(localItem.src_block_tx_link));
                break;
              }
              case NonEVMMode.aptosMainnet:
              case NonEVMMode.aptosTest:
              case NonEVMMode.aptosDevnet: {
                promiseList.push(sendQueryAptosTransactionStatusRequest(localItem.src_block_tx_link));
                break;
              }
              case NonEVMMode.seiMainnet:
              case NonEVMMode.seiDevnet:
              case NonEVMMode.seiTestnet: {
                promiseList.push(sendQuerySeiTransactionStatusRequest(localItem.src_block_tx_link));
                break;
              }
              case NonEVMMode.injectiveTestnet:
              case NonEVMMode.injectiveMainnet: {
                promiseList.push(sendQuerySeiTransactionStatusRequest(localItem.src_block_tx_link));
                break;
              }
              case NonEVMMode.off: {
                if (Number(localItem.src_send_info.chain.id) === Number(chainId)) {
                  const promistx = getTxStatus(provider, localItem.src_block_tx_link); // Check local transaction status
                  promiseList.push(promistx);
                }
                break;
              }
              default: {
                console.error("Unsupported non evm mode");
              }
            }
          }
        }
      });
    }
    return promiseList;
  };

  const getLpOnChainQueryPromiseList = (provider, chainId, localLpHistoryList: LPHistory[]) => {
    // eslint-disable-next-line
    const promiseList: Array<Promise<any>> = [];
    if (localLpHistoryList) {
      const newLocalLpList: LPHistory[] = [];
      localLpHistoryList?.forEach(localItem => {
        if (localItem && localItem.toString() !== "null") {
          newLocalLpList.push(localItem);
          if (
            localItem?.status === LPHistoryStatus.LP_FAILED ||
            localItem?.txIsFailed ||
            Number(localItem.chain.id) !== Number(chainId)
          ) {
            // Failed transactions filter
            const nullPromise = new Promise(resolve => {
              resolve(0);
            });
            promiseList.push(nullPromise);
          } else {
            const promistx = getTxStatus(provider, localItem.block_tx_link);
            promiseList.push(promistx);
          }
        }
      });
    }
    return promiseList;
  };

  const getTxStatus = async (provider, link) => {
    const txid = link.split("/tx/")[1];
    if (txid) {
      const res = await provider?.getTransactionReceipt(txid);
      return res;
    }
    return "";
  };

  const sendQueryFlowTransactionStatusRequest = async (transactionLink: string): Promise<any> => {
    const transactionHash = transactionLink.split("/transaction/")[1];
    if (transactionHash) {
      return queryFlowTransactionStatus(transactionHash);
    }
    return "";
  };

  const sendQueryAptosTransactionStatusRequest = async (transactionLink: string): Promise<any> => {
    const transactionHashWithNetworkSuffix = transactionLink.split("/txn/")[1];
    const transactionHash = transactionHashWithNetworkSuffix.split("?")[0];
    if (transactionHash.includes("0x")) {
      return queryAptosTransactionStatus(transactionHash);
    }
    return "";
  };
  const sendQuerySeiTransactionStatusRequest = async (transactionLink: string): Promise<any> => {
    const transactionHashWithNetworkSuffix = transactionLink.split("/transactions/")[1];
    const transactionHash = transactionHashWithNetworkSuffix.split("?")[0];
    if (transactionHash.includes("0x")) {
      return queryAptosTransactionStatus(transactionHash);
    }
    return "";
  };

  useEffect(() => {
    if (address.length > 0) {
      pingUserAddress(address).then(_ => {});
    }
  }, [address]);

  useEffect(() => {
    if (nonEVMAddress.length > 0) {
      pingUserAddress(nonEVMAddress).then(_ => {});
    }
  }, [nonEVMAddress]);

  useEffect(() => {
    const clearTag = localStorage.getItem(storageConstants.KEY_CLEAR_TAG);
    if (clearTag !== "clearForTransferHistoryIteration2") {
      localStorage.clear();
    }
    localStorage.setItem(storageConstants.KEY_CLEAR_TAG, "clearForTransferHistoryIteration2");
    const localeToAddTokenStr = localStorage.getItem(storageConstants.KEY_TO_ADD_TOKEN);
    if (localeToAddTokenStr && provider) {
      const localeToAddToken = JSON.parse(localeToAddTokenStr).atoken;
      addChainToken(localeToAddToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  useAsync(async () => {
    if (address) {
      getRewardsData();
    }
  }, [address]);

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
                  return tokenInfo.token.display_symbol === seoTokenSymbol;
                } else {
                  return tokenInfo.token.symbol.indexOf(seoTokenSymbol) > -1;
                }
              });
              if (potentialTokenList.length === 0) {
                localStorage.setItem(
                  storageConstants.KEY_SELECTED_TOKEN_SYMBOL,
                  supportTokenList[0].token.display_symbol ?? supportTokenList[0].token.symbol,
                );
                sessionStorage.setItem(seoDefalutKey, "1");
              } else {
                localStorage.setItem(
                  storageConstants.KEY_SELECTED_TOKEN_SYMBOL,
                  potentialTokenList[0].token.display_symbol ?? potentialTokenList[0].token.symbol,
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

  useEffect(() => {
    refreshHistoryCallback({ address, flowAddress, aptosAddress, seiAddress, injAddress, provider, chainId });
    clearInterval(inter);
    inter = setInterval(() => {
      refreshHistoryCallback({ address, flowAddress, aptosAddress, seiAddress, injAddress, provider, chainId });
    }, 60000);

    document.addEventListener("visibilitychange", _ => {
      // console.log(document.visibilityState);
      if (document.visibilityState === "hidden") {
        clearInterval(inter);
      } else if (document.visibilityState === "visible") {
        refreshHistoryCallback({ address, flowAddress, aptosAddress, seiAddress, injAddress, provider, chainId });
        clearInterval(inter);
        inter = setInterval(() => {
          refreshHistoryCallback({ address, flowAddress, aptosAddress, seiAddress, injAddress, provider, chainId });
        }, 60000);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, refreshHistory, flowAddress, aptosAddress, provider, chainId]);

  const refreshTransferAndLPHistory = (
    address: string,
    flowAddress: string,
    aptosAddress: string,
    seiAddress: string,
    injAddress: string,
    provider: JsonRpcProvider | undefined,
    chainId: number,
  ) => {
    const addressesUsedForRemoteRequest = [address];
    const addressesUsedForLocalPreparation = [address];

    if (flowAddress.length > 0) {
      const flowEVMCompatibleAddress = convertNonEVMAddressToEVMCompatible(flowAddress, NonEVMMode.flowTest);
      addressesUsedForRemoteRequest.push(flowEVMCompatibleAddress);
      addressesUsedForLocalPreparation.push(flowAddress);
    }

    if (aptosAddress.length > 0) {
      addressesUsedForRemoteRequest.push(aptosAddress);
      addressesUsedForLocalPreparation.push(aptosAddress);
    }
    if (seiAddress.length > 0) {
      addressesUsedForRemoteRequest.push(convertSeiToCanonicalAddress(seiAddress));
      addressesUsedForLocalPreparation.push(seiAddress);
    }
    if (injAddress.length > 0) {
      addressesUsedForRemoteRequest.push(convertInjToCanonicalAddress(injAddress));
      addressesUsedForLocalPreparation.push(injAddress);
    }
    const pendingHistoryPromise = getPendingHistory(addressesUsedForRemoteRequest);

    const mergedTransferHistoryItemsPromise = getTransferHistoryItems(
      addressesUsedForRemoteRequest.filter(item => {
        return item.length > 0;
      }),
      addressesUsedForLocalPreparation.filter(item => {
        return item.length > 0;
      }),
      provider,
      chainId,
    );

    const mergedLiquidityHistoryItemsPromise = getLiquidityHistoryItems(address, provider, chainId);

    pendingHistoryPromise
      .then(pendingHistory => {
        return Promise.all([
          Promise.resolve(pendingHistory),
          mergedTransferHistoryItemsPromise,
          mergedLiquidityHistoryItemsPromise,
        ]);
      })
      .then(result => {
        const pendingHistory = result[0];
        const mergedTransferHistoryItems = result[1];
        const mergedLiquidityHistoryItems = result[2];
        const localPendingTransferHistoryItemList =
          mergedTransferHistoryItems?.mergedHistoryList?.filter(item => {
            return (
              item.status !== TransferHistoryStatus.TRANSFER_UNKNOWN &&
              item.status !== TransferHistoryStatus.TRANSFER_FAILED &&
              item.status !== TransferHistoryStatus.TRANSFER_REFUNDED &&
              item.status !== TransferHistoryStatus.TRANSFER_COMPLETED
            );
          }) ?? [];
        const actionAndPendingList = [
          ...pendingHistory?.action_transfer_history,
          ...pendingHistory?.pending_transfer_history,
        ];
        const { newList, actionNum } = mergeTransferRemotePendingListAndHistoryPendingList(
          actionAndPendingList,
          localPendingTransferHistoryItemList,
        );

        setHistoryAction(actionNum);
        setHistoryPending(newList.length);
        const localPendingLpHistoryItemList =
          mergedLiquidityHistoryItems?.mergedLpHistory?.filter(item => {
            return (
              item.status !== LPHistoryStatus.LP_COMPLETED &&
              item.status !== LPHistoryStatus.LP_FAILED &&
              item.status !== LPHistoryStatus.LP_UNKNOWN
            );
          }) ?? [];
        const { newList: lpNewList, actionNum: lpActionNum } = mergeLPRemotePendingListAndHistoryPendingList(
          pendingHistory?.action_lp_history,
          localPendingLpHistoryItemList,
        );

        setLpAction(lpActionNum);
        setLpPending(lpNewList.length);
      });

    if (address) {
      getNFTHistoryItems(address, provider, chainId);
    }
  };

  const refreshHistoryCallback = useCallback(
    debounce(nextValue => {
      refreshTransferAndLPHistory(
        nextValue.address,
        nextValue.flowAddress,
        nextValue.aptosAddress,
        nextValue.seiAddress,
        nextValue.injAddress,
        nextValue.provider,
        nextValue.chainId,
      );
    }, 3000),
    [],
  );

  useEffect(() => {
    if (toChain && toChain !== undefined && transferSupportedChainList.length > 0) {
      // if (transferSupportedChainList.)
      const toChainNotSuitableForSourceChain =
        transferSupportedChainList.filter(chainInfo => {
          return chainInfo.id === toChain.id;
        }).length === 0;

      if (toChainNotSuitableForSourceChain) {
        setToChainMethod(transferSupportedChainList[0].id);
      }
    }
  }, [transferSupportedChainList]);

  useEffect(() => {
    const cacheTokenSymbol = localStorage.getItem(storageConstants.KEY_SELECTED_TOKEN_SYMBOL);
    if (fromChain && fromChain !== undefined && toChain && toChain !== undefined) {
      if (supportTokenList.length > 0) {
        const potentialTokenList = supportTokenList.filter(tokenInfo => {
          return (tokenInfo.token.display_symbol ?? tokenInfo.token.symbol) === cacheTokenSymbol;
        });

        if (potentialTokenList.length === 0) {
          if (cacheTokenSymbol === "ETH") {
            const specialWETHToken = supportTokenList.find(tokenInfo => {
              return tokenInfo.token.symbol === "WETH";
            });
            if (specialWETHToken) {
              dispatch(setSelectedToken(specialWETHToken));
              return;
            }
          }

          var specifiedDefaultToken = supportTokenList.find(_ => _.token.symbol === "USDC");
          if (!specifiedDefaultToken) {
            specifiedDefaultToken = supportTokenList[0];
          }
          dispatch(setSelectedToken(specifiedDefaultToken));
        } else {
          dispatch(setSelectedToken(potentialTokenList[0]));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportTokenList]);

  useEffect(() => {
    if (affectedUserAddresses.map(_ => _.toLowerCase()).includes(address.toLowerCase())) {
      setShouldShowAffectedNotification(true);
    }
  }, [address]);

  const getRewardsData = async () => {
    let hasRetentionRewardsEvent = false;
    const retentionRewardsRes = await getRetentionRewardsInfo({ addr: address });
    if (retentionRewardsRes && Number(retentionRewardsRes.event_id) > 0) {
      hasRetentionRewardsEvent = true;
    }

    let hasFeeRebateEvent = false;
    const feeRebateRes = await getPercentageFeeRebateInfo({ addr: address });
    if (feeRebateRes && Number(feeRebateRes.event_id) > 0) {
      hasFeeRebateEvent = true;
    }

    let hasBscCampaignEvent = false;
    const bscCampaignReq = new GetBscCampaignInfoRequest();
    bscCampaignReq.setAddr(address);
    const bscCampaignRes = await getBscCampaignInfo(bscCampaignReq);
    if (!bscCampaignRes.hasErr() && bscCampaignRes.getInfoList().length > 0) {
      hasBscCampaignEvent = true;
    }
    const hasCBridgeCarnivalEvent = false;
    dispatch(
      setHasEvents(hasRetentionRewardsEvent || hasFeeRebateEvent || hasBscCampaignEvent || hasCBridgeCarnivalEvent),
      // setHasEvents(false)
    );
  };

  const getSystemAnnouncementData = async () => {
    const request = new GetSystemAnnouncementRequest();
    try {
      const announcementRes = await getSystemAnnouncement(request);
      const res = announcementRes.toObject();
      if (!res.err) {
        setSystemAnnouncement(res.systemAnnouncement);
        setSystemAnnouncementEnbled(res.enabled);
        if (process.env.REACT_APP_ENV_TYPE !== "staging" && process.env.REACT_APP_ENV_TYPE !== "mainnet") {
          dispatch(setTransferRelatedFeatureDisabled(false));
        } else {
          dispatch(setTransferRelatedFeatureDisabled(!res.allfunctionalityenabled));
        }
      }
    } catch {
      console.debug("getSystemAnnouncement->error");
    }
  };

  const getTransferHistoryItems = async (
    addressesUsedForRemoteRequest: string[],
    addressesUsedForLocalPreparation: string[],
    provider: JsonRpcProvider | undefined,
    chainId: number,
  ) => {
    if (addressesUsedForRemoteRequest.length === 0) {
      return;
    }
    const transferHistoryResponse = await transferHistory({
      acct_addr: addressesUsedForRemoteRequest,
      page_size: 15,
      next_page_token: "",
    });
    const localHistoryItems = filteredLocalTransferHistory(addressesUsedForLocalPreparation);
    const queryWaitingForFundReleaseHistoryItemsOnChain = await queryWaitingForFundReleaseHistoryRelay(
      transferHistoryResponse.history,
    );
    const queryTransactionStatusOnChain = getHistoryOnchainQueryPromiseList(provider, chainId, localHistoryItems);
    const result = await Promise.all(queryTransactionStatusOnChain);
    const historyMergeResult = mergeTransactionHistory({
      pageToken: new Date().getTime(),
      historyList: transferHistoryResponse.history,
      localHistoryList: localHistoryItems,
      pageSize: 15,
      onChainResult: result,
      transferConfig,
      onlyshowPending: false,
    });
    return historyMergeResult;
  };

  const queryWaitingForFundReleaseHistoryRelay = async (histories: TransferHistory[]) => {
    const destinationRelayFinishedTransferIds = getDestinationRelayFinishedTransferIds();

    const waitingForFundReleaseHistories = histories.filter(history => {
      return (
        history.status === TransferHistoryStatus.TRANSFER_WAITING_FOR_FUND_RELEASE &&
        !destinationRelayFinishedTransferIds.includes(history.transfer_id)
      );
    });

    return Promise.all(
      waitingForFundReleaseHistories.map(history => {
        const transferPair = getTransferPair(
          transferConfig,
          history.src_send_info.chain.id,
          history.dst_received_info.chain.id,
          history.src_send_info.token.symbol,
        );
        return getDestinationTransferId(history.transfer_id)
          .then(destinationChainTransferId => {
            return destinationRelayChecker(transferPair, destinationChainTransferId);
          })
          .then(relayFinished => {
            if (relayFinished) {
              addNewDestinationRelayFinishedTransferId(history.transfer_id);
            }
          })
          .catch(error => {
            console.debug("error", error);
          });
      }),
    );
  };

  const getLiquidityHistoryItems = async (
    evmAddress: string,
    provider: JsonRpcProvider | undefined,
    chainId: number,
  ) => {
    if (!evmAddress) {
      return mergeLiquidityHistory(evmAddress, new Date().getTime(), [], [], [], 0);
    }
    const liquidityHistoryResponse = await lpHistory({ addr: evmAddress, page_size: 15, next_page_token: "" });
    let localLiquidityHistoryItems: LPHistory[] = [];
    const localLiquidityHistoryJSONString = localStorage.getItem(storageConstants.KEY_LP_LIST);
    if (localLiquidityHistoryJSONString) {
      localLiquidityHistoryItems = JSON.parse(localLiquidityHistoryJSONString)[evmAddress] as LPHistory[];
    }
    const promiseList = getLpOnChainQueryPromiseList(provider, chainId, localLiquidityHistoryItems);
    const onChainResult = await Promise.all(promiseList);
    return mergeLiquidityHistory(
      evmAddress,
      new Date().getTime(),
      liquidityHistoryResponse?.history,
      localLiquidityHistoryItems,
      onChainResult,
      50,
    );
  };

  const getNFTOnChainQueryPromiseList = (provider, chainId, localNFTHistoryList: NFTHistory[]) => {
    // eslint-disable-next-line
    const promiseList: Array<Promise<any>> = [];
    if (localNFTHistoryList) {
      const newLocalNFTList: NFTHistory[] = [];
      localNFTHistoryList?.forEach(localItem => {
        if (localItem && localItem.toString() !== "null") {
          newLocalNFTList.push(localItem);
          if (
            localItem?.status === NFTBridgeStatus.NFT_BRIDGE_FAILED ||
            localItem?.txIsFailed ||
            Number(localItem.srcChid) !== Number(chainId)
          ) {
            // Failed transactions filter
            const nullPromise = new Promise(resolve => {
              resolve(0);
            });
            promiseList.push(nullPromise);
          } else {
            const promistx = getTxStatus(provider, localItem.srcTx);
            promiseList.push(promistx);
          }
        }
      });
    }
    return promiseList;
  };

  const getNFTHistoryItems = async (evmAddress: string, provider: JsonRpcProvider | undefined, chainId: number) => {
    const nftHistoryResponse = await nftHistory(evmAddress, { nextPageToken: "", pageSize: 50 });
    let localNFTHistoryItems: NFTHistory[] = [];
    const localNFTHistoryJSONString = localStorage.getItem(storageConstants.KEY_NFT_HISTORY_LIST_JSON);
    if (localNFTHistoryJSONString) {
      localNFTHistoryItems = JSON.parse(localNFTHistoryJSONString)[evmAddress] as NFTHistory[];
    }
    const promiseList = getNFTOnChainQueryPromiseList(provider, chainId, localNFTHistoryItems);
    Promise.all(promiseList).then(onChainResult => {
      const nftMergerdResult = mergeNFTHistory({
        pageToken: new Date().getTime(),
        historyList: nftHistoryResponse?.history,
        localHistoryList: localNFTHistoryItems,
        pageSize: 50,
        address: evmAddress,
        onChainResult: onChainResult,
      });
      setNftActionNum(nftMergerdResult.historyActionNum);
      setNftPendingNum(nftMergerdResult.historyPendingNum);
    });
  };

  useEffect(() => {
    const totalActionNumber = lpAction + historyAction + nftActionNum;
    const totalPendingNumber = lpPending + historyPending + nftPendingNum;
    dispatch(setTotalActionNum(totalActionNumber));
    dispatch(setTotalPendingNum(totalPendingNumber));
    dispatch(setHistoryActionNum(historyAction));
    dispatch(setHistoryPendingNum(historyPending));
    dispatch(setLpActionNum(lpAction));
    dispatch(setLpPendingNum(lpPending));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lpAction, historyAction, historyPending, lpPending, nftActionNum, nftPendingNum]);

  useEffect(() => {
    if (chainId) {
      const chainName = getNetworkById(chainId)?.name;
      if (chainName) {
        localStorage.setItem(storageConstants.KEY_CHAIN_NAME, chainName);
      }
    }
  }, [chainId]);

  useEffect(() => {
    if (chainId && transferConfig) {
      const chainConfig = transferConfig.chains.find(it => it.id === chainId);
      if (chainConfig) {
        dispatch(setFarmingRewardAddresses(chainConfig.farming_reward_contract_addr));
      }
    }
  }, [chainId, transferConfig]);
  useEffect(() => {
    if (chainId && rfqConfig) {
      const rfqContractAddresses = rfqConfig.rfqContractAddressesMap.find(it => it[0] === chainId);
      if (rfqContractAddresses) {
        dispatch(setRfqContractAddr(rfqContractAddresses[1]));
      }
    }
  }, [chainId, rfqConfig]);

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

  const getDefaultData = (chains, sourceChainId, destinationChainId) => {
    let sourceChain;
    let destinChain;
    const defaultFromChains = chains.filter(
      item => Number(item.id) === Number(sourceChainId) && Number(item.id) !== 1666600000,
    );
    if (defaultFromChains.length > 0) {
      sourceChain = defaultFromChains[0];
    }
    const defaultToChains = chains.filter(
      item => Number(item.id) === Number(destinationChainId) && Number(item.id) !== 1666600000,
    );
    if (defaultToChains.length > 0) {
      destinChain = defaultToChains[0];
    }
    return { sourceChain, destinChain };
  };

  const setDefaultInfo = useCallback(
    (chains, chain_token, chainId) => {
      if (chains.length > 1) {
        let cacheFromChainId = localStorage.getItem(storageConstants.KEY_FROM_CHAIN_ID);

        if (chainId > 0 && localStorage.getItem(storageConstants.KEY_CHAIN_ID_HIGH_PRIORITY) === "1") {
          cacheFromChainId = chainId;
          localStorage.setItem(storageConstants.KEY_CHAIN_ID_HIGH_PRIORITY, "0");
        }

        const cacheToChainId = localStorage.getItem(storageConstants.KEY_TO_CHAIN_ID);

        const dataInfo = getDefaultData(chains, cacheFromChainId, cacheToChainId); // get info by id
        const { sourceChain, destinChain } = dataInfo;

        const cacheFromChain = sourceChain;
        const cacheToChain = destinChain;
        let defaultFromChain;
        let defaultToChain;

        if (chainId) {
          const chainInfo = chains.filter(item => Number(item.id) === chainId && Number(item.id) !== 1666600000);
          if (cacheFromChain && cacheFromChain !== "undefined") {
            const localFromChain = cacheFromChain;
            const newLocalFromCahinInfo = chains.filter(
              item => Number(item.id) === localFromChain.id && Number(item.id) !== 1666600000,
            );
            if (newLocalFromCahinInfo.length > 0) {
              defaultFromChain = localFromChain;
            } else {
              defaultFromChain = chains[0];
            }
          } else {
            if (chainInfo.length > 0) {
              defaultFromChain = chainInfo[0];
            } else {
              defaultFromChain = chains[0];
            }
          }

          /// Non-EVM chain should not be influenced by web3 chainId change
          if (sourceChain && getNonEVMMode(sourceChain.id) !== NonEVMMode.off) {
            defaultFromChain = sourceChain;
          }

          // Find to chain
          defaultToChain = chains[1];
          if (cacheToChain && cacheToChain !== "undefined") {
            defaultToChain = cacheToChain;
          }
        } else {
          // Display from chain and source chain without wallet connection
          if (cacheFromChain) {
            defaultFromChain = cacheFromChain;
          } else {
            defaultFromChain = chains[0];
          }
          if (cacheToChain) {
            defaultToChain = cacheToChain;
          } else {
            const nonDefaultFromChains = chains.filter(chainInfo => {
              return chainInfo.id !== defaultFromChain.id;
            });
            if (nonDefaultFromChains.length > 0) {
              defaultToChain = nonDefaultFromChains.find(_ => _.id === 56);
              if (!defaultToChain) {
                defaultToChain = chains[1];
              }
            } else {
              defaultToChain = chains[1];
            }
          }
        }

        if (
          defaultFromChain &&
          supportTransferChains.length > 0 &&
          !supportTransferChains.includes(defaultFromChain.id)
        ) {
          const tempChainId = supportTransferChains[0];
          const tempChains = chains.filter(item => Number(item.id) === tempChainId && Number(item.id) !== 1666600000);
          if (tempChains && tempChains.length > 0) {
            defaultFromChain = tempChains[0];
          }
        }
        if (defaultToChain && supportTransferChains.length > 0 && !supportTransferChains.includes(defaultToChain.id)) {
          const tempChainId = supportTransferChains[1];
          const tempChains = chains.filter(item => Number(item.id) === tempChainId && Number(item.id) !== 1666600000);
          if (tempChains && tempChains.length > 0) {
            defaultToChain = tempChains[0];
          }
        }

        if (defaultFromChain) {
          const defalutTokenList = chain_token[defaultFromChain.id]?.token;
          dispatch(setFromChain(defaultFromChain));
          dispatch(setToChain(defaultToChain));

          if (!isNonEVMChain(defaultToChain?.id)) {
            dispatch(setCBridgeDesAddresses(defaultToChain?.contract_addr));
          } else {
            dispatch(setCBridgeDesAddresses(""));
          }
          if (!isNonEVMChain(defaultFromChain?.id)) {
            dispatch(setCBridgeAddresses(defaultFromChain?.contract_addr));
            dispatch(setTransferAgentAddress(defaultFromChain?.transfer_agent_contract_addr));
          } else {
            dispatch(setCBridgeAddresses(""));
          }
          dispatch(setTokenList(defalutTokenList));
        }
      }
    },
    [dispatch, chainId, supportTransferChains],
  );

  // Update cBridge contract address if needed
  useEffect(() => {
    if (!fromChain) {
      return;
    }
    if (!isNonEVMChain(fromChain.id) && fromChain.id === chainId) {
      dispatch(setCBridgeAddresses(fromChain.contract_addr));
      dispatch(setTransferAgentAddress(fromChain.transfer_agent_contract_addr ?? ""));
    } else {
      dispatch(setCBridgeAddresses(""));
    }
  }, [dispatch, chainId, fromChain]);

  useEffect(() => {
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
          nextValue.selectedToken?.token?.display_symbol ?? nextValue.selectedToken?.token?.symbol
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

  const handleSelectChain = (id: number) => {
    if (chainSource === "from") {
      if (id !== chainId) {
        switchMethod(id, "");
      } else if (id !== fromChain?.id) {
        /// Scenario:
        /// Flow as source chain
        /// MetaMask connect evm chain A
        /// User wants to use evm chain A as source chain
        const chain = transferConfig.chains.find(chainInfo => {
          return chainInfo.id === id;
        });
        if (chain !== undefined) {
          dispatch(setFromChain(chain));
        }
      }
    } else if (chainSource === "to") {
      setToChainMethod(id);
    } else if (chainSource === "wallet") {
      if (id !== chainId) {
        switchMethod(id, "");
      } else if (id !== fromChain?.id) {
        /// Scenario:
        /// Flow as source chain
        /// MetaMask connect evm chain A
        /// User wants to use evm chain A as source chain
        const chain = transferConfig.chains.find(chainInfo => {
          return chainInfo.id === id;
        });
        if (chain !== undefined) {
          dispatch(setFromChain(chain));
        }
      }
    } else if (chainSource === "SingleChain") {
      const newList = dataClone(singleChainList);
      lpList?.forEach(item => {
        if (item?.chain.id === id && item?.token.token.symbol === selectedLP?.token.token.symbol) {
          newList[singleChainSelectIndex].totalLiquidity = item.liquidity_amt;
          newList[singleChainSelectIndex].token_addr = item?.token.token.address;
          newList[singleChainSelectIndex].chain = item?.chain;
          newList[singleChainSelectIndex].token = item?.token.token;
          newList[singleChainSelectIndex].stimatedReceived = "0";
          newList[singleChainSelectIndex].bridgeRate = "0";
          newList[singleChainSelectIndex].fee = "0";
          newList[singleChainSelectIndex].errorMsg = "";
          newList[singleChainSelectIndex].ratio = "0";
        }
      });
      newList[singleChainSelectIndex].from_chain_id = id;
      dispatch(setSingleChainList(newList));
    }
    dispatch(setIsChainShow(false));
  };

  const switchMethod = (paramChainId, paramToken) => {
    const nonEVMMode = getNonEVMMode(paramChainId);

    switch (nonEVMMode) {
      case NonEVMMode.flowMainnet:
      case NonEVMMode.flowTest: {
        if (flowConnected) {
          const chain = transferConfig.chains.find(chainInfo => {
            return chainInfo.id === paramChainId;
          });
          if (chain !== undefined) {
            dispatch(setFromChain(chain));
          }
        } else {
          dispatch(openModal(ModalName.flowProvider));
        }
        return;
      }
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        if (aptosConnected) {
          const chain = transferConfig.chains.find(chainInfo => {
            return chainInfo.id === paramChainId;
          });
          if (chain !== undefined) {
            dispatch(setFromChain(chain));
          }
        } else {
          dispatch(openModal(ModalName.aptosProvider));
        }
        return;
      }
      case NonEVMMode.seiMainnet:
      case NonEVMMode.seiDevnet:
      case NonEVMMode.seiTestnet: {
        if (seiConnected) {
          const chain = transferConfig.chains.find(chainInfo => {
            return chainInfo.id === paramChainId;
          });
          if (chain !== undefined) {
            dispatch(setFromChain(chain));
          }
        } else {
          dispatch(openModal(ModalName.seiProvider));
        }
        return;
      }
      case NonEVMMode.injectiveTestnet:
      case NonEVMMode.injectiveMainnet: {
        if (injConnected) {
          const chain = transferConfig.chains.find(chainInfo => {
            return chainInfo.id === paramChainId;
          });
          if (chain !== undefined) {
            dispatch(setFromChain(chain));
          }
        } else {
          dispatch(openModal(ModalName.injProvider));
        }
        return;
      }
      default: {
        break;
      }
    }

    switchChain(paramChainId, paramToken, (targetFromChainId: number) => {
      const chain = transferConfig.chains.find(chainInfo => {
        return chainInfo.id === targetFromChainId;
      });
      if (chain !== undefined) {
        dispatch(setFromChain(chain));
      }
    });

    const newTokenList: LocalTokenInfo[] = chain_token[chainId]?.token;
    dispatch(setTokenList(newTokenList));
    if (newTokenList) {
      const cacheTokensymbol = localStorage.getItem(storageConstants.KEY_SELECTED_TOKEN_SYMBOL);
      const cacheTokenList = newTokenList.filter(
        item => item.token.symbol === cacheTokensymbol || item.token.display_symbol === cacheTokensymbol,
      );
      if (cacheTokenList.length > 0) {
        dispatch(setSelectedToken(cacheTokenList[0]));
      } else {
        dispatch(setSelectedToken(newTokenList[0]));
      }
    }
  };

  const setToChainMethod = (id?: number) => {
    if (!chains || !chain_token || !chains.length) {
      return;
    }
    const targetToChain: Chain =
      chains.find(chain => chain.id === id) || chains.find(chain => chain.id !== fromChain?.id) || chains[0];
    if (targetToChain) {
      dispatch(setToChain(targetToChain));
      dispatch(setCBridgeDesAddresses(targetToChain?.contract_addr));
    }
  };

  /**
   * 进入页面应该就要请求一次transfer config接口，获取设置bridge相关的address
   */
  // todo: check
  useEffect(() => {
    const req = new GetTransferConfigsRequest();
    Promise.all([
      getTransferConfigs(req),
      getFlowTokenPathConfigs(),
      getRfqConfig(new GetRfqConfigsRequest()),
      getPriceOfTokens(),
      getSystemAnnouncementData(),
    ]).then(values => {
      const res = values[0];
      const flowTokenPath = values[1];
      const rfqRes = values[2]?.toObject();
      console.debug("res: ", res.toObject());
      if (rfqRes && !rfqRes.err) {
        dispatch(
          setRfqConfig({
            chaintokensList: rfqRes.chaintokensList,
            rfqContractAddressesMap: rfqRes.rfqContractAddressesMap,
          }),
        );
      }
      if (res) {
        // const { chains, chain_token, farming_reward_contract_addr, pegged_pair_configs } = res;
        const { chainsList, chainTokenMap, peggedPairConfigsList } = res.toObject();
        const newtokenMap: MapLike<ChainTokenInfo> = {};
        chainTokenMap?.map(item => {
          if (item?.length === 2) {
            newtokenMap[item[0]] = {
              token: getTokenList(item[1]),
            };
          }
          return item;
        });
        const newChainsList = chainsList?.map(item => {
          const chain: Chain = {
            id: item?.id,
            name: item?.name,
            icon: item?.icon,
            block_delay: item?.blockDelay,
            gas_token_symbol: item?.gasTokenSymbol,
            explore_url: item?.exploreUrl,
            rpc_url: "",
            contract_addr: item?.contractAddr,
            drop_gas_amt: item?.dropGasAmt,
            farming_reward_contract_addr: item?.farmingRewardContractAddr,
            transfer_agent_contract_addr: item?.transferAgentContractAddr,
          };
          return chain;
        });
        const newPeggedPairConfigsList = peggedPairConfigsList?.map((item: PeggedPairConfig.AsObject) => {
          const newItem: LocalPeggedPairConfig = {
            org_chain_id: item?.orgChainId,
            org_token: getTokenInfoByProto(item?.orgToken),
            pegged_chain_id: item?.peggedChainId,
            pegged_token: getTokenInfoByProto(item?.peggedToken),
            pegged_deposit_contract_addr: item?.peggedDepositContractAddr,
            pegged_burn_contract_addr: item?.peggedBurnContractAddr,
            canonical_token_contract_addr: item?.canonicalTokenContractAddr,
            vault_version: item?.vaultVersion,
            bridge_version: item?.bridgeVersion,
            migration_peg_burn_contract_addr: item?.migrationPegBurnContractAddr,
          };

          return newItem;
        });
        const chains = newChainsList;
        const chain_token = newtokenMap;
        const localChains = CHAIN_LIST;
        const filteredChains = chains.filter(item => {
          const filterLocalChains = localChains.filter(localChainItem => localChainItem.chainId === item.id);
          return filterLocalChains.length > 0;
        });

        if (flowTokenPath) {
          const { FtConfigs } = flowTokenPath;
          dispatch(setFlowTokenPathConfigs(FtConfigs));
        }

        dispatch(
          setTransferConfig({
            chains: filteredChains,
            chain_token,
            pegged_pair_configs: newPeggedPairConfigsList,
          }),
        );
        dispatch(
          setConfig({
            chains: filteredChains,
            chain_token,
            pegged_pair_configs: newPeggedPairConfigsList,
          }),
        );

        const tokenPriceConfig = values[3];
        dispatch(setPriceOfTokens(tokenPriceConfig));
        // dispatch(setFarmingRewardAddresses(farming_reward_contract_addr));
        dispatch(setGetConfigsFinish(true));
        // 设置默认信息

        const displayChains = filteredChains.filter(item => {
          const enableTokens = chain_token[item.id].token.filter(tokenItem => !tokenItem.token.xfer_disabled);
          const hasPegToken =
            newPeggedPairConfigsList.filter(pgItem => {
              return item.id === pgItem.org_chain_id || item.id === pgItem.pegged_chain_id;
            }).length > 0;
          return (enableTokens.length > 0 || hasPegToken) && item.id !== 1666600000;
        });
        setChainList(displayChains);
        const localRes = {
          chains: newChainsList,
          chain_token: chain_token,
          pegged_pair_configs: newPeggedPairConfigsList,
        };
        setTransferConfigsResponse(localRes);
      } else {
        // message.error("Interface error !");
      }
    });
  }, []);

  useEffect(() => {
    if (chainList?.length === 0 || !transferConfigsResponse || supportTransferChains.length === 0) {
      return;
    }
    const { chain_token } = transferConfigsResponse;
    setDefaultInfo(chainList, chain_token, chainId);
  }, [supportTransferChains, chainList, transferConfigsResponse, chainId]);
  return (
    <div className={classes.app}>
      <Layout className={classes.layout}>
        {systemAnnouncementEnabled && systemAnnouncement.length > 0 && (
          <SystemNotificationView systemAnnouncement={systemAnnouncement} />
        )}
        {shouldShowAffectedNotification && (
          <PrivateNotificationView
            privateAnnouncement={
              <span>
                We have detected that you might be affected by a recent DNS poisoning attack on cBridge and need to
                revoke approval for certain smart contract addresses.{" "}
                <a href="https://twitter.com/CelerNetwork/status/1560123830844411904">See this</a> for more details. You
                can ignore this if you have already checked and revoked approvals.
              </span>
            }
          />
        )}
        <Header />
        {isFromSEO ? (
          <h1 className={classes.fromSeoTitle}>{headerTitle}</h1>
        ) : (
          <div className="smallTabBodyOut">
            <div className="smallTabBody">
              <ViewTab />
            </div>
          </div>
        )}

        <Content className={classes.content}>
          <Switch>
            <Route path="/liquidity">
              <Liquidity />
            </Route>
            <Route path="/rewards">
              <Rewards />
            </Route>
            <Route path="/nft">
              <NFTBridgeTab />
            </Route>
            <Route path="/">
              <Transfer />
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
      {isChainShow && (
        <ChainList
          visible={isChainShow}
          onSelectChain={handleSelectChain}
          onCancel={() => dispatch(setIsChainShow(false))}
        />
      )}
      {showHistoryModal && <HistoryModal visible={showHistoryModal} onCancel={handleCloseHistoryModal} />}
      <ProviderModal visible={showProviderModal} onCancel={handleCloseProviderModal} />
      <FlowProviderModal visible={showFlowProviderModal} onCancel={handleCloseFlowProviderModal} />
      <AptosProviderModal visible={showAptosProviderModal} onCancel={handleCloseAptosProviderModal} />
      <SeiProviderModal visible={showSeiProviderModal} onCancel={handleCloseSeiProviderModal} />
      <InjProviderModal visible={showInjProviderModal} onCancel={handleCloseInjProviderModal} />
      {userIsBlockedModal && <UserIsBlockedModal />}
      {showDebugTool && <DebugBtn />}
    </div>
  );
}

export default CBridgeTransferHome;
