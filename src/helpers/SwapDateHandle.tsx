import { WarningFilled } from "@ant-design/icons";
import {
  formatBalance,
  formatDecimal,
  safeParseUnits,
} from "number-format-utils/lib/format";
import { BigNumber } from "ethers";
// import { ErrCode, EstimateFeeResponse } from "../proto/chainhop/web_pb";
import { getTokenSymbol, switchChain } from "../redux/transferSlice";
import errorIcon from "../images/errorIcon.png";
import { ErrCode } from "../proto/chainhop/error_pb";
import { TokenBalance } from "../constants/type";

const validFloatRegex = /^[0-9]+[.]?[0-9]*$/;
export const errorProcessor = {
  isFromChainDiffFromWalletChain(fromChain, chainId, isMobile) {
    if (fromChain && fromChain?.chainId !== chainId && chainId !== 0) {
      if (isMobile) {
        return generateErrMsg(
          `Please switch to ${fromChain?.name} before you can start the swap.`
        );
      }
      return generateErrSwitchMsg(fromChain);
    }
    return undefined;
  },
  isFromChainSameAsDstChain(fromChain, toChain) {
    if (
      fromChain &&
      toChain &&
      fromChain?.chainId === toChain?.chainId
    ) {
      return generateErrMsg(
        `The source chain cannot be the same as the destination chain.`
      );
    }
    return undefined;
  },
  isAmountInvalid(amount) {
    if ((!validFloatRegex.test(amount) && amount) || Number(amount) < 0) {
      return generateErrMsg("Please enter a valid transfer number");
    }
    return undefined;
  },
  isOffline(networkState) {
    if (!networkState.online) {
      return generateErrMsg(
        `Network error. Please check your Internet connection.`
      );
    }
    return undefined;
  },
  isValueGtBalance(
    amount,
    selectedToken,
    tokenBalance: TokenBalance | undefined,
    tokenBalanceLoading,
    nativeTokenLoading
  ) {
    if (amount) {
      const value =
        safeParseUnits(amount, selectedToken?.decimals) || BigNumber.from(0);
      const balance = tokenBalance?.balance ?? 0;
      if (value.gt(balance)) {
        if (tokenBalance?.isNativeToken && !nativeTokenLoading) {
          return generateErrMsg(`Insufficient balance.`);
        }
        if (!tokenBalance?.isNativeToken && !tokenBalanceLoading) {
          return generateErrMsg(`Insufficient balance.`);
        }
      }
    }
    return undefined;
  },
  isValueLteMinSendValue(amount, selectedToken, errorMsg, fromChain) {
    const minSendValue = errorMsg?.errMinMaxSend?.minSend;
    if (
      Number(amount) <= 0 ||
      minSendValue === "0" ||
      errorMsg.code !== ErrCode.ERROR_CODE_MIN_MAX_SEND
    ) {
      return undefined;
    }
    const minsendNum = Number(
      formatDecimal(minSendValue, 6, selectedToken?.decimals)
        .split(",")
        .join("")
    );
    const midAmountNumber = Number(amount);
    if (midAmountNumber <= minsendNum * 1.05) {
      return generateErrMsg(
        `The min swap amount is ${formatBalance(
          minsendNum,
          6,
          "ceil",
          ",",
          true
        )} ${getTokenSymbol(
          selectedToken?.symbol,
          fromChain?.chainId
        )}. Please enter a larger amount.`
      );
    }
    return undefined;
  },
  isValueGteMaxSendValue(amount, errorMsg, selectedToken, fromChain) {
    const maxSendValue = errorMsg?.errMinMaxSend?.maxSend;
    if (
      !amount ||
      Number(amount) <= 0 ||
      !maxSendValue ||
      maxSendValue === "0"
    ) {
      return undefined;
    }

    const midAmount = Number(amount);
    const maxSendAmount = formatDecimal(
      maxSendValue,
      6,
      selectedToken.decimals
    );
    const maxAmountOnSrcToken = `${formatBalance(
      maxSendAmount,
      6,
      "floor",
      ",",
      true
    )}`;

    if (midAmount >= Number(maxSendAmount)) {
      return generateErrMsg(
        `The max swap value is ${maxAmountOnSrcToken} ${getTokenSymbol(
          selectedToken?.symbol,
          fromChain?.chainId
        )}. Please enter a small amount.`
      );
    }
    return undefined;
  },
  isFeeGtAmount(amount, errorMsg) {
    if (
      Number(errorMsg?.code) === ErrCode.ERROR_CODE_NEGATIVE_AMT_OUT &&
      Number(amount) > 0
    ) {
      return generateErrMsg(`The received amount cannot cover fee.`);
    }
    return undefined;
  },
  // isAmountParseError(amount, selectedToken) {
  //   try {
  //     parseUnits(Number(amount).toString(), selectedToken?.decimals);
  //   } catch {
  //     return generateErrMsg(`No route found for this swap.`);
  //   }
  //   return undefined;
  // },
  isNoRouteFound(errorMsg, amount) {
    if (
      Number(errorMsg?.code) === ErrCode.ERROR_CODE_NO_ROUTE &&
      Number(amount) > 0
    ) {
      return generateErrMsg(`No route found for this swap.`);
    }
    return undefined;
  },
  isPriceImpactTooLow(priceImpact, estimateAmtInfoInState) {
    if (priceImpact < -100000 && estimateAmtInfoInState) {
      return (
        <div
          style={{
            display: "inline-flex",
            borderRadius: 16,
            background: "rgba(255, 130, 14, 0.1)",
          }}
        >
          <div
            className="warningInnerbody"
            style={{ display: "inline-flex", margin: "8px 0px 8px 12px" }}
          >
            <WarningFilled style={{ fontSize: 20, marginRight: 10 }} />
          </div>
          <div style={{ display: "inline", margin: "8px 12px 8px 0" }}>
            <span
              className="warningInnerbody"
              style={{ display: "inline", margin: "0px" }}
            >
              The current swap rate is significantly lower than the market
              price. You may reduce your swap amount.
            </span>
          </div>
        </div>
      );
    }
    return undefined;
  },
};

export const warnProcessor = {
  isBigAmountDelayed(
    tokenSymbol,
    delayThresholds,
    isBigAmountDelayed,
    estimateAmtInfoInState,
    impact
  ) {
    const delayNum = delayThresholds * estimateAmtInfoInState?.dstTokenPrice;
    if (isBigAmountDelayed && estimateAmtInfoInState && impact !== 0) {
      return (
        <div
          style={{
            display: "inline-flex",
            borderRadius: 16,
            background: "rgba(255, 130, 14, 0.1)",
          }}
        >
          <div
            className="warningInnerbody"
            style={{ display: "inline-flex", margin: "8px 0px 8px 12px" }}
          >
            <WarningFilled style={{ fontSize: 20, marginRight: 10 }} />
          </div>
          <div style={{ display: "inline", margin: "8px 0px" }}>
            <span
              className="warningInnerbody"
              style={{ display: "inline", margin: "0px" }}
            >
              {`Swapping more than ${delayNum} ${tokenSymbol}  takes up to 60 minutes to complete.`}
            </span>
          </div>
        </div>
      );
    }
    return undefined;
  },
  isPriceImpactLow(priceImpact, estimateAmtInfoInState) {
    if (
      priceImpact >= -100000 &&
      priceImpact <= -50000 &&
      estimateAmtInfoInState
    ) {
      return (
        <div
          style={{
            display: "inline-flex",
            borderRadius: 16,
            background: "rgba(255, 130, 14, 0.1)",
          }}
        >
          <div
            className="warningInnerbody"
            style={{ display: "inline-flex", margin: "8px 0px 8px 12px" }}
          >
            <WarningFilled style={{ fontSize: 20, marginRight: 10 }} />
          </div>
          <div style={{ display: "inline", margin: "8px 0px" }}>
            <span
              className="warningInnerbody"
              style={{ display: "inline", margin: "0px" }}
            >
              The current swap rate is{" "}
              <span className="redText">
                {Math.abs(Number(priceImpact) / 10000).toFixed(2)}% lower
              </span>{" "}
              than the average market price. You may reduce your swap amount or
              proceed with caution.
            </span>
          </div>
        </div>
      );
    }
    return undefined;
  },
};
export const generateErrMsg = (msg: string) => {
  return (
    <div className="errInnerbody">
      <img src={errorIcon} alt="error" width={20} />
      <span style={{ fontSize: 14, marginLeft: 10 }}>{msg}</span>
    </div>
  );
};

export const generateErrSwitchMsg = (fromChain) => {
  return (
    <div className="errInnerbody">
      <img src={errorIcon} alt="error" width={20} />
      <span>
        Please{" "}
        <span
          className="switchBtn"
          onClick={() => {
            switchChain(fromChain.chainId, undefined);
          }}
          style={{ color: "#1890ff", cursor: "pointer" }}
        >
          switch to {fromChain.name}{" "}
        </span>{" "}
        before you can start the swap.
      </span>
    </div>
  );
};
