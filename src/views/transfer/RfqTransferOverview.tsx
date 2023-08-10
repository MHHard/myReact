import React from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { createUseStyles } from "react-jss";
import { formatDecimalPart } from "celer-web-utils/lib/format";
import { Chain, TokenInfo, GetTransferConfigsResponse } from "../../constants/type";
import { useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";
import { getTokenListSymbol } from "../../redux/transferSlice";
import bridgeRateDangerPng from "../../images/bridgeRateDanger.png";
import noticePng from "../../images/noticeIcon.png";
import { PriceResponse } from "../../proto/sdk/service/rfq//user_pb";
import { formatDecimal } from "../../helpers/format";
import rfqShareImage from "../../images/rfqShare.png";
import { getTokenDisplaySymbol } from "./TransferOverview";
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
    height: props => (props.isMobile ? 70 : 44),
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
  transferConfig: GetTransferConfigsResponse;
  isBigAmountDelayed: boolean;
  delayMinutes: string;
  priceResponse: PriceResponse.AsObject | null;
  latencyMinutes: string | null;
};

function RfqTransferOverview({
  selectedToken,
  fromChain,
  toChain,
  bridgeRate,
  transferConfig,
  isBigAmountDelayed,
  delayMinutes,
  priceResponse,
  latencyMinutes,
}: IProps) {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const styles = useStyles({ isMobile });

  const getEstimatedTime = () => {
    if (isBigAmountDelayed) {
      return `up to ${delayMinutes} minutes`;
    }
    return `${latencyMinutes} minutes`;
  };

  const totalFee = formatDecimal(
    BigNumber.from(priceResponse?.fee || "0"),
    priceResponse?.price?.srcToken?.decimals ?? 0,
    8,
  );

  return (
    <div className={styles.box}>
      <div className={styles.noticeItem}>
        <span className={styles.noticeTitle}>
          <img id="rfqImg" className={styles.noticeIconImg} src={noticePng} alt="" />
          <span> This transfer utilizes liquidity from Peti xRFQ protocol</span>
          <div
            onClick={() => {
              window.open("https://docs.peti.trade/");
            }}
            style={{ cursor: "pointer", display: "inline-block" }}
          >
            <img src={rfqShareImage} alt="LAYER2.FINANCE" style={{ width: "30px" }} />
          </div>
        </span>
        {/* <a href="https://cbridge-docs.celer.network/rfq" target="_blank" rel="noreferrer">
          Learn More
        </a> */}
      </div>
      <div className={styles.item}>
        <span className={styles.title}>
          Bridge Rate
          {bridgeRate <= 0.95 ? (
            <img src={bridgeRateDangerPng} alt="bridge rate too small" className={styles.bridgeRateDangerImg} />
          ) : (
            ""
          )}
        </span>
        <span className={styles.content}>
          {isMobile ? (
            <div className={bridgeRate <= 0.95 ? styles.bridgeRate : undefined}>{bridgeRate}</div>
          ) : (
            <div className={bridgeRate <= 0.95 ? styles.bridgeRate : undefined}>
              1 {isETH(selectedToken?.token) ? "ETH" : getTokenListSymbol(selectedToken?.token?.symbol, fromChain?.id)}{" "}
              on <img className={styles.iconImg} src={fromChain?.icon} alt="" /> = {bridgeRate}{" "}
              {getTokenDisplaySymbol(
                selectedToken?.token,
                fromChain,
                toChain,
                transferConfig.pegged_pair_configs,
                false,
              )}{" "}
              on <img className={styles.iconImg} src={toChain?.icon} alt="" />
            </div>
          )}
        </span>
      </div>
      <div className={styles.item}>
        <span className={styles.title}>Fee</span>
        <span className={styles.content}>
          {formatDecimalPart(totalFee, 8, "round", true)}{" "}
          {getTokenDisplaySymbol(selectedToken?.token, fromChain, toChain, transferConfig.pegged_pair_configs, false)}
        </span>
      </div>
      <div className={styles.item}>
        <span className={styles.title}>Estimated Time of Arrival</span>
        <span className={styles.content}>{getEstimatedTime()}</span>
      </div>
    </div>
  );
}

export default React.memo(RfqTransferOverview);
