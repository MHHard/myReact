import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { BigNumber } from "@ethersproject/bignumber";
import { Tooltip } from "antd";
import { formatUnits } from "ethers/lib/utils";
import { createUseStyles } from "react-jss";
import { clone } from "lodash";
import { formatDecimalPart } from "celer-web-utils/lib/format";
import { Chain, Token, TokenInfo, GetTransferConfigsResponse, PeggedPairConfig } from "../../constants/type";
import { useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";
import { getTokenSymbolWithPeggedMode, getTokenListSymbol } from "../../redux/transferSlice";
import { PeggedChainMode, usePeggedPairConfig } from "../../hooks/usePeggedPairConfig";
import { EstimateAmtResponse } from "../../proto/gateway/gateway_pb";
import { useMultiBurnConfig } from "../../hooks/useMultiBurnConfig";
import bridgeRateDangerPng from "../../images/bridgeRateDanger.png";
import { isETH } from "../../helpers/tokenInfo";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  box: {
    display: "flex",
    flexFlow: "column",
    justifyContent: "flex-start",
    alignContent: "center",
    gap: 6,
    width: props => (props.isMobile ? "calc(100% - 32px)" : 496),
    marginTop: props => (props.isMobile ? 28 : 0),
    borderRadius: props => (props.isMobile ? 16 : "0px 0px 16px 16px"),
    border: `1px solid ${theme.primaryBorder}`,
    borderTop: props => (props.isMobile ? "" : 0),
    padding: "18px 16px 16px 16px",
    backgroundColor: theme.primaryBackground,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    color: theme.secondBrand,
    fontSize: 12,
    fontWeight: 600,
  },
  bridgeRateDangerImg: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
  content: {
    color: theme.surfacePrimary,
    fontSize: 12,
    fontWeight: 600,
    "& img": {
      width: 16,
      height: 16,
    },
  },
  bridgeRate: {
    color: theme.infoDanger,
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
  iconImg: {
    borderRadius: "50%",
  },
  noticeItem: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: theme.secondBackground,
    borderRadius: 8,
    height: 44,
    padding: "8px 12px",
    marginBottom: 2,
  },
  noticeTitle: {
    color: theme.surfacePrimary,
    fontSize: 12,
    fontWeight: 500,
    alignItems: "center",
    marginTop: 1,
  },
  noticeIconImg: {
    marginBottom: 3,
    width: 24,
    height: 24,
  },
}));

type IProps = {
  selectedToken: TokenInfo | undefined;
  fromChain: Chain | undefined;
  toChain: Chain | undefined;
  bridgeRate: number;
  isBridgeRateTooLow: boolean;
  minimumReceived: string;
  baseFee: string | undefined;
  percFee: string | undefined;
  transferConfig: GetTransferConfigsResponse;
  isBigAmountDelayed: boolean;
  delayMinutes: string;
  estimateAmtInfoInState: EstimateAmtResponse.AsObject | null;
  latencyMinutes: string | null;
  useCircleUSDC: boolean;
};

function TransferOverview({
  selectedToken,
  fromChain,
  toChain,
  bridgeRate,
  isBridgeRateTooLow,
  minimumReceived,
  baseFee,
  percFee,
  transferConfig,
  isBigAmountDelayed,
  delayMinutes,
  estimateAmtInfoInState,
  latencyMinutes,
  useCircleUSDC,
}: IProps) {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const pegConfig = usePeggedPairConfig();
  const { multiBurnConfig } = useMultiBurnConfig();
  const styles = useStyles({ isMobile });
  const getTokenByChainAndTokenSymbol = (chainId, tokenSymbol) => {
    return transferConfig?.chain_token[chainId]?.token.find(tokenInfo => tokenInfo?.token?.symbol === tokenSymbol);
  };

  const baseTgas = formatUnits(
    baseFee || "0",
    useCircleUSDC
      ? selectedToken?.token.decimal
      : getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token?.symbol)?.token.decimal,
  );
  const percTgas = formatUnits(
    percFee || "0",
    useCircleUSDC
      ? selectedToken?.token.decimal
      : getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token?.symbol)?.token.decimal,
  );

  const getEstimatedTime = () => {
    if (isBigAmountDelayed) {
      return `up to ${delayMinutes} minutes`;
    }
    return `${latencyMinutes} minutes`;
  };

  const totalFee = (Number(baseTgas) + Number(percTgas)).toString() || "0";

  const toChainInConfig = transferConfig.chains.find(it => it.id === toChain?.id);
  // const arrivalGasTokenAmount = BigNumber.from(toChainInConfig?.drop_gas_amt ?? "0");
  const dropGasAmt =
    estimateAmtInfoInState?.dropGasAmt && estimateAmtInfoInState?.dropGasAmt.length > 0
      ? estimateAmtInfoInState?.dropGasAmt
      : "0";
  const arrivalGasTokenAmount = BigNumber.from(dropGasAmt);

  const arrivalGasTokenDecimal =
    getTokenByChainAndTokenSymbol(toChainInConfig?.id ?? 0, toChainInConfig?.gas_token_symbol)?.token.decimal ?? 18;
  const arrivalGasTokenAmountValue = formatUnits(arrivalGasTokenAmount, arrivalGasTokenDecimal);
  const arrivalGasTokenAmountDisplay = formatDecimalPart(arrivalGasTokenAmountValue || "0", 6, "round", true);
  const arrivalGasTokenSymbol = toChainInConfig?.gas_token_symbol;

  return (
    <div className={styles.box}>
      <div className={styles.item}>
        <span className={styles.title}>
          Bridge Rate
          {isBridgeRateTooLow ? (
            <img src={bridgeRateDangerPng} alt="bridge rate too small" className={styles.bridgeRateDangerImg} />
          ) : (
            ""
          )}
        </span>
        <span className={styles.content}>
          {isMobile ? (
            <div className={isBridgeRateTooLow ? styles.bridgeRate : undefined}>{bridgeRate}</div>
          ) : (
            <div className={isBridgeRateTooLow ? styles.bridgeRate : undefined}>
              1 {isETH(selectedToken?.token) ? "ETH" : getTokenListSymbol(selectedToken?.token?.symbol, fromChain?.id)}{" "}
              on <img className={styles.iconImg} src={fromChain?.icon} alt="" />{" "}
              {pegConfig.mode === PeggedChainMode.Off && multiBurnConfig === undefined && !useCircleUSDC ? "≈" : "="}{" "}
              {bridgeRate}{" "}
              {getTokenDisplaySymbol(
                selectedToken?.token,
                fromChain,
                toChain,
                transferConfig.pegged_pair_configs,
                useCircleUSDC,
              )}{" "}
              on <img className={styles.iconImg} src={toChain?.icon} alt="" />
            </div>
          )}
        </span>
      </div>
      <div className={styles.item}>
        <div>
          <span className={styles.title}>Fee</span>
          <Tooltip
            title={
              <div className={styles.tooltipContent} style={{ whiteSpace: "pre-line" }}>
                <span style={{ fontWeight: 700 }}>The Base Fee</span>
                {`: ${formatDecimalPart(baseTgas || "0", 8, "round", true)} ${getTokenDisplaySymbol(
                  selectedToken?.token,
                  fromChain,
                  toChain,
                  transferConfig.pegged_pair_configs,
                  useCircleUSDC,
                )}\n`}
                <span style={{ fontWeight: 700 }}>The Protocol Fee</span>
                {`: ${formatDecimalPart(percTgas || "0", 8, "round", true)} ${getTokenDisplaySymbol(
                  selectedToken?.token,
                  fromChain,
                  toChain,
                  transferConfig.pegged_pair_configs,
                  useCircleUSDC,
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
            <InfoCircleOutlined className={styles.infoIcon} style={{ marginLeft: 6 }} />
          </Tooltip>
        </div>
        <span className={styles.content}>
          {formatDecimalPart(totalFee || "0", 8, "round", true)}{" "}
          {getTokenDisplaySymbol(
            selectedToken?.token,
            fromChain,
            toChain,
            transferConfig.pegged_pair_configs,
            useCircleUSDC,
          )}
        </span>
      </div>
      {pegConfig.mode === PeggedChainMode.Off && multiBurnConfig === undefined ? (
        <div className={styles.item}>
          <div>
            <span className={styles.title}>Minimum Received</span>
            <Tooltip
              title={
                <div className={styles.tooltipContent} style={{ textAlign: "center" }}>
                  {`You will receive at least ${
                    minimumReceived +
                    getTokenDisplaySymbol(
                      selectedToken?.token,
                      fromChain,
                      toChain,
                      transferConfig.pegged_pair_configs,
                      useCircleUSDC,
                    )
                  } on ${toChain?.name} or the transfer won't go through.`}
                </div>
              }
              arrowPointAtCenter
              placement="bottom"
              color="#fff"
              overlayInnerStyle={{ color: "#000", backgroundColor: "#fff", width: 265 }}
            >
              <InfoCircleOutlined className={styles.infoIcon} style={{ marginLeft: 6 }} />
            </Tooltip>
          </div>
          <span className={styles.content}>
            {minimumReceived +
              getTokenDisplaySymbol(
                selectedToken?.token,
                fromChain,
                toChain,
                transferConfig.pegged_pair_configs,
                useCircleUSDC,
              )}
          </span>
        </div>
      ) : null}
      <div className={styles.item}>
        <span className={styles.title}>Estimated Time of Arrival</span>
        <span className={styles.content}>{getEstimatedTime()}</span>
      </div>
      <div className={styles.item} hidden={arrivalGasTokenAmount.lte(0)}>
        <div>
          <span className={styles.title}>Received Gas Tokens On Arrival</span>
          <Tooltip
            title={
              <div className={styles.tooltipContent} style={{ textAlign: "center" }}>
                {`You will also receive ${
                  arrivalGasTokenAmountDisplay + " " + arrivalGasTokenSymbol
                } to pay gas fee on ${toChain?.name}`}
              </div>
            }
            arrowPointAtCenter
            placement="bottom"
            color="#fff"
            overlayInnerStyle={{ color: "#000", backgroundColor: "#fff", width: 265 }}
          >
            <InfoCircleOutlined className={styles.infoIcon} style={{ marginLeft: 6 }} />
          </Tooltip>
        </div>
        <span className={styles.content}>{arrivalGasTokenAmountDisplay + " " + arrivalGasTokenSymbol}</span>
      </div>
    </div>
  );
}

export const needToChangeTokenDisplaySymbol = (selectedToken: Token | undefined, toChain: Chain | undefined) => {
  if (!selectedToken || !toChain) {
    return false;
  }
  const destinationChainToken = clone(selectedToken);
  destinationChainToken.chainId = toChain.id;
  return isETH(destinationChainToken);
};

export const getTokenDisplaySymbol = (
  selectedToken: Token | undefined,
  fromChain: Chain | undefined,
  toChain: Chain | undefined,
  peggedPairConfigs: Array<PeggedPairConfig>,
  useCircleUSDCBridge: boolean,
) => {
  if (useCircleUSDCBridge) {
    return "USDC";
  }
  return getTokenSymbolWithPeggedMode(fromChain?.id, toChain?.id, selectedToken?.symbol ?? "", peggedPairConfigs);
};

export default React.memo(TransferOverview);
