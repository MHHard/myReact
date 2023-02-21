import { useCallback, useEffect, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";

import { formatDecimal, safeParseUnits } from "number-format-utils/lib/format";
import useReadOnlyCustomContractLoader from "./customReadyOnlyContractLoader";
import { Bridge, Bridge__factory } from "../typechain";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { CHAIN_LIST } from "../constants/network";
import {
  setBigAmountDelayInfos,
  BigAmountDelayInfo,
} from "../redux/transferSlice";
import { Chain, Token } from "../proto/chainhop/common_pb";

export const useBigAmountDelay = (
  chain: Chain.AsObject | undefined,
  token: Token.AsObject | undefined,
  amount: number,
  hasEpochVolumeCaps = false,
  epochVolumeCaps?: BigNumber
) => {
  const dispatch = useAppDispatch();
  const { transferInfo } = useAppSelector((state) => state);
  const [isBigAmountDelayed, setIsBigAmountDelayed] = useState(false);
  const [delayThresholds, setDelayThresholds] = useState("");
  const [delayMinutes, setDelayMinutes] = useState("0");
  const { transferConfig, bigAmountDelayInfos } = transferInfo;
  const chainValues = CHAIN_LIST;
  const toChainValue = chainValues.find((it) => {
    return it.chainId === chain?.chainId ?? "";
  });
  const rpcUrl = toChainValue?.rpcUrl ?? "";

  const contractAddress = (() => {
    return chain?.executionNode ?? "";
  })();
  const bridge = useReadOnlyCustomContractLoader(
    chain?.chainId,
    contractAddress,
    Bridge__factory
  ) as Bridge | undefined;

  const getToken = useCallback(() => {
    const tokens = transferConfig?.chainToken[chain?.chainId ?? 0]?.tokenList;
    const currentToken = tokens?.find((it) => it?.symbol === token?.symbol);
    return currentToken;
  }, [chain?.chainId, token, transferConfig?.chainToken]);

  const setValues = useCallback(
    (delayInfo: BigAmountDelayInfo, tokenValue: Token.AsObject) => {
      try {
        setDelayMinutes(
          BigNumber.from(delayInfo.period).div(60).add(10).toString()
        );
        const thresholds = BigNumber.from(delayInfo.thresholds);
        const thresholdsAmount = formatDecimal(
          thresholds,
          tokenValue?.decimals,
          tokenValue?.decimals
        );
        setDelayThresholds(thresholdsAmount);
        const bigAmount = safeParseUnits(
          amount.toFixed(6).toString(),
          tokenValue?.decimals
        );
        setIsBigAmountDelayed(
          bigAmount.gte(thresholds) &&
            bigAmount.gt(BigNumber.from(0)) &&
            thresholds.gt(BigNumber.from(0))
        );
      } catch (error) {
        console.log("amount error", error);
      }
    },
    [amount]
  );

  useEffect(() => {
    const tokenValue = getToken();
    if (hasEpochVolumeCaps && epochVolumeCaps?.gt(0)) {
      setIsBigAmountDelayed(false);
      return;
    }
    if (bridge === undefined || tokenValue?.address === undefined) {
      setIsBigAmountDelayed(false);
      return;
    }
    const delayInfo = bigAmountDelayInfos.find((item) => {
      return (
        item.rpcUrl === rpcUrl &&
        item.contractAddress === contractAddress &&
        item.tokenAddress === tokenValue.address
      );
    });

    if (delayInfo !== undefined) {
      setValues(delayInfo, tokenValue);
      return;
    }

    (async () => {
      setIsBigAmountDelayed(false);
      const tokenAddress = tokenValue?.address ?? "";
      const period = await bridge.delayPeriod();
      const thresholds = await bridge.delayThresholds(tokenAddress);
      const info: BigAmountDelayInfo = {
        rpcUrl,
        contractAddress,
        tokenAddress,
        period: period.toHexString(),
        thresholds: thresholds.toHexString(),
      };
      setValues(info, tokenValue);
      if (!bigAmountDelayInfos.includes(info)) {
        const newBigAmountDelayInfos = [...bigAmountDelayInfos, info];
        dispatch(setBigAmountDelayInfos(newBigAmountDelayInfos));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, token?.address, hasEpochVolumeCaps, epochVolumeCaps, amount]);

  return { isBigAmountDelayed, delayMinutes, delayThresholds, amount };
};
