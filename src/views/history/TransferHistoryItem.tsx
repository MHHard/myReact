import { useContext, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Button, Tooltip } from "antd";
import { LinkOutlined, InfoCircleOutlined, WarningFilled } from "@ant-design/icons";
import moment from "dayjs";
import { BigNumber } from "ethers";
import { TransferHistory, TransferHistoryStatus } from "../../constants/type";
import { formatDecimal } from "../../helpers/format";
import {
  getTokenSymbol,
  getTxLink,
  getTokenSymbolWithAddress,
  switchChain,
  addChainToken,
  setFromChain,
} from "../../redux/transferSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";
import { getRelayTimeMap, setLocalRelayTime } from "../../hooks/useHistoryRelay";
import { getTokenDisplaySymbol, needToChangeTokenDisplaySymbol } from "../transfer/TransferOverview";
import { isToBeConfirmRefund } from "../../utils/mergeTransferHistory";
import { GetPeggedMode, PeggedChainMode, usePeggedPairConfig } from "../../hooks/usePeggedPairConfig";
import { ColorThemeContext } from "../../providers/ThemeProvider";
import runRightIconDark from "../../images/runRightDark.svg";
import runRightIconLight from "../../images/runRightLight.svg";
import meta from "../../images/meta.svg";
import SpeedUpStatus from "../../components/history/SpeedUpStatus";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { getRfqRefundExecMsgCallData } from "../../redux/gateway";
import { errorMessages, storageConstants } from "../../constants/const";
import { isGasToken } from "../../constants/network";
import { BridgeType } from "../../proto/gateway/gateway_pb";
import { useContractsContext } from "../../providers/ContractsContextProvider";
import { GetRefundExecMsgCallDataRequest } from "../../proto/sdk/service/rfq/user_pb";
import { formatBlockExplorerUrlWithTxHash } from "../../utils/formatUrl";

const tooltipShowTime = process.env.REACT_APP_ENV === "TEST" ? 1 : 15;
const speedUpShowTime = process.env.REACT_APP_ENV === "TEST" ? 8000 : 30 * 60 * 1000; // millisecond

interface TransferHistoryItemProps {
  item: TransferHistory;
  clearHistoryLocalData: (any) => void;
  onItemSelected: (any) => void;
  handleSpeedUp: (item, peggedMode) => void;
  onRefundSubmit: (any) => void;
  onRefreshWholeList: () => void;
}

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
  showSupport: {
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
  tabtitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  pagination: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  rebutton: {
    position: "absolute",
    top: 7,
    right: 4,
    zIndex: 10,
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
}));

/* eslint-disable */
/* eslint-disable camelcase */

export const TransferHistoryItem = (props: TransferHistoryItemProps, ref): JSX.Element => {
  const { item, clearHistoryLocalData, onItemSelected, handleSpeedUp, onRefundSubmit, onRefreshWholeList } = props;
  const { chainId, address, getNetworkById } = useWeb3Context();
  const { themeType } = useContext(ColorThemeContext);
  const {
    contracts: { rfqContract },
    transactor,
  } = useContractsContext();
  const dispatch = useAppDispatch();
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const { transferConfig, circleUSDCConfig } = useAppSelector(state => state.transferInfo);
  const { transferRelatedFeatureDisabled } = useAppSelector(state => state.serviceInfo);
  const classes = useStyles({ isMobile });
  const [sourceChainAmountDisplayString, setSourceChainAmountDisplayString] = useState("");
  const [sourceChainTokenSymbol, setSourceChainTokenSymbol] = useState("");
  const [sourceChainTransactionLink, setSourceChainTransactionLink] = useState("");
  const [destinationChainAmountDisplayString, setDestinationChainAmountDisplayString] = useState("");
  const [destinationChainTokenSymbol, setDestinationChainTokenSymbol] = useState("");
  const [destinationChainTransactionLink, setDestinationChainTransactionLink] = useState("");
  const [itemStatus, setItemStatus] = useState(item.status);
  const [shouldShowSupportButton, setShouldShowSupportButton] = useState(false);
  const [shouldShowSpeedUpButton, setShouldShowSpeedUpButton] = useState(false);
  const [shouldShowMetaMaskIcon, setShouldShowMetaMaskIcon] = useState(false);
  const [peggedMode, setPeggedMode] = useState<string | PeggedChainMode>("");
  const [refundLoading, setRefundLoading] = useState(false);
  const isRfq = props.item.bridge_type && props.item.bridge_type === BridgeType.BRIDGETYPE_RFQ;

  useEffect(() => {
    const sourceSendAmount =
      formatDecimal(item.src_send_info?.amount, item.src_send_info?.token?.decimal)?.split(",").join("") ?? "";
    setSourceChainAmountDisplayString(sourceSendAmount);

    setSourceChainTokenSymbol(
      getTokenSymbolWithAddress(
        item?.src_send_info.token.symbol,
        item?.src_send_info.token.address,
        item?.src_send_info.chain.id,
        circleUSDCConfig.chaintokensList.find(tokenInfo => {
          return tokenInfo.chainId === item?.src_send_info.chain.id;
        })?.tokenAddr ?? "",
      ),
    );
    const receivedAmount = formatDecimal(item?.dst_received_info.amount, item?.dst_received_info?.token?.decimal)
      ?.split(",")
      .join("");
    setDestinationChainAmountDisplayString(receivedAmount);

    let destinationChainTokenSymbol = getTokenDisplaySymbol(
      item?.dst_received_info?.token,
      item?.src_send_info?.chain,
      item?.dst_received_info?.chain,
      transferConfig.pegged_pair_configs,
      false,
    );

    if (item?.dst_received_info?.token.symbol === "USDC") {
      const destinationChainId = item?.dst_received_info.chain.id ?? 0;
      const destinationChainCircleUSDC = circleUSDCConfig.chaintokensList.find(tokenInfo => {
        return tokenInfo.chainId === destinationChainId;
      });
      if (
        destinationChainId === 43113 ||
        destinationChainId === 43114 ||
        destinationChainId === 42161 ||
        destinationChainId === 421613
      ) {
        if (item?.dst_received_info.token.address === destinationChainCircleUSDC?.tokenAddr) {
          destinationChainTokenSymbol = "USDC";
        } else {
          destinationChainTokenSymbol = "USDC.e";
        }
      }
    }
    setDestinationChainTokenSymbol(destinationChainTokenSymbol);

    setLocalRelayTime(item);

    const useDestinationChainNativeToken = needToChangeTokenDisplaySymbol(
      item?.src_send_info.token,
      item?.dst_received_info?.chain,
    );
    let shouldDisplayMetaMaskIcon = !useDestinationChainNativeToken;

    const peggedModeCalculated = GetPeggedMode(
      item?.src_send_info?.chain?.id,
      item?.dst_received_info?.chain?.id,
      item?.dst_received_info?.token?.symbol,
      transferConfig.pegged_pair_configs,
    );

    setPeggedMode(peggedModeCalculated);

    if (peggedModeCalculated !== PeggedChainMode.Off) {
      shouldDisplayMetaMaskIcon = true;
    }

    if (isGasToken(item?.dst_received_info?.chain?.id, item?.src_send_info?.token.symbol)) {
      shouldDisplayMetaMaskIcon = false;
    }

    try {
      if (!window.ethereum.isMetaMask) {
        shouldDisplayMetaMaskIcon = false;
      }
    } catch (e) {
      shouldDisplayMetaMaskIcon = false;
    }

    setShouldShowMetaMaskIcon(shouldDisplayMetaMaskIcon);

    setSourceChainTransactionLink(item.src_block_tx_link);
    setDestinationChainTransactionLink(item.dst_block_tx_link);
  }, [item, transferConfig]);

  useEffect(() => {
    if (!item.status) {
      setShouldShowSupportButton(false);
      setShouldShowSpeedUpButton(false);
      return;
    }

    setItemStatus(item.status);

    const showSupport =
      item.status !== TransferHistoryStatus.TRANSFER_COMPLETED &&
      item.status !== TransferHistoryStatus.TRANSFER_FAILED &&
      item.status !== TransferHistoryStatus.TRANSFER_REFUNDED;

    setShouldShowSupportButton(showSupport);

    const transferDisabled = transferConfig.chain_token[item?.dst_received_info?.chain?.id]?.token.find(
      tokenInfo => tokenInfo?.token?.symbol === item?.dst_received_info?.token?.symbol,
      // eslint-disable-next-line
    )?.transfer_disabled;
    const map = getRelayTimeMap();
    const hash = item.src_block_tx_link.match("[^/]+(?!.*/)") || [];
    const delayedTimeout = new Date().getTime() - (map.get(hash[0]) || Number(item.update_ts)) > speedUpShowTime;
    const shouldShowSpeedUp =
      item.status === TransferHistoryStatus.TRANSFER_WAITING_FOR_FUND_RELEASE && delayedTimeout && !transferDisabled;
    setShouldShowSpeedUpButton(shouldShowSpeedUp);
  }, [item.status]);

  useEffect(() => {
    if (
      itemStatus === TransferHistoryStatus.TRANSFER_COMPLETED ||
      itemStatus === TransferHistoryStatus.TRANSFER_FAILED ||
      itemStatus === TransferHistoryStatus.TRANSFER_REFUNDED
    ) {
      setShouldShowSupportButton(false);
    }
  }, [itemStatus]);

  const pegConfig = usePeggedPairConfig();
  const addTokenMethod = (fromChainId, toChainId, token, displaySymbol) => {
    const tokenAddress = pegConfig.getHistoryTokenBalanceAddress(
      token?.address || "",
      fromChainId,
      toChainId,
      token?.symbol,
      transferConfig.pegged_pair_configs,
    );

    const addtoken = {
      address: tokenAddress,
      symbol: displaySymbol ?? getTokenSymbol(token?.symbol, toChainId),
      decimals: token?.decimal,
      image: token?.icon,
    };
    if (chainId === toChainId) {
      addChainToken(addtoken);
    } else {
      switchChain(
        toChainId,
        addtoken,
        (switchSuccessChainId: number) => {
          const chain = transferConfig.chains.find(chainInfo => {
            return chainInfo.id === switchSuccessChainId;
          });
          if (chain !== undefined) {
            dispatch(setFromChain(chain));
          }
        },
        getNetworkById,
      );
    }
  };

  useEffect(() => {
    if (item.status !== TransferHistoryStatus.TRANSFER_WAITING_FOR_FUND_RELEASE) {
      return;
    }

    const transferDisabled = transferConfig.chain_token[item?.dst_received_info?.chain?.id]?.token.find(
      tokenInfo => tokenInfo?.token?.symbol === item?.dst_received_info?.token?.symbol,
      // eslint-disable-next-line
    )?.transfer_disabled;
    const map = getRelayTimeMap();
    const hash = item.src_block_tx_link.match("[^/]+(?!.*/)") || [];
    const delayedTimeout = new Date().getTime() - (map.get(hash[0]) || Number(item.update_ts)) > speedUpShowTime;
    const shouldShowSpeedUp = delayedTimeout && !transferDisabled;
    setShouldShowSpeedUpButton(shouldShowSpeedUp);
  }, [item.status]);

  const tipsStatus = transferHistoryItemPeggedMode => {
    let lab;
    const nowDate = new Date().getTime();
    const showResult = nowDate - Number(item.updateTime || item.ts) <= tooltipShowTime * 60 * 1000;

    switch (itemStatus) {
      case TransferHistoryStatus.TRANSFER_SUBMITTING:
        lab = (
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              showResult ? (
                <span>
                  Your transfer is being confirmed on {item.src_send_info?.chain.name}. Please allow{" "}
                  {item.src_send_info?.chain.block_delay} block confirmations (a few minutes) for your transfer request
                  to be confirmed.
                </span>
              ) : (
                <div>
                  It seems that your transaction has been stuck for more than 15 minutes.
                  <div style={{ marginLeft: 10, marginTop: 15 }}>
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                      <div style={{ fontSize: 15, fontWeight: "bold", marginRight: 5 }}>·</div>
                      <div>
                        {" "}
                        If your on-chain tx has completed, please{" "}
                        <a
                          href={`https://form.typeform.com/to/Q4LMjUaK#srctx=${item.src_block_tx_link}&transferid=${item.transfer_id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          contact support
                        </a>{" "}
                        for help.
                      </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: "flex", alignItems: "baseline" }}>
                        <div style={{ fontSize: 15, fontWeight: "bold", marginRight: 5 }}>·</div>
                        <div>
                          {" "}
                          If your on-chain tx is still pending, you may speed up your transaction by increasing the gas
                          price.{" "}
                        </div>
                      </div>
                    </div>
                    {item.isLocal && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ display: "flex", alignItems: "baseline" }}>
                          <div style={{ fontSize: 15, fontWeight: "bold", marginRight: 5 }}>·</div>
                          <div>
                            {" "}
                            If your on-chain tx has failed, this is usually because the gas limit is set too low. You
                            can manually{" "}
                            <span
                              style={{ color: "#1890ff", cursor: "pointer" }}
                              onClick={() => {
                                clearHistoryLocalData(item);
                              }}
                            >
                              clear this history item
                            </span>{" "}
                            and try again later.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            }
            placement={isMobile ? "bottomLeft" : "bottomRight"}
            color="#fff"
            overlayInnerStyle={{ color: "#000", width: 265 }}
          >
            <div className={classes.waring}>
              Submitting
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </div>
          </Tooltip>
        );
        break;
      case TransferHistoryStatus.TRANSFER_DELAYED:
        lab = (
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              <span>
                Your fund is being processed on {item.dst_received_info.chain.name}, which usually takes 30-60 minutes.
              </span>
            }
            placement={isMobile ? "bottomLeft" : "right"}
            color="#fff"
            overlayInnerStyle={{ color: "#000" }}
          >
            <div className={classes.waring}>
              Waiting for fund release
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </div>
          </Tooltip>
        );
        break;
      case TransferHistoryStatus.TRANSFER_FAILED:
        lab = (
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              <span>
                {isRfq
                  ? `The tx failed on-chain. This is usually because the gas limit or the slippage tolerance is set too low. Rest assured that your funds are safe. You may try again later.`
                  : `Your transaction has failed on ${item.src_send_info?.chain.name}. This is usually because the gas limit is
                set too low. Rest assured that your funds are safe. You may try again later.`}
              </span>
            }
            placement={isMobile ? "bottomLeft" : "right"}
            color="#fff"
            overlayInnerStyle={{ color: "#000" }}
          >
            <div className={classes.failed}>
              Failed
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </div>
          </Tooltip>
        );
        break;
      case TransferHistoryStatus.TRANSFER_WAITING_FOR_FUND_RELEASE:
        lab = waitingForFundReleaseElement();
        break;
      case TransferHistoryStatus.TRANSFER_COMPLETED:
        lab = <div className={classes.completed}>Completed</div>;
        break;
      case TransferHistoryStatus.TRANSFER_TO_BE_REFUNDED:
        lab = (
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              isRfq ? (
                <span>
                  The fund was not promptly released on {item.dst_received_info.chain.name}. Please request a refund.
                </span>
              ) : (
                <div>
                  {transferHistoryItemPeggedMode === PeggedChainMode.Deposit ? (
                    <span>
                      The transfer cannot be completed because there is not enough liquidity to bridge your transfer.
                      You may request a refund.
                    </span>
                  ) : (
                    <span>
                      The transfer cannot be completed because{" "}
                      {errorMessages[item?.refund_reason ?? 0] ||
                        "the bridge rate has moved unfavorably by your slippage tolerance"}
                      . You may request a refund.
                    </span>
                  )}
                </div>
              )
            }
            placement={isMobile ? "bottomLeft" : "right"}
            color="#fff"
            overlayInnerStyle={{ color: "#000" }}
          >
            <div className={classes.waring}>
              To be refunded
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </div>
          </Tooltip>
        );
        break;
      case TransferHistoryStatus.TRANSFER_REQUESTING_REFUND:
        lab = (
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              <span>
                Your refund request is being confirmed on Celer State Guardian Network (SGN), which may take a few
                minutes.
              </span>
            }
            placement={isMobile ? "bottomLeft" : "right"}
            color="#fff"
            overlayInnerStyle={{ color: "#000" }}
          >
            <div className={classes.waring}>
              Requesting refund
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </div>
          </Tooltip>
        );
        break;
      case TransferHistoryStatus.TRANSFER_REFUND_TO_BE_CONFIRMED:
        lab = <div className={classes.waring}>Refund to be confirmed</div>;
        break;
      case TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND:
        if (isToBeConfirmRefund(item)) {
          lab = <div className={classes.waring}>Refund to be confirmed</div>;
          break;
        }
        lab = (
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              showResult ? (
                <span>
                  Your request for refunding the transfer is being confirmed on {item.src_send_info?.chain.name}, which
                  might take a few minutes.
                </span>
              ) : (
                <div>
                  It seems that your transaction has been stuck for more than 15 minutes.
                  <div style={{ marginLeft: 10, marginTop: 15 }}>
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                      <div style={{ fontSize: 15, fontWeight: "bold", marginRight: 5 }}>·</div>
                      <div>
                        {" "}
                        If your on-chain tx has completed, please{" "}
                        <a
                          href={`https://form.typeform.com/to/Q4LMjUaK#srctx=${item.src_block_tx_link}&transferid=${item.transfer_id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          contact support
                        </a>{" "}
                        for help.
                      </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: "flex", alignItems: "baseline" }}>
                        <div style={{ fontSize: 15, fontWeight: "bold", marginRight: 5 }}>·</div>
                        <div>
                          {" "}
                          If your on-chain tx is still pending, you may speed up your transaction by increasing the gas
                          price.{" "}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: "flex", alignItems: "baseline" }}>
                        <div style={{ fontSize: 15, fontWeight: "bold", marginRight: 5 }}>·</div>
                        <div>
                          {" "}
                          If your on-chain tx has failed, this is usually because the gas limit is set too low.Please{" "}
                          <span
                            style={{ color: "#1890ff", cursor: "pointer" }}
                            onClick={e => {
                              e.stopPropagation();
                              const newItem = item;
                              newItem.status = TransferHistoryStatus.TRANSFER_REFUND_TO_BE_CONFIRMED;
                              onRequestRefund(newItem);
                            }}
                          >
                            click here
                          </span>{" "}
                          to resubmit the tx.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            placement={isMobile ? "bottomLeft" : "bottomRight"}
            color="#fff"
            overlayInnerStyle={{ color: "#000", width: 265 }}
          >
            <div className={classes.waring}>
              Confirming your refund
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </div>
          </Tooltip>
        );
        break;
      case TransferHistoryStatus.TRANSFER_WAITING_FOR_SGN_CONFIRMATION:
        lab = (
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              <span>
                Your transfer is being confirmed on Celer State Guardian Network (SGN), which might take a few minutes.
              </span>
            }
            placement={isMobile ? "bottomLeft" : "right"}
            color="#fff"
            overlayInnerStyle={{ color: "#000" }}
          >
            <div className={classes.waring}>
              Waiting for SGN confirmation
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </div>
          </Tooltip>
        );
        break;
      case TransferHistoryStatus.TRANSFER_REFUNDED:
        lab = <div className={classes.completed}>Refunded</div>;
        break;
      default:
        break;
    }
    return lab;
  };

  const waitingForFundReleaseElement = () => {
    return (
      <Tooltip
        overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
        title={
          <span>
            {isRfq
              ? `Your transfer is being released to ${
                  item.dst_received_info.chain.name
                }. If the transfer is not completed after ${moment(
                  Number(item.dst_deadline) * 1000 + 5 * 60 * 1000,
                ).format("YYYY-MM-DD HH:mm:ss")}, you may request a refund.`
              : `Your transfer is being released to ${item.dst_received_info.chain.name}, which takes a few minutes in
            most cases but could take a few hours if there is heavy traffic or your transfer amount is large.`}
          </span>
        }
        placement={isMobile ? "bottomLeft" : "right"}
        color="#fff"
        overlayInnerStyle={{ color: "#000" }}
      >
        <div className={classes.waring}>
          Waiting for fund release
          <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
        </div>
      </Tooltip>
    );
  };

  const btnChange = transferHistoryItem => {
    let btntext;

    if (isToBeConfirmRefund(transferHistoryItem)) {
      btntext = "Confirm Refund";
    } else if (transferHistoryItem.status === TransferHistoryStatus.TRANSFER_TO_BE_REFUNDED) {
      btntext = "Request Refund";
    }
    if (btntext) {
      return (
        <div style={{ position: "relative", width: "fit-content" }}>
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <WarningFilled style={{ fontSize: 20, marginLeft: 4, marginRight: 10, color: "#ff8f00" }} />
                </div>
                <div>
                  It seems that your tx was failed or stuck on-chain. If you found the tx was failed, please increase
                  your gas limit and resubmit the transaction.
                </div>
              </div>
            }
            color="#fff"
            visible={!!transferHistoryItem.txIsFailed}
            placement={isMobile ? "bottomLeft" : "right"}
            overlayInnerStyle={{ color: "#000", textAlign: "left", borderRadius: 10, fontSize: 12, width: 290 }}
            getPopupContainer={() => {
              return document.getElementById("modalpop") || document.body;
            }}
          >
            <Button
              type="primary"
              loading={refundLoading}
              onClick={e => {
                e.stopPropagation();
                onRequestRefund(transferHistoryItem);
              }}
              className={classes.submitBtn}
              disabled={transferRelatedFeatureDisabled}
            >
              {btntext}
            </Button>
          </Tooltip>
        </div>
      );
    }
    return <div />;
  };

  const onRequestRefund = record => {
    if (isRfq && record?.src_send_info?.chain.id === chainId) {
      confirmRfqRefund(record);
    } else {
      onItemSelected(record);
    }
  };

  const confirmRfqRefund = async record => {
    if (record?.src_send_info?.chain.id !== chainId) {
      onItemSelected(record);
      return;
    }
    if (!transactor || !rfqContract) {
      return;
    }
    setRefundLoading(true);
    try {
      const rfqRefundRequest = new GetRefundExecMsgCallDataRequest();
      rfqRefundRequest.setQuoteHash(record.transfer_id);
      const rfqRefundRes = await getRfqRefundExecMsgCallData(rfqRefundRequest);
      if (!rfqRefundRes) {
        setRefundLoading(false);
        return;
      }
      const rfqRefundResObj = rfqRefundRes.toObject();
      const quote = rfqRefundResObj.quote;
      const exec_msg_call_data = rfqRefundResObj.execMsgCallData.length > 0 ? rfqRefundRes.getExecMsgCallData() : [];

      const contractQuote = {
        srcChainId: BigNumber.from(quote?.srcToken?.chainId),
        srcToken: quote?.srcToken?.address ?? "",
        srcAmount: BigNumber.from(quote?.srcAmount ?? "0"),
        srcReleaseAmount: BigNumber.from(quote?.srcReleaseAmount ?? "0"),
        dstChainId: BigNumber.from(quote?.dstToken?.chainId),
        dstToken: quote?.dstToken?.address ?? "",
        dstAmount: BigNumber.from(quote?.dstAmount ?? "0"),
        deadline: BigNumber.from(quote?.dstDeadline) ?? 0,
        nonce: BigNumber.from(quote?.nonce),
        sender: quote?.sender ?? "",
        receiver: quote?.receiver ?? "",
        refundTo: quote?.refundTo ?? "",
        liquidityProvider: quote?.mmAddr ?? "",
      };

      const executor = () => {
        if (rfqRefundResObj.srcNative) {
          return transactor(
            rfqContract.executeRefundNative(contractQuote, exec_msg_call_data, { gasLimit: BigNumber.from(1000000) }),
          );
        }
        return transactor(
          rfqContract.executeRefund(contractQuote, exec_msg_call_data, { gasLimit: BigNumber.from(1000000) }),
        );
      };
      let res;
      try {
        res = await executor();
      } catch (e: any) {
        console.log("catch refund error", e);
        setRefundLoading(false);
      }
      if (res) {
        const transferJson: TransferHistory = {
          dst_block_tx_link: record.dst_block_tx_link,
          src_send_info: record.src_send_info,
          src_block_tx_link: formatBlockExplorerUrlWithTxHash(
            {
              chainId: record.src_send_info.chain.id,
              txHash: res.hash,
            },
            getNetworkById,
          ),
          srcAddress: address,
          dstAddress: address,
          dst_received_info: record.dst_received_info,
          status: TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND,
          transfer_id: record.transfer_id,
          nonce: record.nonce,
          ts: record.ts,
          isLocal: true,
          updateTime: new Date().getTime(),
          txIsFailed: false,
          bridge_type: BridgeType.BRIDGETYPE_RFQ,
        };
        const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
        let localTransferList: TransferHistory[] = [];
        if (localTransferListJsonStr) {
          localTransferList = JSON.parse(localTransferListJsonStr) || [];
        }
        let isHave = false;
        localTransferList.map(item => {
          if (item.transfer_id === record.transfer_id) {
            isHave = true;
            item.updateTime = new Date().getTime();
            item.txIsFailed = false;
            item.src_block_tx_link = formatBlockExplorerUrlWithTxHash(
              {
                chainId: record.src_send_info.chain.id,
                txHash: res.hash,
              },
              getNetworkById,
            );
          }
          return item;
        });

        if (!isHave) {
          localTransferList.unshift(transferJson);
        }
        localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
        setRefundLoading(false);
        const newItem = record;
        newItem.status = TransferHistoryStatus.TRANSFER_REFUNDED;
        onRefundSubmit(newItem);
      }
    } catch (e: any) {
      console.log("catch refund error", e);
      setRefundLoading(false);
    }
  };

  return (
    <div className={classes.ListItem} key={item.transfer_id}>
      <div className={isMobile ? classes.mobileItemContent : classes.itemcont}>
        <div className={classes.itemLeft}>
          <div className={classes.itemtitle} style={isMobile ? { minWidth: 0 } : { minWidth: 160 }}>
            <div>
              <img src={item.src_send_info?.chain.icon} alt="" className={classes.txIcon} />
            </div>
            <div className={classes.chaindes}>
              {sourceChainTransactionLink.length > 0 ? (
                <a
                  className={classes.chainName}
                  href={getTxLink(item.src_send_info?.chain.id, sourceChainTransactionLink, getNetworkById)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.src_send_info?.chain.name} <LinkOutlined className={classes.linkIcon} />
                </a>
              ) : (
                <div className={classes.chainName} style={{ height: 20 }}>
                  {item.src_send_info?.chain.name}
                </div>
              )}

              <div className={classes.reducetxnum}>
                - {sourceChainAmountDisplayString} {sourceChainTokenSymbol}
              </div>
            </div>
          </div>
          <img src={themeType === "dark" ? runRightIconDark : runRightIconLight} alt="" className={classes.turnRight} />
          <div className={classes.itemtitle}>
            <div>
              <img src={item?.dst_received_info?.chain.icon} alt="" className={classes.txIcon} />
            </div>
            <div className={classes.chaindes}>
              {destinationChainTransactionLink ? (
                <a
                  className={classes.linktitle}
                  href={getTxLink(item.dst_received_info?.chain.id, destinationChainTransactionLink, getNetworkById)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item?.dst_received_info?.chain.name} <LinkOutlined className={classes.linkIcon} />
                </a>
              ) : (
                <div className={classes.linktitle}> {item?.dst_received_info?.chain.name}</div>
              )}

              {/* dest amount */}
              {Number(destinationChainAmountDisplayString) > 0 ? (
                <div className={classes.receivetxnum}>
                  +{" "}
                  <span>
                    {destinationChainAmountDisplayString} {destinationChainTokenSymbol}
                  </span>
                  {!isMobile && (
                    <Tooltip
                      overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
                      title="Add to MetaMask"
                      placement="bottom"
                      color="#fff"
                      overlayInnerStyle={{ color: "#000" }}
                    >
                      {/* eslint-disable-next-line */}
                      <img
                        onClick={() => {
                          addTokenMethod(
                            item?.src_send_info.chain.id,
                            item?.dst_received_info?.chain.id,
                            item?.dst_received_info.token,
                            destinationChainTokenSymbol,
                          );
                        }}
                        src={meta}
                        alt=""
                        height={14}
                        style={{
                          display: shouldShowMetaMaskIcon ? "flex" : "none",
                          marginLeft: 5,
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className={isMobile ? classes.mobileItemRight : classes.itemRight}>
          <div className={shouldShowSupportButton ? classes.showSupport : ""}>
            <div>{tipsStatus(peggedMode)}</div>
            <div className={classes.itemTime}>{moment(Number(item.ts)).format("YYYY-MM-DD HH:mm:ss")}</div>
            <div>
              {shouldShowSupportButton && (
                <a
                  href={`https://form.typeform.com/to/Q4LMjUaK#srctx=${item.src_block_tx_link}&transferid=${item.transfer_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className={classes.supportText}
                >
                  Contact Support
                </a>
              )}
              {shouldShowSpeedUpButton && !isRfq && (
                <SpeedUpStatus item={item} peggedMode={peggedMode} onSpeedUp={handleSpeedUp} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div>{btnChange(item)}</div>
    </div>
  );
};
