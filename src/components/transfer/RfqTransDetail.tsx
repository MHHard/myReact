import { FC } from "react";
import { createUseStyles } from "react-jss";
import { BigNumber } from "@ethersproject/bignumber";
import { formatDecimalPart } from "celer-web-utils/lib/format";
import { Theme } from "../../theme";
import { useAppSelector } from "../../redux/store";
import { formatDecimal } from "../../helpers/format";
import { getTokenListSymbol, getTokenSymbolWithPeggedMode } from "../../redux/assetSlice";
import { Chain, Token, PeggedPairConfig } from "../../constants/type";
import { PeggedChainMode, usePeggedPairConfig } from "../../hooks/usePeggedPairConfig";
import { useNonEVMBigAmountDelay } from "../../hooks/useNonEVMBigAmountDelay";
import { useMultiBurnConfig } from "../../hooks/useMultiBurnConfig";

/* eslint-disable camelcase */
const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  historyDetail: {
    width: "100%",
  },
  detailItem: {
    borderBottom: `1px solid ${theme.primaryBorder}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    padding: "12px 0",
  },
  detailItemWithoutBorder: {
    display: "flex",
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
  latencyMinutes: string | null;
  isBigAmountDelayed: boolean;
  delayMinutes: string | undefined;
}

const RfqTransDetail: FC<IProps> = ({ amount, receiveAmount, latencyMinutes, isBigAmountDelayed, delayMinutes }) => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { transferInfo } = useAppSelector(state => state);
  const { fromChain, toChain, selectedToken, transferConfig, priceResponse } = transferInfo;
  const pegConfig = usePeggedPairConfig();
  const { multiBurnConfig } = useMultiBurnConfig();
  const { nonEVMBigAmountDelayed, nonEVMDelayTimeInMinute } = useNonEVMBigAmountDelay(receiveAmount);

  let estimatedReceiveAmount;
  if (receiveAmount === 0) {
    estimatedReceiveAmount = "0.0";
  } else if (receiveAmount < 0) {
    estimatedReceiveAmount = "--";
  } else {
    estimatedReceiveAmount = `${receiveAmount}`;
  }

  let bridgeRate;
  let totalFee;
  if (priceResponse) {
    const feeResTargetAmounts = priceResponse?.fee ?? "0";
    const feeResAmounts = formatDecimal(feeResTargetAmounts, priceResponse?.price?.srcToken?.decimals ?? 0)
      ?.split(",")
      .join("");
    const fee = Number(feeResAmounts);
    bridgeRate = (receiveAmount * 1.0 + fee) / Number(amount);
    totalFee = formatDecimal(
      BigNumber.from(priceResponse?.fee || "0"),
      priceResponse?.price?.srcToken?.decimals ?? 0,
      8,
    );
  }

  const delayTime = () => {
    let result = `${latencyMinutes} minutes`;
    if (isBigAmountDelayed) {
      result = `up to ${delayMinutes} minutes`;
    } else if (nonEVMBigAmountDelayed) {
      result = `up to ${nonEVMDelayTimeInMinute} minutes`;
    }
    return result;
  };

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
            {selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)}
          </div>
        </div>
      </div>
      <div className={classes.detailItem}>
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
            getTokenDisplaySymbol(selectedToken?.token, fromChain, toChain, transferConfig.pegged_pair_configs) ?? ""
          }`}</div>
        </div>
      </div>

      <div className={classes.descripet}>
        <div className={classes.descripetItem}>
          <div className={classes.leftTitle}>Bridge Rate</div>
          {isMobile ? (
            <div className={classes.rightContent}>{bridgeRate}</div>
          ) : (
            <div className={classes.rightContent}>
              1{" "}
              {selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token?.symbol, fromChain?.id)}{" "}
              on
              <img className={classes.desImg} height={14} style={{ marginRight: 6 }} src={fromChain?.icon} alt="" />
              {pegConfig.mode === PeggedChainMode.Off && multiBurnConfig === undefined ? "≈" : "="} {bridgeRate}{" "}
              {getTokenDisplaySymbol(selectedToken?.token, fromChain, toChain, transferConfig.pegged_pair_configs)} on
              <img className={classes.desImg} height={14} src={toChain?.icon} alt="" />
            </div>
          )}
        </div>
        <div className={classes.descripetItem}>
          <div className={classes.leftTitle}>
            <div className={classes.leftTitle}>Fee</div>
          </div>
          <div className={classes.rightContent}>
            {formatDecimalPart(totalFee || "0", 8, "round", true)}{" "}
            {getTokenDisplaySymbol(selectedToken?.token, fromChain, toChain, transferConfig.pegged_pair_configs)}
          </div>
        </div>
        <div className={classes.descripetItem}>
          <span className={classes.leftTitle}>Estimated Time of Arrival</span>
          <span className={classes.rightContent}>{delayTime()}</span>
        </div>
      </div>
    </div>
  );
};

export const getTokenDisplaySymbol = (
  selectedToken: Token | undefined,
  fromChain: Chain | undefined,
  toChain: Chain | undefined,
  peggedPairConfigs: Array<PeggedPairConfig>,
) => {
  return getTokenSymbolWithPeggedMode(fromChain?.id, toChain?.id, selectedToken?.symbol ?? "", peggedPairConfigs);
};

export default RfqTransDetail;
