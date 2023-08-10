/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import { useEffect, useState, useContext, useCallback } from "react";
import { Menu, Button, Spin, Switch } from "antd";
import { createUseStyles } from "react-jss";
import { debounce } from "lodash";
import { ClockCircleOutlined, ReloadOutlined } from "@ant-design/icons";

import { useWeb3Context } from "../../providers/Web3ContextProvider";

import { Theme } from "../../theme";
import { storageConstants } from "../../constants/const";
import { transferHistory, getNFTBridgeChainList, nftHistory } from "../../redux/gateway";
import {
  TransferHistoryStatus,
  LPHistoryStatus,
  TransferHistory,
  LPHistory,
  NFTHistory,
  NFTBridgeStatus,
  S3NFTConfig,
} from "../../constants/type";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { switchChain, setHistoryActionNum, setFromChain } from "../../redux/transferSlice";
import { ColorThemeContext } from "../../providers/ThemeProvider";
import HistoryTransferModal from "./HistoryTransferModal";
import {
  HistoryDisConnectModal,
  HistorySpeedModal,
  HistorySpeedSuccessModal,
} from "../../components/history/HistorySpeedModal";
import PageFlipper from "../../components/PageFlipper";
import { mergeTransactionHistory } from "../../utils/mergeTransferHistory";
import { dataClone } from "../../helpers/dataClone";
import { PeggedChainMode } from "../../hooks/usePeggedPairConfig";
import { useHistoryRelay, getRelayTimeMap } from "../../hooks/useHistoryRelay";

import { filteredLocalTransferHistory } from "../../utils/localTransferHistoryList";
import { mergeNFTHistory } from "../../utils/mergeNFTHistory";
import { NFTHistoryItem } from "./NFTHistoryItem";
import { TransferHistoryItem } from "../history/TransferHistoryItem";

import {
  getLPPending,
  getLPPendingOnePageList,
  getTransferPending,
  getTransferPendingOnePageList,
} from "../../utils/handlePendingHistoryData";

export type PageTokenMap = {
  [propName: number]: number;
};

const defaultPageSize = 5;

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  flexCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  menu: {
    width: props => (props.isMobile ? "100%" : 416),
    height: 44,
    background: theme.primaryUnable,
    borderRadius: 8,
    border: "none",
    "& .ant-menu-item": {
      flexGrow: 1,
      flexBasis: 0,
      textAlign: "center",
      margin: "2px !important",
      fontSize: 16,
      borderRadius: 8,
      top: 0,
      lineHeight: "38px",
      padding: props => (props.isMobile ? "0 !important" : ""),
      "&:hover": {
        color: theme.surfacePrimary,
      },
    },
    "& .ant-menu-item::after": {
      borderBottom: "0 !important",
    },
    "& .ant-menu-item div": {
      color: theme.secondBrand,
      fontWeight: 700,
      fontSize: "16px",
      "&:hover": {
        color: theme.primaryBrand,
      },
    },
    "& .ant-menu-item-selected": {
      background: theme.primaryBrand,
    },
    "& .ant-menu-item-selected:hover": {
      background: theme.primaryBrand,
      color: "#fff !important",
    },
    "& .ant-menu-item-selected div": {
      color: theme.unityWhite,
      "&:hover": {
        color: `${theme.unityWhite} !important`,
      },
    },
  },
  headerTip: {
    marginTop: 16,
    padding: "8px 17px",
    fontSize: 16,
    width: "100%",
    background: theme.unityWhite,
    display: "flex",
    alignItems: "center",
    boxShadow: "0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)",
    borderRadius: 8,
  },
  mobileHeaderTip: {
    marginTop: 14,
    marginBottom: 20,
    padding: "8px 12px",
    fontSize: 16,
    lineHeight: "20px",
    background: theme.unityWhite,
    display: "flex",
    alignItems: "center",
    boxShadow: "0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)",
    borderRadius: 8,
  },
  headerTipImg: props =>
    props.isMobile
      ? {
          width: 18,
          height: 18,
        }
      : {
          width: 30,
          height: 30,
        },
  headerTipText: props =>
    props.isMobile
      ? {
          fontSize: 12,
          lineHeight: "16px",
          fontWeight: "600",
          color: theme.unityBlack,
          paddingLeft: 11,
        }
      : {
          fontSize: 16,
          lineHeight: "19px",
          fontWeight: "bold",
          color: theme.unityBlack,
          paddingLeft: 13,
        },
  tipLink: {
    color: "#3366FF",
  },
  historyBody: {
    width: 786,
    padding: "72px 8px",
    background: theme.secondBackground,
    borderRadius: 16,
    border: `1px solid ${theme.primaryBorder}`,
    boxSizing: "border-box",
    boxShadow: "0px 4px 17px rgba(51, 102, 255, 0.1), 0px 8px 10px rgba(51, 102, 255, 0.1)",
  },
  mobileHistoryBody: {
    width: "100%",
    height: "100%",
    overflowY: "scroll",
    padding: "32px 16px",
  },
  historyList: {},
  ListItem: {
    width: "100%",
    background: theme.primaryBackground,
    marginTop: 16,
    borderRadius: 16,
    padding: "24px 16px 10px 16px",
  },

  itemtitle: {
    display: "flex",
    alignItems: "center",
  },
  turnRight: {
    width: 20,
    height: 18,
    margin: "0 10px",
  },
  txIcon: {
    width: 27,
    height: 27,
    borderRadius: "50%",
  },
  itemTime: {
    fontSize: 12,
    color: theme.secondBrand,
    textAlign: props => (props.isMobile ? "left" : "right"),
    fontWeight: 400,
  },
  reducetxnum: {
    fontSize: props => (props.isMobile ? 12 : 14),
    color: theme.infoDanger,
    lineHeight: 1,
  },
  receivetxnum: {
    fontSize: props => (props.isMobile ? 12 : 14),
    color: theme.infoSuccess,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },
  waring: {
    color: theme.infoWarning,
    fontSize: 14,
  },
  failed: {
    color: theme.infoDanger,
    fontSize: 14,
  },
  completed: {
    color: theme.infoSuccess,
    fontSize: 14,
  },
  canceled: {
    color: theme.infoWarning,
    fontSize: 14,
  },
  itemcont: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  mobileItemContent: {
    display: "grid",
    alignItems: "center",
    gridTemplateColumns: "repeat(1, 1fr)",
  },
  itemLeft: {
    display: "flex",
    justifyContent: props => (props.isMobile ? "space-between" : "flex-start"),
    alignItems: "center",
  },
  itemRight: {
    marginBottom: 0,
    textAlign: "right",
    alignItems: "center",
    justifyContent: "space-between",
    maxHeight: "40px",
  },
  mobileItemRight: {
    marginTop: 20,
    marginBottom: 0,
    textAlign: "left",
    alignItems: "center",
    justifyContent: "space-between",
  },
  showSuppord: {
    transform: "translateY(-21%)",
  },
  supportText: {
    display: "inline-block",
    cursor: "pointer",
    color: theme.primaryReduce,
  },
  chainName: {
    fontSize: props => (props.isMobile ? 12 : 14),
    color: theme.surfacePrimary,
    lineHeight: 1,
  },
  linktitle: {
    fontSize: props => (props.isMobile ? 12 : 14),
    color: theme.surfacePrimary,
  },
  chainName2: {
    fontSize: 14,
    color: theme.surfacePrimary,
    lineHeight: 1,
  },
  chaindes: {
    marginLeft: 6,
  },
  submitBtn: {
    background: theme.primaryBrand,
    borderColor: theme.primaryBrand,
    fontWeight: "bold",
    borderRadius: props => (props.isMobile ? 4 : 2),
    marginTop: props => (props.isMobile ? 14 : 0),
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  empty: {
    height: 480,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.surfacePrimary,
    fontSize: 15,
  },
  linkIcon: {
    fontSize: 14,
    marginLeft: 0,
  },
  numdot: {
    width: 17,
    height: 17,
    borderRadius: "50%",
    border: "1px solid #fff",
    backgroundColor: theme.infoDanger,
    color: "#fff !important",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    fontSize: "12px !important",
  },
  numdot2: {
    height: 16,
    borderRadius: 10,
    border: "1px solid #fff",
    backgroundColor: theme.infoDanger,
    color: "#fff !important",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    fontSize: "12px !important",
    padding: "8px 4px",
    lineHeight: 1,
  },
  tabtitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
  },
  rebutton: {
    marginRight: 7,
    "&.ant-btn": {
      boxShadow: "none",
      border: "none",
      background: "transparent",
      color: theme.secondBrand,
      opacity: 0.7,
      "&:focus, &:hover": {
        border: "none",
        color: theme.surfacePrimary,
        opacity: 0.9,
      },
    },
  },
  mobileTooltipOverlayStyle: {
    "& .ant-tooltip-inner": {
      width: "calc(100vw - 40px)",
      borderRadius: 8,
    },
    "& .ant-tooltip-arrow-content": {
      width: 9,
      height: 9,
    },
  },
  singlText: {
    fontSize: 14,
    lineHeight: "20px",
    color: theme.surfacePrimary,
  },
  blueText: {
    color: theme.primaryReduce,
  },
  disableTooltip: {
    position: "absolute",
    top: 40,
    right: 0,
    zIndex: 100,
    borderRadius: 8,
  },
  disableTooltipTran: {
    width: 9,
    height: 9,
    position: "absolute",
    top: -11,
    left: 32,
    zIndex: 100,
    background: "rgb(255, 255, 255)",
    boxShadow: "-3px -3px 7px rgb(0 0 0 / 7%)",
    transform: "translateY(6.53553391px) rotate(45deg)",
  },
  disableTooltipbody: {
    width: 290,
    fontSize: 12,
    borderRadius: 8,
    textAlign: "left",
    padding: "8px 12px",
    color: "rgb(10, 30, 66)",
    background: "rgb(255, 255, 255)",
    position: "relative",
  },
  whiteSpinblur: {
    "& .ant-spin-blur": {
      opacity: 0.5,
    },
    "& .ant-spin-blur::after": {
      opacity: 0.5,
    },
    "& .ant-spin-container::after": {
      background: "#f6f7fd",
    },
  },
  spinblur: {
    "& .ant-spin-blur": {
      opacity: 0.4,
    },
    "& .ant-spin-blur::after": {
      opacity: 0.4,
    },
    "& .ant-spin-container::after": {
      background: "#2c2c2c",
    },
  },
  showPending: {
    width: 290,
    color: theme.surfacePrimary,
    fontSize: 14,
    fontWeight: 700,
    padding: 8,
    border: `1px solid ${theme.primaryBorder}`,
    borderRadius: 16,
    background: theme.primaryBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& .ant-switch": {
      background: theme.primaryUnable,
    },
    "& .ant-switch-checked": {
      background: theme.primaryBrand,
    },
    "& .ant-switch-checked:focus": {
      boxShadow: "none",
    },
  },
  historyMenu: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
}));

interface IProps {
  refreshChanged: boolean;
}
const getTxStatus = async (provider, link) => {
  const txid = link.split("/tx/")[1];
  if (txid) {
    const res = await provider?.getTransactionReceipt(txid);
    return res;
  }
  return "";
};

export const getTransactionOnchainQueryPromiseList = (
  provider,
  chainId,
  localStorageHistoryList: TransferHistory[],
) => {
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
        } else if (Number(localItem.src_send_info.chain.id) === Number(chainId)) {
          const promistx = getTxStatus(provider, localItem.src_block_tx_link); // Check local transaction status
          promiseList.push(promistx);
        }
      }
    });
  }
  return promiseList;
};

export const getLpOnChainQueryPromiseList = (provider, chainId, localLpHistoryList: LPHistory[]) => {
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

const HistoryContent = (props: IProps): JSX.Element => {
  const { refreshChanged } = props;
  const { themeType } = useContext(ColorThemeContext);
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const { transferInfo, serviceInfo } = useAppSelector(state => state);
  const { transferConfig, historyActionNum, historyPendingNum, lpActionNum, lpPendingNum } = transferInfo;
  const { transferRelatedFeatureDisabled } = serviceInfo;
  const classes = useStyles({ isMobile });
  const [historykey, setHistorykey] = useState("transfer_history");
  const { address, chainId, provider, getNetworkById } = useWeb3Context();
  const now = new Date().getTime();
  const [currentPage, setCurrentPage] = useState(0);
  const [nextPageToken, setNextPageToken] = useState(0);
  const [size, setSize] = useState(defaultPageSize);
  const [pageMap, setPageMap] = useState<PageTokenMap>({ 0: now });
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LPHistory>();
  const [hisLoading, setHisLoading] = useState(true);
  const [lpLoading, setLpLodaing] = useState(false);
  const [nftLoading, setNFTLoading] = useState(false);
  const [pageChanged, setPageChanged] = useState(false);
  const [mergedHistoryList, setMergedHistoryList] = useState<TransferHistory[]>([]);
  const [nftActionNum, setNftActionNum] = useState<number>(0);
  const [nftPendingNum, setNftPendingNum] = useState<number>(0);
  const [mergedLpHistory, setMergedLpHistory] = useState<LPHistory[]>([]);
  const [mergedNFTHistory, setMergedNFTHistory] = useState<NFTHistory[]>([]);
  const [nftList, setNftList] = useState<S3NFTConfig[]>([]);
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const [showDisConnectModal, setShowDisConnectModal] = useState(false);
  const [showSpeedSuccessModal, setShowSpeedSuccessModal] = useState(false);
  const [speedUpPeggedMode, setSpeedUpPeggedMode] = useState<PeggedChainMode>(PeggedChainMode.Off);
  const [speedUpItem, setSpeedUpItem] = useState<TransferHistory>();
  const [relayLoading, setRelayLoading] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [onlyshowPending, setOnlyshowPending] = useState(!!(historyActionNum > 0 || lpActionNum > 0));
  const [relayHash, setRelayHash] = useState("");
  const [onlyPendingNowPage, setOnlyPendingNowPage] = useState<number>(0);
  const [allOnlyPendingTransferList, setAllOnlyPendingTransferList] = useState<TransferHistory[]>([]);
  const [allOnlyPendingLPList, setAllOnlyPendingLPList] = useState<LPHistory[]>([]);
  const [hasMorePending, setHasMorePending] = useState(true);
  const [firstGetIn, setFirstGetIn] = useState(true);

  const speedUp = useHistoryRelay(speedUpItem, speedUpPeggedMode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (historykey === "transfer_history") {
      if (historyActionNum > 0) {
        setOnlyshowPending(true);
      }
    }
    if (historykey === "liquidity_history") {
      if (lpActionNum > 0) {
        setOnlyshowPending(true);
      }
    }
  }, [historyActionNum, lpActionNum, historykey]);

  useEffect(() => {
    reloadHisList();
  }, [refreshChanged]);

  useEffect(() => {
    if (onlyshowPending) {
      handlePendingPageChange(0);
    } else {
      setNextPageToken(now);
      const newpMap = { 0: now };
      setPageMap(newpMap);
      setCurrentPage(0);
    }
  }, [historykey, showModal, onlyshowPending]);

  const handleTabKeyChange = key => {
    if (key === historykey) {
      return;
    }
    if (!onlyshowPending) {
      setPageChanged(true);
    }
    setHistorykey(key);
  };

  useEffect(() => {
    if (!hisLoading && !lpLoading && !nftLoading) {
      setFirstGetIn(false);
    }
  }, [hisLoading, lpLoading, nftLoading]);

  const getTransferPendingList = async page => {
    setHisLoading(true);
    const addresses = [address];
    const localAddresses = [address];

    const { newList, actionNum } = await getTransferPending(
      provider,
      chainId,
      addresses,
      localAddresses,
      transferConfig,
      getNetworkById,
    );
    dispatch(setHistoryActionNum(actionNum));
    setAllOnlyPendingTransferList(newList);
    const { pageList, nowPage } = getTransferPendingOnePageList(newList, page, defaultPageSize);
    setMergedHistoryList(pageList);
    setOnlyPendingNowPage(nowPage);
    handlehasMorePneding(newList?.length, nowPage);
    setHisLoading(false);
  };

  const getLPPendingList = async page => {
    setLpLodaing(true);
    const { newList } = await getLPPending(address, provider, chainId);
    setAllOnlyPendingLPList(newList);
    const { pageList, nowPage } = getLPPendingOnePageList(newList, page, defaultPageSize);
    setMergedLpHistory(pageList);
    setOnlyPendingNowPage(nowPage);
    handlehasMorePneding(newList?.length, nowPage);
    setLpLodaing(false);
  };

  const handlehasMorePneding = (listLength: number, nextPage: number) => {
    const totalPageNum = parseInt((listLength / defaultPageSize).toString(), 10);
    const pageReduce = listLength % defaultPageSize;
    const pages = pageReduce > 0 ? totalPageNum + 1 : totalPageNum;
    setHasMorePending(listLength === 0 ? false : !(pages === nextPage + 1));
  };

  const handlePendingPageChange = nextPage => {
    setOnlyPendingNowPage(nextPage);
    setCurrentPage(nextPage);
    if (historykey === "transfer_history") {
      if (nextPage === 0) {
        getTransferPendingList(0);
      } else {
        const { pageList, nowPage } = getTransferPendingOnePageList(
          allOnlyPendingTransferList,
          nextPage,
          defaultPageSize,
        );
        setMergedHistoryList(pageList);
        setOnlyPendingNowPage(nowPage);
      }
      handlehasMorePneding(allOnlyPendingTransferList?.length, nextPage);
    } else if (historykey === "liquidity_history") {
      if (nextPage === 0) {
        getLPPendingList(0);
      } else {
        const { pageList, nowPage } = getLPPendingOnePageList(allOnlyPendingLPList, nextPage, defaultPageSize);
        setMergedLpHistory(pageList);
        setOnlyPendingNowPage(nowPage);
      }
      handlehasMorePneding(allOnlyPendingLPList?.length, nextPage);
    }
  };

  const setPageMapJson = (cPage, stemp) => {
    const oldPageMap = dataClone(pageMap);
    oldPageMap[cPage + 1] = stemp;
    setPageMap(oldPageMap);
  };

  const getHistoryList = async next_page_token => {
    setHisLoading(true);

    const addresses = [address];
    const localAddresses = [address];

    const res = await transferHistory({ acct_addr: addresses, page_size: defaultPageSize, next_page_token });

    if (res) {
      if (historykey === "transfer_history") {
        setSize(res?.current_size);
      }

      const localHistoryList = filteredLocalTransferHistory(localAddresses);
      const allItemTxQueryPromise = getTransactionOnchainQueryPromiseList(provider, chainId, localHistoryList);
      return Promise.all(allItemTxQueryPromise).then(result => {
        mergeTransactionHistory({
          pageToken: pageMap[currentPage],
          historyList: res.history,
          localHistoryList,
          pageSize: 5,
          onChainResult: result,
          transferConfig,
          onlyshowPending,
          getNetworkById,
        }).then(mergedHistoryResult => {
          // setHistoryActionNum(mergedHistoryResult.historyActionNum);
          // setHistoryPendingNum(mergedHistoryResult.historyPendingNum);
          setMergedHistoryList(mergedHistoryResult.mergedHistoryList);
          setHisLoading(false);
        });
      });
    }
    return null;
  };

  useEffect(() => {
    if (mergedHistoryList && mergedHistoryList.length > 0) {
      const renewPageToken = mergedHistoryList[mergedHistoryList.length - 1].ts.toString();
      setPageMapJson(currentPage, renewPageToken);
    }
  }, [mergedHistoryList]);

  useEffect(() => {
    if (mergedLpHistory && mergedLpHistory.length > 0) {
      const renewPageToken = mergedLpHistory[mergedLpHistory.length - 1].ts.toString();
      setPageMapJson(currentPage, renewPageToken);
    }
  }, [mergedLpHistory]);

  useEffect(() => {
    if (mergedNFTHistory && mergedNFTHistory.length > 0) {
      const lastCreateItem = mergedNFTHistory[mergedNFTHistory.length - 1];
      const renewPageToken = lastCreateItem.createdAt.toString();
      setPageMapJson(currentPage, renewPageToken);
    }
  }, [mergedNFTHistory]);

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

  const getNFTHistoryList = async (nextPage, isAutoRefresh = false) => {
    if (!isAutoRefresh) {
      setNFTLoading(true);
    }

    try {
      const configRes = await getNFTBridgeChainList();
      setNftList(configRes.nfts);
      const res = await nftHistory(address, { nextPageToken: nextPage, pageSize: defaultPageSize });
      if (res && res.history) {
        if (historykey === "nft_history") {
          setSize(res?.pageSize);
        }
        let localNftList;
        const localNftListStr = localStorage.getItem(storageConstants.KEY_NFT_HISTORY_LIST_JSON);
        if (localNftListStr) {
          localNftList = JSON.parse(localNftListStr)[address] as NFTHistory[];
        }
        const promiseList = getNFTOnChainQueryPromiseList(provider, chainId, localNftList);

        return Promise.all(promiseList)
          .then(onChainResult => {
            const nftMergerdResult = mergeNFTHistory({
              pageToken: pageMap[currentPage],
              historyList: res.history,
              localHistoryList: localNftList,
              pageSize: 5,
              address,
              onChainResult,
            });
            setNftActionNum(nftMergerdResult.historyActionNum);
            setNftPendingNum(nftMergerdResult.historyPendingNum);
            setMergedNFTHistory(nftMergerdResult.mergedHistoryList);
            setNFTLoading(false);
          })
          .catch(() => {
            setNFTLoading(false);
          });
      }
      setNFTLoading(false);
    } catch (error) {
      setNFTLoading(false);
    }
    return null;
  };

  useEffect(() => {
    if (nextPageToken !== 0) {
      if (historykey === "transfer_history") {
        getHistoryList(nextPageToken);
      } else if (historykey === "nft_history") {
        getNFTHistoryList(nextPageToken);
      }
    }
  }, [nextPageToken]);

  const reloadHisList = () => {
    if (historykey === "transfer_history") {
      // eslint-disable-next-line no-unused-expressions
      !onlyshowPending
        ? getHistoryList(currentPage === 0 ? now : pageMap[currentPage])
        : getTransferPendingList(onlyPendingNowPage);
    } else if (historykey === "nft_history") {
      getNFTHistoryList(nextPageToken);
    }
  };

  const refreshTabMessageCallback = useCallback(
    (
      historyActionNum,
      historyPendingNum,
      lpActionNum,
      lpPendingMum,
      mergedHistoryList,
      mergedLpHistory,
      nftActionNum,
      nftPendingNum,
      mergeNFTHistory,
      pageChanged,
    ) => {
      if (pageChanged) {
        return;
      }

      const hasActionInTranster = historyActionNum > 0;
      const hasActionInLiquidity = lpActionNum > 0;
      const hasPendingInTransfer = historyPendingNum > 0;
      const hasPendingInLiquidity = lpPendingMum > 0;
      const hasHistoryInTranster = mergedHistoryList.length > 0;
      const hasHistoryInLiquidity = mergedLpHistory.length > 0;
      const hasActionInNFT = nftActionNum > 0;
      const hasPendngInNFT = nftPendingNum > 0;
      const hasHistoryInNft = mergeNFTHistory.length > 0;

      // Action Required > No Action Required
      // Pending > No Pending
      // History > No History
      // Transfer > Liquidity
      const transferDefaultPriority = 2;
      const liquidityDefaultPriority = 1;
      const nftDefaultPriority = 0;

      const hasHistoryPriority = 10;
      const hasPendingPriority = 100;
      const hasActionPriority = 1000;
      let transferPriority = 0;
      let liquidityPriority = 0;
      let nftPriority = 0;

      transferPriority += transferDefaultPriority;
      liquidityPriority += liquidityDefaultPriority;
      nftPriority += nftDefaultPriority;
      if (hasHistoryInTranster) {
        transferPriority += hasHistoryPriority;
      }
      if (hasHistoryInLiquidity) {
        liquidityPriority += hasHistoryPriority;
      }
      if (hasHistoryInNft) {
        nftPriority += hasHistoryPriority;
      }
      if (hasPendingInTransfer) {
        transferPriority += hasPendingPriority;
      }
      if (hasPendingInLiquidity) {
        liquidityPriority += hasPendingPriority;
      }
      if (hasPendngInNFT) {
        nftPriority += hasPendingPriority;
      }
      if (hasActionInTranster) {
        transferPriority += hasActionPriority;
      }
      if (hasActionInLiquidity) {
        liquidityPriority += hasActionPriority;
      }
      if (hasActionInNFT) {
        nftPriority += hasActionPriority;
      }

      let max = 0;
      let key = "";
      if (liquidityPriority > transferPriority) {
        max = liquidityPriority;
        key = "liquidity_history";
      } else {
        max = transferPriority;
        key = "transfer_history";
      }
      if (nftPriority > max) {
        key = "nft_history";
      }
      console.debug(`transferPriority:${transferPriority}, liquidityPriority: ${liquidityPriority}`);
      setHistorykey(key);
    },
    [
      historyActionNum,
      historyPendingNum,
      lpActionNum,
      lpPendingNum,
      nftActionNum,
      nftPendingNum,
      mergedHistoryList,
      mergedLpHistory,
      mergedNFTHistory,
      pageChanged,
    ],
  );
  const debouncedMessageNumberChangeHandler = useCallback(debounce(refreshTabMessageCallback, 300), []);

  useEffect(() => {
    debouncedMessageNumberChangeHandler(
      historyActionNum,
      historyPendingNum,
      lpActionNum,
      lpPendingNum,
      mergedHistoryList,
      mergedLpHistory,
      nftActionNum,
      nftPendingNum,
      mergedNFTHistory,
      pageChanged,
    );
  }, [historyActionNum, lpActionNum, historyPendingNum, lpPendingNum, nftActionNum, nftPendingNum, pageChanged]);

  const clearHistoryLocalData = item => {
    const transferListStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
    let localList;
    if (transferListStr) {
      const transferList = JSON.parse(transferListStr);
      localList = transferList ? dataClone(transferList) : [];
      transferList?.map(async (localItem, i) => {
        if (item.transfer_id === localItem.transfer_id) {
          localList.splice(i, 1);
        }
        return localItem;
      });
    }

    localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localList));
    reloadHisList();
  };

  const onPageChange = page => {
    const oldPageMap = dataClone(pageMap);
    if (page === 0) {
      oldPageMap[0] = now;
      setNextPageToken(now);
    } else {
      setNextPageToken(oldPageMap[page]);
    }
    setCurrentPage(page);
    setPageMap(oldPageMap);
    setPageChanged(true);
  };

  const handleSpeedUp = (item, peggedMode) => {
    if (transferRelatedFeatureDisabled) {
      return;
    }
    setSpeedUpItem(item);
    setSpeedUpPeggedMode(peggedMode);
    setRelayLoading(false);
    setConnectLoading(false);
    const dstChainId = item?.dst_received_info?.chain?.id;
    if (dstChainId === chainId) {
      setShowSpeedModal(true);
    } else {
      setShowDisConnectModal(true);
    }
  };

  const speedUpTransfer = async () => {
    if (transferRelatedFeatureDisabled) {
      return;
    }

    setRelayLoading(true);
    speedUp()
      .then(speedHash => {
        if (speedHash) {
          const hash = speedUpItem?.src_block_tx_link.match("[^/]+(?!.*/)") || [];
          const map = getRelayTimeMap();
          map.set(hash[0], new Date().getTime());
          localStorage.setItem(
            storageConstants.KEY_TRANSFER_RELAY_TIME_LIST,
            JSON.stringify(Array.from(map.entries())),
          );
          setRelayHash(speedHash);
          setShowSpeedSuccessModal(true);
          reloadHisList();
        }
        setShowSpeedModal(false);
        setRelayLoading(false);
      })
      .catch(() => {
        setShowSpeedModal(false);
        setRelayLoading(false);
      });
  };

  const switchDstChain = paramChainId => {
    setConnectLoading(true);
    switchChain(
      paramChainId,
      "",
      (targetFromChainId: number) => {
        const chain = transferConfig.chains.find(chainInfo => {
          return chainInfo.id === targetFromChainId;
        });
        if (chain !== undefined) {
          dispatch(setFromChain(chain));
        }
      },
      getNetworkById,
    );
  };

  let historyContent = <></>;
  if (historykey === "transfer_history") {
    historyContent = (
      <div className={themeType === "dark" ? classes.spinblur : classes.whiteSpinblur} key="1">
        <Spin spinning={hisLoading}>
          <div>
            {mergedHistoryList.length > 0 ? (
              <div>
                {mergedHistoryList?.map(item => {
                  return (
                    <TransferHistoryItem
                      key={item.src_block_tx_link + item.ts}
                      item={item}
                      clearHistoryLocalData={() => {
                        clearHistoryLocalData(item);
                      }}
                      onItemSelected={item => {
                        setSelectedItem(item);
                        setShowModal(true);
                      }}
                      handleSpeedUp={(item, peggedMode) => {
                        handleSpeedUp(item, peggedMode);
                      }}
                      onRefundSubmit={item => {
                        setSelectedItem(item);
                        setShowModal(true);
                      }}
                      onRefreshWholeList={() => {
                        reloadHisList();
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div className={classes.empty}>
                {!hisLoading && (
                  <div>
                    <div style={{ width: "100%", textAlign: "center", marginBottom: 15 }}>
                      <ClockCircleOutlined style={{ fontSize: 30 }} />
                    </div>
                    <div style={{ fontSize: 15 }}>{onlyshowPending ? "No pending history!" : "No history yet!"}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Spin>
      </div>
    );
  } else if (historykey === "nft_history") {
    historyContent = (
      <div className={themeType === "dark" ? classes.spinblur : classes.whiteSpinblur} key="3">
        <Spin spinning={nftLoading}>
          <div>
            {mergedNFTHistory.length > 0 ? (
              <div>
                {mergedNFTHistory?.map(item => {
                  return (
                    <NFTHistoryItem
                      key={`${item.srcTx}-${item.createdAt}`}
                      item={item}
                      nftList={nftList}
                      onLocalItemRemoved={() => {
                        reloadHisList();
                      }}
                      getNetworkById={getNetworkById}
                    />
                  );
                })}
              </div>
            ) : (
              <div className={classes.empty}>
                {!nftLoading && (
                  <div>
                    <div style={{ width: "100%", textAlign: "center", marginBottom: 15 }}>
                      <ClockCircleOutlined style={{ fontSize: 30 }} />
                    </div>
                    <div style={{ fontSize: 15 }}> No history yet!</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Spin>
      </div>
    );
  }

  return (
    <div className={isMobile ? classes.mobileHistoryBody : classes.historyBody}>
      <div>
        <div className={classes.flexCenter}>
          <Menu
            className={classes.menu}
            selectedKeys={[historykey]}
            onClick={e => {
              handleTabKeyChange(e.key);
            }}
            mode="horizontal"
          >
            <Menu.Item key="transfer_history">
              <div className={classes.tabtitle}>
                Transfer
                {historyActionNum > 0 && (
                  <div className={historyActionNum > 9 ? classes.numdot2 : classes.numdot}>{historyActionNum}</div>
                )}
              </div>
            </Menu.Item>
            <Menu.Item key="liquidity_history">
              <div className={classes.tabtitle}>
                Liquidity
                {lpActionNum > 0 && (
                  <div className={lpActionNum > 9 ? classes.numdot2 : classes.numdot}>{lpActionNum}</div>
                )}
              </div>
            </Menu.Item>
            <Menu.Item key="nft_history">
              <div className={classes.tabtitle}>NFT</div>
            </Menu.Item>
          </Menu>
        </div>
        <div
          className={classes.historyMenu}
          style={
            historykey === "nft_history" || firstGetIn
              ? { justifyContent: "flex-end" }
              : { justifyContent: "space-between" }
          }
        >
          {historykey !== "nft_history" && !firstGetIn && (
            <div className={classes.showPending}>
              Only show pending transactions
              <Switch
                checked={onlyshowPending}
                disabled={hisLoading || lpLoading || nftLoading}
                onChange={checked => {
                  setOnlyshowPending(checked);
                }}
              />
            </div>
          )}
          <div>
            {isMobile ? null : (
              <Button
                type="primary"
                className={classes.rebutton}
                onClick={() => {
                  reloadHisList();
                }}
                icon={<ReloadOutlined style={{ fontSize: 20 }} />}
              />
            )}
          </div>
        </div>
        <div className={classes.historyList}>{historyContent}</div>
        {currentPage !== undefined ? (
          <div className={classes.pagination}>
            <PageFlipper
              page={currentPage}
              isLoading={hisLoading || lpLoading || nftLoading}
              hasMore={!onlyshowPending ? Number(size) === defaultPageSize : hasMorePending}
              onPageChange={(toPage: number) => {
                onlyshowPending ? handlePendingPageChange(toPage) : onPageChange(toPage);
              }}
            />
          </div>
        ) : null}
      </div>
      {showModal && (
        <HistoryTransferModal visible={showModal} onCancel={() => setShowModal(false)} record={selectedItem} />
      )}
      <HistorySpeedModal
        visible={showSpeedModal}
        onCancel={() => setShowSpeedModal(false)}
        record={speedUpItem}
        onSeedUp={speedUpTransfer}
        loading={relayLoading}
      />
      <HistoryDisConnectModal
        visible={showDisConnectModal}
        onCancel={() => setShowDisConnectModal(false)}
        record={speedUpItem}
        onSwitchChain={switchDstChain}
        loading={connectLoading}
      />
      <HistorySpeedSuccessModal
        txHash={relayHash}
        visible={showSpeedSuccessModal}
        onCancel={() => setShowSpeedSuccessModal(false)}
      />
    </div>
  );
};

export default HistoryContent;
