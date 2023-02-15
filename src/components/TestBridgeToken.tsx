// import { useEffect, useMemo, useState } from "react";
import { createUseStyles } from "react-jss";
// import { TransferPair } from "../constants/type";
// import { validateTransferPair } from "../helpers/transferPairValidation";
// import { useDestinationChainTransferInfo } from "../hooks/useDestinationChainTransferInfo";
// import { useSourceChainTransferInfo } from "../hooks/useSourceChainTransferInfo";
// import { useBridgeChainTokensContext } from "../providers/BridgeChainTokensProvider";
import { useAppSelector } from "../redux/store";
import { Theme } from "../theme";

const TestBridgeToken = () => {
  const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
    ratemodal: {},

    activeBtn: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "16px",
      fontSize: 14,
      fontWeight: 600,
      background: theme.primaryBrand,
      // color: theme.surfacePrimary,
      color: "#FFFFFF",
      textAlign: "center",
      cursor: "pointer",
      height: 48,
    },
  }));

  const { isMobile } = useAppSelector(state => state.windowWidth);
  // const { fromChain, toChain, selectedToken } = useAppSelector(state => state.transferInfo);
  const classes = useStyles({ isMobile });
  // const {
  //   // getChainInfoById,
  //   // getPegPair,
  //   // getBridgeType,
  //   // getBridgeContractAddress,
  //   // getTokenInfo,
  //   // getMintAndSwapTokenAddress,
  //   // isNativeToken,
  //   // getTokenDisplayName,
  //   getTransferPair,
  // } = useBridgeChainTokensContext();

  const onTestClick = () => {
    // console.log("lclaaaaaa");
    // const chainInfo = getChainInfoById(5);
    // console.log("test bridgeToken getChainInfoById");
    // console.log(chainInfo);
    // const pegPair = getPegPair(5, 97, "DOMI");
    // console.log("test bridgeToken getPegPair");
    // console.log(pegPair);
    // const bridgeType = getBridgeType(5, 595, "USDC");
    // console.log("test bridgeToken getBridgeType");
    // console.log(bridgeType);
    // const contractAddress = getBridgeContractAddress(5, 97, "DOMI");
    // console.log("test bridgeToken getBridgeContractAddress");
    // console.log(contractAddress);
    // const tokenInfo = getTokenInfo(5, 595, "USDC");
    // console.log("test bridgeToken getTokenInfo");
    // console.log(tokenInfo);
    // const mintAndSwapTokenAddress = getMintAndSwapTokenAddress(595);
    // console.log("test bridgeToken getMintAndSwapTokenAddress");
    // console.log(mintAndSwapTokenAddress);
    // const isNativeT = isNativeToken(56, "BNB");
    // console.log("test bridgeToken isNativeToken");
    // console.log(isNativeT);
    // const tokenDisplayName = getTokenDisplayName(43114, "USDT");
    // console.log("test bridgeToken getTokenDisplayName");
    // console.log(tokenDisplayName);
  };

  // useEffect(() => {
  //   const transferPair = getTransferPair(fromChain?.id, toChain?.id, selectedToken?.token.symbol ?? "");
  //   setTransferPair(transferPair);
  // }, [fromChain, toChain, selectedToken]);

  // const nullPair = getTransferPair(0, 0, "");
  // const [transferPair, setTransferPair] = useState<TransferPair>(nullPair);

  // const { destinationChainTransferInfoCallback } = useDestinationChainTransferInfo(transferPair);
  // useMemo(() => {
  //   if (!validateTransferPair(transferPair) || !destinationChainTransferInfoCallback) {
  //     return;
  //   }

  //   const getDelayInfo = async () => {
  //     const delayInfo = await destinationChainTransferInfoCallback();
  //     if (delayInfo) {
  //       console.log(
  //         "Transfer Pair Destination delayPeriod, thresholds, epochVolumeCaps",
  //         delayInfo.delayPeriod.toString(),
  //         delayInfo.delayThresholds.toString(),
  //         delayInfo.epochVolumeCaps.toString(),
  //       );
  //     }
  //   };

  //   getDelayInfo();
  // }, [destinationChainTransferInfoCallback, transferPair]);

  // const { sourceChainTransferInfoCallback } = useSourceChainTransferInfo(transferPair);

  // useMemo(() => {
  //   if (!validateTransferPair(transferPair) || !sourceChainTransferInfoCallback) {
  //     return;
  //   }

  //   const getDelayInfo = async () => {
  //     const safeGuardInfo = await sourceChainTransferInfoCallback();
  //     if (safeGuardInfo) {
  //       console.log(
  //         "Transfer Pair Source max, min",
  //         safeGuardInfo.maxAmount.toString(),
  //         safeGuardInfo.minAmount.toString(),
  //       );
  //     }
  //   };

  //   getDelayInfo();
  // }, [sourceChainTransferInfoCallback, transferPair]);

  return (
    <div className={classes.ratemodal}>
      <div
        className={classes.activeBtn}
        onClick={() => {
          onTestClick();
        }}
      >
        test
      </div>
    </div>
  );
};

export default TestBridgeToken;
