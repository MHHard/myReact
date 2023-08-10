import { Modal, Button, message } from "antd";
import { FC, useEffect, useState, useContext } from "react";
import { createUseStyles } from "react-jss";
import { WarningFilled, CloseCircleFilled } from "@ant-design/icons";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { formatDecimalPart, safeParseUnits } from "celer-web-utils/lib/format";
import moment from "dayjs";
import { useContractsContext } from "../../providers/ContractsContextProvider";
import { useWeb3Context } from "../../providers/Web3ContextProvider";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setEstimateAmtInfoInState, setPriceResponse } from "../../redux/transferSlice";

import { Theme } from "../../theme";
import { ERC20 } from "../../typechain/typechain/ERC20";
import { ERC20__factory } from "../../typechain/typechain/factories/ERC20__factory";
import { ColorThemeContext } from "../../providers/ThemeProvider";
import { useCustomContractLoader } from "../../hooks";
import arrTop from "../../images/arrTop.svg";
import TransDetail from "./TransDetail";
import { TransferHistoryStatus, LPHistoryStatus, TransferHistory, TokenInfo } from "../../constants/type";
import arrTopLightIcon from "../../images/arrTopLight.svg";
import clockPng from "../../images/clockIcon.png";

/* eslint-disable camelcase */

import {
  EstimateAmtRequest,
  EstimateAmtResponse,
  MarkRefRelationRequest,
  BridgeType,
} from "../../proto/gateway/gateway_pb";
import { isGasToken, isTestNet } from "../../constants/network";
import { getTokenBalanceAddress, PeggedChainMode, usePeggedPairConfig } from "../../hooks/usePeggedPairConfig";

import { storageConstants } from "../../constants/const";
import { useMultiBurnConfig } from "../../hooks/useMultiBurnConfig";
import { PegTokenSupply } from "../../hooks/usePegV2Transition";
import { gatewayServiceWithGrpcUrlClient } from "../../redux/grpcClients";
import transferFactory from "./transferFactory";
import { MaxITransfer } from "../../constants/transferAdatper";
import { checkContractAddress } from "../../utils/contractAddressChecker";
import { getRfqPrice, getRfqQuote, getUserIsBlocked, pingUserAddress } from "../../redux/gateway";
import { PriceRequest, QuoteRequest, QuoteResponse } from "../../proto/sdk/service/rfq/user_pb";
import { Token } from "../../proto/sdk/common/token_pb";
import RfqTransDetail from "./RfqTransDetail";
import { ModalName, openModal } from "../../redux/modalSlice";
import { Price } from "../../proto/sdk/service/rfqmm/api_pb";
import getReceivedToken from "../../utils/getReceivedToken";
import warning from "../../images/warning.svg";
import {
  findCircleBridgeProxyContractAddress,
  shouldUseCircleUSDCBridge,
} from "../../helpers/circleUSDCTransferHelper";
import { loadContract } from "../../hooks/customContractLoader";
import { CircleBridgeProxy, CircleBridgeProxy__factory } from "../../typechain/typechain";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  balanceText: {
    textDecoration: "underline",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  countdown: {
    fontSize: 14,
    fontWeight: 600,
  },
  explanation: {
    color: theme.infoSuccess,
    marginBottom: 24,
  },
  historyDetail: {
    width: "100%",
  },
  detailItem: {
    borderBottom: `1px solid ${theme.infoSuccess}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    padding: "12px 0",
  },
  detailItemBto: {
    borderBottom: `1px solid ${theme.infoSuccess}`,
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
    fontSize: 16,
    color: theme.infoSuccess,
  },
  itemTextDes: {
    fontSize: 12,
    color: theme.infoSuccess,
  },
  totalValue: {
    fontSize: 16,
    color: "#FC5656",
  },
  totalValueRN: {
    fontSize: 16,
    color: "#00d395",
  },
  fromNet: {
    fontSize: 12,
    color: theme.infoSuccess,
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
  modalTop: {},
  modalTopDes: {
    fontSize: 14,
  },
  modalTopTitle: {
    fontSize: 12,
    width: "100%",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  addrCheckWarning: {
    backgroundColor: "#fff",
    borderRadius: 4,
    color: "#17171A",
    fontSize: 14,
    padding: "8px 15px",
    marginBottom: 40,
    display: "flex",
    alignItems: "center",
  },
  transferdes: {
    fontSize: 12,
    width: "100%",
    textAlign: "center",
    marginBottom: props => (props.isMobile ? 0 : 20),
    fontWeight: 400,
    color: theme.surfacePrimary,
  },
  transferde2: {
    color: theme.infoWarning,
    textAlign: "center",
    background: "#fff",
    borderRadius: 12,
    padding: "8px 12px",
    fontWeight: 500,
  },
  modalToptext: {
    fontSize: 15,
    width: "100%",
    textAlign: "center",
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  modalToptext2: {
    fontSize: 16,
    width: "100%",
    textAlign: "center",
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  modalTopTitleNotice: {
    fontSize: 14,
    fontWeight: 400,
    width: "100%",
    textAlign: "center",
    marginBottom: 20,
  },
  modalTopIcon: {
    fontSize: 16,
    fontWeight: 600,
    width: "100%",
    textAlign: "center",
    marginTop: props => (props.isMobile ? 18 : 40),
    marginBottom: props => (props.isMobile ? 18 : 40),
    "&img": {
      width: 90,
    },
  },
  modalSuccessIcon: {
    fontSize: 70,
    fontWeight: "bold",
    color: theme.transferSuccess,
  },
  addToken: {
    color: "#00E096",
    fontSize: 12,
    padding: "10px 10px",
    borderRadius: "100px",
    background: theme.primaryBackground,
    display: "flex",
    width: "auto",
    alignItems: "center",
    cursor: "pointer",
    justifyContent: "center",
    marginTop: 40,
  },
  button: {
    marginTop: props => (props.isMobile ? 16 : 40),
    height: 56,
    lineHeight: "42px",
    background: theme.primaryBrand,
    borderRadius: 16,
    fontSize: 18,
    fontWeight: 500,
    borderWidth: 0,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  resultText: {
    color: theme.surfacePrimary,
  },
  modaldes: {
    color: theme.surfacePrimary,
    marginTop: props => (props.isMobile ? 16 : 40),
    fontSize: 15,
    textAlign: "center",
  },
  modaldes2: {
    color: theme.surfacePrimary,
    marginTop: props => (props.isMobile ? 16 : 70),
    fontSize: 15,
    textAlign: "center",
  },
  transferModal: {
    minWidth: props => (props.isMobile ? "100%" : 448),
    background: theme.secondBackground,
    border: `1px solid ${theme.primaryBackground}`,
    "& .ant-modal-content": {
      background: theme.secondBackground,
      boxShadow: props => (props.isMobile ? "none" : ""),
      "& .ant-modal-close": {
        color: theme.surfacePrimary,
      },
      "& .ant-modal-header": {
        background: theme.secondBackground,
        borderBottom: "none",
        "& .ant-modal-title": {
          color: theme.surfacePrimary,
          "& .ant-typography": {
            color: theme.surfacePrimary,
          },
        },
      },
      "& .ant-modal-body": {
        minHeight: 260,
      },
      "& .ant-modal-footer": {
        border: "none",
        "& .ant-btn-link": {
          color: theme.primaryBrand,
        },
      },
    },
    "& .ant-typography": {
      color: theme.surfacePrimary,
    },
  },
  warningInnerbody: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errInnerbody: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: theme.unityBlack,
    fontWeight: 500,
    maxWidth: 360,
    fontSize: 14,
  },
  viewInExplorerWrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    fontWeight: 700,
    fontSize: 12,
    marginTop: 18,
  },
  countDownItem: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: 400,
    color: theme.surfacePrimary,
    marginTop: 10,
  },
  countDownIcon: {
    width: 20,
    height: 20,
    marginRight: 3,
    marginBottom: 2,
  },
  countDowntime: {
    display: "inline-block",
    color: `${theme.infoSuccess} !important`,
  },
}));

const TRANSFER = "transfer";
const BRIDGE_RATE_UPDATED = "bridgeRateUpdated";
const BRIDGE_NO_ROUTE = "bridgeNoRoute";
const SHOW_APTOS_ONBOARDING = "showAptosOnboarding";

interface IProps {
  amount: string;
  receiveAmount: number;
  nonEVMReceiverAddress: string;
  pegSupply?: PegTokenSupply;
  onCancel: () => void;
  onSuccess: () => void;
  latencyMinutes: string | null;
  isBigAmountDelayed: boolean;
  delayMinutes: string | undefined;
  feeRebateDescription: string | undefined;
  isRfq: boolean;
  shouldShowAptosOnboardingFlow: boolean;
  selectedDestinationChainToken: TokenInfo | undefined;
}

let countDownInterval;
const TransferModal: FC<IProps> = props => {
  const {
    amount,
    receiveAmount,
    nonEVMReceiverAddress,
    pegSupply,
    onCancel,
    onSuccess,
    latencyMinutes,
    isBigAmountDelayed,
    delayMinutes,
    feeRebateDescription,
    isRfq,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    shouldShowAptosOnboardingFlow,
    selectedDestinationChainToken,
  } = props;
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { contracts, transactor } = useContractsContext();
  const { bridge, rfqContract } = contracts;
  const { provider, address, chainId, signer, getNetworkById } = useWeb3Context();
  const dispatch = useAppDispatch();
  const { transferInfo, modal } = useAppSelector(state => state);
  const { showTransferModal } = modal;
  const {
    transferConfig,
    fromChain,
    toChain,
    selectedToken,
    estimateAmtInfoInState,
    rate,
    flowTokenPathConfigs,
    isFromSEO,
    rfqConfig,
    priceResponse,
    circleUSDCConfig,
    disableTransferAddlqAggregatelqAction,
  } = transferInfo;
  const [leftTimes, setLeftTimes] = useState<number>(0);

  const getTokenByChainAndTokenSymbol = (cId, tokenSymbol) => {
    return transferConfig?.chain_token[cId]?.token?.find(tokenInfo => tokenInfo?.token?.symbol === tokenSymbol);
  };

  const selectedToChain = transferConfig?.chains.find(chain => chain.id === toChain?.id);
  const value = safeParseUnits(amount || "0", selectedToken?.token?.decimal ?? 18);

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

  // token contract: param address is selected token's address
  const pegConfig = usePeggedPairConfig();
  const { multiBurnConfig } = useMultiBurnConfig();

  const tokenAddress = getTokenBalanceAddress(
    selectedToken?.token?.address || "",
    fromChain?.id,
    selectedToken?.token?.symbol,
    transferConfig.pegged_pair_configs,
  );

  const tokenContract = useCustomContractLoader(provider, tokenAddress || "", ERC20__factory) as ERC20 | undefined;
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);
  const [transfState, setTransfState] = useState<
    TransferHistoryStatus | LPHistoryStatus | "bridgeRateUpdated" | "transfer" | "bridgeNoRoute" | "showAptosOnboarding"
  >(TRANSFER);
  const [loading, setLoading] = useState(false);
  const [newEstimateAmtInfoInState, setNewEstimateAmtInfoInState] = useState<EstimateAmtResponse.AsObject>({
    eqValueTokenAmt: "",
    bridgeRate: 0,
    baseFee: "",
    percFee: "",
    slippageTolerance: 0,
    maxSlippage: 0,
    estimatedReceiveAmt: "",
    dropGasAmt: "",
    opFeeRebate: 0,
    opFeeRebatePortion: 0,
    opFeeRebateEndTime: 0,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quoteInfoInState, setQuetoInfoInState] = useState<QuoteResponse.AsObject | null>();

  const receivedToken = getReceivedToken(fromChain?.id, toChain?.id, pegConfig, multiBurnConfig);
  const showAddrCheckWarning =
    toChain && selectedToken && !isGasToken(toChain.id, selectedToken.token.symbol) && !!receivedToken;

  let detailInter;
  const { themeType } = useContext(ColorThemeContext);
  useEffect(() => {
    const img = new Image();
    img.src = themeType === "dark" ? arrTop : arrTopLightIcon; // To speed up image source loading
    return () => {
      clearInterval(detailInter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isRfq) {
      startCountDown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceResponse]);

  const onHandleCancel = () => {
    clearInterval(countDownInterval);
    clearInterval(detailInter);
    if (transferSuccess) {
      onSuccess();
      onCancel();
    } else {
      onCancel();
    }
  };
  const updateRate = () => {
    dispatch(setEstimateAmtInfoInState(newEstimateAmtInfoInState));
    setTransfState(TRANSFER);
  };

  const queryQuote = async () => {
    if (!fromChain || !toChain || !selectedToken) {
      return;
    }

    const srcToken = rfqConfig.chaintokensList.find(
      rfqChaintoken =>
        rfqChaintoken.tokeninfo?.chainId === fromChain.id &&
        rfqChaintoken.tokeninfo?.symbol === selectedToken?.token?.symbol,
    );
    const dstToken = rfqConfig.chaintokensList.find(
      rfqChaintoken =>
        rfqChaintoken.tokeninfo?.chainId === toChain.id &&
        rfqChaintoken.tokeninfo?.symbol === selectedToken?.token?.symbol,
    );
    const amoutValue = safeParseUnits(amount || "0", srcToken?.tokeninfo?.decimals ?? 0).toString();

    const rfqSrcToken = new Token();
    rfqSrcToken.setChainId(srcToken?.tokeninfo?.chainId ?? 0);
    rfqSrcToken.setSymbol(srcToken?.tokeninfo?.symbol ?? "");
    rfqSrcToken.setAddress(srcToken?.tokeninfo?.address ?? "");
    rfqSrcToken.setDecimals(srcToken?.tokeninfo?.decimals ?? 0);
    rfqSrcToken.setName(srcToken?.tokeninfo?.name ?? "");
    rfqSrcToken.setLogoUri(srcToken?.tokeninfo?.logoUri ?? "");
    const rfqDstToken = new Token();
    rfqDstToken.setChainId(dstToken?.tokeninfo?.chainId ?? 0);
    rfqDstToken.setSymbol(dstToken?.tokeninfo?.symbol ?? "");
    rfqDstToken.setAddress(dstToken?.tokeninfo?.address ?? "");
    rfqDstToken.setDecimals(dstToken?.tokeninfo?.decimals ?? 0);
    rfqDstToken.setName(dstToken?.tokeninfo?.name ?? "");
    rfqDstToken.setLogoUri(dstToken?.tokeninfo?.logoUri ?? "");

    const priceRequest = new PriceRequest();
    priceRequest.setSrcToken(rfqSrcToken);
    priceRequest.setDstToken(rfqDstToken);
    priceRequest.setSrcAmount(amoutValue);
    priceRequest.setDstAmount("");
    console.debug("priceRequest: ", priceRequest.toObject());
    const priceRes = await getRfqPrice(priceRequest);
    console.debug("priceRes: ", priceRes.toObject());

    if (!priceRes.getErr()) {
      setQuetoInfoInState(null);
      if (priceRes.getPrice()) {
        setTransfState(TRANSFER);
        dispatch(setPriceResponse(priceRes.toObject()));
      } else {
        setTransfState(BRIDGE_NO_ROUTE);
      }
    } else {
      console.log("price->error: ", priceRes.getErr());
      setTransfState(BRIDGE_NO_ROUTE);
    }
  };

  const getBigAmountModalMsg = (): string => {
    let time = `${latencyMinutes} minutes`;

    if (isBigAmountDelayed) {
      time = `up to ${delayMinutes} minutes`;
    }
    return `Please allow ${time} for the funds to arrive at your wallet on ${toChain?.name}.`;
  };

  // const getChainInfo = selectedChainId => {
  //   return transferConfig.chains.find(chain => chain.id === selectedChainId);
  // };

  const validateRfqData = () => {
    if (
      !transactor ||
      !fromChain ||
      !toChain ||
      !selectedToken ||
      !rfqContract ||
      !priceResponse ||
      fromChain.id !== chainId
    ) {
      return false;
    }

    if (value.isZero()) {
      return false;
    }

    return true;
  };
  const handleOpenDisabledModal = () => {
    dispatch(openModal(ModalName.disabledModal));
  };

  const handleAction = async () => {
    if (disableTransferAddlqAggregatelqAction) {
      handleOpenDisabledModal();
      return;
    }
    if (!fromChain || !toChain || !selectedToken) {
      return;
    }

    setLoading(true);
    const isBlocked = (await getUserIsBlocked(address, fromChain?.id)).getIsBlocked();
    if (isBlocked) {
      dispatch(openModal(ModalName.userIsBlockedModal));
      setLoading(false);
      return;
    }

    let transferParams: MaxITransfer;
    const useCircleUSDCBridgeAdapter = shouldUseCircleUSDCBridge(
      circleUSDCConfig,
      selectedToken,
      selectedDestinationChainToken,
    );

    if (isRfq && validateRfqData()) {
      let quote = quoteInfoInState?.quote;
      if (!quote) {
        const fromNative = isGasToken(priceResponse?.price?.srcToken?.chainId ?? 0, selectedToken.token.symbol ?? "");
        const toNative = isGasToken(priceResponse?.price?.dstToken?.chainId ?? 0, selectedToken.token.symbol ?? "");

        const srcToken = new Token();
        srcToken.setChainId(priceResponse?.price?.srcToken?.chainId ?? 0);
        srcToken.setSymbol(priceResponse?.price?.srcToken?.symbol ?? "");
        srcToken.setAddress(priceResponse?.price?.srcToken?.address ?? "");
        srcToken.setDecimals(priceResponse?.price?.srcToken?.decimals ?? 0);
        srcToken.setName(priceResponse?.price?.srcToken?.name ?? "");
        srcToken.setLogoUri(priceResponse?.price?.srcToken?.logoUri ?? "");
        const dstToken = new Token();
        dstToken.setChainId(priceResponse?.price?.dstToken?.chainId ?? 0);
        dstToken.setSymbol(priceResponse?.price?.dstToken?.symbol ?? "");
        dstToken.setAddress(priceResponse?.price?.dstToken?.address ?? "");
        dstToken.setDecimals(priceResponse?.price?.dstToken?.decimals ?? 0);
        dstToken.setName(priceResponse?.price?.dstToken?.name ?? "");
        dstToken.setLogoUri(priceResponse?.price?.dstToken?.logoUri ?? "");

        const rfqPrice = new Price();
        rfqPrice.setSrcToken(srcToken);
        rfqPrice.setSrcAmount(priceResponse?.price?.srcAmount ?? "");
        rfqPrice.setDstToken(dstToken);
        rfqPrice.setSrcReleaseAmount(priceResponse?.price?.srcReleaseAmount ?? "");
        rfqPrice.setDstAmount(priceResponse?.price?.dstAmount ?? "");
        rfqPrice.setFeeAmount(priceResponse?.price?.feeAmount ?? "");
        rfqPrice.setValidThru(priceResponse?.price?.validThru ?? 0);
        rfqPrice.setMmAddr(priceResponse?.price?.mmAddr ?? "");
        rfqPrice.setSig(priceResponse?.price?.sig ?? "");
        rfqPrice.setSrcDepositPeriod(priceResponse?.price?.srcDepositPeriod ?? 0);
        rfqPrice.setDstTransferPeriod(priceResponse?.price?.dstTransferPeriod ?? 0);

        const curTime = Number((new Date().getTime() / 1000).toFixed(0));
        const quoteRequest = new QuoteRequest();
        quoteRequest.setPrice(rfqPrice);
        quoteRequest.setMmId(priceResponse?.mmId ?? "");
        quoteRequest.setSender(address);
        quoteRequest.setReceiver(address);
        quoteRequest.setRefundTo(address);
        quoteRequest.setSrcNative(fromNative);
        quoteRequest.setDstNative(toNative);
        quoteRequest.setSrcDeadline((priceResponse?.price?.srcDepositPeriod ?? 0) + curTime);
        quoteRequest.setDstDeadline((priceResponse?.price?.dstTransferPeriod ?? 0) + curTime);

        console.debug("quoteRequest: ", quoteRequest.toObject());
        const quoteRes = await getRfqQuote(quoteRequest);
        console.debug("quoteRes: ", quoteRes.toObject());
        if (!quoteRes.getErr()) {
          quote = quoteRes.toObject()?.quote;
          setQuetoInfoInState(quoteRes.toObject());
        } else {
          setLoading(false);
        }
      }
      if (!quote) {
        setLoading(false);
        return;
      }

      const msgFee = BigNumber.from(priceResponse?.txMsgFee).toHexString();

      transferParams = {
        fromChain,
        toChain,
        isNativeToken: selectedToken?.token.isNative,
        address,
        value,
        selectedToken,
        contracts,
        transactor,
        chainId,
        amount,
        quote,
        msgFee,
        type: "RfqITransfer",
        // no use in this case
        pegConfig,
        pegSupply,
        selectedToChain,
        maxSlippage: 0,
        receiverEVMCompatibleAddress: "",
        toAccount: "",
        dstAddress: "",
        flowTokenPathConfigs,
        nonEVMReceiverAddress,
        circleBridgeProxy: undefined,
        getNetworkById,
      };
    } else if (useCircleUSDCBridgeAdapter) {
      if (address.length > 0) {
        pingUserAddress(address).then(_ => {});
      }

      const receiverEVMCompatibleAddress = nonEVMReceiverAddress;
      const toAccount = address;
      const dstAddress = address;

      const circleBridgeProxy = (await loadContract(
        signer,
        findCircleBridgeProxyContractAddress(circleUSDCConfig, selectedToken.token.chainId ?? 0),
        CircleBridgeProxy__factory,
      )) as CircleBridgeProxy | undefined;

      transferParams = {
        isNativeToken: selectedToken?.token.isNative,
        chainId,
        address,
        fromChain,
        toChain,
        pegConfig,
        pegSupply,
        amount,
        selectedToken,
        selectedToChain,
        value,
        maxSlippage: 0,
        type: "CircleUSDCITransfer",
        receiverEVMCompatibleAddress,
        toAccount,
        dstAddress,
        flowTokenPathConfigs,
        nonEVMReceiverAddress,
        transactor,
        contracts,
        circleBridgeProxy,
        getNetworkById,
      };
    } else {
      const estimateRequest = new EstimateAmtRequest();
      estimateRequest.setSrcChainId(fromChain?.id);
      estimateRequest.setDstChainId(toChain?.id);
      estimateRequest.setTokenSymbol(selectedToken?.token.symbol);
      estimateRequest.setUsrAddr(address);
      estimateRequest.setSlippageTolerance(Number(rate) * 10000);
      estimateRequest.setAmt(value.toString());
      estimateRequest.setIsPegged(pegConfig.mode !== PeggedChainMode.Off || multiBurnConfig !== undefined);

      const res = await gatewayServiceWithGrpcUrlClient.estimateAmt(estimateRequest, null);
      const response = res.toObject();
      if (response.err) {
        message.error(`${response.err?.msg}`);
        console.log("estimateAmt->error: ");
        return;
      }
      if (pegConfig.mode === PeggedChainMode.Off && multiBurnConfig === undefined) {
        if (res.getBridgeRate() !== estimateAmtInfoInState?.bridgeRate) {
          setNewEstimateAmtInfoInState(res.toObject());
          setTransfState(BRIDGE_RATE_UPDATED);
          return;
        }
      }

      /// For security reasons, ping address before sending on-chain transaction
      if (address.length > 0) {
        pingUserAddress(address).then(_ => {});
      }
      if (!transactor || !bridge || !tokenContract || !selectedToken?.token?.address || fromChain.id !== chainId)
        return;

      const receiverEVMCompatibleAddress = nonEVMReceiverAddress;
      const toAccount = receiverEVMCompatibleAddress;
      const dstAddress = address;
      const walletAddress = () => {
        const addr = address;
        return addr;
      };

      transferParams = {
        fromChain,
        toChain,
        isNativeToken: selectedToken.token.isNative,
        address: walletAddress(),
        value,
        selectedToken,
        contracts,
        transactor,
        chainId,
        pegConfig,
        pegSupply,
        amount,
        selectedToChain,
        maxSlippage: res.getMaxSlippage(),
        receiverEVMCompatibleAddress,
        toAccount,
        dstAddress,
        flowTokenPathConfigs,
        nonEVMReceiverAddress,
        circleBridgeProxy: undefined,
        getNetworkById,
      };
    }

    const transferAdapter = transferFactory(transferParams, transferConfig, multiBurnConfig);
    try {
      if (!transferAdapter) return;
      setLoading(true);

      const transferAdapterContractAddress = transferAdapter.getInteractContract();

      checkContractAddress(isTestNet, transferAdapterContractAddress[0], transferAdapterContractAddress[1]);

      /// Special case for transfer agent OTV2 or PegV2
      if (transferAdapterContractAddress.length > 2) {
        checkContractAddress(isTestNet, transferAdapterContractAddress[2], transferAdapterContractAddress[3]);
      }

      transferAdapter
        .transfer()
        ?.then(async transferResponse => {
          const checkSuccess = transferAdapter.isResponseValid(transferResponse);

          if (!checkSuccess) {
            setLoading(false);
          } else {
            transferAdapter.onSuccess(transferResponse);
            const selectedToChainToken =
              selectedDestinationChainToken?.token ??
              getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token?.symbol)?.token;
            if (selectedToChainToken) {
              const transferJson: TransferHistory = {
                dst_block_tx_link: "",
                src_send_info: {
                  amount: safeParseUnits(amount, selectedToken.token.decimal).toString(),
                  chain: fromChain,
                  token: selectedToken.token,
                },
                src_block_tx_link: transferAdapter.srcBlockTxLink,
                dst_received_info: {
                  amount: safeParseUnits(receiveAmount.toString(), selectedToChainToken?.decimal).toString(),
                  chain: toChain,
                  token: selectedToChainToken,
                },
                srcAddress: transferAdapter.senderAddress,
                dstAddress: transferAdapter.receiverAddress,
                status: TransferHistoryStatus.TRANSFER_SUBMITTING,
                bridge_type: isRfq ? BridgeType.BRIDGETYPE_RFQ : BridgeType.BRIDGETYPE_UNKNOWN,
                transfer_id: transferAdapter.transferId,
                ts: useCircleUSDCBridgeAdapter ? new Date().getTime() : transferAdapter.nonce,
                updateTime: transferAdapter.nonce,
                nonce: transferAdapter.nonce,
                isLocal: true,
                txIsFailed: false,
              };
              const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
              let localTransferList: TransferHistory[] = [];
              if (localTransferListJsonStr) {
                localTransferList = JSON.parse(localTransferListJsonStr) || [];
              }
              localTransferList.unshift(transferJson);
              localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
            }
            setTransferSuccess(true);
            setTransfState(TransferHistoryStatus?.TRANSFER_COMPLETED);
            markRefRelation(transferAdapter.transferId);
          }
        })
        .catch(error => {
          console.debug("error", error);
          setLoading(false);
          onHandleCancel();
        });
    } catch (e) {
      console.log("e", e);
      clearInterval(detailInter);
      setLoading(false);
    }
  };

  const markRefRelation = (transferId: string) => {
    const refId = sessionStorage.getItem("refId") ?? "";

    const refIdFromSeo = sessionStorage.getItem("refIdForSeo") ?? "";

    const request = new MarkRefRelationRequest();
    request.setTransferId(transferId);

    if (isFromSEO) {
      request.setRefId(refIdFromSeo);
    } else {
      request.setRefId(refId);
    }

    gatewayServiceWithGrpcUrlClient
      .markRefRelation(request, null)
      .then(_ => {})
      .catch(_ => {});
  };

  const startCountDown = () => {
    clearInterval(countDownInterval);

    let leftT = (priceResponse?.price?.validThru ?? 0) * 1000 - new Date().getTime();
    if (leftT < 0) {
      leftT = 0;
    }
    setLeftTimes(leftT);
    countDownInterval = setInterval(() => {
      if (leftT < 1000) {
        clearInterval(countDownInterval);
        setTransfState(BRIDGE_RATE_UPDATED);
      } else {
        leftT -= 1000;
      }
      setLeftTimes(leftT);
    }, 1000);
  };

  let titleText = "Transfer";
  let content;

  if (transfState === BRIDGE_RATE_UPDATED) {
    content = (
      <>
        {isRfq ? (
          <RfqTransDetail
            amount={amount}
            receiveAmount={receiveAmount}
            latencyMinutes={latencyMinutes}
            isBigAmountDelayed={isBigAmountDelayed}
            delayMinutes={delayMinutes}
          />
        ) : (
          <TransDetail
            amount={amount}
            receiveAmount={receiveAmount}
            receiverAddress={nonEVMReceiverAddress}
            latencyMinutes={latencyMinutes}
            isBigAmountDelayed={isBigAmountDelayed}
            delayMinutes={delayMinutes}
            feeRebateDescription={feeRebateDescription}
            gasOnArrival={undefined}
            selectedDestinationChainToken={selectedDestinationChainToken}
          />
        )}
        <div className={classes.modalTop}>
          <div className={classes.transferde2}>
            <div className={classes.warningInnerbody}>
              <div>
                <WarningFilled style={{ fontSize: 20, marginRight: 5, color: "#ff8f00" }} />
                <span style={{ color: "#17171A" }}>Bridge Rate Updated</span>
              </div>
              <div
                style={{ color: "#3366FF", cursor: "pointer", fontWeight: 700 }}
                onClick={() => {
                  setLoading(false);
                  if (isRfq) {
                    queryQuote();
                  } else {
                    updateRate();
                  }
                }}
              >
                Accept
              </div>
            </div>
          </div>
        </div>
        <Button
          id="confirmTransfer"
          type="primary"
          size="large"
          block
          onClick={() => {}}
          className={classes.button}
          disabled
        >
          Confirm Transfer
        </Button>
      </>
    );
  } else if (transfState === BRIDGE_NO_ROUTE) {
    content = (
      <>
        {isRfq ? (
          <RfqTransDetail
            amount={amount}
            receiveAmount={receiveAmount}
            latencyMinutes={latencyMinutes}
            isBigAmountDelayed={isBigAmountDelayed}
            delayMinutes={delayMinutes}
          />
        ) : (
          <TransDetail
            amount={amount}
            receiveAmount={receiveAmount}
            receiverAddress={nonEVMReceiverAddress}
            latencyMinutes={latencyMinutes}
            isBigAmountDelayed={isBigAmountDelayed}
            delayMinutes={delayMinutes}
            feeRebateDescription={feeRebateDescription}
            gasOnArrival={undefined}
            selectedDestinationChainToken={selectedDestinationChainToken}
          />
        )}
        <div className={classes.modalTop}>
          <div className={classes.transferde2}>
            <div className={classes.warningInnerbody}>
              <div className={classes.errInnerbody}>
                <CloseCircleFilled style={{ fontSize: 20, marginRight: 10, color: "#FF3D71" }} />
                <span style={{ color: "#17171A", textAlign: "left" }}>
                  No route found for your transfer request. You may reduce your amount and try again later.
                </span>
              </div>
              <div
                style={{ color: "#3366FF", cursor: "pointer" }}
                onClick={() => {
                  if (isRfq) {
                    onSuccess();
                  }
                  onHandleCancel();
                }}
              >
                Go Back
              </div>
            </div>
          </div>
        </div>
        <Button
          id="confirmTransfer"
          type="primary"
          size="large"
          block
          onClick={() => {}}
          className={classes.button}
          disabled
        >
          Confirm Transfer
        </Button>
      </>
    );
  } else if (transfState === SHOW_APTOS_ONBOARDING) {
    titleText = "";
  } else if (transfState === TransferHistoryStatus?.TRANSFER_COMPLETED) {
    // Relay - check your fund
    content = (
      <div>
        <div className={classes.modalTopIcon} style={{ marginTop: 80 }}>
          <img src={themeType === "dark" ? arrTop : arrTopLightIcon} height="120" alt="" />
        </div>
        <div>
          <div className={classes.modalToptext2}>Transfer Submitted.</div>
          <div className={classes.modaldes}>{getBigAmountModalMsg()}</div>
        </div>
        <Button
          type="primary"
          size="large"
          block
          // loading={loading}
          onClick={() => {
            setTransfState(TRANSFER);
            onHandleCancel();
          }}
          className={classes.button}
        >
          Done
        </Button>
      </div>
    );
    titleText = "";
  } else {
    content = (
      <>
        {isRfq ? (
          <RfqTransDetail
            amount={amount}
            receiveAmount={receiveAmount}
            latencyMinutes={latencyMinutes}
            isBigAmountDelayed={isBigAmountDelayed}
            delayMinutes={delayMinutes}
          />
        ) : (
          <TransDetail
            amount={amount}
            receiveAmount={receiveAmount}
            receiverAddress={nonEVMReceiverAddress}
            latencyMinutes={latencyMinutes}
            isBigAmountDelayed={isBigAmountDelayed}
            delayMinutes={delayMinutes}
            feeRebateDescription={feeRebateDescription}
            gasOnArrival={undefined}
            selectedDestinationChainToken={selectedDestinationChainToken}
          />
        )}

        {showAddrCheckWarning && (
          <div className={classes.addrCheckWarning}>
            <img style={{ width: 18, marginRight: 10 }} src={warning} alt="warning" />
            <div>Please double check the received token address before making the transfer.</div>
          </div>
        )}

        <div className={classes.modalTop} hidden={arrivalGasTokenAmount.lte(0)}>
          <div className={classes.transferdes}>
            You will also receive{" "}
            <span style={{ color: "#ff8f00" }}>
              {arrivalGasTokenAmountDisplay} {arrivalGasTokenSymbol}
            </span>{" "}
            to pay gas fee on {toChain?.name}
          </div>
        </div>
        <Button
          id="confirmTransfer"
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => {
            handleAction();
          }}
          disabled={loading}
          className={classes.button}
          style={{ marginTop: 0 }}
        >
          Confirm Transfer
        </Button>
        {isRfq && (
          <div className={classes.countDownItem}>
            <img className={classes.countDownIcon} src={clockPng} alt="" />
            This quote will expire in <span style={{ color: "#00E096" }}>{moment(leftTimes).format("mm:ss")}</span>{" "}
          </div>
        )}
      </>
    );
  }
  return (
    <Modal
      title={titleText}
      onCancel={onHandleCancel}
      visible={showTransferModal}
      footer={null}
      className={classes.transferModal}
      maskClosable={false}
    >
      {content}
    </Modal>
  );
};

TransferModal.defaultProps = {
  pegSupply: undefined,
};

export default TransferModal;
