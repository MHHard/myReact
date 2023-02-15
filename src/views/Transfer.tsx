import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Card, Button, Avatar, Tooltip, Modal, message } from "antd";
import { createUseStyles } from "react-jss";
import { useToggle, useNetworkState, useAsync } from "react-use";
import { formatUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { MaxUint256 } from "@ethersproject/constants";
import { debounce } from "lodash";
import { WarningFilled, InfoCircleOutlined, DownOutlined, CloseCircleFilled } from "@ant-design/icons";
import { deleteDecimalPart, safeParseUnits, formatDecimalPart, sub } from "celer-web-utils/lib/format";

import classNames from "classnames";
import { parseUnits } from "ethers/lib/utils";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ERC20 } from "../typechain/typechain/ERC20";
import { ERC20__factory } from "../typechain/typechain/factories/ERC20__factory";

import { useContractsContext } from "../providers/ContractsContextProvider";
import { useWeb3Context } from "../providers/Web3ContextProvider";

import { useAppDispatch, useAppSelector } from "../redux/store";
import { closeModal, ModalName, openModal } from "../redux/modalSlice";

import {
  setIsChainShow,
  setChainSource,
  setTokenList,
  setFromChain,
  setToChain,
  setSelectedToken,
  setSelectedTokenSymbol,
  switchChain,
  setEstimateAmtInfoInState,
  setRefreshHistory,
  setPriceResponse,
} from "../redux/transferSlice";

import {
  useCustomContractLoader,
  useTokenBalance,
  useNativeETHToken,
  useNonEVMTokenBalance,
  useReadOnlyCustomContractLoader,
} from "../hooks";
import { formatDecimal } from "../helpers/format";
import { BridgeType, TokenInfo, TransferPair } from "../constants/type";
import { getNetworkById } from "../constants/network";
import { validFloatRegex } from "../constants/regex";
import { Theme } from "../theme";

import ProviderModal from "../components/ProviderModal";
import TransferModal from "../components/transfer/TransferModal";
import TokenInput, { ITokenInputChangeEvent } from "../components/TokenInput";
import TokenList from "../components/transfer/TokenList";
import NonEVMChainTokenList from "../components/transfer/NonEVMChainTokenList";
import FlowProviderModal from "../components/nonEVM/FlowProviderModal";
import AptosProviderModal from "../components/nonEVM/AptosProviderModal";

import settingIcon from "../images/setting.svg";
import arrowUpDowm from "../images/arrowupdown.svg";
import arrowDowm from "../images/arrow-D.svg";
import RateModal from "../components/RateModal";
import TransferOverview, { getTokenDisplaySymbol } from "./transfer/TransferOverview";
import { EstimateAmtRequest, ErrCode, EstimateAmtResponse } from "../proto/gateway/gateway_pb";
import { getTokenSymbol, getTokenListSymbol } from "../redux/assetSlice";
import { PeggedChainMode, usePeggedPairConfig, GetPeggedMode } from "../hooks/usePeggedPairConfig";
import { useTransferSupportedTokenList } from "../hooks/transferSupportedInfoList";
import { useWalletConnectionContext } from "../providers/WalletConnectionContextProvider";
import {
  NonEVMMode,
  useNonEVMContext,
  isNonEVMChain,
  getNonEVMMode,
  isAptosChain,
} from "../providers/NonEVMContextProvider";
import { checkTokenReceivabilityForFlowAccount, setupTokenVaultForFlowAccount } from "../redux/NonEVMAPIs/flowAPIs";
import { useMultiBurnConfig } from "../hooks/useMultiBurnConfig";
import { isApeChain } from "../hooks/useTransfer";
import { ApeTip } from "./nft/ApeTips";
import { useBridgeChainTokensContext } from "../providers/BridgeChainTokensProvider";
import { useSafeGuardCheck } from "../hooks/useSafeGuardChecker";
import { PegTokenSupply, usePegV2Transition } from "../hooks/usePegV2Transition";
import { gatewayServiceWithGrpcUrlClient } from "../redux/grpcClients";
import { getTokenUnitPriceInUSD } from "../helpers/tokenPriceCalculation";
import { getRfqPrice, getTransferLatency } from "../redux/gateway";
import { PriceRequest, PriceResponse } from "../proto/sdk/service/rfq/user_pb";
import { Token } from "../proto/sdk/common/token_pb";
import RfqTransferOverview from "./transfer/RfqTransferOverview";
import { getAptosResources, registerTokenForAptosAccount } from "../redux/NonEVMAPIs/aptosAPIs";
import SwitchAptosEnvModal from "../components/rewards/SwitchAptosEnvModal ";

/* eslint-disable */
/* eslint-disable camelcase */
const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  flexCenter: {
    display: "flex",
    flexFlow: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  transferCard: {
    position: "relative",
    width: "100%",
    maxWidth: 560,
    marginTop: props => (props.isMobile ? 0 : 45),
    borderRadius: props => (props.isMobile ? 0 : 16),
    background: props => (props.isMobile ? "transparent" : theme.secondBackground),
    border: props => (props.isMobile ? "none" : `1px solid ${theme.primaryBorder}`),
    "& .ant-card-head": {
      color: theme.primaryBrand,
      fontSize: 22,
      borderBottom: `1px solid ${theme.primaryBorder}`,
      padding: "30px 32px 10px 32px",
      fontWeight: 700,
    },
    "& .ant-card-body": {
      padding: props => (props.isMobile ? "18px 16px 24px 16px" : 32),
    },
    "& .ant-card-head-title": {
      padding: "0",
      lineHeight: 1,
      marginBottom: 7,
      height: "25px",
    },
    "& .ant-card-extra": {
      padding: "0",
      lineHeight: 1,
    },
  },
  settingIcon: {
    width: 24,
    filter: `brightness(${theme.isLight ? 0 : 100})`,
  },
  contCover: {
    width: "100%",
    height: "100%",
    borderRadius: "12px",
    background: theme.transferCover,
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 10,
  },
  cardContent: {
    position: "relative",
    width: props => (props.isMobile ? "100%" : 496),
  },
  trans: {},
  err: {
    width: "100%",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    minHeight: props => (props.isMobile ? 0 : 24),
  },
  btnare: {
    position: "absolute",
    width: "100%",
    top: 0,
    left: 0,
    zIndex: 15,
  },
  btnarein: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  buttonBg: {
    width: "100%",
  },
  createflowBtn: {
    marginBottom: "20px !important",
  },
  approveBg: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  approveBgMobile: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20,
  },

  approveTransBtn: {
    width: "49%",
    margin: "0",
    height: 56,
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 16,
    background: theme.primaryBrand,
    border: 0,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },

  transBtn: {
    // width: 560,
    width: "100%",
    margin: "0",
    height: 56,
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 16,
    background: theme.primaryBrand,
    border: 0,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  cont: {
    width: "100%",
    //  fontSize: theme.transferFontS,
  },
  transMobileBtn: {
    marginTop: 20,
    width: "100%",
    height: 55,
    fontSize: 14,
    borderRadius: 16,
    background: theme.primaryBrand,
    border: 0,
    fontWeight: 700,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  transitem: {},
  transitemTitle: {
    //   background: theme.dark.contentBackground,
    color: theme.surfacePrimary,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // padding: "0 12px",
  },
  transcontent: {
    borderRadius: "16px",
    background: theme.primaryBackground,
    padding: "15px 0",
    marginTop: 8,
  },
  transInfoItem: {
    display: "flex",
    justifyContent: "space-between",
  },
  transInfoTitle: {
    color: theme.secondBrand,
    fontSize: 12,
    fontWeight: 600,
  },
  transInfoContent: {
    color: theme.unityBlack,
    fontSize: 12,
    fontWeight: 600,
    "& img": {
      width: 16,
      height: 16,
    },
  },
  icon: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: props => (props.isMobile ? "17px 0" : "13px 0"),
  },
  source: {
    display: "inline-block",
    marginRight: 8,
    fontSize: 14,
    width: props => (props.isMobile ? "" : 35),
  },
  transselect: {
    background: theme.primaryBackground,
    display: "inline-block",
    minWidth: 100,
    borderRadius: 100,
    cursor: "pointer",
  },
  transChainame: {
    fontSize: props => (props.isMobile ? 12 : 14),
    fontWeight: props => (props.isMobile ? 400 : 500),
    textAlign: props => (props.isMobile ? "right" : ""),
  },
  transnum: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    marginTop: 3,
    color: theme.secondBrand,
  },
  transnumtext: {
    fontSize: 12,
    fontWeight: 600,
    float: "left",
    color: theme.secondBrand,
  },
  transnumlimt: {
    borderBottom: "1px solid #8F9BB3",
    cursor: "pointer",
    fontSize: 12,
  },

  nonEvmRecipientText: {
    fontSize: 12,
    fontWeight: 600,
    display: "flex",
    color: theme.secondBrand,
    padding: "0 12px",
  },

  transndes: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    marginTop: 18,
    fontSize: 20,
  },
  transdestext: {
    //   fontSize: theme.transferFontXl,
    color: theme.surfacePrimary,
    float: "left",
    flex: 2,
    "& .ant-input::-webkit-input-placeholder": {
      color: `${theme.surfacePrimary} !important`,
    },
  },
  nonEvmAddressText: {
    color: theme.surfacePrimary,
    float: "left",
    flex: 2,
    "& .ant-input": {
      width: "100%",
      fontSize: 14,
      fontWeight: 600,
    },
    "& .ant-input::-webkit-input-placeholder": {
      color: `${theme.selectChainBorder} !important`,
    },

    "& .ant-input[disabled]": {
      color: `${theme.surfacePrimary} !important`,
    },
  },
  transdeslimt: {
    position: "relative",
    flex: 1,
  },
  investSelct: {
    display: "flex",
    position: "absolute",
    top: -13,
    right: 0,
    alignItems: "baseline",
    cursor: "pointer",
  },
  selectpic: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    "& img": {
      width: "100%",
      borderRadius: "50%",
    },
  },
  selectdes: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 16,
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  selecttoog: {
    height: 14,
    color: theme.surfacePrimary,
  },

  chainSelcet: {
    borderRadius: 16,
    background: theme.primaryBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 8,
    paddingRight: 10,
    height: 40,
    fontSize: 16,
    fontWeight: 600,
  },
  msgBoldInnerbody: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    color: "#17171A",
    fontWeight: "bold",
    textAlign: "left",
    margin: "8px 12px",
  },

  warningMessage: {
    color: theme.textWarning,
  },
  errInner: {
    color: theme.infoDanger,
    textAlign: "left",
    margin: props => (props.isMobile ? "24px 0 0 0" : "24px 0"),
    background: "#fff",
    boxShadow: "0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)",
    borderRadius: 8,
    fontSize: 14,
  },
  errMessage: {
    width: "100vw",
    position: "fixed",
    top: 122,
    left: 0,
    textAlign: "center",
  },
  errMessageMobile: {
    width: "calc(100vw - 32px)",
    position: "relative",
    top: -45,
    left: 0,
    textAlign: "center",
  },
  messageBody: {
    fontSize: 16,
    padding: "8px 15px",
    background: "#fff",
    //   width: theme.tipsWidth,
    borderRadius: 12,
    margin: "0 auto",
    // textAlign: "left",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  setting: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 432,
    height: 156,
    background: theme.secondBackground,
    borderRadius: 16,
    border: `1px solid ${theme.primaryBorder}`,
  },
  settingTitle: {
    color: theme.surfacePrimary,
    fontSize: 13,
  },
  settingContent: {},
  transcontenttip: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.unityBlack,
  },
  tipTitle: {
    fontSize: 13,
    width: "100%",
    textAlign: "center",
    fontWeight: 400,
    marginBottom: 10,
  },
  mobileTooltipOverlayStyle: {
    "& .ant-tooltip-inner": {
      width: "calc(100vw - 40px) !important",
      borderRadius: 8,
    },
    "& .ant-tooltip-arrow-content": {
      width: 9,
      height: 9,
    },
  },
  mobileRateModal: {
    width: "calc(100% - 32px)",
    minWidth: "calc(100% - 32px)",
    border: `1px solid ${theme.primaryBorder}`,
    borderRadius: 16,
    height: "auto",
    margin: 8,
    "& .ant-modal-content": {
      background: theme.primaryBackground,
      borderRadius: 16,
      "& .ant-modal-header": {
        background: "transparent",
        borderRadius: 16,
      },
      "& .ant-modal-body": {
        padding: "16px 16px",
        background: "transparent",
      },
    },
  },
  safeguardToastBox: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 11,
    width: "100%",
    borderRadius: 4,
    padding: "8px 12px 8px 12px",
    background: theme.primaryBackground,
  },
  errorMsg: {
    fontSize: 14,
    color: theme.infoDanger,
    textAlign: "left",
  },
  warningMsg: {
    fontSize: 14,
    color: theme.infoWarning,
    textAlign: "left",
  },
  receiveLabel: {
    display: props => (props.isMobile ? "block" : "flex"),
    alignItems: "center",
  },
  feeRebate: {
    backgroundColor: theme.feeRebateBg,
    color: theme.feeRebateText,
    fontSize: 12,
    borderRadius: 100,
    padding: "0 6px",
    height: 24,
    lineHeight: 24,
    marginLeft: props => (props.isMobile ? 0 : 12),
    display: "flex",
    alignItems: "center",
  },
  opRebateTooltip: {
    "& .ant-tooltip-inner": {
      padding: "9px 12px",
    },
  },
  tooltipContent: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.unityBlack,
  },
  infoIcon: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.feeRebateText,
  },
}));

let aptosResourcesQueryTimer: NodeJS.Timer;

const Transfer: FC = () => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const {
    contracts: {
      bridge,
      originalTokenVault,
      originalTokenVaultV2,
      peggedTokenBridge,
      peggedTokenBridgeV2,
      transferAgent,
      rfqContract,
    },
    transactor,
  } = useContractsContext();
  const { provider, signer, chainId, address } = useWeb3Context();
  const { connected, walletConnectionButtonTitle } = useWalletConnectionContext();
  const dispatch = useAppDispatch();
  const networkState = useNetworkState();
  const { transferInfo, modal, globalInfo, serviceInfo } = useAppSelector(state => state);
  const { refreshGlobalTokenBalance } = globalInfo;
  const { transferRelatedFeatureDisabled } = serviceInfo;
  // const globalTokenBalance = BigNumber.from(globalTokenBalanceString);
  const { showProviderModal, showRateModal, showTransferModal, showFlowProviderModal, showAptosProviderModal } = modal;
  const {
    transferConfig,
    fromChain,
    toChain,
    tokenList,
    selectedToken,
    estimateAmtInfoInState,
    priceResponse,
    rate,
    refreshHistory,
    flowTokenPathConfigs,
    priceOfTokens,
    rfqConfig,
  } = transferInfo;
  const pegConfig = usePeggedPairConfig();
  const { multiBurnConfig, multiBurnSpenderAddress } = useMultiBurnConfig();
  const [isBridgeRateTooLow, setIsBridgeRateTooLow] = useState(false);

  // selectedToken?.token?.address || "",

  const tokenAddress = pegConfig.getTokenBalanceAddress(
    selectedToken?.token?.address || "",
    fromChain?.id,
    selectedToken?.token.symbol,
    transferConfig.pegged_pair_configs,
  );

  const jsonRPCProvider = useMemo(() => {
    if (fromChain?.id) {
      if (isNonEVMChain(fromChain?.id ?? 0)) {
        return undefined;
      }
      return new JsonRpcProvider(getNetworkById(fromChain.id).rpcUrl);
    }
    return undefined;
  }, [fromChain?.id]);

  const tokenContract = useCustomContractLoader(provider, tokenAddress, ERC20__factory) as ERC20 | undefined;

  const readOnlyTokenContract = useReadOnlyCustomContractLoader(jsonRPCProvider, tokenAddress, ERC20__factory) as
    | ERC20
    | undefined;

  const [tokenBalance, balanceLoading, , refreshBalance] = useTokenBalance(
    readOnlyTokenContract,
    address,
    fromChain?.id,
  );
  const [amount, setAmount] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [exceedsSafeguard, setExceedsSafeguard] = useState(true);
  const [errorMsg, setErrorMsg] = useState<JSX.Element>(<div />);
  const [hasError, setHasError] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [createFlowBtnLoading, setCreateFlowBtnLoading] = useState(false);
  const [isTokenShow, toggleIsTokenShow] = useToggle(false);
  const [fee, setFee] = useState(0);
  const [tokenEnabled, setTokenEnabled] = useState(true);
  const [tokenPaused, setTokenPaused] = useState(false);
  const [estimateAmtErrMsg, setEstimateAmtErrMsg] = useState("");
  const { isNativeToken, ETHBalance } = useNativeETHToken(fromChain, selectedToken);
  const [noTokenOnDst, setNoTokenOnDst] = useState(false);
  const [userBalance, setUserBalance] = useState<string>("0");
  const [denyPeg, setDenyPeg] = useState(false);
  const [spenderAddr, setSpenderAddr] = useState<string>();
  const [cbridgeAllowance, setCbridgeAllowance] = useState<BigNumber>();
  const [rfqAllowance, setRfqAllowance] = useState<BigNumber>();
  const [allowance, setAllowance] = useState<BigNumber>();
  const [latencyMinutes, setLatencyMinutes] = useState<string>("0");

  // allowance for v0 -> v2 transition
  const [allowanceForPegV2Contract, setAllowanceForPegV2Contract] = useState<BigNumber>();
  const [allowanceForPegV0Contract, setAllowanceForPegV0Contract] = useState<BigNumber>();
  const [pegTokenSupply, setPegTokenSupply] = useState<PegTokenSupply>();

  const [hasGotAllowance, setHasGotAllowance] = useState(false);
  const [refreshSafeGuardCheck, toggleRefreshSafeGuardCheck] = useToggle(false);
  const [hasShowGotAllowance, setHasShowGotAllowance] = useState(false);
  const { supportTokenList } = useTransferSupportedTokenList();
  const {
    nonEVMMode,
    flowConnected,
    aptosConnected,
    flowAddress,
    aptosAddress,
    seiAddress,
    injAddress,
    nonEVMConnected,
    nonEVMAddress,
    seiConnected,
    injConnected,
    shouldNotifyUserSwitchToCorrectWalletEndpoint,
    setFlowInToChain,
    setAptosInToChain,
    signAndSubmitTransaction,
  } = useNonEVMContext();
  // when bridge from nonevm chain to evm chain, if the evm wallet not connected,
  // user must to input the evm wallet address.
  const [nonEVMRecipientAddress, setNonEVMRecipientAddress] = useState<string>("");
  const [flowAccountInitialized, setFlowAccountInitialized] = useState(false);
  const [aptosTokenRegistered, setAptosTokenRegistered] = useState(false);
  const [registerAptosTokenLoading, setRegisterAptosTokenLoading] = useState(false);
  const [nonEVMTokenBalance] = useNonEVMTokenBalance();
  const [shouldShowSwitchAptosEndpoint, setShouldShowSwitchAptosEndpointModal] = useState(false);
  const [transactionFeeRebateDescription, setTransactionFeeRebateDescription] = useState("");
  const [opFeeRebatePortion, setOpFeeRebatePortion] = useState(0);
  const [shouldShowResourceRegistrationButton, setShouldShowResourceRegistrationButton] = useState(false);

  const [aptosResources, setAptosResources] = useState<any | undefined>(undefined);
  const [shouldShowAptosOnboardingFlow, setShouldShowAptosOnboardingFlow] = useState(false);

  const getTokenByChainAndTokenSymbol = (chainId, tokenSymbol) => {
    return transferConfig?.chain_token[chainId]?.token.find(tokenInfo => tokenInfo?.token?.symbol === tokenSymbol);
  };

  const { getTransferPair, getTransferSnapshot } = useBridgeChainTokensContext();

  const [transferPair, setTransferPair] = useState<TransferPair>(
    getTransferPair(transferConfig, fromChain?.id, toChain?.id, selectedToken?.token.symbol ?? ""),
  );

  const { safeGuardParameters, safeguardException, isSafeGuardTaskInProgress } = useSafeGuardCheck(transferPair);

  const { onPegSupplyCallback } = usePegV2Transition();

  const [isPegSupplyLoading, setIsPegSupplyLoading] = useState<boolean>(false);
  const [isRfq, setIsRfq] = useState<boolean>(false);
  const [isEstimateEnd, setIsEstimateEnd] = useState<boolean>(false);
  const sourceChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
  const toChainNonEVMMode = getNonEVMMode(toChain?.id ?? 0);
  const disableForResourceRegistrationChainReceiver =
    toChainNonEVMMode === NonEVMMode.flowMainnet ||
    toChainNonEVMMode === NonEVMMode.flowTest ||
    toChainNonEVMMode === NonEVMMode.aptosMainnet ||
    toChainNonEVMMode === NonEVMMode.aptosTest ||
    toChainNonEVMMode === NonEVMMode.aptosDevnet ||
    toChainNonEVMMode === NonEVMMode.seiMainnet ||
    toChainNonEVMMode === NonEVMMode.seiDevnet ||
    toChainNonEVMMode === NonEVMMode.seiTestnet;
  let showBalancePlaceHolderForNonEVMChain = false;
  switch (sourceChainNonEVMMode) {
    case NonEVMMode.flowMainnet:
    case NonEVMMode.flowTest: {
      showBalancePlaceHolderForNonEVMChain = !flowConnected || !flowAccountInitialized;
      break;
    }
    case NonEVMMode.aptosMainnet:
    case NonEVMMode.aptosTest:
    case NonEVMMode.aptosDevnet: {
      showBalancePlaceHolderForNonEVMChain = !aptosConnected || !aptosTokenRegistered;
      break;
    }
  }

  useEffect(() => {
    const transferPair = getTransferPair(transferConfig, fromChain?.id, toChain?.id, selectedToken?.token.symbol ?? "");
    setTransferPair(transferPair);
  }, [fromChain, toChain, selectedToken, transferConfig, refreshSafeGuardCheck]);
  useAsync(async () => {
    if (fromChain && toChain) {
      const res = await getTransferLatency(fromChain?.id, toChain?.id);
      if (!res?.data?.err) {
        const minutes = Number(res?.data?.median_transfer_latency_in_second) / 60;
        setLatencyMinutes(minutes?.toFixed(0));
      }
    }
  }, [fromChain, toChain]);
  useEffect(() => {
    const loadPegSupply = async () => {
      if (onPegSupplyCallback === null) {
        return;
      }
      setIsPegSupplyLoading(true);
      const result = await onPegSupplyCallback();
      console.debug("onPegSupplyCallback", result);
      setPegTokenSupply(result);
      setIsPegSupplyLoading(false);
    };

    loadPegSupply();
  }, [onPegSupplyCallback]);

  useEffect(() => {
    const getPegV0AndV2Allowance = async () => {
      if (!selectedToken || !pegConfig || !tokenContract || !address) {
        return;
      }
      if (pegConfig.mode === PeggedChainMode.TransitionPegV2) {
        const allowanceApprovedToV0 = await tokenContract.allowance(
          address,
          pegConfig.config.migration_peg_burn_contract_addr,
        );
        const allowanceApprovedToV2 = await tokenContract.allowance(
          address,
          pegConfig.config.pegged_burn_contract_addr,
        );
        setAllowanceForPegV0Contract(allowanceApprovedToV0);
        setAllowanceForPegV2Contract(allowanceApprovedToV2);
      }
    };
    getPegV0AndV2Allowance();
  }, [selectedToken, pegConfig, tokenContract, address]);

  useEffect(() => {
    setAllowance(isRfq ? rfqAllowance : cbridgeAllowance);
  }, [rfqAllowance, cbridgeAllowance, isRfq]);

  const getAllowance = useCallback(async () => {
    let multiBurnConfigConditionFailure = false;
    if (multiBurnConfig) {
      if (multiBurnConfig.burn_config_as_org.canonical_token_contract_addr.length === 0) {
        multiBurnConfigConditionFailure = multiBurnConfig.burn_config_as_org.burn_contract_addr !== spenderAddr;
      } else {
        multiBurnConfigConditionFailure = multiBurnConfig.burn_config_as_org.token.token.address !== spenderAddr;
      }
    }

    let skipCheckForAptosAsDestination = false;

    switch (nonEVMMode) {
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        skipCheckForAptosAsDestination = true;
        break;
      }
      default: {
        break;
      }
    }

    if (!isRfq && !skipCheckForAptosAsDestination) {
      if (
        !tokenContract ||
        !address ||
        !spenderAddr ||
        fromChain?.id !== chainId ||
        multiBurnConfigConditionFailure ||
        (pegConfig.mode === PeggedChainMode.Off &&
          multiBurnConfig === undefined &&
          fromChain.contract_addr !== spenderAddr) ||
        (pegConfig.mode === PeggedChainMode.Deposit && pegConfig.config.pegged_deposit_contract_addr !== spenderAddr) ||
        (pegConfig.mode === PeggedChainMode.Burn && pegConfig.config.pegged_burn_contract_addr !== spenderAddr) ||
        (pegConfig.mode === PeggedChainMode.BurnThenSwap &&
          pegConfig.config.pegged_token.token.address !== spenderAddr) ||
        tokenContract.address !== tokenAddress
      ) {
        setApproveLoading(false);
        return;
      }
    }
    if (!spenderAddr) {
      return;
    }

    // fix nervos chain can't get balance who has not register the L2 account,
    // error: from id not found by from address:xx have you deposited?
    let overrides = {};
    if (fromChain?.id === 71402) {
      overrides = { from: "0x9FEaB89C449C90282c93D0b532029eFA72eA00c8" };
    }

    try {
      const cbridgeApprove = await readOnlyTokenContract?.allowance(address, spenderAddr, overrides);
      setCbridgeAllowance(cbridgeApprove);
      if (rfqContract?.address) {
        const rfqApprove = await readOnlyTokenContract?.allowance(address, rfqContract.address, overrides);
        setRfqAllowance(rfqApprove);
      }
      setHasGotAllowance(true);
      setApproveLoading(false);
    } catch {
      setHasGotAllowance(true);
      setApproveLoading(false);
    }
  }, [address, tokenContract, rfqContract, spenderAddr, fromChain, chainId, pegConfig, tokenAddress, isRfq]);

  const setTokenMethod = (symbol?: string) => {
    if (!supportTokenList) {
      return;
    }

    const targetToken: TokenInfo =
      supportTokenList.find(token => {
        return (token.token.display_symbol ?? getTokenListSymbol(token.token.symbol, fromChain?.id ?? 0)) === symbol;
      }) || supportTokenList[0];

    dispatch(setSelectedToken(targetToken));
    dispatch(
      setSelectedTokenSymbol(
        targetToken?.token.display_symbol ?? getTokenListSymbol(targetToken?.token.symbol, chainId),
      ),
    );
    toggleIsTokenShow();
    setAmount("");
    setMaxValue("");
    setReceiveAmount(0);
    setFee(0);
  };

  // reset data
  const resetData = () => {
    setAmount("");
    setMaxValue("");
    setHasShowGotAllowance(false);
    setReceiveAmount(0);
    setFee(0);
    dispatch(setEstimateAmtInfoInState(null));
    dispatch(setPriceResponse(null));
    setNoTokenOnDst(false);
    setDenyPeg(false);
  };

  useEffect(() => {
    setTokenEnabled(true);
    setNoTokenOnDst(false);
    setTokenPaused(false);
    dispatch(setEstimateAmtInfoInState(null));
    dispatch(setPriceResponse(null));
  }, [selectedToken]);

  const generateErrMsg = (msg: string, iconType = "WarningFilled") => {
    return (
      <div className="errInnerbody">
        {iconType === "WarningFilled" ? (
          <WarningFilled style={{ fontSize: 20, marginRight: 5 }} />
        ) : (
          <CloseCircleFilled style={{ fontSize: 20, marginRight: 5 }} />
        )}
        <span style={{ fontSize: 14, marginLeft: 10 }}>{msg}</span>
      </div>
    );
  };
  const generateWaringMsg = (msg: string) => {
    return (
      <div className="warningInnerbody">
        <WarningFilled style={{ fontSize: 20, marginRight: 5 }} />
        <span style={{ color: "#17171A" }}>{msg}</span>
      </div>
    );
  };

  const bigAmountDelayedMsg = (tokenSymbol: string, minutes: string, threshold: string) => {
    return (
      <div style={{ display: "inline-flex" }}>
        <div className="warningInnerbody" style={{ display: "inline-flex", margin: "8px 0px 8px 12px" }}>
          <WarningFilled style={{ fontSize: 20, marginRight: 10 }} />
        </div>
        <div style={{ display: "inline", margin: "8px 0px" }}>
          <span className="msgInnerbody" style={{ display: "inline", margin: "0px" }}>
            {`Transfer of more than ${threshold} ${tokenSymbol} takes`}
          </span>
          <span
            className="msgInnerbody"
            style={{ display: "inline", margin: "0px 4px", color: "#17171A", fontWeight: "bold" }}
          >
            {`up to ${minutes} minutes`}
          </span>
          <span className="msgInnerbody" style={{ display: "inline", margin: "0px 12px 0px 0px" }}>
            to complete.
          </span>
        </div>
      </div>
    );
  };

  // get Allowance
  useEffect(() => {
    getAllowance();
  }, [getAllowance]);

  // setSpenderAddr
  useEffect(() => {
    const destinationChainNonEVMMode = getNonEVMMode(toChain?.id ?? 0);

    switch (destinationChainNonEVMMode) {
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        setSpenderAddr(transferAgent?.address ?? "");
        return;
      }
      default: {
        break;
      }
    }

    if (multiBurnConfig) {
      setSpenderAddr(multiBurnSpenderAddress);
    } else if (pegConfig.mode === PeggedChainMode.Off) {
      setSpenderAddr(bridge?.address ?? "");
    } else {
      setSpenderAddr(pegConfig.getSpenderAddress());
    }
  }, [pegConfig, bridge, multiBurnConfig, isRfq, rfqContract, transferAgent]);

  // Highlight current token when first loaded.
  useEffect(() => {
    const tokenSymbol =
      (selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, chainId)) || "";
    dispatch(setSelectedTokenSymbol(tokenSymbol));
  }, [isTokenShow]);

  // refreshBalance
  useEffect(() => {
    refreshBalance();
  }, [refreshGlobalTokenBalance]);

  // fromChain observer
  useEffect(() => {
    resetData();
  }, [fromChain, toChain]);

  useEffect(() => {
    setTokenEnabled(true);
    setNoTokenOnDst(false);
    setTokenPaused(false);
    setExceedsSafeguard(false);
  }, [pegConfig]);

  // After close history modal, need to estimateAmt
  // useEffect(() => {
  //   if (segments[0] === "transfer" && Number(amount) > 0) {
  //   }
  // }, [refreshTransferAndLiquidity]);

  // set user balance
  useEffect(() => {
    let balance = "0";
    if (isNonEVMChain(fromChain?.id ?? 0)) {
      balance = formatDecimalPart(`${nonEVMTokenBalance}`, 6, "floor", true);
    } else {
      balance =
        fromChain?.id === chainId && !balanceLoading
          ? formatDecimal(isNativeToken ? ETHBalance : tokenBalance, selectedToken?.token?.decimal)
          : "0";
    }
    setUserBalance(balance);
  }, [tokenBalance, ETHBalance, isNativeToken, nonEVMTokenBalance, fromChain, selectedToken, balanceLoading, chainId]);

  // clear error info
  const clearError = () => {
    setHasError(false);
    setErrorMsg(<div />);
    setExceedsSafeguard(false); // reset safeguard check
  };

  const handleError = errorMsgParam => {
    setHasError(true);
    setErrorMsg(errorMsgParam);
  };

  const handleWarning = warningMsgParam => {
    setErrorMsg(warningMsgParam);
  };

  const wideFromChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
  const fromChainWalletConnected =
    (signer && wideFromChainNonEVMMode === NonEVMMode.off) ||
    (nonEVMConnected && wideFromChainNonEVMMode !== NonEVMMode.off);

  const errorProcessor = {
    isOffline(networkState) {
      if (!networkState.online) {
        return generateErrMsg(`Network error. Please check your Internet connection.`, "CloseCircleFilled");
      }
      return undefined;
    },
    isTokenNotEnable(tokenEnabled, selectedToken, fromChain, toChain) {
      if (!tokenEnabled) {
        return generateErrMsg(
          `${
            selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token?.symbol, fromChain?.id)
          } transfer from ${fromChain?.name} to ${toChain?.name} is not yet supported.`,
        );
      }
      return undefined;
    },
    isTokenPaused(tokenPaused, errMsg) {
      if (tokenPaused) {
        return generateErrMsg(`${errMsg}`);
      }
      return undefined;
    },

    isDenyPeg(transferPair: TransferPair, denyPeg) {
      if (denyPeg && transferPair && transferPair.sourceChainToken) {
        return generateErrMsg(
          `${
            transferPair.sourceChainToken.token.display_symbol ??
            getTokenListSymbol(transferPair.sourceChainToken.token?.symbol, transferPair.sourceChainInfo?.id)
          } transfer from ${transferPair.sourceChainInfo?.name} to ${
            transferPair.destinationChainInfo?.name
          } is not yet supported.`,
        );
      }
      return undefined;
    },
    isNoTokenOnDstChain(noTokenOnDst, toChain) {
      if (noTokenOnDst) {
        return generateErrMsg(
          `Insufficient liquidity on ${toChain?.name}. You may reduce your transfer amount.`,
          "CloseCircleFilled",
        );
      }
      return undefined;
    },
    isFromChainSameAsDstChain(fromChain, toChain) {
      if (fromChain && toChain && fromChain?.id === toChain?.id) {
        return generateErrMsg(`Cannot transfer on the same chain.`);
      }
      return undefined;
    },
    isFromChainDiffFromWalletChain(fromChain, chainId) {
      if (isNonEVMChain(fromChain?.id ?? 0)) {
        return undefined;
      }

      if (fromChain && fromChain?.id !== chainId && chainId > 0) {
        return (
          <div
            className="errInnerbody"
            style={{ margin: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <WarningFilled style={{ fontSize: 20, marginRight: 5, color: "#ff8f00" }} />
            <span style={{ color: "#17171A", marginTop: 3 }}>
              You must switch to{" "}
              {isMobile ? (
                <span style={{ fontWeight: "bold" }}>{fromChain?.name} </span>
              ) : (
                <a
                  style={{ fontWeight: "bold" }}
                  onClick={() => {
                    switchChain(fromChain.id, selectedToken, (targetFromChainId: number) => {
                      console.debug(`switched chain to ${targetFromChainId}`);
                    });
                  }}
                >
                  {fromChain?.name}{" "}
                </a>
              )}
              to begin the transfer.
            </span>
          </div>
        );
      }
      return undefined;
    },
    isAmountInvalid(amount) {
      if ((!validFloatRegex.test(amount) && amount) || Number(amount) < 0) {
        return generateErrMsg("Please enter a valid number");
      }
      return undefined;
    },
    isAmountParseError(amount, selectedToken) {
      try {
        safeParseUnits(Number(amount).toString(), selectedToken?.token?.decimal);
      } catch {
        return generateErrMsg(`The input amount is too small or exceeds the maximum.`);
      }
      return undefined;
    },
    isValueGtMaxAmount(transferPair: TransferPair, burnSwapTotalSupplyLimit, amount) {
      const maxAmount = burnSwapTotalSupplyLimit;
      const value =
        safeParseUnits(Number(amount).toString(), transferPair.sourceChainToken?.token.decimal ?? 18) ||
        BigNumber.from(0);
      if (maxAmount && value.gt(maxAmount) && transferPair.sourceChainToken) {
        return generateErrMsg(
          `At this moment, you can transfer up to ${formatDecimal(
            maxAmount,
            transferPair.sourceChainToken.token.decimal,
            2,
          )} 
        ${getTokenSymbol(transferPair.sourceChainToken.token.symbol, transferPair.destinationChainInfo?.id)} from
        ${transferPair.sourceChainInfo?.name} to ${transferPair.destinationChainInfo?.name}. 
        You may reduce your transfer amount or try again later.`,
          "CloseCircleFilled",
        );
      }
      return undefined;
    },
    isFeeGtAmount(fee, amount) {
      if (fee > Number(amount) && Number(amount) > 0) {
        return generateErrMsg(`The received amount cannot cover fee.`);
      }
      return undefined;
    },
    isValueGtBalance(amount, selectedToken, isNativeToken, ETHBalance, tokenBalance) {
      const value = safeParseUnits(Number(amount).toString(), selectedToken?.token?.decimal ?? 18) || BigNumber.from(0);
      if (isNonEVMChain(fromChain?.id ?? 0) && !Number.isNaN(nonEVMTokenBalance)) {
        return Number(amount) > Number(nonEVMTokenBalance) ? generateErrMsg(`Insufficient balance.`) : undefined;
      }
      if (value.gt(isNativeToken ? ETHBalance : tokenBalance)) {
        return generateErrMsg(`Insufficient balance.`);
      }
      return undefined;
    },

    isValueLteMinSendValue(transferPair: TransferPair, amount, minSendValue) {
      const value =
        safeParseUnits(Number(amount).toString(), transferPair.sourceChainToken?.token.decimal ?? 18) ||
        BigNumber.from(0);
      const minsendNum = Number(
        formatDecimal(minSendValue, transferPair.sourceChainToken?.token.decimal ?? 18)
          .split(",")
          .join(""),
      );
      if (amount && minSendValue && value.lte(minSendValue) && Number(amount) > 0) {
        return generateErrMsg(
          `The transfer amount must be greater than ${minsendNum} ${getTokenSymbol(
            selectedToken?.token?.symbol,
            fromChain?.id,
          )}.`,
        );
      }
      return undefined;
    },

    isValueGtSafeguardMaxAmount(transferPair: TransferPair, amount, safeguardMaxAmount) {
      const value = safeParseUnits(Number(amount).toString(), selectedToken?.token?.decimal ?? 18) || BigNumber.from(0);
      const fromChainNonEVMMode = getNonEVMMode(transferPair.sourceChainInfo?.id ?? 0);

      if (safeguardMaxAmount) {
        const formatedAmount = formatUnits(
          safeguardMaxAmount!.toString(),
          transferPair.sourceChainToken?.token.decimal,
        );
        let valueExceeds = false;
        let errorDescription = ``;
        if (fromChainNonEVMMode === NonEVMMode.flowMainnet || fromChainNonEVMMode === NonEVMMode.flowTest) {
          valueExceeds = value.gte(safeguardMaxAmount);
          errorDescription = `The transfer amount should be less than
            ${deleteDecimalPart(formatedAmount.toString())}
            ${getTokenSymbol(
              transferPair.sourceChainToken?.token.symbol,
              transferPair.sourceChainInfo?.id,
            )}. Please reduce your transfer amount.`;
        } else {
          valueExceeds = value.gt(safeguardMaxAmount);
          errorDescription = `The maximum transfer amount is
          ${deleteDecimalPart(formatedAmount.toString())}
          ${getTokenSymbol(
            transferPair.sourceChainToken?.token.symbol,
            transferPair.sourceChainInfo?.id,
          )}. Please reduce your transfer amount.`;
        }

        if (valueExceeds) {
          setExceedsSafeguard(true);
          return generateErrMsg(errorDescription, "CloseCircleFilled");
        }
      }
      return undefined;
    },

    isRecipientAddressInputInValid(amount, nonEVMRecipientAddress, nonEVMMode, toChain) {
      if (nonEVMMode === NonEVMMode.off) {
        return undefined;
      }
      if (Number(amount) == 0 && nonEVMRecipientAddress.length === 0) {
        return undefined;
      }
      const toChainNonEVMMode = getNonEVMMode(toChain?.id ?? 0);

      const addressInputWithout0x = nonEVMRecipientAddress.replace("0x", "");

      switch (toChainNonEVMMode) {
        case NonEVMMode.flowTest:
        case NonEVMMode.flowMainnet: {
          return undefined;
        }
        case NonEVMMode.aptosDevnet:
        case NonEVMMode.aptosTest:
        case NonEVMMode.aptosMainnet: {
          if (addressInputWithout0x.match(/^[0-9a-f]+$/i) && addressInputWithout0x.length === 64) {
            setNonEVMRecipientAddress("0x" + addressInputWithout0x);
            return undefined;
          }
          break;
        }
        case NonEVMMode.seiMainnet:
        case NonEVMMode.seiDevnet:
        case NonEVMMode.seiTestnet:
        case NonEVMMode.injectiveTestnet:
        case NonEVMMode.injectiveMainnet: {
          if (addressInputWithout0x.length > 0) {
            return undefined;
          }
          break;
        }
        case NonEVMMode.off: {
          if (addressInputWithout0x.match(/^[0-9a-f]+$/i) && addressInputWithout0x.length === 40) {
            setNonEVMRecipientAddress("0x" + addressInputWithout0x);
            return undefined;
          }
          break;
        }
      }

      return generateErrMsg(
        `Please enter a valid recipient address on
            ${toChain?.name}`,
      );
    },
    isExcceedCoMinterCap(amount, coMinterBurnCap, srcTokenDecimal) {
      if (amount && coMinterBurnCap !== undefined && srcTokenDecimal) {
        const amountWithDecimal = safeParseUnits(amount, srcTokenDecimal);
        if (amountWithDecimal.gt(coMinterBurnCap)) {
          return generateErrMsg(
            `At this moment, you can transfer up to ${formatDecimal(coMinterBurnCap, srcTokenDecimal, 2)}
          ${getTokenSymbol(selectedToken?.token.symbol, toChain?.id)} from
          ${fromChain?.name} to ${toChain?.name}.
          You may reduce your transfer amount or try again later.`,
            "CloseCircleFilled",
          );
        }
      }

      if (amount && pegTokenSupply && srcTokenDecimal) {
        const amountWithDecimal = safeParseUnits(amount, srcTokenDecimal);

        if (
          amountWithDecimal.gt(pegTokenSupply.v0PegTokenSupply) &&
          amountWithDecimal.gt(pegTokenSupply.v2PegTokenSupply)
        ) {
          return generateErrMsg(
            `At this moment, you can transfer up to ${formatDecimal(
              pegTokenSupply.v2PegTokenSupply,
              srcTokenDecimal,
              2,
            )} 
          ${getTokenSymbol(selectedToken?.token.symbol, toChain?.id)} from
          ${fromChain?.name} to ${toChain?.name}. 
          You may reduce your transfer amount or try again later.`,
            "CloseCircleFilled",
          );
        }
      }
      return undefined;
    },
    isInboundLimit(tokenInBoundLimitLocal, token, amount) {
      const tokenBoundBigNumber = tokenInBoundLimitLocal;
      const inboundLmtBigNumber = BigNumber.from(token?.inbound_lmt || 0)
        .mul(9)
        .div(10);
      const amountBigNumber = parseUnits(amount.toString() || "0", token?.token?.decimal);
      if (
        token &&
        token?.inbound_lmt !== "" &&
        tokenBoundBigNumber &&
        tokenBoundBigNumber.abs().gt(0) &&
        tokenBoundBigNumber.add(amountBigNumber).gt(inboundLmtBigNumber)
      ) {
        let remainingTransferAmt = inboundLmtBigNumber.sub(tokenBoundBigNumber);
        remainingTransferAmt = remainingTransferAmt.gt(0) ? remainingTransferAmt : BigNumber.from("0");

        if (remainingTransferAmt.gt(0)) {
          return generateErrMsg(
            `You can transfer up to ${formatDecimal(
              remainingTransferAmt.toString(),
              token?.token?.decimal,
              6,
            )} ${getTokenSymbol(token?.token?.symbol, toChain?.id)} from ${fromChain?.name} to ${
              toChain?.name
            } at this moment. You may reduce your transfer amount.
          `,
            "CloseCircleFilled",
          );
        } else {
          return generateErrMsg(
            `Transfer from ${fromChain?.name} is temporarily unavailable due to rate limit. Please check back later.`,
            "CloseCircleFilled",
          );
        }
      }
    },

    isExceedBurnEpochVolume(bridgeType: BridgeType, sourceChainId: number, sourceToken: TokenInfo | undefined, amount) {
      if (
        (bridgeType === BridgeType.PegBurn ||
          bridgeType === BridgeType.PegV2Burn ||
          bridgeType === BridgeType.PegBurnMint) &&
        sourceToken
      ) {
        const tokenInChainTokenConfig = getTokenByChainAndTokenSymbol(sourceChainId, sourceToken.token.symbol);
        return this.isInboundEpochCap(tokenInChainTokenConfig, amount);
      }
      return undefined;
    },

    isInboundEpochCap(token, amount) {
      const inboundEpochCapBigNumber = BigNumber.from(token?.inbound_epoch_cap || 0);
      const amountBigNumber = parseUnits(amount.toString() || "0", token?.token?.decimal);
      if (
        token &&
        token?.inbound_epoch_cap &&
        token?.inbound_epoch_cap !== "" &&
        amountBigNumber.gt(inboundEpochCapBigNumber)
      ) {
        return generateErrMsg(
          `At this moment, you can transfer up to ${formatDecimal(
            inboundEpochCapBigNumber.toString(),
            token?.token?.decimal,
            6,
          )} ${getTokenSymbol(token?.token?.symbol, toChain?.id)} from ${fromChain?.name} to ${
            toChain?.name
          }, You may reduce your transfer amount or try again later.
        `,
          "CloseCircleFilled",
        );
      }
    },
    isExcceedWrapTokenLiquidityThreshold(amount, wrapTokenCap, srcTokenDecimal) {
      if (amount && wrapTokenCap && srcTokenDecimal) {
        const amountWithDecimal = safeParseUnits(amount, srcTokenDecimal);
        if (wrapTokenCap.gt(0) && amountWithDecimal.gt(wrapTokenCap)) {
          return generateErrMsg(
            `At this moment, you can transfer up to ${formatDecimal(wrapTokenCap, srcTokenDecimal, 2)} 
          ${getTokenSymbol(transferPair.destinationToken?.token.symbol ?? "", fromChain?.id)} from
          ${fromChain?.name} to ${toChain?.name}. 
          You may reduce your transfer amount or try again later.`,
            "CloseCircleFilled",
          );
        }
      }
      return undefined;
    },
    isSafeGuardTaskError(safeGuardError) {
      if (safeGuardError) {
        console.error(safeGuardError);
        return generateErrMsg(`Network error. Please check your Internet connection.`, "CloseCircleFilled");
      }
      return undefined;
    },
  };

  const isReachDelayedTransfer = (delayThresholdsWithDecimal, receiveAmount, srcTokenDecimal) => {
    if (delayThresholdsWithDecimal && srcTokenDecimal) {
      const receiveAmountWithDecimal = safeParseUnits(receiveAmount.toString() || "0", srcTokenDecimal);

      if (delayThresholdsWithDecimal.gt(0) && receiveAmountWithDecimal.gt(delayThresholdsWithDecimal)) {
        return true;
      }
      return false;
    }
    return false;
  };

  const getPegBurnDelayInfo = (transferPair: TransferPair) => {
    if (transferPair.sourceChainInfo && transferPair.sourceChainToken) {
      const tokenInChainTokenConfig = getTokenByChainAndTokenSymbol(
        transferPair.sourceChainInfo?.id,
        transferPair.sourceChainToken.token.symbol,
      );
      const delayThreshold = tokenInChainTokenConfig?.delay_threshold ?? "";
      const delayPeriod = tokenInChainTokenConfig?.delay_period ?? 0;
      const dealyBuffer = 10 * 60; // set buffer to 10 mins
      const delayPeriodInMin = ((delayPeriod ?? 0) + dealyBuffer) / 60;
      return [delayThreshold, delayPeriodInMin, delayPeriod];
    }
    return undefined;
  };

  const isReachBurnDelayedTransfer = (transferPair: TransferPair, amount) => {
    if (
      (transferPair.bridgeType === BridgeType.PegBurn ||
        transferPair.bridgeType === BridgeType.PegV2Burn ||
        transferPair.bridgeType === BridgeType.PegBurnMint) &&
      transferPair.sourceChainToken
    ) {
      const tokenInChainTokenConfig = getTokenByChainAndTokenSymbol(
        transferPair.sourceChainInfo?.id,
        transferPair.sourceChainToken.token.symbol,
      );
      const delayThreshold = tokenInChainTokenConfig?.delay_threshold;

      if (!delayThreshold || !amount || !tokenInChainTokenConfig) {
        return false;
      }

      if (parseUnits(amount, tokenInChainTokenConfig.token.decimal).gt(BigNumber.from(delayThreshold))) {
        return true;
      }

      return false;
    }
    return false;
  };

  const warningProcessor = {
    isDestinationTransferDelayed(delayMinutes, delayThresholdsWithDecimal, transferPair: TransferPair) {
      if (
        delayThresholdsWithDecimal &&
        transferPair.sourceChainToken &&
        isReachDelayedTransfer(delayThresholdsWithDecimal, receiveAmount, transferPair.sourceChainToken.token.decimal)
      ) {
        const tokenSymbol = getTokenSymbol(
          transferPair.sourceChainToken.token?.symbol,
          transferPair.destinationChainInfo?.id,
        );
        const delayThresholdsWithoutDecimal = formatDecimal(
          delayThresholdsWithDecimal,
          transferPair.sourceChainToken.token.decimal,
        );
        return bigAmountDelayedMsg(tokenSymbol, delayMinutes, delayThresholdsWithoutDecimal);
      }
      return undefined;
    },

    isSourceChainBurnDelayed(transferPair: TransferPair, amount) {
      if (isReachBurnDelayedTransfer(transferPair, amount) && transferPair.sourceChainToken) {
        const tokenInChainTokenConfig = getTokenByChainAndTokenSymbol(
          transferPair.sourceChainInfo?.id,
          transferPair.sourceChainToken.token.symbol,
        );

        const pegBurnDelayInfo = getPegBurnDelayInfo(transferPair);

        if (pegBurnDelayInfo) {
          const [delayThreshold, delayPeriodInMin] = pegBurnDelayInfo;
          if (!delayThreshold || !amount || !delayPeriodInMin || !tokenInChainTokenConfig) {
            return false;
          }

          return bigAmountDelayedMsg(
            tokenInChainTokenConfig?.token.symbol,
            `${delayPeriodInMin}`,
            formatDecimal(delayThreshold, tokenInChainTokenConfig.token.decimal),
          );
        }
      }
      return undefined;
    },
  };

  useEffect(() => {
    clearError();
    const offlineInfo = errorProcessor.isOffline(networkState);
    if (offlineInfo) {
      handleError(offlineInfo);
    } else {
      // if safeGuardTask is in progress, wait for the task to finish, otherwise it's maybe the old result be used to handle the error.
      if (!fromChainWalletConnected && isSafeGuardTaskInProgress) {
        return;
      }

      // prevent data mismatch cause by continuous async call, check current transfer pair snapshot match with safeguard request snapshot.
      if (safeGuardParameters?.transferPairSnapshot && transferPair) {
        if (getTransferSnapshot(transferPair) !== safeGuardParameters.transferPairSnapshot) {
          return;
        }
      }
      if (!isEstimateEnd && amount) {
        return;
      }

      let errorInfo;
      if (isRfq) {
        errorInfo =
          errorProcessor.isTokenNotEnable(
            tokenEnabled,
            transferPair.sourceChainToken,
            transferPair.sourceChainInfo,
            transferPair.destinationChainInfo,
          ) ||
          errorProcessor.isTokenPaused(tokenPaused, estimateAmtErrMsg) ||
          errorProcessor.isDenyPeg(transferPair, denyPeg) ||
          errorProcessor.isNoTokenOnDstChain(noTokenOnDst, transferPair.destinationChainInfo) ||
          errorProcessor.isFromChainSameAsDstChain(transferPair.sourceChainInfo, transferPair.destinationChainInfo) ||
          errorProcessor.isFromChainDiffFromWalletChain(transferPair.sourceChainInfo, chainId) ||
          errorProcessor.isAmountInvalid(amount) ||
          errorProcessor.isAmountParseError(amount, transferPair.sourceChainToken) ||
          errorProcessor.isValueGtBalance(
            amount,
            transferPair.sourceChainToken,
            isNativeToken,
            ETHBalance,
            tokenBalance,
          ) ||
          errorProcessor.isFeeGtAmount(fee, amount) ||
          errorProcessor.isRecipientAddressInputInValid(amount, nonEVMRecipientAddress, nonEVMMode, toChain);
      } else {
        errorInfo =
          errorProcessor.isTokenNotEnable(
            tokenEnabled,
            transferPair.sourceChainToken,
            transferPair.sourceChainInfo,
            transferPair.destinationChainInfo,
          ) ||
          errorProcessor.isTokenPaused(tokenPaused, estimateAmtErrMsg) ||
          errorProcessor.isDenyPeg(transferPair, denyPeg) ||
          errorProcessor.isNoTokenOnDstChain(noTokenOnDst, transferPair.destinationChainInfo) ||
          errorProcessor.isFromChainSameAsDstChain(transferPair.sourceChainInfo, transferPair.destinationChainInfo) ||
          errorProcessor.isFromChainDiffFromWalletChain(transferPair.sourceChainInfo, chainId) ||
          errorProcessor.isAmountInvalid(amount) ||
          errorProcessor.isAmountParseError(amount, transferPair.sourceChainToken) ||
          errorProcessor.isValueGtBalance(
            amount,
            transferPair.sourceChainToken,
            isNativeToken,
            ETHBalance,
            tokenBalance,
          ) ||
          errorProcessor.isFeeGtAmount(fee, amount) ||
          errorProcessor.isSafeGuardTaskError(safeguardException) ||
          errorProcessor.isValueGtMaxAmount(transferPair, safeGuardParameters?.burnSwapTotalSupplyLimit, amount) ||
          errorProcessor.isValueLteMinSendValue(transferPair, amount, safeGuardParameters?.minSendValue) ||
          errorProcessor.isExcceedWrapTokenLiquidityThreshold(
            amount,
            safeGuardParameters?.wrapTokenCap,
            safeGuardParameters?.transferSourceChainTokenDecimal,
          ) ||
          errorProcessor.isValueGtSafeguardMaxAmount(transferPair, amount, safeGuardParameters?.maxSendValue) ||
          errorProcessor.isExcceedCoMinterCap(
            amount,
            safeGuardParameters?.coMinterBurnCaps,
            safeGuardParameters?.transferSourceChainTokenDecimal,
          ) ||
          errorProcessor.isInboundLimit(
            safeGuardParameters?.tokenInBoundLimit,
            transferPair.sourceChainToken,
            amount,
          ) ||
          errorProcessor.isExceedBurnEpochVolume(
            transferPair.bridgeType,
            transferPair.sourceChainInfo?.id ?? 0,
            transferPair.sourceChainToken,
            amount,
          ) ||
          errorProcessor.isInboundEpochCap(transferPair.sourceChainToken, amount) ||
          errorProcessor.isRecipientAddressInputInValid(amount, nonEVMRecipientAddress, nonEVMMode, toChain);
      }
      if (errorInfo) {
        handleError(errorInfo);
      } else if (isBridgeRateTooLow) {
        handleError("");
      } else {
        let warningInfo;
        if (!isRfq) {
          warningInfo =
            warningProcessor.isDestinationTransferDelayed(
              safeGuardParameters?.destinationChainDelayTimeInMinutes,
              safeGuardParameters?.destinationChainDelayThresholds,
              transferPair,
            ) || warningProcessor.isSourceChainBurnDelayed(transferPair, amount);
        }
        if (warningInfo) {
          handleWarning(warningInfo);
        }
      }
    }
  }, [
    isRfq,
    isEstimateEnd,
    networkState,
    signer,
    amount,
    chainId,
    tokenBalance,
    fee,
    estimateAmtInfoInState,
    tokenEnabled,
    tokenPaused,
    estimateAmtErrMsg,
    exceedsSafeguard,
    isNativeToken,
    ETHBalance,
    noTokenOnDst,
    receiveAmount,
    denyPeg,
    nonEVMRecipientAddress,
    nonEVMMode,
    safeGuardParameters,
    safeguardException,
    transferPair,
    isSafeGuardTaskInProgress,
    isBridgeRateTooLow,
  ]);

  const renderCardSetting = () => {
    return (
      <div
        onClick={e => {
          e.stopPropagation();
          handleOpenRateModal();
        }}
        style={{ cursor: "pointer", position: "relative" }}
      >
        <img src={settingIcon} className={classes.settingIcon} alt="setting icon" />
        {showRateModal && (
          <RateModal
            onCancle={() => {
              handleCloseRateModal();
            }}
          />
        )}
      </div>
    );
  };

  const showChain = type => {
    dispatch(setChainSource(type));
    dispatch(setIsChainShow(true));
  };

  // Estimate error  processor
  const estimateErrorProcessor = {
    isOffLine(network) {
      if (!network.online) {
        return true;
      }
    },
    isAmountInvalid(amount) {
      if ((!validFloatRegex.test(amount) && amount) || Number(amount) < 0) {
        return true;
      }
    },
    isTokenNotEnable(amount) {
      if (Number(amount) < 0 || Number.isNaN(Number(amount))) {
        return true;
      }
    },
    isDenyPeg(toChain) {
      setDenyPeg(false);
      if (PeggedChainMode.Off !== pegConfig.mode && toChain && selectedToken) {
        const toChainPeggedTokenList = getNetworkById(toChain.id).tokenSymbolList;
        if (!toChainPeggedTokenList.includes(selectedToken.token.symbol)) {
          setDenyPeg(true);
          return true;
        }
      }
    },
    isAmountParseError(amount, selectedToken) {
      try {
        safeParseUnits(Number(amount).toString(), selectedToken?.token?.decimal);
      } catch {
        return true;
      }
    },
    isNoTokenSupported(selectedToken) {
      const canToken = supportTokenList.find(item => {
        return item.token.symbol === selectedToken?.token.symbol;
      });
      return canToken === undefined;
    },
  };

  const estimateAmt = async (selectedFromChain, selectedToChain, targetToken, value, addr, rate) => {
    const mode = GetPeggedMode(
      fromChain?.id,
      toChain?.id,
      targetToken.token.symbol,
      transferConfig.pegged_pair_configs,
    );
    const estimateRequest = new EstimateAmtRequest();
    estimateRequest.setSrcChainId(selectedFromChain.id);
    estimateRequest.setDstChainId(selectedToChain.id);
    estimateRequest.setTokenSymbol(targetToken?.token.symbol);
    estimateRequest.setAmt(value.toString());
    estimateRequest.setUsrAddr(addr);
    estimateRequest.setSlippageTolerance(Number(rate) * 10000);
    estimateRequest.setIsPegged(mode !== PeggedChainMode.Off || multiBurnConfig !== undefined);
    estimateRequest.setNeedDetailInfo(true);

    const res = await gatewayServiceWithGrpcUrlClient.estimateAmt(estimateRequest, null);
    console.debug("estimateAmt:", res.toObject());
    return res;
  };

  const estimateAmtResProcessor = (res: EstimateAmtResponse, targetToken) => {
    if (!res?.getErr()) {
      setIsRfq(false);
      dispatch(setEstimateAmtInfoInState(res.toObject()));
      const feeBigNum = BigNumber.from(res?.getBaseFee()).add(BigNumber.from(res?.getPercFee()));
      const totalFee = feeBigNum.toString() || "0";
      const totalFeeWithoutDecimal = Number(
        formatDecimal(totalFee, getTokenByChainAndTokenSymbol(toChain?.id, targetToken?.token?.symbol)?.token.decimal)
          ?.split(",")
          .join(""),
      );
      const targetReceiveAmounts = res.getEstimatedReceiveAmt();
      const receiveAmounts = formatDecimal(
        targetReceiveAmounts,
        getTokenByChainAndTokenSymbol(toChain?.id, targetToken?.token?.symbol)?.token.decimal,
      )
        ?.split(",")
        .join("");
      setFee(totalFeeWithoutDecimal);
      setReceiveAmount(Number(receiveAmounts));
      setNoTokenOnDst(false);
    } else {
      const response = res.toObject();

      if (response.err?.code === 1012) {
        dispatch(setEstimateAmtInfoInState(res.toObject()));
        setIsBridgeRateTooLow(true);
        return;
      }

      if (
        response.err?.code === ErrCode.ERROR_NO_TOKEN_ON_DST_CHAIN ||
        response.err?.code === ErrCode.ERROR_NO_TOKEN_ON_SRC_CHAIN
      ) {
        setTokenEnabled(false);
      }
      if (response.err?.code === ErrCode.ERROR_CODE_NO_ENOUGH_TOKEN_ON_DST_CHAIN) {
        setNoTokenOnDst(true);
      } else {
        setNoTokenOnDst(false);
      }
      if (response.err?.code === ErrCode.ERROR_CODE_TRANSFER_DISABLED) {
        setTokenPaused(true);
        setEstimateAmtErrMsg(response.err?.msg);
      } else {
        setTokenPaused(false);
      }
      setReceiveAmount(0);
      setFee(0);
      dispatch(setEstimateAmtInfoInState(null));
      setIsBridgeRateTooLow(false);
    }
  };

  const quoteAmtResProcessor = (res: PriceResponse) => {
    if (!res?.getErr()) {
      setIsRfq(true);
      dispatch(setPriceResponse(res.toObject()));

      setFee(0);
      setNoTokenOnDst(false);
    } else {
      setReceiveAmount(0);
      setFee(0);
      dispatch(setPriceResponse(null));
    }
  };

  useEffect(() => {
    if (isRfq && priceResponse) {
      const quoteResTargetReceiveAmounts = priceResponse.price?.dstAmount ?? "0";
      const quoteReceiveAmounts = formatDecimal(
        quoteResTargetReceiveAmounts,
        priceResponse.price?.dstToken?.decimals ?? 0,
      )
        ?.split(",")
        .join("");
      setReceiveAmount(Number(quoteReceiveAmounts));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRfq, priceResponse]);

  const debounceFn = useCallback(
    debounce(callback => {
      callback();
    }, 1000),
    [],
  );

  // useEffect(() => {
  //   if (!isRfq) {
  //     getEstimate();
  //   }
  // }, [networkState, isRfq]);

  useEffect(() => {
    getEstimate();
  }, [fromChain, toChain, amount, selectedToken, address, rate]);

  const getEstimate = () => {
    if (!amount) {
      return;
    }
    setIsEstimateEnd(false);
    setIsBridgeRateTooLow(false);
    debounceFn(async () => {
      const latestKey =
        fromChain?.id + "--" + toChain?.id + "--" + selectedToken?.token.symbol + "--" + address + "--" + amount + "--";
      sessionStorage.setItem("LatestEstimationKey", latestKey);

      const cannotEstimat =
        estimateErrorProcessor.isOffLine(networkState) ||
        estimateErrorProcessor.isTokenNotEnable(amount) ||
        estimateErrorProcessor.isDenyPeg(toChain) ||
        estimateErrorProcessor.isNoTokenSupported(selectedToken) ||
        estimateErrorProcessor.isAmountInvalid(amount);
      if (cannotEstimat) {
        setLoading(false);
        return undefined;
      }
      if (Number(amount) > 0) {
        setLoading(true);
      }
      let estimateReceiveAmountNum = 0;
      let quoteReceiveAmountNum = 0;
      let estimateRes: EstimateAmtResponse | undefined = undefined;
      let priceRes: PriceResponse | undefined = undefined;

      try {
        estimateRes = await estimate({ fromChain, toChain, amount, selectedToken, address, rate });
      } catch (e) {
        const key = sessionStorage.getItem("LatestEstimationKey");
        if (key === latestKey) {
          setReceiveAmount(0);
          setFee(0);
          dispatch(setEstimateAmtInfoInState(null));
        }
      }

      setTransactionFeeRebateDescription("");
      setOpFeeRebatePortion(0);

      if (estimateRes && estimateRes.toObject().opFeeRebateEndTime) {
        const opRewardsEndTime = estimateRes.toObject().opFeeRebateEndTime;
        const leftT = opRewardsEndTime * 1000 - new Date().getTime();
        if (leftT > 0) {
          const portion = estimateRes.toObject().opFeeRebatePortion;
          const rebateFee = (estimateRes.toObject().opFeeRebate * portion).toFixed(6);
          if (Number(rebateFee) > 0) {
            const rebateTokenSymbol = "OP";
            const rebateTokenPrice = priceOfTokens?.assetPrice.find(assetPriceItem => {
              return assetPriceItem.symbol === rebateTokenSymbol;
            });
            let rebateUnitPiceInUSD = rebateTokenPrice ? getTokenUnitPriceInUSD(rebateTokenPrice) : 0;
            setTransactionFeeRebateDescription(
              ` + ${rebateFee} ${rebateTokenSymbol} ($${(rebateUnitPiceInUSD * Number(rebateFee)).toFixed(
                2,
              )}) rebate 🎉 `,
            );
            setOpFeeRebatePortion(portion * 100);
          }
        }
      }

      try {
        priceRes = await rfqPrice({ fromChain, toChain, amount, selectedToken });
      } catch (e) {
        console.log("quote error: ", e);
      }
      setLoading(false);
      if (estimateRes && priceRes) {
        const estimateResTargetReceiveAmounts = estimateRes.getEstimatedReceiveAmt();
        const estimateReceiveAmounts = formatDecimal(
          estimateResTargetReceiveAmounts,
          getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token?.symbol)?.token.decimal,
        )
          ?.split(",")
          .join("");
        estimateReceiveAmountNum = Number(estimateReceiveAmounts);
        console.debug("estimate receive amt: ", estimateReceiveAmountNum);

        const quoteResTargetReceiveAmounts = priceRes.getPrice()?.getDstAmount() ?? "0";
        const quoteReceiveAmounts = formatDecimal(
          quoteResTargetReceiveAmounts,
          priceRes?.getPrice()?.getDstToken()?.getDecimals() ?? 0,
        )
          ?.split(",")
          .join("");
        quoteReceiveAmountNum = Number(quoteReceiveAmounts);
        console.debug("quote receive amt: ", quoteReceiveAmountNum);
        // test rfq hard code
        // if (pegConfig.mode === PeggedChainMode.Off && quoteReceiveAmountNum > 0) {
        const rfqSpecificChains = process.env.REACT_APP_ENV === "TEST" ? [5, 97] : [56, 137];
        const isSpecialRfqPair =
          quoteReceiveAmountNum > 0 &&
          rfqSpecificChains.includes(priceRes.getPrice()?.getSrcToken()?.getChainId() ?? 0) &&
          rfqSpecificChains.includes(priceRes.getPrice()?.getDstToken()?.getChainId() ?? 0);

        const rfqCondition =
          pegConfig.mode === PeggedChainMode.Off &&
          estimateReceiveAmountNum > 0 &&
          quoteReceiveAmountNum > estimateReceiveAmountNum;
        if (isSpecialRfqPair || rfqCondition) {
          quoteAmtResProcessor(priceRes);
        } else {
          const key = sessionStorage.getItem("LatestEstimationKey");
          if (key === latestKey) {
            estimateAmtResProcessor(estimateRes, selectedToken);
          }
        }
      } else if (estimateRes) {
        const key = sessionStorage.getItem("LatestEstimationKey");
        if (key === latestKey) {
          estimateAmtResProcessor(estimateRes, selectedToken);
        }
      } else if (priceRes) {
        quoteAmtResProcessor(priceRes);
      } else {
        setReceiveAmount(0);
        setFee(0);
        dispatch(setEstimateAmtInfoInState(null));
        dispatch(setPriceResponse(null));
      }
      setIsEstimateEnd(true);
    });
  };

  const estimate = async ({
    fromChain,
    toChain,
    amount,
    selectedToken,
    address,
    rate,
  }): Promise<EstimateAmtResponse | undefined> => {
    if (Number(amount) > 0) {
      try {
        const value = safeParseUnits(amount || "0", selectedToken?.token?.decimal);
        const estimateStart = new Date().getTime();
        const res = await estimateAmt(fromChain, toChain, selectedToken, value, address, rate);
        const estimateFinish = new Date().getTime();
        console.debug("[performance][estimateAmt]", estimateFinish - estimateStart);

        // continue to process estimate error when there are no other errors.
        if (!hasError) {
          return res;
        }
      } catch (e) {
        console.log("estimate error:", e);
      }
    }
    return undefined;
  };

  const rfqPrice = async ({ fromChain, toChain, amount, selectedToken }): Promise<PriceResponse | undefined> => {
    if (Number(amount) > 0) {
      try {
        const value = safeParseUnits(amount || "0", selectedToken?.token?.decimal).toString();
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
        priceRequest.setSrcAmount(value);
        priceRequest.setDstAmount("");
        console.debug("priceRequest: ", priceRequest.toObject());
        const priceRes = await getRfqPrice(priceRequest);
        console.debug("priceRes: ", priceRes.toObject());
        if (!priceRes.getErr()) {
          return priceRes;
        }
      } catch (e) {
        console.log("rfq price error:", e);
      }
    }
    return undefined;
  };

  const setMaxAmount = () => {
    if (!fromChainWalletConnected) {
      return;
    }

    if (denyPeg) {
      return;
    }

    if (isNonEVMChain(fromChain?.id ?? 0)) {
      const maxSend = formatDecimalPart(`${nonEVMTokenBalance}`, selectedToken?.token.decimal);

      if (!maxSend) {
        return;
      }

      if (maxSend === maxValue) {
        return;
      }
      setLoading(true);
      /// Display amount should be 6-digit
      setAmount(formatDecimalPart(`${nonEVMTokenBalance}`, 6, "floor", true));
      setMaxValue(maxSend);
      dispatch(setEstimateAmtInfoInState(null));
      setNoTokenOnDst(false);
      setReceiveAmount(0);
      return;
    }

    const balance = isNativeToken ? ETHBalance : tokenBalance;
    let maxShow = formatDecimal(balance.toString(), selectedToken?.token?.decimal).split(",").join("");
    let maxSen = formatDecimal(balance.toString(), selectedToken?.token?.decimal, selectedToken?.token?.decimal)
      ?.split(",")
      .join("");

    // native token need to subtract 0.01, but metis is 0.03
    const subGasAmount = isMetisChainGasToken() ? 0.03 : 0.01;
    if (isNativeToken || isMetisChainGasToken()) {
      if (Number(maxSen) <= subGasAmount) {
        maxSen = "0";
        maxShow = "0";
      } else {
        maxSen = sub(Number(maxSen), subGasAmount).toString();
        maxShow = sub(Number(maxShow), subGasAmount).toString();
      }
    }
    if (!maxSen) {
      return;
    }
    if (maxSen === maxValue) {
      return;
    }
    setLoading(true);
    setAmount(maxShow.toString());
    setMaxValue(maxSen.toString());

    dispatch(setEstimateAmtInfoInState(null));
    dispatch(setPriceResponse(null));
    setNoTokenOnDst(false);
    setReceiveAmount(0);
  };

  const isMetisChainGasToken = () => {
    return fromChain?.id === 1088 && selectedToken?.token.symbol === "Metis";
  };

  const handleTokenInputChange = (e: ITokenInputChangeEvent) => {
    setHasShowGotAllowance(false);
    setReceiveAmount(0);
    setMaxValue("");
    dispatch(setEstimateAmtInfoInState(null));
    dispatch(setPriceResponse(null));
    setTransactionFeeRebateDescription("");
    if (!e.value) {
      setReceiveAmount(0);
    }
    setTokenEnabled(true);
    setAmount(e.value);
    setNoTokenOnDst(false);
    setTokenPaused(false);
    if (e.error) {
      setHasError(true);
      setErrorMsg(generateErrMsg(e.error));
    } else {
      setHasError(false);
    }
  };

  const switchMethod = (paramChain, paramToken) => {
    const paramChainId = paramChain.id;
    const nonEVMMode = getNonEVMMode(paramChainId);

    switch (nonEVMMode) {
      case NonEVMMode.flowMainnet:
      case NonEVMMode.flowTest: {
        if (flowConnected) {
          const chain = transferConfig.chains.find(chainInfo => {
            return chainInfo.id === paramChainId;
          });
          if (chain !== undefined) {
            dispatch(setFromChain(chain));
          }
        } else {
          dispatch(openModal(ModalName.flowProvider));
        }
        return;
      }
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        if (aptosConnected) {
          const chain = transferConfig.chains.find(chainInfo => {
            return chainInfo.id === paramChainId;
          });
          if (chain !== undefined) {
            dispatch(setFromChain(chain));
          }
        } else {
          dispatch(openModal(ModalName.aptosProvider));
        }
        return;
      }
      case NonEVMMode.seiMainnet:
      case NonEVMMode.seiDevnet:
      case NonEVMMode.seiTestnet: {
        if (seiConnected) {
          const chain = transferConfig.chains.find(chainInfo => {
            return chainInfo.id === paramChainId;
          });
          if (chain !== undefined) {
            dispatch(setFromChain(chain));
          }
        } else {
          dispatch(openModal(ModalName.seiProvider));
        }
        return;
      }
      case NonEVMMode.injectiveTestnet:
      case NonEVMMode.injectiveMainnet: {
        if (injConnected) {
          const chain = transferConfig.chains.find(chainInfo => {
            return chainInfo.id === paramChainId;
          });
          if (chain !== undefined) {
            dispatch(setFromChain(chain));
          }
        } else {
          dispatch(openModal(ModalName.injProvider));
        }
        return;
      }
      default: {
        break;
      }
    }

    switchChain(paramChain.id, paramToken, (chainId: number) => {
      const chain = transferConfig.chains.find(chainInfo => {
        return chainInfo.id === chainId;
      });
      if (chain !== undefined) {
        dispatch(setFromChain(chain));
      }
    });

    dispatch(setTokenList(supportTokenList));
    refreshBalance();
  };

  const exchangeFromAndToChain = () => {
    if (!fromChain || !toChain) {
      return;
    }
    const tmpfromChain = fromChain;
    const tmpChain = toChain;
    dispatch(setToChain(tmpfromChain));
    dispatch(setFromChain(tmpChain));
    if (tmpfromChain.id !== tmpChain.id) {
      switchMethod(tmpChain, "");
    }
  };

  const handleCloseProviderModal = () => {
    dispatch(closeModal(ModalName.provider));
  };
  const handleCloseFlowProviderModal = () => {
    dispatch(closeModal(ModalName.flowProvider));
  };

  const handleCloseAptosProviderModal = () => {
    dispatch(closeModal(ModalName.aptosProvider));
  };

  const handleCloseTransferModal = () => {
    refreshBalance();
    getAptosResourcesCallback(aptosAddress);
    dispatch(setRefreshHistory(!refreshHistory));
    dispatch(closeModal(ModalName.transfer));
  };

  const handleSuccess = () => {
    setAmount("");
    setMaxValue("");
    setHasShowGotAllowance(false);
    setReceiveAmount(0);
    setFee(0);
    dispatch(setEstimateAmtInfoInState(null));
    dispatch(setPriceResponse(null));
    toggleRefreshSafeGuardCheck();
  };

  const handleSelectToken = (symbol: string) => {
    if (!tokenList) {
      return;
    }
    setTokenMethod(symbol);
  };

  const showWalletConnectionProviderModal = useCallback(() => {
    const fromChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
    switch (fromChainNonEVMMode) {
      case NonEVMMode.flowMainnet:
      case NonEVMMode.flowTest: {
        dispatch(openModal(ModalName.flowProvider));
        break;
      }
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        dispatch(openModal(ModalName.aptosProvider));
        break;
      }
      case NonEVMMode.seiMainnet:
      case NonEVMMode.seiDevnet:
      case NonEVMMode.seiTestnet: {
        dispatch(openModal(ModalName.seiProvider));
        break;
      }
      case NonEVMMode.injectiveTestnet:
      case NonEVMMode.injectiveMainnet: {
        dispatch(openModal(ModalName.injProvider));
        break;
      }
      default: {
        dispatch(openModal(ModalName.provider));
        break;
      }
    }
  }, [dispatch, fromChain]);

  const showNonEVMProviderModalForToChain = useCallback(() => {
    const toChainNonEVMMode = getNonEVMMode(toChain?.id ?? 0);

    switch (toChainNonEVMMode) {
      case NonEVMMode.flowMainnet:
      case NonEVMMode.flowTest: {
        setFlowInToChain();
        dispatch(openModal(ModalName.flowProvider));
        break;
      }
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        setAptosInToChain();
        dispatch(openModal(ModalName.aptosProvider));
        break;
      }
      case NonEVMMode.seiMainnet:
      case NonEVMMode.seiDevnet:
      case NonEVMMode.seiTestnet: {
        setAptosInToChain();
        dispatch(openModal(ModalName.seiProvider));
        break;
      }
      case NonEVMMode.injectiveTestnet:
      case NonEVMMode.injectiveMainnet: {
        setAptosInToChain();
        dispatch(openModal(ModalName.injProvider));
        break;
      }
    }
  }, [dispatch, toChain]);

  const onShowTransferModal = useCallback(async () => {
    if (
      shouldNotifyUserSwitchToCorrectWalletEndpoint &&
      (isAptosChain(fromChain?.id ?? 0) || isAptosChain(toChain?.id ?? 0))
    ) {
      setShouldShowSwitchAptosEndpointModal(true);
      return;
    }

    dispatch(openModal(ModalName.transfer));
  }, [dispatch, isRfq, priceResponse, shouldNotifyUserSwitchToCorrectWalletEndpoint, fromChain, toChain]);
  const handleOpenRateModal = () => {
    dispatch(openModal(ModalName.rate));
  };
  const handleCloseRateModal = () => {
    dispatch(closeModal(ModalName.rate));
  };

  const approveMethod = async () => {
    if (!transactor || !tokenContract || !spenderAddr) {
      return;
    }
    if (!isNativeToken || isMetisChainGasToken()) {
      setHasShowGotAllowance(true);
      setApproveLoading(true);
      try {
        if (pegConfig.mode === PeggedChainMode.TransitionPegV2) {
          const inputBig = safeParseUnits(amount || "0", selectedToken?.token?.decimal ?? 18);

          if (inputBig.gt(pegTokenSupply?.v0PegTokenSupply ?? BigNumber.from("0"))) {
            const approveTx = await transactor(
              tokenContract.approve(pegConfig.config.pegged_burn_contract_addr, MaxUint256),
            );
            await approveTx.wait();
            setAllowanceForPegV2Contract(MaxUint256);
          } else {
            const approveTx = await transactor(
              tokenContract.approve(pegConfig.config.migration_peg_burn_contract_addr, MaxUint256),
            );
            await approveTx.wait();
            setAllowanceForPegV0Contract(MaxUint256);
          }

          setHasGotAllowance(true);
          setApproveLoading(false);
          return;
        }

        if (isRfq) {
          const value = BigNumber.from(priceResponse?.price?.srcAmount ?? "0");
          const approveTx = await transactor(tokenContract.approve(rfqContract?.address ?? "", value));
          await approveTx.wait();
          getAllowance();
          return;
        }

        if (fromChain && isApeChain(fromChain.id)) {
          const approveTx = await transactor(tokenContract.approve(spenderAddr, MaxUint256, { gasPrice: 0 }));
          await approveTx.wait();
        } else {
          const approveTx = await transactor(tokenContract.approve(spenderAddr, MaxUint256));
          await approveTx.wait();
        }
        getAllowance();
      } catch (e) {
        setApproveLoading(false);
      }
    }
  };

  const setupFlowAccountWithLoadingSign = () => {
    if (!flowConnected || flowAccountInitialized) {
      return;
    }

    setCreateFlowBtnLoading(true);

    const flowTokenPath = flowTokenPathConfigs.find(config => {
      return config.Symbol === selectedToken?.token.symbol;
    });

    if (flowTokenPath) {
      setupTokenVaultForFlowAccount(flowTokenPath, nonEVMAddress)
        .then(initialized => {
          setFlowAccountInitialized(initialized);
          setCreateFlowBtnLoading(false);
        })
        .catch(e => {
          message.error(`set token vault err: ${e}`);
          setCreateFlowBtnLoading(false);
        });
    } else {
      setCreateFlowBtnLoading(false);
    }
  };

  const registerAptosTokenWithLoadingSign = () => {
    if (shouldNotifyUserSwitchToCorrectWalletEndpoint) {
      setShouldShowSwitchAptosEndpointModal(true);
      return;
    }

    if (!aptosConnected || aptosTokenRegistered) {
      return;
    }

    setRegisterAptosTokenLoading(true);

    registerTokenForAptosAccount(transferPair.destinationToken?.token.address ?? "", signAndSubmitTransaction)
      .then(registered => {
        if (!registered) {
          setRegisterAptosTokenLoading(false);
        }
        setAptosTokenRegistered(registered);
      })
      .catch(e => {
        message.error(`set token vault err: ${e}`);
        setRegisterAptosTokenLoading(false);
      });
  };

  const amountInputDisabled = () => {
    if (!getNonEVMMode(fromChain?.id || 0) && chainId > 0 && fromChain?.id != chainId) {
      return true;
    }
    const nonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
    if (nonEVMMode !== NonEVMMode.off) {
      return false;
    }

    return denyPeg;
  };

  const nonEVMReceiverAddress = () => {
    if (isNonEVMChain(fromChain?.id ?? 0) || isNonEVMChain(toChain?.id ?? 0)) {
      return nonEVMRecipientAddress;
    }
    return "";
  };

  useEffect(() => {
    if (isAptosChain(fromChain?.id ?? 0)) {
      setAptosTokenRegistered(!Number.isNaN(nonEVMTokenBalance));
    }
  }, [nonEVMTokenBalance, fromChain]);

  useEffect(() => {
    const check = async () => {
      // const toChainMode = getNonEVMMode(toChain?.id ?? 0);
      switch (sourceChainNonEVMMode) {
        case NonEVMMode.flowMainnet:
        case NonEVMMode.flowTest: {
          if (flowAddress.length === 0) {
            return;
          }
          const flowTokenPath = flowTokenPathConfigs.find(config => {
            return config.Symbol === selectedToken?.token.symbol;
          });

          checkTokenReceivabilityForFlowAccount(flowAddress, flowTokenPath?.ReceiverPath ?? "").then(initialized => {
            setFlowAccountInitialized(initialized);
          });
          break;
        }

        case NonEVMMode.aptosMainnet:
        case NonEVMMode.aptosTest:
        case NonEVMMode.aptosDevnet: {
          break;
        }
      }

      switch (toChainNonEVMMode) {
        case NonEVMMode.flowMainnet:
        case NonEVMMode.flowTest: {
          if (flowAddress.length === 0) {
            return;
          }
          const flowTokenPath = flowTokenPathConfigs.find(config => {
            return config.Symbol === selectedToken?.token.symbol;
          });

          checkTokenReceivabilityForFlowAccount(flowAddress, flowTokenPath?.ReceiverPath ?? "").then(initialized => {
            setFlowAccountInitialized(initialized);
          });
          break;
        }

        case NonEVMMode.aptosMainnet:
        case NonEVMMode.aptosTest:
        case NonEVMMode.aptosDevnet: {
          break;
        }
      }
    };

    check();
  }, [flowAddress, aptosAddress, selectedToken, transferPair]);

  useEffect(() => {
    switch (getNonEVMMode(toChain?.id ?? 0)) {
      case NonEVMMode.flowMainnet:
      case NonEVMMode.flowTest: {
        if (flowConnected && flowAddress.length > 0) {
          setNonEVMRecipientAddress(flowAddress);
        } else {
          setNonEVMRecipientAddress("");
        }
        break;
      }
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        if (aptosConnected && aptosAddress) {
          setNonEVMRecipientAddress(aptosAddress);
        } else {
          setNonEVMRecipientAddress("");
        }
        break;
      }
      case NonEVMMode.seiMainnet:
      case NonEVMMode.seiDevnet:
      case NonEVMMode.seiTestnet: {
        if (seiConnected && seiAddress) {
          setNonEVMRecipientAddress(seiAddress);
        } else {
          setNonEVMRecipientAddress("");
        }
        break;
      }
      case NonEVMMode.injectiveTestnet:
      case NonEVMMode.injectiveMainnet: {
        if (injConnected && injAddress) {
          setNonEVMRecipientAddress(injAddress);
        } else {
          setNonEVMRecipientAddress("");
        }
        break;
      }
      case NonEVMMode.off: {
        setNonEVMRecipientAddress(address);
        break;
      }
      default: {
        break;
      }
    }
  }, [
    flowConnected,
    aptosConnected,
    flowAddress,
    aptosAddress,
    seiAddress,
    seiConnected,
    injAddress,
    injConnected,
    toChain,
    address,
  ]);

  const isTransferReady = Number(amount) > 0 && !hasError && receiveAmount && !exceedsSafeguard;

  const getAptosResourcesCallback = useCallback(
    (localAptosAddress: string) => {
      if (!aptosConnected) {
        clearInterval(aptosResourcesQueryTimer);
        return;
      }

      if (!localAptosAddress) {
        clearInterval(aptosResourcesQueryTimer);
        return;
      }

      getAptosResources(localAptosAddress)
        .then(resources => {
          setAptosResources(resources);
        })
        .catch(_ => {
          ///
        });
      clearInterval(aptosResourcesQueryTimer);
      aptosResourcesQueryTimer = setInterval(() => {
        getAptosResources(localAptosAddress)
          .then(resources => {
            setAptosResources(resources);
          })
          .catch(_ => {
            ///
          });
      }, 5000);
    },
    [aptosAddress, aptosConnected],
  );

  useEffect(() => {
    getAptosResourcesCallback(aptosAddress);
  }, [aptosAddress]);

  useEffect(() => {
    if (isTransferReady === 0) {
      setShouldShowResourceRegistrationButton(false);
      return;
    }

    switch (toChainNonEVMMode) {
      case NonEVMMode.flowMainnet:
      case NonEVMMode.flowTest: {
        setShouldShowResourceRegistrationButton(flowConnected && !flowAccountInitialized && isTransferReady);
        break;
      }
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        if (aptosResources === undefined) {
          setShouldShowAptosOnboardingFlow(true);
          setShouldShowResourceRegistrationButton(false);
          return;
        }

        const aptosTokenTypeTag = `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`;
        const aptosToken = aptosResources.find(r => r.type === aptosTokenTypeTag);
        const aptosTokenValue = (aptosToken?.data?.coin?.value ?? 0) / 10 ** 8;

        const aptosChainReceivingToken = transferConfig.chain_token[toChain?.id ?? 0]?.token.find(tokenInfo => {
          return tokenInfo.token.symbol === selectedToken?.token.symbol;
        });
        const aptosChainReceivingTokenTypeTag = `0x1::coin::CoinStore<${
          aptosChainReceivingToken?.token.address ?? ""
        }>`;
        const aptosChainReceivingTokenRegistered =
          aptosResources.find(r => r.type === aptosChainReceivingTokenTypeTag) !== undefined;

        if (aptosTokenValue < 0.002 && !aptosChainReceivingTokenRegistered) {
          setShouldShowAptosOnboardingFlow(true);
          setShouldShowResourceRegistrationButton(false);
        } else {
          setShouldShowAptosOnboardingFlow(false);
          setShouldShowResourceRegistrationButton(
            aptosConnected && !aptosChainReceivingTokenRegistered && isTransferReady,
          );
        }
        break;
      }
      default: {
        setShouldShowResourceRegistrationButton(false);
        break;
      }
    }
  }, [isTransferReady, toChainNonEVMMode, nonEVMTokenBalance, aptosResources, selectedToken, transferConfig]);

  const renderCreateFlowTokenVaultBtn = () => {
    return (
      <Button
        id="transBtn"
        type="primary"
        onClick={setupFlowAccountWithLoadingSign}
        loading={createFlowBtnLoading}
        className={classNames(isMobile ? classes.transMobileBtn : classes.transBtn, classes.createflowBtn)}
      >
        <Tooltip
          overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
          title={`In order to receive ${
            selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)
          } on Flow, you will need to create a ${
            selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)
          }
          vault in your Flow wallet. This does not consume any gas and only needs to be done once per token.`}
          placement="bottomLeft"
          arrowPointAtCenter
          color="#fff"
          overlayInnerStyle={{ color: "#000", width: 265 }}
        >
          <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
        </Tooltip>
        Create {selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)}{" "}
        vault in your Flow wallet
      </Button>
    );
  };

  const renderRegisterAptosTokenBtn = () => {
    return (
      <Button
        type="primary"
        onClick={registerAptosTokenWithLoadingSign}
        loading={registerAptosTokenLoading}
        className={classNames(isMobile ? classes.transMobileBtn : classes.transBtn, classes.createflowBtn)}
      >
        <Tooltip
          overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
          title={`In order to receive ${
            selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)
          } on Aptos, you will need to register ${
            selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)
          }
          in your Aptos wallet. It consumes aptos gas and only needs to be done once per token.`}
          placement="bottomLeft"
          arrowPointAtCenter
          color="#fff"
          overlayInnerStyle={{ color: "#000", width: 265 }}
        >
          <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
        </Tooltip>
        Register{" "}
        {selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)} in your
        Aptos wallet
      </Button>
    );
  };

  let bridgeRate;
  let minimumReceived;
  if (isRfq) {
    if (priceResponse) {
      const feeResTargetAmounts = priceResponse?.fee ?? "0";
      const feeResAmounts = formatDecimal(feeResTargetAmounts, priceResponse?.price?.srcToken?.decimals ?? 0)
        ?.split(",")
        .join("");
      const fee = Number(feeResAmounts);
      bridgeRate = (receiveAmount * 1.0 + fee) / Number(amount);
    }
  } else if (estimateAmtInfoInState) {
    const millionBigNum = BigNumber.from(1000000);

    let minimumReceivedNum = BigNumber.from("0");
    if (amount) {
      const amountBn = safeParseUnits(
        amount,
        getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token?.symbol)?.token.decimal ?? 18,
      );
      minimumReceivedNum = amountBn.sub(
        amountBn.mul(BigNumber.from(estimateAmtInfoInState.maxSlippage)).div(millionBigNum),
      );

      if (minimumReceivedNum.lt(0)) {
        minimumReceivedNum = BigNumber.from("0");
      }
    }
    bridgeRate = estimateAmtInfoInState.bridgeRate;

    minimumReceived =
      formatDecimal(
        minimumReceivedNum || "0",
        getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token?.symbol)?.token.decimal,
      ) + " ";
  }

  const renderBtn = () => {
    if (!connected) {
      return (
        <Button
          id="connectBtn"
          type="primary"
          onClick={showWalletConnectionProviderModal}
          className={isMobile ? classes.transMobileBtn : classes.transBtn}
        >
          {walletConnectionButtonTitle}
        </Button>
      );
    }

    const toChainNonEVMMode = getNonEVMMode(toChain?.id ?? 0);

    if ((toChainNonEVMMode === NonEVMMode.flowMainnet || toChainNonEVMMode === NonEVMMode.flowTest) && !flowConnected) {
      return (
        <Button
          id="transBtn"
          type="primary"
          onClick={showNonEVMProviderModalForToChain}
          className={isMobile ? classes.transMobileBtn : classes.transBtn}
        >
          Connect your Flow wallet to receive the funds
        </Button>
      );
    }

    if (
      (toChainNonEVMMode === NonEVMMode.aptosDevnet ||
        toChainNonEVMMode === NonEVMMode.aptosTest ||
        toChainNonEVMMode === NonEVMMode.aptosMainnet) &&
      !aptosConnected
    ) {
      return (
        <Button
          type="primary"
          onClick={showNonEVMProviderModalForToChain}
          className={isMobile ? classes.transMobileBtn : classes.transBtn}
        >
          Connect your Aptos wallet to receive the funds
        </Button>
      );
    }
    if (
      (toChainNonEVMMode === NonEVMMode.seiMainnet ||
        toChainNonEVMMode === NonEVMMode.seiTestnet ||
        toChainNonEVMMode === NonEVMMode.seiDevnet) &&
      !seiConnected
    ) {
      return (
        <Button
          type="primary"
          onClick={showNonEVMProviderModalForToChain}
          className={isMobile ? classes.transMobileBtn : classes.transBtn}
        >
          Connect your Sei wallet to receive the funds
        </Button>
      );
    }
    if (
      (toChainNonEVMMode === NonEVMMode.injectiveMainnet || toChainNonEVMMode === NonEVMMode.injectiveTestnet) &&
      !injConnected
    ) {
      return (
        <Button
          type="primary"
          onClick={showNonEVMProviderModalForToChain}
          className={isMobile ? classes.transMobileBtn : classes.transBtn}
        >
          Connect your Injective wallet to receive the funds
        </Button>
      );
    }

    if ((!validFloatRegex.test(amount) && amount) || Number(amount) < 0) {
      return (
        <Button
          id="transBtn"
          type="primary"
          onClick={onShowTransferModal}
          loading={loading}
          className={isMobile ? classes.transMobileBtn : classes.transBtn}
          disabled={true}
        >
          Transfer
        </Button>
      );
    }

    const needApprove = ((_allowance: BigNumber | undefined) => {
      if (isNativeToken && !isMetisChainGasToken()) {
        return false;
      }
      const inputAmount = amount || "0";
      const inputBig = safeParseUnits(inputAmount, selectedToken?.token?.decimal ?? 18);

      if (pegConfig.mode === PeggedChainMode.TransitionPegV2) {
        console.debug(
          "transition log",
          pegTokenSupply?.v0PegTokenSupply.toString(),
          pegTokenSupply?.v2PegTokenSupply.toString(),
          inputBig.toString(),
          allowanceForPegV0Contract?.toString(),
          allowanceForPegV2Contract?.toString(),
        );

        if (inputBig.gt(pegTokenSupply?.v0PegTokenSupply ?? BigNumber.from("0")) && allowanceForPegV2Contract?.gt(0)) {
          return false;
        }

        if (inputBig.lte(pegTokenSupply?.v0PegTokenSupply ?? BigNumber.from("0")) && allowanceForPegV0Contract?.gt(0)) {
          return false;
        }
        return true;
      }

      if (!_allowance || _allowance.isZero()) {
        return true;
      }
      try {
        const isGreatThanAllowance = inputBig.gt(_allowance);
        return isGreatThanAllowance;
      } catch {
        return true;
      }
    })(allowance);

    let shouldNotSkipAllowanceCheckForNonEVM = getNonEVMMode(fromChain?.id ?? 0) === NonEVMMode.off;

    if ((needApprove && isTransferReady && shouldNotSkipAllowanceCheckForNonEVM) || hasShowGotAllowance) {
      if (!hasGotAllowance) {
        return (
          <Button
            id="transBtn"
            type="primary"
            loading={true}
            className={isMobile ? classes.transMobileBtn : classes.transBtn}
            disabled
          >
            {" "}
            Checking Allowance
          </Button>
        );
      } else {
        const approveContent =
          "Approve " +
          amount +
          " " +
          (selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id));
        return (
          <div className={classes.buttonBg}>
            {shouldShowResourceRegistrationButton &&
              (toChainNonEVMMode === NonEVMMode.flowMainnet || toChainNonEVMMode === NonEVMMode.flowTest) &&
              renderCreateFlowTokenVaultBtn()}
            {shouldShowResourceRegistrationButton &&
              (toChainNonEVMMode === NonEVMMode.aptosMainnet ||
                toChainNonEVMMode === NonEVMMode.aptosTest ||
                toChainNonEVMMode === NonEVMMode.aptosDevnet) &&
              renderRegisterAptosTokenBtn()}
            <div className={isMobile ? classes.approveBgMobile : classes.approveBg}>
              <Button
                id="approveTransBtn"
                type="primary"
                onClick={approveMethod}
                loading={approveLoading}
                disabled={!(needApprove && !shouldShowResourceRegistrationButton) || transferRelatedFeatureDisabled}
                className={classes.approveTransBtn}
              >
                {isRfq ? (
                  <span style={{ fontSize: approveContent.length > 18 ? 14 : 16 }}>
                    {approveContent.length > 18 ? (
                      <>
                        {" "}
                        <div>Approve</div>
                        <div>
                          {amount}{" "}
                          {selectedToken?.token?.display_symbol ??
                            getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)}
                        </div>{" "}
                      </>
                    ) : (
                      <div>{approveContent}</div>
                    )}
                  </span>
                ) : (
                  <span>
                    <Tooltip
                      overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
                      title={`You must give cBridge smart contracts permission to use your ${
                        selectedToken?.token?.display_symbol ??
                        getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)
                      }, which is an on-chain tx that consumes gas. You only have to do this once per token.`}
                      placement="bottomLeft"
                      arrowPointAtCenter
                      color="#fff"
                      overlayInnerStyle={{ color: "#000", width: 265 }}
                    >
                      <InfoCircleOutlined style={{ fontSize: 13, marginRight: 6 }} />
                    </Tooltip>
                    Approve{" "}
                    {selectedToken?.token?.display_symbol ??
                      getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)}
                  </span>
                )}
              </Button>
              <Button
                id="approveTransBtn"
                type="primary"
                onClick={onShowTransferModal}
                loading={loading}
                className={isMobile ? classes.approveTransBtn : classes.approveTransBtn}
                disabled={
                  (!isTransferReady && !loading) ||
                  isSafeGuardTaskInProgress ||
                  needApprove ||
                  (shouldShowResourceRegistrationButton as boolean) ||
                  transferRelatedFeatureDisabled
                }
              >
                Transfer
              </Button>
            </div>
          </div>
        );
      }
    } else if (isBridgeRateTooLow || (isRfq && bridgeRate <= 0.95)) {
      return (
        <div className={classes.buttonBg}>
          <Button
            id="transBtn"
            type="primary"
            className={isMobile ? classes.transMobileBtn : classes.transBtn}
            disabled={true}
          >
            Bridge rate too low
          </Button>
        </div>
      );
    } else {
      return (
        <div className={classes.buttonBg}>
          {shouldShowResourceRegistrationButton &&
            (toChainNonEVMMode === NonEVMMode.flowMainnet || toChainNonEVMMode === NonEVMMode.flowTest) &&
            renderCreateFlowTokenVaultBtn()}
          {shouldShowResourceRegistrationButton &&
            (toChainNonEVMMode === NonEVMMode.aptosMainnet ||
              toChainNonEVMMode === NonEVMMode.aptosTest ||
              toChainNonEVMMode === NonEVMMode.aptosDevnet) &&
            renderRegisterAptosTokenBtn()}
          <Button
            id="transBtn"
            type="primary"
            onClick={onShowTransferModal}
            loading={loading}
            className={isMobile ? classes.transMobileBtn : classes.transBtn}
            disabled={
              (!isTransferReady && !loading) ||
              isSafeGuardTaskInProgress ||
              (shouldShowResourceRegistrationButton as boolean) ||
              isPegSupplyLoading ||
              transferRelatedFeatureDisabled
            }
          >
            Transfer
          </Button>
        </div>
      );
    }
  };

  const balanceAvailable = (): Boolean => {
    const fromChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
    switch (fromChainNonEVMMode) {
      case NonEVMMode.flowMainnet:
      case NonEVMMode.flowTest: {
        if (flowConnected) {
          return flowAccountInitialized;
        }
        return false;
      }
      case NonEVMMode.aptosMainnet:
      case NonEVMMode.aptosTest:
      case NonEVMMode.aptosDevnet: {
        if (aptosConnected) {
          return aptosTokenRegistered;
        }
        return false;
      }
      case NonEVMMode.seiMainnet:
      case NonEVMMode.seiTestnet:
      case NonEVMMode.seiDevnet:
      case NonEVMMode.injectiveTestnet:
      case NonEVMMode.injectiveMainnet: {
        if (seiConnected) {
          return true;
        }
        return false;
      }
    }
    return true;
  };

  const toChainEVMMode = getNonEVMMode(toChain?.id ?? 0);
  const disableForFlowReceiver = toChainEVMMode === NonEVMMode.flowMainnet || toChainEVMMode === NonEVMMode.flowTest;
  const getOverviewShowDelayPeriodInMins = () => {
    if (
      safeGuardParameters &&
      isReachDelayedTransfer(
        safeGuardParameters.destinationChainDelayThresholds,
        receiveAmount,
        selectedToken?.token.decimal,
      )
    ) {
      return safeGuardParameters.destinationChainDelayTimeInMinutes.toString();
    }

    if (isReachBurnDelayedTransfer(transferPair, amount)) {
      return getPegBurnDelayInfo(transferPair)?.[1]?.toString();
    }

    return undefined;
  };

  return (
    <div className={classes.flexCenter}>
      <Card className={classes.transferCard} bordered={false}>
        <div className={classes.cardContent}>
          {fromChain && isApeChain(fromChain.id) && isMobile ? <ApeTip /> : <></>}

          <div className={classes.trans}>
            <div className={classes.transitem}>
              <div className={classes.transitemTitle}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className={classes.source}>From</div>
                  <div className={classes.transselect}>
                    <div
                      className={classes.chainSelcet}
                      onClick={() => {
                        showChain("from");
                      }}
                    >
                      <Avatar size="small" src={fromChain?.icon} style={{ marginRight: 5 }} />
                      <span id="srcSelectedChain" style={{ marginRight: 13 }}>
                        {fromChain?.name}
                      </span>
                      <img id="srcSelectedChainIcon" src={arrowDowm} alt="more from chain" />
                    </div>
                  </div>
                </div>
                {(() => {
                  if (pegConfig.mode !== PeggedChainMode.Off) {
                    return null;
                  }
                  if (isMobile) {
                    return (
                      <div>
                        <div
                          onClick={e => {
                            e.stopPropagation();
                            handleOpenRateModal();
                          }}
                          style={{ cursor: "pointer", position: "relative" }}
                        >
                          <img src={settingIcon} className={classes.settingIcon} alt="setting icon" />
                        </div>
                        <Modal
                          className={classes.mobileRateModal}
                          title=""
                          closable
                          visible={showRateModal}
                          onCancel={handleCloseRateModal}
                          footer={null}
                          centered
                        >
                          <RateModal
                            onCancle={() => {
                              handleCloseRateModal();
                            }}
                          />
                        </Modal>
                      </div>
                    );
                  }
                  return renderCardSetting();
                })()}
              </div>
              <div className={classes.transcontent}>
                <div className={classes.transnum}>
                  <div className={classes.transnumtext}>Send:</div>
                  {balanceAvailable() && !transferRelatedFeatureDisabled ? (
                    <div
                      className={classes.transnumlimt}
                      onClick={() => {
                        setMaxAmount();
                      }}
                    >
                      Max: <span>{userBalance}</span>
                    </div>
                  ) : showBalancePlaceHolderForNonEVMChain ? (
                    <div className={classes.transnumlimt}>Max: --</div>
                  ) : (
                    ""
                  )}
                </div>
                <div className={classes.transndes}>
                  <div className={classes.transdestext}>
                    <TokenInput
                      value={amount}
                      onChange={handleTokenInputChange}
                      disabled={amountInputDisabled() || transferRelatedFeatureDisabled}
                    />
                  </div>
                  <div className={classes.transdeslimt}>
                    <div id="investSelct" className={classes.investSelct} onClick={() => toggleIsTokenShow()}>
                      <div className={classes.selectpic}>
                        <img src={selectedToken?.icon} alt="" />
                      </div>
                      <div className={classes.selectdes}>
                        {selectedToken?.token?.display_symbol ??
                          getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)}
                      </div>
                      <div className={classes.selecttoog}>
                        <DownOutlined style={{ fontSize: "14px" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.icon}>
              <img
                src={arrowUpDowm}
                alt="arrow up down"
                onClick={() => exchangeFromAndToChain()}
                style={{
                  cursor: "pointer",
                }}
                width={32}
              />
            </div>
            <div className={classes.transitem}>
              <div className={classes.transitemTitle}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className={classes.source}>To</div>
                  <div className={classes.transselect}>
                    <div
                      className={classes.chainSelcet}
                      onClick={() => {
                        showChain("to");
                      }}
                    >
                      <Avatar size="small" src={toChain?.icon} style={{ marginRight: 5 }} />
                      <span style={{ marginRight: 13 }}>{toChain?.name}</span>
                      <img id="dstSelectedChainIcon" src={arrowDowm} alt="more to chain" />
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.transcontent}>
                {fromChain && toChain && selectedToken ? (
                  <div className={classes.transnum}>
                    <div className={classes.transnumtext}>
                      <Tooltip
                        title={
                          <div className={classes.transcontenttip}>
                            This amount is estimated based on the current bridge rate and fees.
                          </div>
                        }
                        placement="top"
                        color="#fff"
                        overlayInnerStyle={{ color: "#000", backgroundColor: "#fff", width: 265 }}
                      >
                        <InfoCircleOutlined style={{ fontSize: 12, marginRight: 6 }} />
                      </Tooltip>
                      Receive (estimated):
                    </div>
                  </div>
                ) : null}
                <div className={classes.transndes}>
                  <div className={classes.transdestext}>
                    {receiveAmount === 0 ? (
                      <span style={{ float: "left" }}>0.0</span>
                    ) : (
                      <span style={{ float: "left" }}>
                        {receiveAmount < 0 ? (
                          "--"
                        ) : (
                          <span className={classes.receiveLabel}>
                            <div>
                              {receiveAmount}{" "}
                              {getTokenDisplaySymbol(
                                selectedToken?.token,
                                fromChain,
                                toChain,
                                transferConfig.pegged_pair_configs,
                              )}
                            </div>
                            {transactionFeeRebateDescription && (
                              <div className={classes.feeRebate}>
                                {transactionFeeRebateDescription}
                                <Tooltip
                                  overlayClassName={classes.opRebateTooltip}
                                  title={
                                    <div className={classes.tooltipContent} style={{ textAlign: "left" }}>
                                      You will receive {opFeeRebatePortion}% rebate in $OP token for this transfer,
                                      including the src tx cost, the base fee and the protocol fee. The rebate can be
                                      claimed in the <span style={{ fontWeight: "bolder" }}>“Rewards” page</span> after
                                      the transfer is completed.
                                    </div>
                                  }
                                  arrowPointAtCenter
                                  placement="top"
                                  color="#fff"
                                  overlayInnerStyle={{ color: "#000", backgroundColor: "#fff", width: 265 }}
                                >
                                  <InfoCircleOutlined className={classes.infoIcon} style={{ marginLeft: 6 }} />
                                </Tooltip>
                              </div>
                            )}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {nonEVMMode !== NonEVMMode.off && fromChainWalletConnected ? (
              <div className={classes.transitem}>
                <div style={{ height: 24 }} />
                <div className={classes.transcontent}>
                  <div className={classes.nonEvmRecipientText}>
                    Recipient address on {toChain?.name} (do NOT send funds to exchanges)
                  </div>
                  <div className={classes.transndes}>
                    <div className={classes.nonEvmAddressText}>
                      <TokenInput
                        value={nonEVMRecipientAddress}
                        placeholderText="Please enter recipient address"
                        onChange={e => {
                          setNonEVMRecipientAddress(e.value);
                        }}
                        disabled={disableForResourceRegistrationChainReceiver || transferRelatedFeatureDisabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className={classes.err}>
          <div className={classes.errInner}>{errorMsg}</div>
        </div>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            position: "relative",
            height: shouldShowResourceRegistrationButton ? 132 : 56,
          }}
        >
          <div className={classes.btnare}>
            <div className={classes.btnarein}>{renderBtn()}</div>
          </div>
        </div>
      </Card>

      {!denyPeg && bridgeRate && !exceedsSafeguard && safeGuardParameters && isRfq ? (
        <RfqTransferOverview
          selectedToken={selectedToken}
          fromChain={fromChain}
          toChain={toChain}
          bridgeRate={bridgeRate}
          transferConfig={transferConfig}
          isBigAmountDelayed={false}
          delayMinutes={""}
          priceResponse={priceResponse}
          latencyMinutes={latencyMinutes}
        />
      ) : null}

      {!denyPeg && bridgeRate && !exceedsSafeguard && safeGuardParameters && !isRfq ? (
        <TransferOverview
          selectedToken={selectedToken}
          fromChain={fromChain}
          toChain={toChain}
          bridgeRate={bridgeRate}
          isBridgeRateTooLow={isBridgeRateTooLow}
          minimumReceived={minimumReceived}
          baseFee={estimateAmtInfoInState?.baseFee}
          percFee={estimateAmtInfoInState?.percFee}
          transferConfig={transferConfig}
          isBigAmountDelayed={getOverviewShowDelayPeriodInMins() != undefined}
          delayMinutes={getOverviewShowDelayPeriodInMins() ?? ""}
          estimateAmtInfoInState={estimateAmtInfoInState}
          latencyMinutes={latencyMinutes}
        />
      ) : null}
      <ProviderModal visible={showProviderModal} onCancel={handleCloseProviderModal} />
      <FlowProviderModal visible={showFlowProviderModal} onCancel={handleCloseFlowProviderModal} />
      <AptosProviderModal visible={showAptosProviderModal} onCancel={handleCloseAptosProviderModal} />
      {shouldShowSwitchAptosEndpoint && (
        <SwitchAptosEnvModal
          showModal={shouldShowSwitchAptosEndpoint}
          claimTitle=""
          onClose={() => {
            setShouldShowSwitchAptosEndpointModal(false);
          }}
        />
      )}
      {showTransferModal && (
        <TransferModal
          amount={maxValue || amount}
          receiveAmount={receiveAmount}
          nonEVMReceiverAddress={nonEVMReceiverAddress()}
          pegSupply={pegTokenSupply}
          onCancel={handleCloseTransferModal}
          onSuccess={handleSuccess}
          latencyMinutes={latencyMinutes}
          isBigAmountDelayed={getOverviewShowDelayPeriodInMins() !== undefined}
          delayMinutes={getOverviewShowDelayPeriodInMins()}
          isRfq={isRfq}
          shouldShowAptosOnboardingFlow={shouldShowAptosOnboardingFlow}
          feeRebateDescription={transactionFeeRebateDescription}
        />
      )}
      <TokenList
        visible={!isNonEVMChain(fromChain?.id ?? 0) && isTokenShow}
        onSelectToken={handleSelectToken}
        onCancel={() => toggleIsTokenShow()}
      />
      <NonEVMChainTokenList
        visible={isNonEVMChain(fromChain?.id ?? 0) && isTokenShow}
        onSelectToken={handleSelectToken}
        onCancel={() => toggleIsTokenShow()}
      />
    </div>
  );
};

export default Transfer;
