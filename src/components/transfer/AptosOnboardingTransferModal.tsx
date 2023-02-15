import { Button } from "antd";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { createUseStyles } from "react-jss";
import { LoadingOutlined } from "@ant-design/icons";
import { JsonRpcProvider, TransactionReceipt } from "@ethersproject/providers";
import { base64 } from "ethers/lib/utils";
import { BigNumber } from "ethers";

import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";
import { getAptosResources, submitAptosProxyRegisterAndMintRequest } from "../../redux/NonEVMAPIs/aptosAPIs";
import { GetTransferRelayInfoRequest, GetTransferRelayInfoResponse } from "../../proto/gateway/gateway_pb";
import { getTransferRelayInfo } from "../../redux/gateway";
import { useNonEVMContext } from "../../providers/NonEVMContextProvider";
import { Chain, TokenInfo } from "../../constants/type";
import { getNetworkById } from "../../constants/network";

interface AptosOnboardingTransferModalIProps {
    nonEVMReceiverAddress: string;
    sourceChainInfo: Chain | undefined,
    sourceChainTransferId: string;
    sourceChainTransactionHashLink: string;
    destinationTokenInfo: TokenInfo | undefined;
    aptosPeggedBridgeContractAddress: string;
    onFinish: () => void;
}

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
    statusDescription: {
      fontSize: 14,
      width: "100%",
      textAlign: "center",
      fontWeight: 500,
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
    waitingForBlock: {
      fontWeight: 700,
      fontSize: 14,
      justifyContent: "center",
      color: theme.surfacePrimary,
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
  
// eslint-disable-next-line
enum AptosOnboardingStatus {
    submitting = 0,
    waitingForBlockConfirmations = 1,  
    waitingForSGNConfirmations = 2, 
    clickToClaimToken = 3, 
}

let aptosOnboardingQueryTimer: NodeJS.Timer ;

const AptosOnboardingTransferModal = forwardRef((props: AptosOnboardingTransferModalIProps, ref) => {
  const {
    nonEVMReceiverAddress,
    sourceChainInfo,
    sourceChainTransferId,
    sourceChainTransactionHashLink,
    destinationTokenInfo,
    aptosPeggedBridgeContractAddress,
    onFinish
  } = props;
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const [aptosOnboardingStatus, setAptosOnboardingStatus] = 
      useState<AptosOnboardingStatus>(AptosOnboardingStatus.submitting)
  const { provider } = useWeb3Context()
  const [sourceChainTransactionReceipt, setSourceChainTransactionReceipt] = useState<TransactionReceipt | undefined>()
  const [sourceChainBlockNumber, setSourceChainBlockNumber] = useState<number | undefined>()
  // eslint-disable-next-line
  const [aptosResources, setAptosResources] = useState<any | undefined>(undefined); 
  const [aptosRelayInfo, setAptosRelayInfo] = useState<GetTransferRelayInfoResponse | undefined>()
  const [claimButtonLoading, setClaimButtonLoading] = useState(false)
  const [currentWaitingBlock, setCurrentWaitingBlock] = useState(1)
  const { signAndSubmitTransaction } = useNonEVMContext();
  const blockProvider = new JsonRpcProvider(getNetworkById(sourceChainInfo?.id ?? 1).rpcUrl);

  const stopAptosOnboardingQuery = () => {
    clearInterval(aptosOnboardingQueryTimer)
  }

  useImperativeHandle(ref, () => ({
    stopAptosOnboardingQuery,
  }));

  useEffect(() => {
    if (sourceChainTransactionReceipt === undefined || sourceChainTransactionReceipt === null) {
      return
    }

    if (sourceChainTransactionReceipt.status === undefined || sourceChainTransactionReceipt.status === null) {
      return
    }

    if (sourceChainTransactionReceipt.status === 1 && sourceChainTransactionReceipt.blockNumber > 0) {
      setAptosOnboardingStatus(AptosOnboardingStatus.waitingForBlockConfirmations)
    }
  }, [sourceChainTransactionReceipt])

  useEffect(() => {
    if (sourceChainTransactionReceipt === undefined || sourceChainTransactionReceipt === null) {
      return
    }

    if (sourceChainBlockNumber === undefined) {
      return 
    }

    if (sourceChainInfo === undefined) {
      console.log("Unexpected undefined source chain info")
      return 
    }

    if (aptosOnboardingStatus === AptosOnboardingStatus.clickToClaimToken || 
        aptosOnboardingStatus === AptosOnboardingStatus.waitingForSGNConfirmations) {
        return 
    }

    const blockDifference = sourceChainBlockNumber - sourceChainTransactionReceipt.blockNumber
    setCurrentWaitingBlock(Math.max(1, blockDifference))

    if (blockDifference > sourceChainInfo.block_delay) {
      setAptosOnboardingStatus(AptosOnboardingStatus.waitingForSGNConfirmations)
    }

  }, [sourceChainBlockNumber, sourceChainTransactionReceipt, sourceChainInfo, aptosOnboardingStatus])

  useEffect(() => {
    if (aptosResources === undefined) {
      return 
    }

    if (aptosRelayInfo === undefined) {
      return 
    }

    if (aptosOnboardingStatus === AptosOnboardingStatus.clickToClaimToken) {
      return 
    }

    if (aptosResourcesValidation(aptosResources) && relayInfoValidation(aptosRelayInfo)) {
      setAptosOnboardingStatus(AptosOnboardingStatus.clickToClaimToken)
    }
  }, [aptosResources, aptosRelayInfo, aptosOnboardingStatus])

  useEffect(() => {
    switch (aptosOnboardingStatus) {
      case AptosOnboardingStatus.submitting: {
        clearInterval(aptosOnboardingQueryTimer)
        aptosOnboardingQueryTimer = setInterval(() => {
          queryTransactionStatus(provider, sourceChainTransactionHashLink).then((receipt) => {
            setSourceChainTransactionReceipt(receipt)
          })
        }, 3000)
        break
      }
      case AptosOnboardingStatus.waitingForBlockConfirmations: {
        clearInterval(aptosOnboardingQueryTimer)
        aptosOnboardingQueryTimer = setInterval(() => {
          blockProvider.getBlockNumber().then(blockNumber => {
            setSourceChainBlockNumber(blockNumber)
          })    
        }, 1000)
        break
      }
      case AptosOnboardingStatus.waitingForSGNConfirmations: {
        clearInterval(aptosOnboardingQueryTimer)
        aptosOnboardingQueryTimer = setInterval(() => {
          let relayInfoPromise = queryAptosMintTokenParameters(sourceChainTransferId)
          let aptosResourcesPromise = queryAptosResources(nonEVMReceiverAddress)

          if (aptosRelayInfo !== undefined && relayInfoValidation(aptosRelayInfo)) {
            relayInfoPromise = Promise.resolve(aptosRelayInfo)
          } 

          if (aptosResources !== undefined && aptosResourcesValidation(aptosResources)) {
            aptosResourcesPromise = Promise.resolve(aptosResources)
          }
          Promise.all([
            relayInfoPromise, 
            aptosResourcesPromise,
          ]).then(result => {
            setAptosRelayInfo(result[0])
            setAptosResources(result[1])
          })
        }, 3000)
        break
      }
      case AptosOnboardingStatus.clickToClaimToken: {
        clearInterval(aptosOnboardingQueryTimer)
        break
      }
      default: {
        break
      }
    }
  // eslint-disable-next-line
  }, [aptosOnboardingStatus, aptosResources, aptosRelayInfo, sourceChainBlockNumber])

  const submitTransaction = useCallback((localAptosRelayInfo: GetTransferRelayInfoResponse | undefined) => {
    setClaimButtonLoading(true)

    if (destinationTokenInfo === undefined) {
      console.log("Unexpected undefined destination token info")
      return 
    }

    if (localAptosRelayInfo === undefined) {
      console.log("Unexpected undefined aptosRelayInfo")
      return 
    }

    console.debug("aptosRelayInfo", localAptosRelayInfo, JSON.stringify(localAptosRelayInfo.toObject()))

    try {
      const wdmsg = base64.decode(localAptosRelayInfo.toObject().request.toString());
      const sigs = localAptosRelayInfo.toObject().sortedSigsList.map(item => {
        return base64.decode(item.toString());
      });
      const signers = localAptosRelayInfo.toObject().signersList.map(item => {
        return base64.decode(item.toString());
      });
      const powers = localAptosRelayInfo.toObject().powersList.map(item => {
        return BigNumber.from(base64.decode(item.toString())).toString();
      });
      submitAptosProxyRegisterAndMintRequest(
        aptosPeggedBridgeContractAddress, 
        destinationTokenInfo.token.address,
        wdmsg,
        sigs,
        signers,
        powers,
        signAndSubmitTransaction,
      ).then(_ => {
        setClaimButtonLoading(false)
        onFinish()
      }).catch(error => {
        setClaimButtonLoading(false)
        console.log("Submit aptos transaction error", error)
      })
    } catch(error) {
      setClaimButtonLoading(false)
      console.debug("error", error)
    }  
  // eslint-disable-next-line
  }, [aptosRelayInfo])

  let element: JSX.Element
  
  switch (aptosOnboardingStatus) {
    case AptosOnboardingStatus.submitting: {
      element = (
        <div>
          <div className={classes.modalTopIcon}>
            <LoadingOutlined style={{ fontSize: 72, fontWeight: "bold", color: "#3366FF" }} />
          </div>
          <div className={classes.statusDescription}>Submitting your transaction…</div>
          <a className={classes.viewInExplorerWrapper} href={ sourceChainTransactionHashLink } target="_blank" rel="noreferrer">
            View in Explorer
          </a>
        </div>
      )
      break
    }
    case AptosOnboardingStatus.waitingForBlockConfirmations: {
      element = (
        <div>
          <div className={classes.modalTopIcon} style={{position: "relative", }}>
            <div className={classes.waitingForBlock} style={{position: "absolute", top: 35, right: 203, fontSize: 14, fontWeight: 700, width: 60}}> {currentWaitingBlock} / {sourceChainInfo?.block_delay ?? 100} </div>
            <LoadingOutlined style={{ fontSize: 90, fontWeight: "bold", color: "#3366FF" }} />
          </div>
          <div className={classes.statusDescription}>Waiting for block confirmations…</div>
          <a className={classes.viewInExplorerWrapper} href={ sourceChainTransactionHashLink } target="_blank" rel="noreferrer">
            View in Explorer
          </a>
        </div>
      )
      break
    }
    case AptosOnboardingStatus.waitingForSGNConfirmations: {
      element = (
        <div>
          <div className={classes.modalTopIcon}>
            <LoadingOutlined style={{ fontSize: 72, fontWeight: "bold", color: "#3366FF" }} />
          </div>
          <div className={classes.statusDescription}>Waiting for SGN confirmations…</div>
          <div className = {classes.viewInExplorerWrapper} style={{ fontSize: 12, fontWeight: 600, color: "#8F9BB3", alignContent: "center" }}>Please wait a few minutes.</div>
        </div>
      )
      break
    }
    case AptosOnboardingStatus.clickToClaimToken: {
      element = (
        <div>
          <div className={classes.modalTopIcon} style={{ marginTop: 80 }}/>
          <div className={classes.statusDescription}>Please claim your {destinationTokenInfo?.token.symbol} on Aptos. You only need to do this once per token.</div>
          <Button
            type="primary"
            size="large"
            block
            loading={claimButtonLoading}
            onClick={() => {
              submitTransaction(aptosRelayInfo)
            }}
            className={classes.button}
          >
            Claim {destinationTokenInfo?.token.symbol}
          </Button>            
        </div>
      )
      break
    }
    default: {
      element = (
        <div/>
      )
      break
    }
  }
  
  return ( element ); 
})

const queryTransactionStatus = async (
  provider: JsonRpcProvider | undefined,
  transactionHashLink: string) => {  
  const transactionHash = transactionHashLink.split("/tx/")[1];
  return provider?.getTransactionReceipt(transactionHash);
}

const queryAptosMintTokenParameters = async (transferId: string) => {
  const request = new GetTransferRelayInfoRequest();
  request.setTransferId(transferId);
  return getTransferRelayInfo(request) 
}

const queryAptosResources = async (walletAddress: string) => {
  return getAptosResources(walletAddress)
}

const relayInfoValidation = (relayInfo: GetTransferRelayInfoResponse): boolean => {
  return (
    relayInfo.getRequest().length > 0 &&
    relayInfo.getSignersList().length > 0 &&
    relayInfo.getSortedSigsList().length > 0 &&
    relayInfo.getPowersList().length > 0
  )
}

// eslint-disable-next-line
const aptosResourcesValidation = (resources: any): boolean => {
  const aptosTokenTypeTag = `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`;
  const aptosToken = resources.find((r) => r.type === aptosTokenTypeTag)
  const aptosTokenValue = (aptosToken?.data?.coin?.value ?? 0) / (10 ** 8)
  return aptosTokenValue > 0
}


AptosOnboardingTransferModal.defaultProps = {
    // nonEVMReceiverAddress: "",
    // sourceChainTransferId: "",
    // sourceChainTransactionHash: "",
};  

export default AptosOnboardingTransferModal;
