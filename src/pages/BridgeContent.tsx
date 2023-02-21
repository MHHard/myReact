import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Card,
  Button,
  Avatar,
  Tooltip,
  Checkbox,
  message,
  Skeleton,
} from "antd";
import { useToggle, useNetworkState } from "react-use";
import { BigNumber } from "@ethersproject/bignumber";
import { debounce } from "lodash";
import { MaxUint256 } from "@ethersproject/constants";

import {
  formatDecimal,
  formatDecimalWithSeparation,
  safeParseUnits,
  sub,
} from "number-format-utils/lib/format";
import { ERC20 } from "../typechain/ERC20";
import { ERC20__factory } from "../typechain/factories/ERC20__factory";
import { useContractsContext } from "../providers/ContractsContextProvider";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { closeModal, ModalName, openModal } from "../redux/modalSlice";
import { storageConstants, disableAllActionButton } from "../constants/const";
import { getNetworkById } from "../constants/network";

import {
  setIsChainShow,
  setChainSource,
  setFromChain,
  setToChain,
  setSelectedToken,
  switchChain,
  setEstimateAmtInfoInWithKey,
  setTokenSource,
  getTokenSymbol,
  setQuoteLoading,
  setSwapAmount,
  setHasError,
  setErrorMsg,
} from "../redux/transferSlice";

import { useCustomContractLoader } from "../hooks";

import { QuoteRequest } from "../proto/chainhop/web_pb";

import TokenInput, {
  ITokenInputChangeEvent,
} from "../components/common/TokenInput";
import TokenList, { getNativeToken } from "./TokenList";
// import { ReactComponent as exchangeIcon } from "../images/exchangeIcon.svg";
import { queryFeeAndError } from "../redux/chainhop";
import SendModal from "./SendModal";
import useReadOnlyCustomContractLoader from "../hooks/customReadyOnlyContractLoader";
import { ColorThemeContext } from "../providers/ThemeProvider";
import { useNativeETHToken } from "../hooks/useNativeETHToken";
import { errorProcessor, generateErrMsg } from "../helpers/SwapDateHandle";
import { TokenBalance } from "../constants/type";

import { getLocalTokenIcon } from "../constants/token_icons";
import TokenIcon from "../components/common/TokenIcon";

import { Chain, Token } from "../proto/chainhop/common_pb";

import arrowDown from "../images/arrowDown.png";
import tsIcon from "../images/tsIcon.png";
import Account from "../components/Account";
import CurrentChainOfWallet from "../components/CurrentChainOfWallet";

interface GenericError {
  message?: string;
  stack?: string;
  code?: number;
}

export const tokenIsNative = (
  chain: Chain.AsObject | undefined,
  tokenInfo: Token.AsObject | undefined
) => {
  let tag = false;
  if (!chain) {
    return false;
  }
  const LocalChain = getNetworkById(chain?.chainId);
  if (tokenInfo?.symbol === LocalChain?.symbol) {
    tag = true;
  }
  return tag;
};

const BridgeContent = forwardRef(() => {
  const {
    contracts: { transferSwapper },
    transactor,
  } = useContractsContext();
  const { provider, signer, chainId, address, web3Modal } = useWeb3Context();
  const dispatch = useAppDispatch();
  const networkState = useNetworkState();
  const { transferInfo, modal } = useAppSelector((state) => state);
  const { sendModal } = modal;
  const [unlimitedApprove, toggleUnlimitedApprove] = useToggle(false);
  const {
    fromChain,
    toChain,
    selectedToken,
    estimateAmtInfoInWithKey,
    srcTokenList,
    homeLoading,
    hasError,
    quoteLoading,
    errorMsg,
    transferConfig,
  } = transferInfo;

  const tokenContract = useCustomContractLoader(
    provider,
    selectedToken?.address,
    ERC20__factory
  ) as ERC20 | undefined;

  const { isNativeToken, ETHBalance, refreshETH, nativeTokenLoading } =
    useNativeETHToken(fromChain, selectedToken);

  const srcTokenContract = useReadOnlyCustomContractLoader(
    fromChain?.chainId,
    selectedToken?.address || "",
    ERC20__factory
  ) as ERC20 | undefined;

  const [amount, setAmount] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [sourceTokenBalance, setSourceTokenBalance] = useState("");
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [errorElement, setErrorElement] = useState<JSX.Element | null>(null);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [isTokenShow, toggleIsTokenShow] = useToggle(false);
  const [allowance, setAllowance] = useState<BigNumber>();
  const [refreshBlance, setRefreshBlance] = useToggle(true);
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | undefined>();
  const [tokenBalanceLoading, setTokenBalanceLoading] =
    useState<boolean>(false);
  const { isMobile } = useContext(ColorThemeContext);

  useEffect(() => {
    getEstimate();
  }, [fromChain, toChain, amount, selectedToken, address]);

  const getEstimate = () => {
    setTimeout(() => {
      setReceiveAmount(100);
    }, 1000);
  };

  const handleCloseSendModal = () => {
    dispatch(closeModal(ModalName.sendModal));
  };

  const getTokenBalance = async () => {
    setTokenBalanceLoading(true);
    if (
      !selectedToken ||
      !srcTokenContract ||
      !fromChain ||
      srcTokenContract?.address !== selectedToken?.address
    ) {
      setTokenBalanceLoading(false);
      return;
    }

    if (isNativeToken) {
      setTokenBalance({
        isNativeToken: true,
        balance: ETHBalance,
        sysmbol: selectedToken.symbol,
        decimals: selectedToken.decimals,
      });
      setTokenBalanceLoading(false);
      return;
    }

    try {
      const balance = await srcTokenContract?.balanceOf(address);
      setTokenBalance({
        isNativeToken: false,
        balance,
        sysmbol: selectedToken.symbol,
        decimals: selectedToken.decimals,
      });
      setTokenBalanceLoading(false);
    } catch (error) {
      console.log("getBalance error", error);
      setTokenBalanceLoading(false);
    }
  };

  useEffect(() => {
    getTokenBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    srcTokenContract,
    selectedToken,
    fromChain,
    refreshBlance,
    address,
    ETHBalance,
    isNativeToken,
  ]);

  const setTokenMethod = (symbol?: string) => {
    if (srcTokenList && srcTokenList.length > 0) {
      if (!fromChain) {
        return;
      }
      if (symbol !== selectedToken?.symbol) {
        setTokenBalance(undefined);
      }
      let targetToken: Token.AsObject =
        srcTokenList.find((token) => {
          return token?.symbol === symbol;
        }) || srcTokenList[0];
      const nativeTokenSymbol = getNetworkById(fromChain.chainId || 1).symbol;
      if (nativeTokenSymbol === symbol) {
        const nativeToken = getNativeToken(fromChain.chainId, srcTokenList);
        if (nativeToken) {
          targetToken = nativeToken;
        }
      }
      dispatch(setSelectedToken(targetToken));
      initData();
      toggleIsTokenShow();
    }
  };

  const reloadAllBalance = () => {
    console.log("reloadAllBalance");
    if (isNativeToken) {
      refreshETH();
    } else {
      setRefreshBlance();
    }
    // setDstTokenReloading();
  };

  const setAmountFunc = (val) => {
    setAmount(val);
    dispatch(setSwapAmount(val));
  };

  const initData = () => {
    setAmountFunc("");
    setMaxValue("");
    setReceiveAmount(0);
    dispatch(
      setEstimateAmtInfoInWithKey({
        key: "",
        estimateAmtInfoInState: null,
      })
    );
    dispatch(
      setErrorMsg({
        code: 0,
        msg: "",
      })
    );
  };
  useEffect(() => {
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromChain, toChain]);

  const clearErrorData = () => {
    dispatch(
      setErrorMsg({
        code: 0,
        msg: "",
      })
    );
    setReceiveAmount(0);
    dispatch(
      setEstimateAmtInfoInWithKey({
        key: "",
        estimateAmtInfoInState: null,
      })
    );
  };
  const clearError = () => {
    setErrorElement(null);
    dispatch(setHasError(false));
  };
  const handleError = (errorMsgParam) => {
    setErrorElement(errorMsgParam);
    dispatch(setHasError(true));
  };

  useEffect(() => {
    clearError();
    const offlineInfo = errorProcessor.isOffline(networkState);
    const checkValue = maxValue || amount;

    if (offlineInfo) {
      handleError(offlineInfo);
    } else if (signer) {
      const errorInfo =
        errorProcessor.isFromChainSameAsDstChain(fromChain, toChain) ||
        errorProcessor.isAmountInvalid(checkValue) ||
        errorProcessor.isValueGtBalance(
          checkValue,
          selectedToken,
          tokenBalance,
          tokenBalanceLoading,
          nativeTokenLoading
        ) ||
        errorProcessor.isFeeGtAmount(checkValue, errorMsg) ||
        errorProcessor.isValueLteMinSendValue(
          checkValue,
          selectedToken,
          errorMsg,
          fromChain
        ) ||
        errorProcessor.isValueGteMaxSendValue(
          checkValue,
          errorMsg,
          selectedToken,
          fromChain
        ) ||
        errorProcessor.isNoRouteFound(errorMsg, checkValue);
      if (errorInfo) {
        handleError(errorInfo);
      }
    } else if (!signer) {
      const errorInfo =
        errorProcessor.isFromChainSameAsDstChain(fromChain, toChain) ||
        errorProcessor.isAmountInvalid(checkValue) ||
        errorProcessor.isFeeGtAmount(checkValue, errorMsg) ||
        errorProcessor.isNoRouteFound(errorMsg, checkValue);
      if (errorInfo) {
        handleError(errorInfo);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    networkState,
    signer,
    amount,
    maxValue,
    chainId,
    fromChain,
    toChain,
    tokenBalance,
    isNativeToken,
    estimateAmtInfoInWithKey?.estimateAmtInfoInState,
    selectedToken,
    receiveAmount,
    errorMsg,
    isMobile,
  ]);

  const showChain = (type) => {
    dispatch(setChainSource(type));
    dispatch(setIsChainShow(true));
  };
  const showToken = (type) => {
    dispatch(setTokenSource(type));
    toggleIsTokenShow();
  };

  const buildTokenProtoData = (
    token: Token.AsObject | undefined,
    cId: number
  ) => {
    const protoToken = new Token();
    if (!token) {
      return protoToken;
    }
    protoToken.setSymbol(token.symbol);
    protoToken.setAddress(token.address);
    protoToken.setDecimals(token.decimals);
    protoToken.setName(token.name);
    protoToken.setLogoUri(token.logoUri);
    protoToken.setChainId(cId);
    return protoToken;
  };

  const buildEstimateInfoRequest = ({
    fChain,
    tChain,
    fromToken,
    toToken,
    value,
  }) => {
    const estimateRequest = new QuoteRequest();
    const srcToken = buildTokenProtoData(fromToken, fChain?.chainId);
    srcToken.setChainId(fChain.chainId);
    const dstToken = buildTokenProtoData(toToken, tChain?.chainId);
    estimateRequest.setDstToken(dstToken);
    estimateRequest.setSrcToken(srcToken);
    estimateRequest.setAmountIn(value.toString());
    estimateRequest.setNativeOut(tokenIsNative(tChain, toToken));
    const nonce = Date.now();
    estimateRequest.setNonce(nonce);
    estimateRequest.setOnlyBridgesList([]);
    estimateRequest.setOnlySwapsList([]);
    return estimateRequest;
  };

  const getEstimateInfo = async (item, isCheckQuery = false) => {
    const { fChain, tChain, fromToken, val, network } = item;

    if (!network.online) {
      setErrorElement(
        generateErrMsg(`Network error. Please check your Internet connection.`)
      );
      return;
    }

    if (!fChain || !tChain || !fromToken) {
      return;
    }
    if (Number(item.val) <= 0 || Number.isNaN(Number(item.val))) {
      return;
    }
    let value = BigNumber.from(0);
    try {
      value = safeParseUnits(val || "0", fromToken?.decimals);
      setLoading(!isCheckQuery);
      dispatch(setQuoteLoading(true));
      const quoteRequest = buildEstimateInfoRequest({
        fChain,
        tChain,
        fromToken,
        toToken: fromToken,
        value,
      });
      sessionStorage.setItem(
        storageConstants.KEY_QUOTE_NONCE,
        `${quoteRequest.getNonce()}`
      );

      const responses = await queryFeeAndError(quoteRequest);
      const quoteRes = responses.toObject();
      if (quoteRes.err) {
        dispatch(setErrorMsg(quoteRes?.err));
      } else {
        dispatch(
          setErrorMsg({
            code: 0,
            msg: "",
          })
        );
      }

      // if the nonce matched response has not arrived, will keep the loading view.
      if (
        quoteRes.nonce ===
        Number(sessionStorage.getItem(storageConstants.KEY_QUOTE_NONCE))
      ) {
        setLoading(false);
        dispatch(setQuoteLoading(false));
      }
    } catch (error) {
      console.log("quote error", error);
      setLoading(false);
      dispatch(setQuoteLoading(false));
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  const debouncedSave = useCallback(
    debounce((nextValue) => {
      clearErrorData();
      getEstimateInfo({
        ...nextValue,
        fromChain,
        toChain,
        address,
        network: networkState,
        isNativeToken,
      });
    }, 500),
    [selectedToken, fromChain, toChain, address, networkState, isNativeToken]
  );

  useEffect(() => {
    clearErrorData();
    const checkValue = maxValue || amount || "0";
    debouncedSave({
      fromToken: selectedToken,
      val: checkValue,
    });
  }, [amount, maxValue]);

  const setMaxAmount = () => {
    if (!signer || !tokenBalance || sourceTokenBalance.length === 0) {
      return;
    }
    let maxShow = formatDecimal(
      tokenBalance?.balance.toString(),
      6,
      tokenBalance?.decimals,
      "floor",
      true
    );
    let maxSen = formatDecimal(
      tokenBalance.balance.toString(),
      tokenBalance?.decimals,
      tokenBalance?.decimals
    );
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
      clearErrorData();
      getEstimateInfo({
        fromChain,
        toChain,
        fromToken: selectedToken,
        val: "0",
        address,
        network: networkState,
        isNativeToken,
      });
      return;
    }
    setAmountFunc(maxShow.toString());
    setMaxValue(maxSen.toString());
  };
  const isMetisChainGasToken = () => {
    return fromChain?.chainId === 1088 && selectedToken?.symbol === "Metis";
  };

  const handleTokenInputChange = (e: ITokenInputChangeEvent) => {
    if (e.error) {
      setErrorElement(generateErrMsg(e.error));
      dispatch(setHasError(true));
    } else {
      dispatch(setHasError(false));
    }

    let val = e.value;
    if (e.value.indexOf(".") > -1) {
      const num = e.value.split(".")[0];
      const dot = e.value.split(".")[1].slice(0, selectedToken?.decimals || 6);
      val = num + "." + dot;
    }
    if (val !== amount) {
      clearErrorData();
    }

    setReceiveAmount(0);
    setMaxValue("");
    setAmountFunc(val);
  };

  const exchangeFromAndToChain = () => {
    if (!fromChain || !toChain) {
      return;
    }
    const tmpfromChain = fromChain;
    const tmpChain = toChain;
    dispatch(setToChain(tmpfromChain));
    dispatch(setFromChain(tmpChain));
    if (tmpfromChain.chainId !== tmpChain.chainId) {
      switchChain(tmpChain.chainId, "", (cId: number) => {
        const chain = transferConfig.chains.find((chainInfo) => {
          return chainInfo.chainId === cId;
        });
        if (chain !== undefined) {
          dispatch(setFromChain(chain));
        }
      });
    }
    setTokenBalance(undefined);
    setSourceTokenBalance("--");
    initData();
    setRefreshBlance();
  };

  const handleSelectToken = (symbol: string) => {
    setTokenMethod(symbol);
  };

  const onShowProviderModal = useCallback(() => {
    dispatch(openModal(ModalName.provider));
  }, [dispatch]);

  useEffect(() => {
    if (tokenBalanceLoading) {
      return;
    }
    if (tokenBalance) {
      const balance =
        fromChain?.chainId === chainId && !tokenBalanceLoading
          ? formatDecimalWithSeparation(
              tokenBalance?.balance,
              6,
              tokenBalance?.decimals,
              "floor",
              ",",
              true
            )
          : "--";
      console.log("111111111", balance);
      setSourceTokenBalance(balance);
    } else {
      setSourceTokenBalance("");
    }
  }, [tokenBalance, tokenBalanceLoading]);

  const getAllowance = useCallback(() => {
    if (!tokenContract || !address || !transferSwapper?.address || !amount) {
      return;
    }
    if (isNativeToken) {
      return;
    }

    tokenContract
      ?.allowance(address, transferSwapper.address)
      .then((result) => {
        setAllowance(result);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [address, tokenContract, transferSwapper?.address, amount]);

  const approveMethod = async () => {
    if (!transactor || !tokenContract || !transferSwapper) {
      return;
    }
    // console.debug("[approve-debug] spender address:", transferSwapper.address);
    if (!isNativeToken) {
      setApproveLoading(true);
      try {
        const value = safeParseUnits(
          maxValue || amount,
          selectedToken?.decimals ?? 18
        );
        const approveAmount = unlimitedApprove ? MaxUint256 : value;
        const approveTx = await transactor(
          tokenContract.approve(transferSwapper.address || "", approveAmount)
        );
        await approveTx.wait();
        setAllowance(approveAmount);
        setApproveLoading(false);
      } catch (e) {
        setApproveLoading(false);
      }
    }
  };

  useEffect(() => {
    getAllowance();
  }, [getAllowance]);

  const handleTxError = (err) => {
    const isCancelByUser = err?.message?.indexOf("Action cancelled by user");
    if (err?.message.includes("insufficient funds")) {
      message.error("insufficient funds");
      return;
    }
    if (err?.code !== 4001 && !isCancelByUser) {
      console.log("is cancel by user");
    }
  };

  const handleAction = async () => {
    try {
      console.log("12342222");
    } catch (e) {
      const err = e as GenericError;
      setLoading(false);
      setBtnLoading(false);
      handleTxError(err);
      console.log("err:", err);
    } finally {
      setLoading(false);
      setBtnLoading(false);
    }
  };

  const handleSuccess = () => {
    reloadAllBalance();
    initData();
  };

  let needApprove = false;

  if (
    !isNativeToken &&
    allowance &&
    estimateAmtInfoInWithKey?.estimateAmtInfoInState &&
    Number(amount) > 0 &&
    !hasError
  ) {
    const value = safeParseUnits(
      maxValue || amount,
      selectedToken?.decimals ?? 18
    );
    needApprove = (value && value.gt(allowance)) || allowance.eq(0);
  }
  if (fromChain?.chainId !== chainId) {
    needApprove = false;
  }

  const isFromChainDiffFromWallet =
    !!errorProcessor.isFromChainDiffFromWalletChain(
      fromChain,
      chainId,
      isMobile
    );
  const buttonClick = () => {
    // swap
  };

  const showButton = () => {
    if (web3Modal.cachedProvider === "") {
      return (
        <Button
          id="swapBtn"
          type="primary"
          onClick={onShowProviderModal}
          className="transBtn swapBtn"
        >
          Connect Wallet
        </Button>
      );
    }
    if (isFromChainDiffFromWallet) {
      return (
        <Button
          id="swapBtn"
          type="primary"
          onClick={() => {
            if (signer) {
              switchChain(fromChain?.chainId, "");
            }
          }}
          className="transBtn swapBtn"
        >
          <span>
            Switch to{" "}
            <img width={28} src={fromChain?.icon} alt="fromChainIcon" />{" "}
            {fromChain?.name}
          </span>
        </Button>
      );
    }
    const buttonDisabled =
      (!(Number(amount) > 0 && receiveAmount) && !loading && !btnLoading) ||
      hasError ||
      needApprove ||
      disableAllActionButton;
    // if (buttonDisabled) {
    //   // Just for display, in order to avoid the background color of the button from flickering in dark mode
    //   return <div className="transBtn swapBtnDisable">Swap</div>;
    // }
    return (
      <Button
        id="swapBtn"
        type="primary"
        className={buttonDisabled ? "swapBtnDisable" : "transBtn"}
        onClick={() => {
          buttonClick();
        }}
        loading={(loading || btnLoading || quoteLoading) && !sendModal}
        disabled={buttonDisabled}
      >
        Swap
      </Button>
    );
  };

  return (
    <div className="bridgeContent">
      <div className="bridgeContentRight">
        <CurrentChainOfWallet />
        <Account />
      </div>
      <Card className="transferCard" bordered={false}>
        <div className="cardContent">
          <div className="transTop">
            <div className="settingsTitle" />
          </div>
          <div className="transitem">
            <div className="transitemFrom">
              <div className="transitemTitle">FROM</div>
              <div className="transselect">
                <div
                  className="chainSelcet"
                  onClick={() => {
                    if (!homeLoading) {
                      showChain("from");
                    }
                  }}
                >
                  {homeLoading ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Skeleton.Avatar shape="circle" active size={28} />
                      <Skeleton.Input
                        active
                        style={{
                          marginLeft: 5,
                          height: 24,
                          width: 108,
                          borderRadius: 12,
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        size={28}
                        src={fromChain?.icon}
                        style={{ marginLeft: 5 }}
                      />
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          marginLeft: 5,
                        }}
                      >
                        {fromChain?.name}
                      </span>
                    </div>
                  )}

                  {!homeLoading && (
                    <img
                      id="srcSelectedChainIcon"
                      // src={themeType === "dark" ? arrowDowmWhite : arrowDowm}
                      src={arrowDown}
                      alt="more from chain"
                      style={{ width: 14, height: 8.5, marginLeft: 10 }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="transcontent">
              <div className="transnum">
                <div className="transnumlimt">
                  <div style={{ fontWeight: 600, fontSize: 12 }}>Send</div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (!disableAllActionButton) {
                        setMaxAmount();
                      }
                    }}
                  >
                    {sourceTokenBalance.length > 0 && signer && !homeLoading
                      ? sourceTokenBalance
                      : "--"}{" "}
                    <span className="transnumlimtmax">Max</span>
                  </div>
                </div>
              </div>
              <div className="transdes">
                <div
                  className={
                    Number(amount) > 0 ? "transdestextActive" : "transdestext"
                  }
                >
                  <TokenInput
                    clsName={
                      Number(amount) > 0
                        ? "transdestextActiveInput"
                        : "transdestextInput"
                    }
                    value={amount}
                    onChange={handleTokenInputChange}
                    disabled={
                      !!(
                        fromChain &&
                        toChain &&
                        fromChain?.chainId === toChain?.chainId
                      ) || disableAllActionButton
                    }
                  />
                </div>
                <div className="transdeslimt">
                  {homeLoading ? (
                    <div className="investSelctForLoading">
                      <Skeleton.Button
                        active
                        shape="round"
                        style={{ width: 85, height: 36, borderRadius: 10 }}
                      />
                    </div>
                  ) : (
                    <div
                      id="srcInvestSelct"
                      className="investSelct"
                      onClick={() => {
                        showToken("from");
                      }}
                    >
                      <div className="selectpic">
                        <TokenIcon
                          src={getLocalTokenIcon(selectedToken)}
                          className="selectTokenIcon"
                        />
                      </div>
                      <div className="selectdes">
                        {getTokenSymbol(
                          selectedToken?.symbol || "",
                          fromChain?.chainId
                        )}
                      </div>
                      <div className="selecttoog">
                        <img
                          src={arrowDown}
                          alt="more source token"
                          style={{ width: 14, height: 8.5 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="icon" onClick={() => exchangeFromAndToChain()}>
            <img className="transitemIcon" src={tsIcon} alt="" />
          </div>
          <div className="transitem">
            <div className="transitemTo">
              <div className="transitemTitle">TO</div>
              <div className="transselect">
                <div
                  className="chainSelcet"
                  onClick={() => {
                    if (!homeLoading) {
                      showChain("to");
                    }
                  }}
                >
                  {homeLoading ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Skeleton.Avatar shape="circle" active size={28} />
                      <Skeleton.Input
                        active
                        style={{
                          marginLeft: 5,
                          height: 24,
                          width: 108,
                          borderRadius: 12,
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        size={28}
                        src={toChain?.icon}
                        style={{ marginLeft: 5 }}
                      />
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          marginLeft: 5,
                        }}
                      >
                        {toChain?.name}
                      </span>
                    </div>
                  )}

                  {!homeLoading && (
                    <img
                      id="dstSelectedChainIcon"
                      src={arrowDown}
                      alt="more from chain"
                      style={{ width: 14, height: 8.5, marginLeft: 10 }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="transcontent">
              <div className="transnum">
                <div className="transnumlimt">
                  <div style={{ fontWeight: 600, fontSize: 12 }}>
                    Received Amount (estimated)
                  </div>
                </div>
              </div>
              <div className="transdes">
                <div
                  className={
                    Number(receiveAmount) > 0
                      ? "transdestextActive"
                      : "transdestext"
                  }
                >
                  {receiveAmount === 0 ? (
                    <span
                      style={{ float: "left" }}
                      className="transdestextInput"
                    >
                      0.0
                    </span>
                  ) : (
                    <span style={{ float: "left" }}>
                      <div className="transdestextActiveInput">
                        {receiveAmount}{" "}
                        <span style={{ fontSize: 16, fontWeight: 600 }}>
                          {selectedToken?.symbol}
                        </span>
                      </div>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            textAlign: "center",
            position: "relative",
          }}
          className="bridgeBottom"
        >
          {errorElement && (
            <div className="err">
              <div className="errInner">
                {!homeLoading && !loading && errorElement}
              </div>
            </div>
          )}
          <div className="btnare">
            <div className="btnarein">
              {needApprove && (
                <div className="unlimit-div">
                  <Checkbox
                    checked={unlimitedApprove}
                    onChange={() => toggleUnlimitedApprove()}
                  />
                  <span className="unlimit-text">Approve unlimited amount</span>
                  <Tooltip
                    title={`By checking this box, you grant the ChainHop contract to use an unlimited amount of ${selectedToken?.symbol}.`}
                    arrowPointAtCenter
                    color="#000"
                    overlayInnerStyle={{ color: "#fff", width: 220 }}
                  />
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                {needApprove && (
                  <Button
                    id="swapBtn"
                    type="primary"
                    onClick={() => approveMethod()}
                    loading={approveLoading}
                    className="transBtn swapBtn"
                    disabled={disableAllActionButton}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {unlimitedApprove ? (
                      <span>Approve unlimited {selectedToken?.symbol} </span>
                    ) : (
                      <span>
                        Approve {amount} {selectedToken?.symbol}{" "}
                      </span>
                    )}
                  </Button>
                )}
              </div>
              <div>{showButton()}</div>
            </div>
          </div>
        </div>
      </Card>
      <SendModal
        visible={sendModal}
        onClose={() => {
          setBtnLoading(false);
          reloadAllBalance();
          handleCloseSendModal();
        }}
      />

      {isTokenShow && (
        <TokenList
          visible={isTokenShow}
          onSelectToken={handleSelectToken}
          onCancel={() => toggleIsTokenShow()}
        />
      )}
    </div>
  );
});
export default BridgeContent;
