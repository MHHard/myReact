import { FC, useCallback, useEffect, useState } from "react";
import { Card, Button, Avatar, Tooltip, Modal } from "antd";
import { createUseStyles } from "react-jss";
import { useToggle, useNetworkState, useAsync } from "react-use";
import { formatUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { MaxUint256 } from "@ethersproject/constants";
import { debounce } from "lodash";
import { WarningFilled, InfoCircleOutlined, DownOutlined, CloseCircleFilled } from "@ant-design/icons";
import { deleteDecimalPart, safeParseUnits, sub } from "celer-web-utils/lib/format";

import { parseUnits } from "ethers/lib/utils";
import { ERC20 } from "../../typechain/typechain/ERC20";
import { ERC20__factory } from "../../typechain/typechain/factories/ERC20__factory";

import { useContractsContext } from "../../providers/ContractsContextProvider";
import { useWeb3Context } from "../../providers/Web3ContextProvider";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import { closeModal, ModalName, openModal } from "../../redux/modalSlice";

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
  setDisableTransferAddlqAggregatelqAction,
  getTokenSymbol,
  getTokenListSymbol,
} from "../../redux/transferSlice";

import { useCustomContractLoader, useTokenBalance, useReadOnlyCustomContractLoader } from "../../hooks";
import { formatDecimal } from "../../helpers/format";
import { BridgeType, TokenInfo, TransferPair } from "../../constants/type";
import { Theme } from "../../theme";

import TokenInput, { ITokenInputChangeEvent } from "../../components/TokenInput";

import settingIcon from "../../images/setting.svg";
import arrowUpDowm from "../../images/arrowupdown.svg";
import arrowDowm from "../../images/arrow-D.svg";
import TransferOverview, { getTokenDisplaySymbol } from "./TransferOverview";
import { EstimateAmtRequest, ErrCode, EstimateAmtResponse } from "../../proto/gateway/gateway_pb";
import {
  PeggedChainMode,
  usePeggedPairConfig,
  GetPeggedMode,
  getTokenBalanceAddress,
} from "../../hooks/usePeggedPairConfig";
import { useTransferSupportedTokenList } from "../../hooks/transferSupportedInfoList";
import { useWalletConnectionContext } from "../../providers/WalletConnectionContextProvider";
import { useMultiBurnConfig } from "../../hooks/useMultiBurnConfig";
import { isApeChain } from "../../hooks/useTransfer";
import { ApeTip } from "../nft/ApeTips";
import { useBridgeChainTokensContext } from "../../providers/BridgeChainTokensProvider";
import { useSafeGuardCheck } from "../../hooks/useSafeGuardChecker";
import { PegTokenSupply, usePegV2Transition } from "../../hooks/usePegV2Transition";
import { gatewayServiceWithGrpcUrlClient } from "../../redux/grpcClients";
import { getTokenUnitPriceInUSD } from "../../helpers/tokenPriceCalculation";
import { getRfqPrice, getTransferLatency } from "../../redux/gateway";
import { PriceRequest, PriceResponse } from "../../proto/sdk/service/rfq/user_pb";
import { Token } from "../../proto/sdk/common/token_pb";
import { MaxUint96, validFloatRegex } from "../../constants/const";
import DestinationChainTokenList from "../../components/transfer/DestinationChainTokenList";
import { useDestinationChainTokenList } from "../../hooks/useDestinationChainTokenList";
import {
  estimateCircleUSDCTransfer,
  findCircleBridgeProxyContractAddress,
  shouldUseCircleUSDCBridge,
} from "../../helpers/circleUSDCTransferHelper";
import { isETH } from "../../helpers/tokenInfo";

import TokenList from "../../components/transfer/TokenList";
import ProviderModal from "../../components/ProviderModal";
import TransferModal from "../../components/transfer/TransferModal";
import RateModal from "../../components/RateModal";
import RfqTransferOverview from "./RfqTransferOverview";

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

const Transfer: FC = () => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const {
    contracts: { bridge, transferAgent, rfqContract },
    transactor,
  } = useContractsContext();
  const { provider, signer, chainId, address, getNetworkById } = useWeb3Context();
  const { connected, walletConnectionButtonTitle } = useWalletConnectionContext();
  const dispatch = useAppDispatch();
  const networkState = useNetworkState();
  const { transferInfo, modal, globalInfo, serviceInfo } = useAppSelector(state => state);
  const { refreshGlobalTokenBalance } = globalInfo;
  const { transferRelatedFeatureDisabled } = serviceInfo;
  // const globalTokenBalance = BigNumber.from(globalTokenBalanceString);
  const { showProviderModal, showRateModal, showTransferModal } = modal;
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
    priceOfTokens,
    rfqConfig,
    circleUSDCConfig,
    disableTransferAddlqAggregatelqAction,
    disableTransferAddlqAggregatelqActionLoading,
  } = transferInfo;
  const pegConfig = usePeggedPairConfig();
  const { multiBurnConfig, multiBurnSpenderAddress } = useMultiBurnConfig();
  const [isBridgeRateTooLow, setIsBridgeRateTooLow] = useState(false);

  const tokenAddress = getTokenBalanceAddress(
    selectedToken?.token?.address || "",
    fromChain?.id,
    selectedToken?.token.symbol,
    transferConfig.pegged_pair_configs,
  );

  const tokenContract = useCustomContractLoader(provider, tokenAddress, ERC20__factory) as ERC20 | undefined;

  const readOnlyTokenContract = useReadOnlyCustomContractLoader(fromChain?.id, tokenAddress, ERC20__factory) as
    | ERC20
    | undefined;

  const [tokenBalance, balanceLoading, , refreshBalance] = useTokenBalance(
    {
      symbol: selectedToken?.token.symbol || "",
      address: tokenAddress,
      chainId: fromChain?.id || 0,
      decimal: selectedToken?.token.decimal || 18,
      xfer_disabled: false,
      isNative: selectedToken?.token.isNative || false,
    },
    3000,
    getNetworkById,
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

  // when bridge from nonevm chain to evm chain, if the evm wallet not connected,
  // user must to input the evm wallet address.
  const [nonEVMRecipientAddress, setNonEVMRecipientAddress] = useState<string>("");
  const [flowAccountInitialized, setFlowAccountInitialized] = useState(false);
  const [aptosTokenRegistered, setAptosTokenRegistered] = useState(false);
  const [registerAptosTokenLoading, setRegisterAptosTokenLoading] = useState(false);
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
    getTransferPair(transferConfig, fromChain?.id, toChain?.id, selectedToken?.token.symbol ?? "", getNetworkById),
  );

  const { onPegSupplyCallback } = usePegV2Transition();

  const [isPegSupplyLoading, setIsPegSupplyLoading] = useState<boolean>(false);
  const [isRfq, setIsRfq] = useState<boolean>(false);
  const [isEstimateEnd, setIsEstimateEnd] = useState<boolean>(false);

  let showBalancePlaceHolderForNonEVMChain = false;

  const destinationChainTokenList = useDestinationChainTokenList();
  const [shouldShowDestinationChainTokenSelectionUI, setShouldShowDestinationChainTokenSelectionUI] = useState(false);
  const [selectedDestinationTokenForUSDCBridge, setSelectedDestinationTokenForUSDCBridge] = useState<
    TokenInfo | undefined
  >(undefined);
  const [showDestinationTokenList, toggleShowDestinationTokenList] = useToggle(false);
  const [shouldUseCircleUSDC, setShouldUseCircleUSDC] = useState(false);

  const { safeGuardParameters, safeguardException, isSafeGuardTaskInProgress } = useSafeGuardCheck(
    transferPair,
    selectedDestinationTokenForUSDCBridge,
  );

  useEffect(() => {
    const transferPair = getTransferPair(
      transferConfig,
      fromChain?.id,
      toChain?.id,
      selectedToken?.token.symbol ?? "",
      getNetworkById,
    );
    setTransferPair(transferPair);
  }, [fromChain, toChain, selectedToken, transferConfig, refreshSafeGuardCheck]);

  useEffect(() => {
    setShouldShowDestinationChainTokenSelectionUI(destinationChainTokenList.length > 1);
    if (destinationChainTokenList.length >= 1) {
      setSelectedDestinationTokenForUSDCBridge(destinationChainTokenList[0]);
    } else {
      setSelectedDestinationTokenForUSDCBridge(undefined);
    }
  }, [destinationChainTokenList]);

  useEffect(() => {
    setShouldUseCircleUSDC(
      shouldUseCircleUSDCBridge(circleUSDCConfig, selectedToken, selectedDestinationTokenForUSDCBridge),
    );
  }, [circleUSDCConfig, selectedToken, selectedDestinationTokenForUSDCBridge]);

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
      if (onPegSupplyCallback === null || !transferPair || transferPair.bridgeType !== BridgeType.PegV2Burn) {
        setPegTokenSupply(undefined);
        return;
      }
      setIsPegSupplyLoading(true);
      const result = await onPegSupplyCallback();
      console.debug("onPegSupplyCallback", result);
      setPegTokenSupply(result);
      setIsPegSupplyLoading(false);
    };
    loadPegSupply();
  }, [onPegSupplyCallback, transferPair]);

  useEffect(() => {
    const getPegV0AndV2Allowance = async () => {
      if (!selectedToken || !pegConfig || !tokenContract || !address) {
        return;
      }
      if (tokenContract.address.toLowerCase() != selectedToken.token.address.toLowerCase()) {
        return;
      }
      if (pegConfig.config.pegged_token?.token?.address.toLowerCase() != selectedToken.token.address.toLowerCase()) {
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

    const skipAddressCheckForCircleUSDCBridge = shouldUseCircleUSDCBridge(
      circleUSDCConfig,
      selectedToken,
      selectedDestinationTokenForUSDCBridge,
    );

    if (!isRfq && !skipAddressCheckForCircleUSDCBridge) {
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

  const setDestinationToken = (tokenInfo: TokenInfo) => {
    toggleShowDestinationTokenList();
    setAmount("");
    setMaxValue("");
    setReceiveAmount(0);
    setFee(0);
    setSelectedDestinationTokenForUSDCBridge(tokenInfo);
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

  const generateWaringMsgWithElement = (element: JSX.Element) => {
    return (
      <div className="warningInnerbody">
        <WarningFilled style={{ fontSize: 20, marginRight: 5 }} />
        {element}
      </div>
    );
  };

  const bigAmountDelayedMsg = (tokenSymbol: string, minutes: string, threshold: string) => {
    console.debug(`delay transfer, token:${tokenSymbol}, threshold: ${threshold}`);
    return (
      <div style={{ display: "inline-flex" }}>
        <div className="warningInnerbody" style={{ display: "inline-flex", margin: "8px 0px 8px 12px" }}>
          <WarningFilled style={{ fontSize: 20, marginRight: 10 }} />
        </div>
        <div style={{ display: "inline", margin: "8px 0px" }}>
          <span className="msgInnerbody" style={{ display: "inline", margin: "0px" }}>
            {`Attention: this transfer will take`}
          </span>
          <span
            className="msgInnerbody"
            style={{ display: "inline", margin: "0px 4px", color: "#17171A", fontWeight: "bold" }}
          >
            {`${minutes} minutes`}
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
    if (multiBurnConfig) {
      setSpenderAddr(multiBurnSpenderAddress);
    } else if (shouldUseCircleUSDC) {
      setSpenderAddr(findCircleBridgeProxyContractAddress(circleUSDCConfig, selectedToken?.token.chainId ?? 0));
    } else if (pegConfig.mode === PeggedChainMode.Off) {
      setSpenderAddr(bridge?.address ?? "");
    } else {
      setSpenderAddr(pegConfig.getSpenderAddress());
    }
  }, [pegConfig, bridge, multiBurnConfig, isRfq, rfqContract, transferAgent, selectedToken, shouldUseCircleUSDC]);

  // Highlight current token when first loaded.
  useEffect(() => {
    const tokenSymbol =
      (isETH(selectedToken?.token) ? "ETH" : getTokenListSymbol(selectedToken?.token.symbol, chainId)) || "";
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

  // set user balance
  useEffect(() => {
    let balance = "0";
    balance = !balanceLoading ? formatDecimal(tokenBalance, selectedToken?.token?.decimal) : "0";
    setUserBalance(balance);
  }, [tokenBalance, fromChain, selectedToken, balanceLoading, chainId]);

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

  const errorProcessor = {
    isOffline(networkState) {
      if (!networkState.online) {
        console.log("networkState111:", networkState);
        return generateErrMsg(`Network error. Please check your Internet connection.`, "CloseCircleFilled");
      }
      return undefined;
    },
    isTokenNotEnable(tokenEnabled, selectedToken, fromChain, toChain) {
      if (!tokenEnabled) {
        return generateErrMsg(
          `${
            isETH(selectedToken?.token) ? "ETH" : getTokenListSymbol(selectedToken?.token?.symbol, fromChain?.id)
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
            isETH(transferPair.sourceChainToken.token)
              ? "ETH"
              : getTokenListSymbol(transferPair.sourceChainToken.token?.symbol, transferPair.sourceChainInfo?.id)
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
                    switchChain(
                      fromChain.id,
                      selectedToken,
                      (targetFromChainId: number) => {
                        console.debug(`switched chain to ${targetFromChainId}`);
                      },
                      getNetworkById,
                    );
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
        console.log("isValueGtMaxAmount:", maxAmount, value, value.gt(maxAmount), transferPair.sourceChainToken);
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
    isValueGtBalance(amount, selectedToken, tokenBalance) {
      if (sessionStorage.getItem("bot")) return undefined;
      const value = safeParseUnits(Number(amount).toString(), selectedToken?.token?.decimal ?? 18) || BigNumber.from(0);
      if (value.gt(tokenBalance)) {
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
      if (safeguardMaxAmount) {
        const formatedAmount = formatUnits(
          safeguardMaxAmount!.toString(),
          transferPair.sourceChainToken?.token.decimal,
        );
        let valueExceeds = false;
        let errorDescription = ``;
        valueExceeds = value.gt(safeguardMaxAmount);
        errorDescription = `The maximum transfer amount is
          ${deleteDecimalPart(formatedAmount.toString())}
          ${getTokenSymbol(
            transferPair.sourceChainToken?.token.symbol,
            transferPair.sourceChainInfo?.id,
          )}. Please reduce your transfer amount.`;

        if (valueExceeds) {
          setExceedsSafeguard(true);
          return generateErrMsg(errorDescription, "CloseCircleFilled");
        }
      }
      return undefined;
    },

    isRecipientAddressInputInValid(amount, nonEVMRecipientAddress, toChain) {
      if (Number(amount) == 0 && nonEVMRecipientAddress.length === 0) {
        return undefined;
      }
      const addressInputWithout0x = nonEVMRecipientAddress.replace("0x", "");
      if (addressInputWithout0x.match(/^[0-9a-f]+$/i) && addressInputWithout0x.length === 40) {
        setNonEVMRecipientAddress("0x" + addressInputWithout0x);
        return undefined;
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
          console.log(
            "isExcceedCoMinterCap:",
            amountWithDecimal,
            coMinterBurnCap,
            amountWithDecimal.gt(coMinterBurnCap),
          );
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
          console.log("pegTokenSupply:", amountWithDecimal, pegTokenSupply);
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
        console.log("isInboundEpochCap:", token, amountBigNumber, amountBigNumber.gt(inboundEpochCapBigNumber));
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
          console.log(
            "isExcceedWrapTokenLiquidityThreshold:",
            wrapTokenCap,
            wrapTokenCap.gt(0),
            amountWithDecimal,
            amountWithDecimal.gt(wrapTokenCap),
          );
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
        console.log("networkState222:", networkState, safeGuardError);
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

    isCircleUSDCBridgeAvailable(shouldShowDestinationChainTokenSelectionUI: boolean) {
      const USDCToken = destinationChainTokenList?.filter(dst => dst?.token?.symbol === "USDC");
      const USDC_CIRCLE_Token = destinationChainTokenList?.filter(dst => dst?.token?.symbol === "USDC_CIRCLE");
      const usdc_addr = USDCToken.length > 0 ? USDCToken[0]?.token.address : "";
      const usdc_circle_addr = USDC_CIRCLE_Token.length > 0 ? USDC_CIRCLE_Token[0]?.token.address : "";

      if (shouldShowDestinationChainTokenSelectionUI) {
        return generateWaringMsgWithElement(
          <div>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#17171A" }}>
              You can select&nbsp;
              <span
                style={{ fontSize: 14, fontWeight: 500, color: "#3366FF", cursor: "pointer" }}
                onClick={() => {
                  window.open(getNetworkById(toChain?.id ?? 0).blockExplorerUrl + "/token/" + usdc_addr);
                }}
              >
                USDC.e
              </span>
              &nbsp;or&nbsp;
              <span
                style={{ fontSize: 14, fontWeight: 500, color: "#3366FF", cursor: "pointer" }}
                onClick={() => {
                  window.open(getNetworkById(toChain?.id ?? 0).blockExplorerUrl + "/token/" + usdc_circle_addr);
                }}
              >
                USDC
              </span>
              &nbsp;to receive on {toChain?.name}
            </span>
          </div>,
        );
      }

      return undefined;
    },
  };

  useEffect(() => {
    if (shouldShowDestinationChainTokenSelectionUI) {
      handleWarning(warningProcessor.isCircleUSDCBridgeAvailable(shouldShowDestinationChainTokenSelectionUI));
    }
  }, [shouldShowDestinationChainTokenSelectionUI]);

  useEffect(() => {
    clearError();
    const offlineInfo = errorProcessor.isOffline(networkState);
    if (offlineInfo) {
      handleError(offlineInfo);
    } else {
      // if safeGuardTask is in progress, wait for the task to finish, otherwise it's maybe the old result be used to handle the error.
      if (isSafeGuardTaskInProgress) {
        return;
      }

      if (shouldShowDestinationChainTokenSelectionUI) {
        handleWarning(warningProcessor.isCircleUSDCBridgeAvailable(shouldShowDestinationChainTokenSelectionUI));
      }

      // prevent data mismatch cause by continuous async call, check current transfer pair snapshot match with safeguard request snapshot.
      if (safeGuardParameters?.transferPairSnapshot) {
        if (getTransferSnapshot(transferPair) !== safeGuardParameters.transferPairSnapshot && !shouldUseCircleUSDC) {
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
          errorProcessor.isAmountInvalid(maxValue || amount) ||
          errorProcessor.isAmountParseError(amount, transferPair.sourceChainToken) ||
          errorProcessor.isValueGtBalance(amount, transferPair.sourceChainToken, tokenBalance) ||
          errorProcessor.isFeeGtAmount(fee, amount) ||
          errorProcessor.isRecipientAddressInputInValid(amount, nonEVMRecipientAddress, toChain);
      } else if (shouldUseCircleUSDC) {
        errorInfo =
          errorProcessor.isTokenNotEnable(
            tokenEnabled,
            transferPair.sourceChainToken,
            transferPair.sourceChainInfo,
            transferPair.destinationChainInfo,
          ) ||
          errorProcessor.isTokenPaused(tokenPaused, estimateAmtErrMsg) ||
          errorProcessor.isFromChainSameAsDstChain(transferPair.sourceChainInfo, transferPair.destinationChainInfo) ||
          errorProcessor.isFromChainDiffFromWalletChain(transferPair.sourceChainInfo, chainId) ||
          errorProcessor.isAmountInvalid(maxValue || amount) ||
          errorProcessor.isAmountParseError(amount, selectedToken) ||
          errorProcessor.isValueGtBalance(amount, selectedToken, tokenBalance) ||
          errorProcessor.isFeeGtAmount(fee, amount);
        if (errorInfo) {
          clearError();
        }
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
          errorProcessor.isAmountInvalid(maxValue || amount) ||
          errorProcessor.isAmountParseError(amount, transferPair.sourceChainToken) ||
          errorProcessor.isValueGtBalance(amount, transferPair.sourceChainToken, tokenBalance) ||
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
          errorProcessor.isRecipientAddressInputInValid(amount, nonEVMRecipientAddress, toChain);
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
            ) ||
            warningProcessor.isSourceChainBurnDelayed(transferPair, amount) ||
            warningProcessor.isCircleUSDCBridgeAvailable(shouldShowDestinationChainTokenSelectionUI);
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
    noTokenOnDst,
    receiveAmount,
    denyPeg,
    nonEVMRecipientAddress,
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
    if (res.getErr()?.getCode() === ErrCode.ERROR_CODE_ADDRESS_BLOCKED) {
      dispatch(setDisableTransferAddlqAggregatelqAction(true));
      dispatch(openModal(ModalName.disabledModal));
    }

    return res;
  };

  const estimateAmtResProcessor = (res: EstimateAmtResponse, targetToken) => {
    if (!res?.getErr()) {
      setIsRfq(false);
      dispatch(setEstimateAmtInfoInState(res.toObject()));
      const feeBigNum = BigNumber.from(res?.getBaseFee()).add(BigNumber.from(res?.getPercFee()));
      const totalFee = feeBigNum.toString() || "0";
      const destinationChainTokenInfo =
        selectedDestinationTokenForUSDCBridge ?? getTokenByChainAndTokenSymbol(toChain?.id, targetToken?.token?.symbol);
      const totalFeeWithoutDecimal = Number(
        formatDecimal(totalFee, destinationChainTokenInfo?.token.decimal)?.split(",").join(""),
      );
      const targetReceiveAmounts = res.getEstimatedReceiveAmt();
      const receiveAmounts = formatDecimal(targetReceiveAmounts, destinationChainTokenInfo?.token.decimal)
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
  }, [fromChain, toChain, amount, selectedToken, address, rate, shouldUseCircleUSDC]);

  const getEstimate = () => {
    setIsEstimateEnd(false);
    setIsBridgeRateTooLow(false);
    debounceFn(async () => {
      if (!amount) {
        return undefined;
      }
      const latestKey =
        fromChain?.id + "--" + toChain?.id + "--" + selectedToken?.token.symbol + "--" + address + "--" + amount + "--";
      sessionStorage.setItem("LatestEstimationKey", latestKey);

      const cannotEstimat =
        estimateErrorProcessor.isOffLine(networkState) ||
        estimateErrorProcessor.isTokenNotEnable(amount) ||
        estimateErrorProcessor.isDenyPeg(toChain) ||
        estimateErrorProcessor.isNoTokenSupported(selectedToken) ||
        estimateErrorProcessor.isAmountInvalid(maxValue || amount);
      if (cannotEstimat) {
        setLoading(false);
        setIsEstimateEnd(true);
        return undefined;
      }
      if (Number(amount) > 0) {
        setLoading(true);
      }
      let estimateReceiveAmountNum = 0;
      let quoteReceiveAmountNum = 0;
      let estimateRes: EstimateAmtResponse | undefined = undefined;
      let priceRes: PriceResponse | undefined = undefined;

      if (shouldUseCircleUSDC) {
        const value = safeParseUnits(amount || "0", selectedToken?.token?.decimal ?? 6);
        const circleUSDCEstimateResponse = await estimateCircleUSDCTransfer(
          fromChain?.id ?? 0,
          findCircleBridgeProxyContractAddress(circleUSDCConfig, selectedToken?.token.chainId ?? 0),
          toChain?.id ?? 0,
          value,
          getNetworkById,
        );
        setLoading(false);
        estimateAmtResProcessor(circleUSDCEstimateResponse, selectedToken);
        setIsEstimateEnd(true);
        return;
      }

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
        // const rfqSpecificChains = process.env.REACT_APP_ENV === "TEST" ? [5, 97] : [56, 137];
        // const rfqSpecificTokens = ["USDT", "USDC"];
        // const isSpecialRfqPair =
        //   quoteReceiveAmountNum > 0 &&
        //   rfqSpecificChains.includes(priceRes.getPrice()?.getSrcToken()?.getChainId() ?? 0) &&
        //   rfqSpecificChains.includes(priceRes.getPrice()?.getDstToken()?.getChainId() ?? 0) &&
        //   rfqSpecificTokens.includes(priceRes.getPrice()?.getSrcToken()?.getSymbol() ?? "") &&
        //   rfqSpecificTokens.includes(priceRes.getPrice()?.getDstToken()?.getSymbol() ?? "");

        const isSpecialRfqPair = false;

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
    if (denyPeg) {
      return;
    }

    let maxShow = formatDecimal(tokenBalance.toString(), selectedToken?.token?.decimal).split(",").join("");
    let maxSen = formatDecimal(tokenBalance.toString(), selectedToken?.token?.decimal, selectedToken?.token?.decimal)
      ?.split(",")
      .join("");

    // native token need to subtract 0.01, but metis is 0.03
    const subGasAmount = isMetisChainGasToken() ? 0.03 : 0.01;
    if (selectedToken?.token.isNative || isMetisChainGasToken()) {
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

  const isAuraGasToken = () => {
    return fromChain?.id === 999999996 && selectedToken?.token.symbol === "AURA";
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
    switchChain(
      paramChain.id,
      paramToken,
      (chainId: number) => {
        const chain = transferConfig.chains.find(chainInfo => {
          return chainInfo.id === chainId;
        });
        if (chain !== undefined) {
          dispatch(setFromChain(chain));
        }
      },
      getNetworkById,
    );

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

  const handleCloseTransferModal = () => {
    refreshBalance();
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

  const handleSelectToken = (targetTokenInfo: TokenInfo) => {
    if (!tokenList) {
      return;
    }
    dispatch(setSelectedToken(targetTokenInfo));
    dispatch(
      setSelectedTokenSymbol(
        isETH(targetTokenInfo.token)
          ? "ETH"
          : getTokenListSymbol(targetTokenInfo?.token.symbol, targetTokenInfo.token.chainId),
      ),
    );
    toggleIsTokenShow();
    setAmount("");
    setMaxValue("");
    setReceiveAmount(0);
    setFee(0);
  };

  const showWalletConnectionProviderModal = useCallback(() => {
    dispatch(openModal(ModalName.provider));
  }, [dispatch]);

  const handleOpenDisabledModal = () => {
    dispatch(openModal(ModalName.disabledModal));
  };

  const onShowTransferModal = useCallback(async () => {
    if (disableTransferAddlqAggregatelqAction) {
      handleOpenDisabledModal();
      return;
    }
    dispatch(openModal(ModalName.transfer));
  }, [dispatch, isRfq, priceResponse, fromChain, toChain, disableTransferAddlqAggregatelqAction]);
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
    let approveMax = MaxUint256;
    // symbol:MCHC    approve MaxUint96
    if (selectedToken?.token.symbol === "MCHC") {
      approveMax = MaxUint96;
    }

    if (!selectedToken?.token.isNative || isMetisChainGasToken()) {
      setHasShowGotAllowance(true);
      setApproveLoading(true);
      try {
        if (pegConfig.mode === PeggedChainMode.TransitionPegV2) {
          const inputBig = safeParseUnits(amount || "0", selectedToken?.token?.decimal ?? 18);

          if (inputBig.gt(pegTokenSupply?.v0PegTokenSupply ?? BigNumber.from("0"))) {
            const approveTx = await transactor(
              tokenContract.approve(pegConfig.config.pegged_burn_contract_addr, approveMax),
            );
            await approveTx.wait();
            setAllowanceForPegV2Contract(approveMax);
          } else {
            const approveTx = await transactor(
              tokenContract.approve(pegConfig.config.migration_peg_burn_contract_addr, approveMax),
            );
            await approveTx.wait();
            setAllowanceForPegV0Contract(approveMax);
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
          const approveTx = await transactor(tokenContract.approve(spenderAddr, approveMax, { gasPrice: 0 }));
          await approveTx.wait();
        } else {
          const approveTx = await transactor(tokenContract.approve(spenderAddr, approveMax));
          await approveTx.wait();
        }
        getAllowance();
      } catch (e) {
        setApproveLoading(false);
      }
    }
  };

  const amountInputDisabled = () => {
    return denyPeg;
  };

  const nonEVMReceiverAddress = () => {
    return address;
  };

  useEffect(() => {
    setNonEVMRecipientAddress(address);
  }, [address]);

  const isTransferReady = Number(amount) > 0 && !hasError && receiveAmount && !exceedsSafeguard;

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
  } else if (estimateAmtInfoInState && shouldUseCircleUSDC) {
    minimumReceived =
      formatDecimal(estimateAmtInfoInState.estimatedReceiveAmt || "0", selectedToken?.token.decimal ?? 6) + " ";
    bridgeRate = estimateAmtInfoInState.bridgeRate;
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

    if ((!validFloatRegex.test(amount) && amount) || Number(amount) < 0) {
      return (
        <Button
          id="transBtn"
          type="primary"
          onClick={onShowTransferModal}
          loading={loading || disableTransferAddlqAggregatelqActionLoading}
          className={isMobile ? classes.transMobileBtn : classes.transBtn}
          disabled={true}
        >
          Transfer
        </Button>
      );
    }

    const needApprove = ((
      _allowance: BigNumber | undefined,
      _allowanceForPegV0Contract: BigNumber | undefined,
      _allowanceForPegV2Contract: BigNumber | undefined,
    ) => {
      if (selectedToken?.token.isNative && !isMetisChainGasToken()) {
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
          _allowanceForPegV0Contract?.toString(),
          _allowanceForPegV2Contract?.toString(),
        );

        if (inputBig.gt(pegTokenSupply?.v0PegTokenSupply ?? BigNumber.from("0")) && _allowanceForPegV2Contract?.gt(0)) {
          return false;
        }

        if (
          inputBig.lte(pegTokenSupply?.v0PegTokenSupply ?? BigNumber.from("0")) &&
          _allowanceForPegV0Contract?.gt(0)
        ) {
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
    })(allowance, allowanceForPegV0Contract, allowanceForPegV2Contract);

    if ((needApprove && isTransferReady) || hasShowGotAllowance) {
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
          (isETH(selectedToken?.token) ? "ETH" : getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id));
        return (
          <div className={classes.buttonBg}>
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
                          {isETH(selectedToken?.token)
                            ? "ETH"
                            : getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)}
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
                        isETH(selectedToken?.token)
                          ? "ETH"
                          : getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)
                      }, which is an on-chain tx that consumes gas. You only have to do this once per token.`}
                      placement="bottomLeft"
                      arrowPointAtCenter
                      color="#fff"
                      overlayInnerStyle={{ color: "#000", width: 265 }}
                    >
                      <InfoCircleOutlined style={{ fontSize: 13, marginRight: 6 }} />
                    </Tooltip>
                    Approve{" "}
                    {isETH(selectedToken?.token)
                      ? "ETH"
                      : getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)}
                  </span>
                )}
              </Button>
              <Button
                id="approveTransBtn"
                type="primary"
                onClick={onShowTransferModal}
                loading={loading || disableTransferAddlqAggregatelqActionLoading}
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
          <Button
            id="transBtn"
            type="primary"
            onClick={onShowTransferModal}
            loading={loading || disableTransferAddlqAggregatelqActionLoading}
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

  const showTipsTokenArray = ["ASTR", "DOT"];
  const showTipsChainArray = [592];
  const tipsWhenDstChainIsInjective = () => {
    if (
      showTipsChainArray.includes(fromChain?.id || 0) &&
      toChain?.id === 999999997 &&
      Number(amount) > 0 &&
      showTipsTokenArray.includes(selectedToken?.token.symbol || "")
    ) {
      return (
        <div className={classes.errInner} style={{ margin: "24px 0 0 0" }}>
          <div
            className="errInnerbody"
            style={{ margin: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <WarningFilled style={{ fontSize: 20, marginRight: 10, color: "#ff8f00" }} />
            <span style={{ color: "#17171A" }}>
              You will receive CW20 tokens on Injective, you can visit{" "}
              <span
                style={{ cursor: "pointer", color: "#1890ff" }}
                onClick={() => {
                  window.open(`https://hub.injective.network/wallet/`, "_blank");
                }}
              >
                Injective Hub
              </span>{" "}
              to convert them into bank-type tokens in your wallet balances.
            </span>
          </div>
        </div>
      );
    }
    return <div />;
  };

  const tipsWhenSrcChainIsInjective = () => {
    if (
      fromChain?.id === 999999997 &&
      showTipsChainArray.includes(toChain?.id || 0) &&
      Number(amount) > 0 &&
      showTipsTokenArray.includes(selectedToken?.token.symbol || "")
    ) {
      return (
        <div className={classes.errInner} style={{ margin: "24px 0 0 0" }}>
          <div
            className="errInnerbody"
            style={{ margin: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <WarningFilled style={{ fontSize: 20, marginRight: 10, color: "#ff8f00" }} />
            <span style={{ color: "#17171A" }}>
              You can only transfer CW20 tokens from Injective. Please visit{" "}
              <span
                style={{ cursor: "pointer", color: "#1890ff" }}
                onClick={() => {
                  window.open(`https://hub.injective.network/wallet/`, "_blank");
                }}
              >
                Injective Hub
              </span>{" "}
              to convert bank-type tokens into CW20 tokens in your wallet balances.
            </span>
          </div>
        </div>
      );
    }
    return <div />;
  };
  const ensuringEnoughASTRBalance = () => {
    const checkList = ["INJ", "ATOM"];
    if (
      fromChain?.id === 999999997 &&
      toChain?.id === 592 &&
      Number(amount) > 0 &&
      checkList.includes(selectedToken?.token.symbol || "")
    ) {
      return (
        <div className={classes.errInner} style={{ margin: "24px 0 0 0" }}>
          <div
            className="errInnerbody"
            style={{ margin: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <WarningFilled style={{ fontSize: 20, marginRight: 10, color: "#ff8f00" }} />
            <span style={{ color: "#17171A" }}>
              Please ensure there is at least 0.1 $ASTR in your Astar account before bridging{" "}
              {selectedToken?.token.symbol || ""} into Astar to avoid fund release being held up. Learn more about how
              to get $ASTR{" "}
              <span
                style={{ cursor: "pointer", color: "#1890ff" }}
                onClick={() => {
                  window.open(
                    `https://docs.astar.network/docs/user-guides/transfer-tokens/#sending-astrsdn-to-astar-network-from-centralized-exchanges`,
                    "_blank",
                  );
                }}
              >
                here
              </span>
              . Contact support if your transaction is pending due to insufficient $ASTR.
            </span>
          </div>
        </div>
      );
    }
    return <div />;
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
                  if (pegConfig.mode !== PeggedChainMode.Off || shouldUseCircleUSDC) {
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
                  {!transferRelatedFeatureDisabled ? (
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
                        {isETH(selectedToken?.token)
                          ? "ETH"
                          : getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)}
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
                                shouldUseCircleUSDC,
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
                  {shouldShowDestinationChainTokenSelectionUI && (
                    <div className={classes.transdeslimt}>
                      <div
                        id="investSelct"
                        className={classes.investSelct}
                        onClick={() => toggleShowDestinationTokenList()}
                      >
                        <div className={classes.selectpic}>
                          <img src={selectedDestinationTokenForUSDCBridge?.icon} alt="" />
                        </div>
                        <div className={classes.selectdes}>
                          {getTokenListSymbol(
                            selectedDestinationTokenForUSDCBridge?.token.symbol ?? "",
                            selectedDestinationTokenForUSDCBridge?.token.chainId,
                          )}
                        </div>
                        <div className={classes.selecttoog}>
                          <DownOutlined style={{ fontSize: "14px" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.err}>
          {fromChain?.id === 999999997 ? tipsWhenSrcChainIsInjective() : tipsWhenDstChainIsInjective()}
          {ensuringEnoughASTRBalance()}
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

      {!denyPeg && bridgeRate && !exceedsSafeguard && safeGuardParameters && !shouldUseCircleUSDC && !isRfq ? (
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
          useCircleUSDC={shouldUseCircleUSDC}
        />
      ) : null}
      {!denyPeg && bridgeRate && !exceedsSafeguard && shouldUseCircleUSDC ? (
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
          useCircleUSDC={shouldUseCircleUSDC}
        />
      ) : null}
      <ProviderModal visible={showProviderModal} onCancel={handleCloseProviderModal} />
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
          selectedDestinationChainToken={selectedDestinationTokenForUSDCBridge}
        />
      )}
      <TokenList visible={isTokenShow} onSelectToken={handleSelectToken} onCancel={() => toggleIsTokenShow()} />
      <DestinationChainTokenList
        visible={showDestinationTokenList}
        onSelectToken={setDestinationToken}
        onCancel={() => toggleShowDestinationTokenList()}
        selectedToken={selectedDestinationTokenForUSDCBridge}
      />
    </div>
  );
};

export default Transfer;
