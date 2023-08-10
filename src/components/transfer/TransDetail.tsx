import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { FC } from "react";
import { createUseStyles } from "react-jss";
import { formatUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { formatDecimalPart, safeParseUnits } from "celer-web-utils/lib/format";
import { Theme } from "../../theme";
import { useAppSelector } from "../../redux/store";
import { formatDecimal, formatPercentage } from "../../helpers/format";
import { getTokenListSymbol } from "../../redux/transferSlice";
import { TokenInfo } from "../../constants/type";
import { PeggedChainMode, usePeggedPairConfig } from "../../hooks/usePeggedPairConfig";
import { useMultiBurnConfig } from "../../hooks/useMultiBurnConfig";
import { shouldUseCircleUSDCBridge } from "../../helpers/circleUSDCTransferHelper";
import { isETH } from "../../helpers/tokenInfo";
import shareImage from "../../images/rfqShare.png";
import getReceivedToken, { getTokenContractLink } from "../../utils/getReceivedToken";
import { isGasToken } from "../../constants/network";
import { getTokenDisplaySymbol } from "../../views/transfer/TransferOverview";
import { useWeb3Context } from "../../providers/Web3ContextProvider";

/* eslint-disable camelcase */

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  historyDetail: {
    width: "100%",
  },
  detailItem: {
    borderBottom: `1px solid ${theme.primaryBorder}`,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    padding: "12px 0",
  },
  detailTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  feeRebate: {
    backgroundColor: theme.feeRebateBg,
    color: theme.feeRebateText,
    fontSize: 12,
    borderRadius: 100,
    padding: "0 6px",
    height: 24,
    lineHeight: 24,
    marginLeft: 12,
    display: "flex",
    alignItems: "center",
    marginBottom: -6,
  },
  tokenAddressWrap: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#17171A",
    borderRadius: 8,
    width: "100%",
    marginTop: 12,
  },
  tokenIcon: {
    width: 28,
    height: 28,
    marginRight: 5,
    padding: 5,
    borderRadius: "50%",
  },
  tokenAddress: {
    fontSize: 12,
    fontWeight: 400,
    color: "#8F9BB3",
    maxWidth: "80%",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  tokenShare: {
    width: 30,
    cursor: "pointer",
  },
  detailItemWithoutBorder: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    padding: "12px 0",
  },
  detailItemBto: {
    borderBottom: `1px solid ${theme.primaryBorder}`,
    padding: "12px 0",
  },
  detailItemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemLeft: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  itemContImg: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    marginRight: 8,
  },
  itemRight: {
    textAlign: "right",
  },
  itemText: {},
  itemTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  itemTextDes: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.surfacePrimary,
  },
  recipientDescText: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.surfacePrimary,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: 400,
    color: theme.infoDanger,
  },
  totalValueRN: {
    fontSize: 15,
    fontWeight: 400,
    color: theme.infoSuccess,
  },
  fromNet: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.secondBrand,
  },
  expe: {
    fontSize: 12,
    color: theme.infoSuccess,
    textAlign: "left",
    paddingTop: 30,
  },
  time: {
    fontSize: 16,
    color: theme.infoSuccess,
    textAlign: "right",
  },
  descripet: {
    background: theme.primaryBackground,
    borderRadius: 16,
    padding: "10px 16px 16px 16px",
    margin: props => (props.isMobile ? "16px 0" : "40px 0"),
  },
  recipientContainer: {
    background: theme.primaryBackground,
    borderRadius: 8,
    padding: "4px 14px 4px 14px",
  },
  descripetItem: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 6,
  },
  leftTitle: {
    color: theme.secondBrand,
    fontSize: 13,
  },
  rightContent: {
    display: "flex",
    alignItems: "center",
    color: theme.surfacePrimary,
    fontSize: 13,
    fontWeight: 400,
  },
  desImg: {
    width: 14,
    marginLeft: 6,
    borderRadius: "50%",
  },
  tooltipContent: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.unityBlack,
  },
  infoIcon: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.secondBrand,
  },
}));

interface IProps {
  amount: string;
  receiveAmount: number;
  receiverAddress: string;
  latencyMinutes: string | null;
  isBigAmountDelayed: boolean;
  delayMinutes: string | undefined;
  feeRebateDescription: string | undefined;
  gasOnArrival: string | undefined;
  selectedDestinationChainToken: TokenInfo | undefined;
}

const TransDetail: FC<IProps> = ({
  amount,
  receiveAmount,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  receiverAddress,
  latencyMinutes,
  isBigAmountDelayed,
  delayMinutes,
  feeRebateDescription,
  gasOnArrival,
  selectedDestinationChainToken,
}) => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { getNetworkById } = useWeb3Context();
  const { transferInfo } = useAppSelector(state => state);
  const { fromChain, toChain, selectedToken, estimateAmtInfoInState, transferConfig, circleUSDCConfig } = transferInfo;
  const pegConfig = usePeggedPairConfig();
  const { multiBurnConfig } = useMultiBurnConfig();
  const getTokenByChainAndTokenSymbol = (chainId, tokenSymbol) => {
    return transferConfig?.chain_token[chainId]?.token?.find(tokenInfo => tokenInfo?.token?.symbol === tokenSymbol);
  };
  const useCircleUSDCBridgeAdapter = shouldUseCircleUSDCBridge(
    circleUSDCConfig,
    selectedToken,
    selectedDestinationChainToken,
  );

  let estimatedReceiveAmount;
  if (receiveAmount === 0) {
    estimatedReceiveAmount = "0.0";
  } else if (receiveAmount < 0) {
    estimatedReceiveAmount = "--";
  } else {
    estimatedReceiveAmount = `${receiveAmount}`;
  }

  let baseTgas;
  let percTgas;
  let bridgeRate;
  let slippage_tolerance;
  let minimumReceived;
  let totalFee;
  if (estimateAmtInfoInState) {
    const slippageToleranceNum = (Number(estimateAmtInfoInState.slippageTolerance) / 1000000).toFixed(6);
    const millionBigNum = BigNumber.from(1000000);
    const feeBigNum = BigNumber.from(estimateAmtInfoInState?.baseFee).add(
      BigNumber.from(estimateAmtInfoInState?.percFee),
    );
    let minimumReceivedNum = BigNumber.from("0");
    if (amount) {
      const amountBn = safeParseUnits(amount, selectedToken?.token.decimal ?? 18);
      minimumReceivedNum = amountBn.sub(
        amountBn.mul(BigNumber.from(estimateAmtInfoInState.maxSlippage)).div(millionBigNum),
      );

      if (minimumReceivedNum.lt(0)) {
        minimumReceivedNum = BigNumber.from("0");
      }
      if (useCircleUSDCBridgeAdapter) {
        minimumReceivedNum = amountBn.sub(feeBigNum);
      }
    }
    const feeDecimal = useCircleUSDCBridgeAdapter
      ? selectedToken?.token.decimal
      : getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token.symbol)?.token?.decimal;
    baseTgas = formatUnits(estimateAmtInfoInState?.baseFee, feeDecimal) || "--";
    percTgas = formatUnits(estimateAmtInfoInState?.percFee, feeDecimal) || "--";
    totalFee = formatUnits(feeBigNum, feeDecimal) || "--";
    bridgeRate = estimateAmtInfoInState.bridgeRate;
    slippage_tolerance = formatPercentage(Number(slippageToleranceNum));
    minimumReceived =
      formatDecimal(minimumReceivedNum || "0", selectedToken?.token.decimal) +
      " " +
      getTokenDisplaySymbol(
        selectedToken?.token,
        fromChain,
        toChain,
        transferConfig.pegged_pair_configs,
        useCircleUSDCBridgeAdapter,
      );
  }

  const delayTime = () => {
    let result = `${latencyMinutes} minutes`;
    if (isBigAmountDelayed) {
      result = `up to ${delayMinutes} minutes`;
    }
    return result;
  };

  const receivedToken = getReceivedToken(fromChain?.id, toChain?.id, pegConfig, multiBurnConfig);
  const showAddrCheckWarning =
    toChain && selectedToken && !isGasToken(toChain.id, selectedToken.token.symbol) && !!receivedToken;

  return (
    <div className={classes.historyDetail}>
      <div className={classes.detailItem}>
        <div className={classes.itemLeft}>
          <div>
            <img className={classes.itemContImg} src={fromChain?.icon} alt="" />
          </div>
          <div className={classes.itemText}>
            <div className={classes.itemTitle}>{fromChain?.name}</div>
            <div className={classes.itemTextDes}>Source Chain</div>
          </div>
        </div>
        <div className={classes.itemRight}>
          <div className={classes.totalValue}>
            - {Number(formatDecimalPart(amount, 6, "floor", true)).toFixed(6) || "0.0"}
          </div>
          <div className={classes.fromNet}>
            {isETH(selectedToken?.token) ? "ETH" : getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)}
          </div>
        </div>
      </div>
      <div
        className={classes.detailItem}
        style={{ justifyContent: "end", borderBottom: showAddrCheckWarning ? "none" : `1px solid #40424E` }}
      >
        <div className={classes.detailTop}>
          <div className={classes.itemLeft}>
            <div>
              <img className={classes.itemContImg} src={toChain?.icon} alt="" />
            </div>
            <div className={classes.itemText}>
              <div className={classes.itemTitle}>{toChain?.name}</div>
              <div className={classes.itemTextDes}>Destination Chain</div>
            </div>
          </div>
          <div className={classes.itemRight}>
            <div className={classes.totalValueRN}>+{estimatedReceiveAmount}</div>
            <div className={classes.fromNet}>{`(estimated) ${
              getTokenDisplaySymbol(
                selectedToken?.token,
                fromChain,
                toChain,
                transferConfig.pegged_pair_configs,
                useCircleUSDCBridgeAdapter,
              ) ?? ""
            }`}</div>
          </div>
        </div>

        {feeRebateDescription && <div className={classes.feeRebate}>{feeRebateDescription}</div>}
        {showAddrCheckWarning && (
          <div className={classes.tokenAddressWrap}>
            <img className={classes.tokenIcon} src={receivedToken?.icon || ""} alt="" />
            <div className={classes.tokenAddress}>{receivedToken?.token.address}</div>
            <div
              onClick={() =>
                window.open(getTokenContractLink(toChain, receivedToken?.token.address, getNetworkById), "_blank")
              }
            >
              <img className={classes.tokenShare} src={shareImage} alt="" />
            </div>
          </div>
        )}
      </div>

      <div className={classes.descripet}>
        <div className={classes.descripetItem}>
          <div className={classes.leftTitle}>Bridge Rate</div>
          {isMobile ? (
            <div className={classes.rightContent}>{bridgeRate}</div>
          ) : (
            <div className={classes.rightContent}>
              1 {isETH(selectedToken?.token) ? "ETH" : getTokenListSymbol(selectedToken?.token?.symbol, fromChain?.id)}{" "}
              on
              <img className={classes.desImg} height={14} style={{ marginRight: 6 }} src={fromChain?.icon} alt="" />
              {pegConfig.mode === PeggedChainMode.Off && multiBurnConfig === undefined && !useCircleUSDCBridgeAdapter
                ? "≈"
                : "="}{" "}
              {bridgeRate}{" "}
              {getTokenDisplaySymbol(
                selectedToken?.token,
                fromChain,
                toChain,
                transferConfig.pegged_pair_configs,
                useCircleUSDCBridgeAdapter,
              )}{" "}
              on
              <img className={classes.desImg} height={14} src={toChain?.icon} alt="" />
            </div>
          )}
        </div>
        <div className={classes.descripetItem}>
          <div className={classes.leftTitle}>
            <div className={classes.leftTitle}>
              Fee
              <Tooltip
                title={
                  <div className={classes.tooltipContent} style={{ whiteSpace: "pre-line" }}>
                    <span style={{ fontWeight: 700 }}>The Base Fee</span>
                    {`:${formatDecimalPart(baseTgas || "0", 8, "round", true)} ${getTokenDisplaySymbol(
                      selectedToken?.token,
                      fromChain,
                      toChain,
                      transferConfig.pegged_pair_configs,
                      useCircleUSDCBridgeAdapter,
                    )}\n`}
                    <span style={{ fontWeight: 700 }}>The Protocol Fee</span>
                    {`:${formatDecimalPart(percTgas || "0", 8, "round", true)} ${getTokenDisplaySymbol(
                      selectedToken?.token,
                      fromChain,
                      toChain,
                      transferConfig.pegged_pair_configs,
                      useCircleUSDCBridgeAdapter,
                    )}\n\nBase Fee is used to cover the gas cost for sending your transfer on the destination chain.\n\n`}
                    {pegConfig.mode === PeggedChainMode.Off && multiBurnConfig === undefined
                      ? "Protocol Fee is charged proportionally to your transfer amount. Protocol Fee is paid to cBridge LPs and Celer SGN as economic incentives."
                      : "Protocol Fee is charged proportionally to your transfer amount. Protocol Fee is paid to Celer SGN as economic incentives for guarding the security of cBridge."}
                  </div>
                }
                arrowPointAtCenter
                placement="top"
                color="#fff"
                overlayInnerStyle={{ color: "#000", backgroundColor: "#fff", width: 265 }}
              >
                <InfoCircleOutlined className={classes.leftTitle} style={{ marginLeft: 6 }} />
              </Tooltip>
            </div>
          </div>
          <div className={classes.rightContent}>
            {formatDecimalPart(totalFee || "0", 8, "round", true)}{" "}
            {getTokenDisplaySymbol(
              selectedToken?.token,
              fromChain,
              toChain,
              transferConfig.pegged_pair_configs,
              useCircleUSDCBridgeAdapter,
            )}
          </div>
        </div>
        {pegConfig.mode === PeggedChainMode.Off && multiBurnConfig === undefined && !useCircleUSDCBridgeAdapter ? (
          <>
            <div className={classes.descripetItem}>
              <div className={classes.leftTitle}>
                <div className={classes.leftTitle}>
                  Minimum Received
                  <Tooltip
                    title={
                      <div className={classes.tooltipContent} style={{ textAlign: "center" }}>
                        {`You will receive at least ${minimumReceived} on ${toChain?.name} or the transfer won't go through.`}
                      </div>
                    }
                    arrowPointAtCenter
                    placement="bottom"
                    color="#fff"
                    overlayInnerStyle={{ color: "#000", backgroundColor: "#fff", width: 265 }}
                  >
                    <InfoCircleOutlined className={classes.infoIcon} style={{ marginLeft: 6 }} />
                  </Tooltip>
                </div>
              </div>
              <div className={classes.rightContent}>{minimumReceived}</div>
            </div>
            <div className={classes.descripetItem}>
              <div className={classes.leftTitle}>
                <div className={classes.leftTitle}>
                  Slippage Tolerance
                  <Tooltip
                    overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
                    title="The transfer won’t go through if the bridge rate moves unfavorably by more than this percentage when the
                transfer is executed."
                    placement="bottomLeft"
                    arrowPointAtCenter
                    color="#fff"
                    overlayInnerStyle={{ color: "#000", width: 265 }}
                  >
                    <InfoCircleOutlined className={classes.infoIcon} style={{ marginLeft: 6 }} />
                  </Tooltip>
                </div>
              </div>
              <div className={classes.rightContent}>{slippage_tolerance || "--"}</div>
            </div>
          </>
        ) : null}
        <div className={classes.descripetItem}>
          <span className={classes.leftTitle}>Estimated Time of Arrival</span>
          <span className={classes.rightContent}>{delayTime()}</span>
        </div>
        <div className={classes.descripetItem} hidden={gasOnArrival === undefined}>
          <div>
            <span className={classes.leftTitle}>Received Gas Tokens On Arrival</span>
            <Tooltip
              title={
                <div className={classes.tooltipContent} style={{ textAlign: "center" }}>
                  {`You will also receive ${gasOnArrival} to pay gas fee on ${toChain?.name}`}
                </div>
              }
              arrowPointAtCenter
              placement="bottom"
              color="#fff"
              overlayInnerStyle={{ color: "#000", backgroundColor: "#fff", width: 265 }}
            >
              <InfoCircleOutlined className={classes.infoIcon} style={{ marginLeft: 6 }} />
            </Tooltip>
          </div>
          <span className={classes.rightContent}>{gasOnArrival}</span>
        </div>
      </div>
    </div>
  );
};

export default TransDetail;
