/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createUseStyles } from "react-jss";
import { useContext, useState, useCallback, useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { debounce } from "lodash";
import { ColorThemeContext } from "../../providers/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { openModal, ModalName } from "../../redux/modalSlice";
import {
  setTotalActionNum,
  setTotalPendingNum,
  setHistoryActionNum,
  setHistoryPendingNum,
} from "../../redux/transferSlice";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { Theme } from "../../theme/theme";
import homeHistoryIcon from "../../images/homehistory.svg";
import lightHomeHistory from "../../images/lightHomeHistory.svg";
import { NFTBridgeStatus, NFTHistory, TransferHistory, TransferHistoryStatus } from "../../constants/type";
import { transferHistory, nftHistory, getDestinationTransferId, getPendingHistory } from "../../redux/gateway";
import { filteredLocalTransferHistory } from "../../utils/localTransferHistoryList";
import { mergeTransactionHistory } from "../../utils/mergeTransferHistory";
import { mergeTransferRemotePendingListAndHistoryPendingList } from "../../utils/handlePendingHistoryData";

import {
  addNewDestinationRelayFinishedTransferId,
  destinationRelayChecker,
  getDestinationRelayFinishedTransferIds,
} from "../../helpers/destinationRelayChecker";
import { storageConstants } from "../../constants/const";
import { mergeNFTHistory } from "../../utils/mergeNFTHistory";
import { useBridgeChainTokensContext } from "../../providers/BridgeChainTokensProvider";

const historyButtonStyles = createUseStyles((theme: Theme) => ({
  box: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 22,
    borderRadius: 12,
    background: theme.primaryBrand,
  },
  titleBox: {
    fontWeight: 400,
    fontSize: 12,
    padding: "0 4px 0 6px",
    color: theme.unityWhite,
  },
  mobileHistoryBtnWrapper: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    background: theme.primaryBackground,
    borderRadius: 12,
    height: 24,
    paddingLeft: 2,
    paddingRight: 4,
  },
  mobileHistoryBtnIcon: {
    fontSize: 18,
    color: theme.surfacePrimary,
    marginRight: 2,
    width: 18,
    height: 18,
    pointerEvents: "none",
  },
  mobileHistoryText: {
    fontSize: 14,
    fontWeight: 400,
    color: theme.surfacePrimary,
  },
  dot: {
    width: 8,
    height: 8,
    border: "1px solid #fff",
    borderRadius: "50%",
    background: theme.infoDanger,
    position: "absolute",
    top: -3,
    right: 0,
  },
}));
let inter;
export default function HistoryButton(): JSX.Element {
  const styles = historyButtonStyles();
  const dispatch = useAppDispatch();
  const { themeType } = useContext(ColorThemeContext);
  const [historyAction, setHistoryAction] = useState<number>(0);
  const [historyPending, setHistoryPending] = useState<number>(0);
  const [nftActionNum, setNftActionNum] = useState<number>(0);
  const [nftPendingNum, setNftPendingNum] = useState<number>(0);
  const { transferInfo } = useAppSelector(state => state);

  const { getTransferPair } = useBridgeChainTokensContext();
  const handleOpenHistoryModal = () => {
    dispatch(openModal(ModalName.history));
  };
  const { transferConfig, refreshHistory, totalActionNum, totalPaddingNum } = transferInfo;
  const { chainId, address, provider, getNetworkById } = useWeb3Context();

  useEffect(() => {
    refreshHistoryCallback({
      address,
      provider,
      chainId,
    });
    clearInterval(inter);
    inter = setInterval(() => {
      refreshHistoryCallback({
        address,
        provider,
        chainId,
      });
    }, 60000);

    document.addEventListener("visibilitychange", _ => {
      // console.log(document.visibilityState);
      if (document.visibilityState === "hidden") {
        clearInterval(inter);
      } else if (document.visibilityState === "visible") {
        refreshHistoryCallback({
          address,
          provider,
          chainId,
        });
        clearInterval(inter);
        inter = setInterval(() => {
          refreshHistoryCallback({
            address,
            provider,
            chainId,
          });
        }, 60000);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, refreshHistory, provider, chainId]);

  const refreshTransferAndLPHistory = (
    address: string,
    provider: StaticJsonRpcProvider | undefined,
    chainId: number,
  ) => {
    const addressesUsedForRemoteRequest = [address];
    const addressesUsedForLocalPreparation = [address];
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

    pendingHistoryPromise
      .then(pendingHistory => {
        return Promise.all([Promise.resolve(pendingHistory), mergedTransferHistoryItemsPromise]);
      })
      .then(result => {
        const pendingHistory = result[0];
        const mergedTransferHistoryItems = result[1];
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
      });

    if (address) {
      getNFTHistoryItems(address, provider, chainId);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refreshHistoryCallback = useCallback(
    debounce(nextValue => {
      refreshTransferAndLPHistory(nextValue.address, nextValue.provider, nextValue.chainId);
    }, 3000),
    [],
  );

  const getTransferHistoryItems = async (
    addressesUsedForRemoteRequest: string[],
    addressesUsedForLocalPreparation: string[],
    provider: StaticJsonRpcProvider | undefined,
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
      getNetworkById,
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
      getNetworkById,
    });
    // eslint-disable-next-line consistent-return
    return historyMergeResult;
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
          } else if (Number(localItem.src_send_info.chain.id) === Number(chainId)) {
            const promistx = getTxStatus(provider, localItem.src_block_tx_link); // Check local transaction status
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

  const queryWaitingForFundReleaseHistoryRelay = async (histories: TransferHistory[], getNetworkById) => {
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
          getNetworkById,
        );
        return getDestinationTransferId(history.transfer_id)
          .then(destinationChainTransferId => {
            return destinationRelayChecker(transferPair, destinationChainTransferId, getNetworkById);
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

  const getNFTHistoryItems = async (
    evmAddress: string,
    provider: StaticJsonRpcProvider | undefined,
    chainId: number,
  ) => {
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
        onChainResult,
      });
      setNftActionNum(nftMergerdResult.historyActionNum);
      setNftPendingNum(nftMergerdResult.historyPendingNum);
    });
  };

  useEffect(() => {
    const totalActionNumber = historyAction + nftActionNum;
    const totalPendingNumber = historyPending + nftPendingNum;
    dispatch(setTotalActionNum(totalActionNumber));
    dispatch(setTotalPendingNum(totalPendingNumber));
    dispatch(setHistoryActionNum(historyAction));
    dispatch(setHistoryPendingNum(historyPending));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyAction, historyPending, nftActionNum, nftPendingNum]);

  let content;
  if (totalActionNum) {
    content = (
      <div className={styles.box} onClick={() => handleOpenHistoryModal()}>
        <div className={styles.titleBox}>
          <img
            style={{ maxWidth: "100%", maxHeight: "100%", height: 16, position: "relative", top: -1 }}
            src="./actionLogo.svg"
            alt=""
          />
          <span style={{ marginLeft: 2 }}>{`${totalActionNum} Action${
            Number(totalActionNum) !== 1 ? "s" : ""
          } Required`}</span>
        </div>
        <div className={styles.dot} />
      </div>
    );
  } else if (totalPaddingNum) {
    content = (
      <div className={styles.box} onClick={() => handleOpenHistoryModal()}>
        <div className={styles.titleBox}>
          <span>{` ${totalPaddingNum} Pending`}</span>
          <LoadingOutlined style={{ fontSize: 12, marginLeft: 2, color: "#fff" }} />
        </div>
      </div>
    );
  } else {
    content = (
      <div className={styles.mobileHistoryBtnWrapper} onClick={() => handleOpenHistoryModal()}>
        <img
          src={themeType === "dark" ? homeHistoryIcon : lightHomeHistory}
          className={styles.mobileHistoryBtnIcon}
          alt="homeHistoryIcon icon for history"
        />
        <span className={styles.mobileHistoryText}>History</span>
      </div>
    );
  }
  return content;
}
