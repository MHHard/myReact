import { useEffect, useState } from "react";
import { Modal, Button, message } from "antd";
import { createUseStyles } from "react-jss";
import { LoadingOutlined, WarningFilled } from "@ant-design/icons";
import { base64, getAddress, hexlify } from "ethers/lib/utils";
import { BigNumber } from "@ethersproject/bignumber";

import { TransferHistoryStatus, WithdrawDetail, TransferHistory } from "../constants/type";
import errorMessages from "../constants/errorMessage";
import { Theme } from "../theme";
import { useContractsContext } from "../providers/ContractsContextProvider";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { getTransferStatus, getUserIsBlocked, withdrawLiquidity, getRfqRefundExecMsgCallData } from "../redux/gateway";
import { switchChain, setFromChain } from "../redux/transferSlice";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { GetPeggedMode, PeggedChainMode, getPeggedPairConfigs } from "../hooks/usePeggedPairConfig";

import { WithdrawReq as WithdrawReqProto, WithdrawType } from "../proto/sgn/cbridge/v1/tx_pb";
import {
  EstimateWithdrawAmtRequest,
  EstimateWithdrawAmtResponse,
  WithdrawInfo,
  WithdrawLiquidityRequest,
  WithdrawMethodType,
  EstimateWithdrawAmt,
  BridgeType,
} from "../proto/gateway/gateway_pb";

import { formatBlockExplorerUrlWithTxHash } from "../utils/formatUrl";
import { storageConstants } from "../constants/const";
import { isToBeConfirmRefund } from "../utils/mergeTransferHistory";
import { getNonEVMMode, NonEVMMode, useNonEVMContext } from "../providers/NonEVMContextProvider";
import { submitFlowBurnRefundRequest, submitFlowDepositRefundRequest } from "../redux/NonEVMAPIs/flowAPIs";
import { getNetworkById } from "../constants/network";
import { useSignAgain } from "../hooks/useSignAgain";
import { isSignerMisMatchErr } from "../utils/errorCheck";
import { debugTools } from "../utils/debug";
import { gatewayServiceWithGrpcUrlClient } from "../redux/grpcClients";
import { GetRefundExecMsgCallDataRequest } from "../proto/sdk/service/rfq/user_pb";
import { ModalName, openModal } from "../redux/modalSlice";
import { submitAptosBurnRefundRequest, submitAptosDepositRefundRequest } from "../redux/NonEVMAPIs/aptosAPIs";
import { Bridge__factory, Bridge } from "../typechain/typechain";
import { loadContract } from "../hooks/customContractLoader";
import { seiBurnRefund, seiDepositRefund } from "../redux/NonEVMAPIs/seiAPI";
import { injBurnRefund, injDepositRefund } from "../redux/NonEVMAPIs/injectiveAPI";

/* eslint-disable */
/* eslint-disable camelcase */

const useStyles = createUseStyles((theme: Theme) => ({
  modalTop: {},
  modalTopDes: {
    fontSize: 14,
  },
  modaldes: {
    color: theme.surfacePrimary,
    marginTop: 40,
    fontSize: 15,
    textAlign: "center",
  },
  modaldes2: {
    color: theme.surfacePrimary,
    marginTop: 70,
    fontSize: 15,
    textAlign: "center",
  },
  button: {
    marginTop: 40,
    height: 56,
    lineHeight: "42px",
    background: theme.primaryBrand,
    borderRadius: 16,
    border: "none",
    fontSize: 18,
    fontWeight: 700,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  modalTopIcon: {
    fontSize: 16,
    fontWeight: 600,
    width: "100%",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 45,
  },
  modalToptext: {
    fontSize: 15,
    width: "100%",
    textAlign: "center",
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  transferModal: {
    border: `1px solid ${theme.primaryBackground}`,
    "& .ant-modal-content": {
      background: theme.secondBackground,
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
        minHeight: 240,
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
  yellowText: {
    color: theme.infoWarning,
    display: "inline-block",
  },
}));

const HistoryTransferModal = ({ visible, onCancel, record }) => {
  const classes = useStyles();
  const {
    contracts: { originalTokenVault, originalTokenVaultV2, peggedTokenBridge, peggedTokenBridgeV2, rfqContract },
    transactor,
  } = useContractsContext();
  const { signer, chainId, address } = useWeb3Context();
  const { flowConnected, seiAddress, injAddress, seiProvider, loadNonEVMModal, signAndSubmitTransaction } =
    useNonEVMContext();
  const dispatch = useAppDispatch();
  const { windowWidth, transferInfo } = useAppSelector(state => state);
  const { transferConfig } = transferInfo;
  const { isMobile } = windowWidth;
  const [loading, setLoading] = useState(false);
  const [transfState, setTransfState] = useState(record?.status);
  const [withdrawDetail, setWithdrawDetail] = useState<WithdrawDetail>();
  const [transferStatusInfo, setTransferStatusInfo] = useState<any>();
  const [seqNum, setSeqNum] = useState<string>("0");
  const peggedMode = GetPeggedMode(
    record?.src_send_info?.chain?.id,
    record?.dst_received_info?.chain?.id,
    record?.dst_received_info?.token?.symbol,
    transferInfo.transferConfig.pegged_pair_configs,
  );
  getPeggedPairConfigs(
    transferInfo.transferConfig.pegged_pair_configs,
    record.src_send_info.chain,
    record.dst_received_info.chain,
    { token: record.src_send_info.token },
    dispatch,
  );
  const srcSendChainNonEVMMode = getNonEVMMode(record?.src_send_info?.chain.id ?? 0);
  const initiateSignAgain = useSignAgain(address, record?.src_send_info?.chain.id, Number(seqNum), record?.transfer_id);
  const isRfq = record && record.bridge_type === BridgeType.BRIDGETYPE_RFQ;

  useEffect(() => {
    setTransfState(record?.status);
  }, [record]);

  let content;
  let detailInter;
  const getestimate = async () => {
    const withdrawItem = new WithdrawInfo();
    withdrawItem.setChainId(record?.src_send_info.chain.id);
    withdrawItem.setAmount(record?.src_send_info.amount);
    withdrawItem.setSlippageTolerance(1000000);

    const estimateReq = new EstimateWithdrawAmtRequest();
    estimateReq.setSrcWithdrawsList(Array(withdrawItem));
    estimateReq.setDstChainId(record?.src_send_info.chain.id);
    estimateReq.setTokenSymbol(record?.src_send_info.token.symbol);
    estimateReq.setUsrAddr(address);

    const res: EstimateWithdrawAmtResponse = await gatewayServiceWithGrpcUrlClient.estimateWithdrawAmt(
      estimateReq,
      null,
    );

    let estimateResult = "";
    if (!res.getErr() && res.getReqAmtMap()) {
      const resMap = res.getReqAmtMap();
      resMap.forEach((entry: EstimateWithdrawAmt, key: number) => {
        if (key === Number(record?.src_send_info.chain.id)) {
          const totleFee = (Number(entry.getBaseFee()) + Number(entry.getPercFee())).toString() || "0";
          const eqValueTokenAmtBigNum = BigNumber.from(entry.getEqValueTokenAmt());
          const feeBigNum = BigNumber.from(totleFee);
          const targetReceiveAmounts = eqValueTokenAmtBigNum.sub(feeBigNum);
          estimateResult = targetReceiveAmounts.toString();
        }
      });
    }

    return estimateResult;
  };
  const requestRefund = async () => {
    if (!signer && srcSendChainNonEVMMode === NonEVMMode.off) {
      return;
    }
    setLoading(true);

    const estimated = await getestimate();
    if (estimated) {
      const timestamp = Math.floor(Date.now() / 1000);
      const withdrawReqProto = new WithdrawReqProto();
      withdrawReqProto.setXferId(record.transfer_id);
      withdrawReqProto.setReqId(timestamp);
      withdrawReqProto.setWithdrawType(WithdrawType.WITHDRAW_TYPE_REFUND_TRANSFER);

      const req = new WithdrawLiquidityRequest();
      req.setWithdrawReq(withdrawReqProto.serializeBinary());
      req.setEstimatedReceivedAmt(estimated);
      req.setMethodType(WithdrawMethodType.WD_METHOD_TYPE_ONE_RM);
      const wres = await withdrawLiquidity(req);
      if (!wres.getErr()) {
        const seq_num = wres.getSeqNum().toString() || "";
        setSeqNum(seq_num);
        detailInter = setInterval(async () => {
          const res = await getTransferStatus({ transfer_id: record.transfer_id });
          setTransferStatusInfo(res);
          if (res?.status) {
            const status = res.status;
            // if (status === TransferHistoryStatus.TRANSFER_REQUESTING_REFUND) {
            //   setTransfState(status);
            // } else
            if (status === TransferHistoryStatus.TRANSFER_REFUND_TO_BE_CONFIRMED) {
              setTransfState(status);
              const { wd_onchain, sorted_sigs, signers, powers } = res;
              setWithdrawDetail({
                _wdmsg: wd_onchain,
                _sigs: sorted_sigs,
                _signers: signers,
                _powers: powers,
              });
              setLoading(false);
              clearInterval(detailInter);
            }
          } else if (res.status === TransferHistoryStatus.TRANSFER_UNKNOWN) {
            console.error("status: " + res.status);
          } else {
            clearInterval(detailInter);
            setLoading(false);
          }
        }, 5000);
      } else {
        console.log(
          "withdraw request error",
          JSON.stringify(req.toObject()),
          JSON.stringify(wres.getErr()?.toObject()),
        );
        message.error("Refund error");
        setLoading(false);
        setTransfState(TransferHistoryStatus?.TRANSFER_TO_BE_REFUNDED);
      }
    }
  };
  const clickRefundButton = async () => {
    const isBlocked = await getUserIsBlocked(address, Number(record?.src_send_info?.chain.id));
    if (isBlocked) {
      dispatch(openModal(ModalName.userIsBlocked));
      setLoading(false);
      return;
    }
    if (isRfq) {
      confirmRfqRefund();
    } else {
      requestRefund();
    }
  };
  const clickComnfirmRefundButton = async () => {
    const isBlocked = await getUserIsBlocked(address, Number(record?.src_send_info?.chain.id));
    if (isBlocked) {
      dispatch(openModal(ModalName.userIsBlocked));
      setLoading(false);
      return;
    }
    if (isRfq) {
      confirmRfqRefund();
    } else if (srcSendChainNonEVMMode === NonEVMMode.off) {
      confirmRefund(false);
    } else if (srcSendChainNonEVMMode === NonEVMMode.flowMainnet || srcSendChainNonEVMMode === NonEVMMode.flowTest) {
      confirmFlowRefund();
    } else if (
      srcSendChainNonEVMMode === NonEVMMode.aptosMainnet ||
      srcSendChainNonEVMMode === NonEVMMode.aptosTest ||
      srcSendChainNonEVMMode === NonEVMMode.aptosDevnet
    ) {
      confirmAptosRefund();
    } else if (
      srcSendChainNonEVMMode === NonEVMMode.seiDevnet ||
      srcSendChainNonEVMMode === NonEVMMode.seiMainnet ||
      srcSendChainNonEVMMode === NonEVMMode.seiTestnet
    ) {
      confirmSeiRefund();
    } else if (
      srcSendChainNonEVMMode === NonEVMMode.injectiveMainnet ||
      srcSendChainNonEVMMode === NonEVMMode.injectiveTestnet
    ) {
      confirmInjRefund();
    }
  };

  const confirmFlowRefund = async () => {
    let nowWithdrawDetail = withdrawDetail;
    if (!nowWithdrawDetail) {
      const res = await getTransferStatus({
        transfer_id: record.transfer_id,
      });
      setTransferStatusInfo(res);
      const { wd_onchain, sorted_sigs, signers, powers } = res;
      nowWithdrawDetail = {
        _wdmsg: wd_onchain,
        _sigs: sorted_sigs,
        _signers: signers,
        _powers: powers,
      };
    }
    setLoading(true);
    const { _wdmsg, _sigs } = nowWithdrawDetail;
    const wdmsg = base64.decode(_wdmsg);
    const sigs = _sigs.map(item => {
      return base64.decode(item);
    });

    console.debug("record", record);

    let txHash: string = "";

    const depositContractAddress =
      transferInfo.transferConfig.pegged_pair_configs.find(peggedPairConfig => {
        return (
          peggedPairConfig.org_chain_id === record?.src_send_info?.chain?.id &&
          peggedPairConfig.org_token.token.symbol === record.src_send_info.token.symbol
        );
      })?.pegged_deposit_contract_addr ?? "";

    if (depositContractAddress.length > 0) {
      txHash = await submitFlowDepositRefundRequest(
        depositContractAddress,
        record.src_send_info.token.address,
        wdmsg,
        sigs,
      );
    }

    const burnContractAddress =
      transferInfo.transferConfig.pegged_pair_configs.find(peggedPairConfig => {
        return (
          peggedPairConfig.pegged_chain_id === record?.src_send_info?.chain?.id &&
          peggedPairConfig.pegged_token.token.symbol === record.src_send_info.token.symbol
        );
      })?.pegged_burn_contract_addr ?? "";

    if (burnContractAddress.length > 0) {
      txHash = await submitFlowBurnRefundRequest(burnContractAddress, record.src_send_info.token.address, wdmsg, sigs);
    }

    setLoading(false);
    console.debug("txHash", txHash);

    if (txHash.length > 0) {
      const transferJson: TransferHistory = {
        dst_block_tx_link: record.dst_block_tx_link,
        src_send_info: record.src_send_info,
        src_block_tx_link: `${getNetworkById(record.src_send_info.chain.id).blockExplorerUrl}/transaction/${txHash}`,
        srcAddress: address,
        dstAddress: address,
        dst_received_info: record.dst_received_info,
        status: TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND,
        transfer_id: record.transfer_id,
        nonce: record.nonce,
        ts: record.ts,
        isLocal: true,
        updateTime: new Date().getTime(),
        txIsFailed: false,
      };
      const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
      let localTransferList: TransferHistory[] = [];
      if (localTransferListJsonStr) {
        localTransferList = JSON.parse(localTransferListJsonStr) || [];
      }
      let isHave = false;
      localTransferList.map(item => {
        if (item.transfer_id === record.transfer_id) {
          isHave = true;
          item.updateTime = new Date().getTime();
          item.txIsFailed = false;
          item.src_block_tx_link = `${
            getNetworkById(record.src_send_info.chain.id).blockExplorerUrl
          }/transaction/${txHash}`;
        }
        return item;
      });

      if (!isHave) {
        localTransferList.unshift(transferJson);
      }
      localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
      setLoading(false);
      setTransfState(TransferHistoryStatus.TRANSFER_REFUNDED);
    }
  };

  const confirmAptosRefund = async () => {
    let nowWithdrawDetail = withdrawDetail;
    if (!nowWithdrawDetail) {
      const res = await getTransferStatus({
        transfer_id: record.transfer_id,
      });
      setTransferStatusInfo(res);
      const { wd_onchain, sorted_sigs, signers, powers } = res;
      nowWithdrawDetail = {
        _wdmsg: wd_onchain,
        _sigs: sorted_sigs,
        _signers: signers,
        _powers: powers,
      };
    }
    setLoading(true);
    const { _wdmsg, _sigs, _signers, _powers } = nowWithdrawDetail;
    const wdmsg = base64.decode(_wdmsg);
    const sigs = _sigs.map(item => {
      return base64.decode(item);
    });
    const signers = _signers.map(item => {
      return base64.decode(item);
    });
    const powers = _powers.map(item => {
      return BigNumber.from(base64.decode(item)).toString();
    });

    console.debug("record", record);

    let txHash: string = "";

    const depositContractAddress =
      transferInfo.transferConfig.pegged_pair_configs.find(peggedPairConfig => {
        return (
          peggedPairConfig.org_chain_id === record?.src_send_info?.chain?.id &&
          peggedPairConfig.org_token.token.symbol === record.src_send_info.token.symbol
        );
      })?.pegged_deposit_contract_addr ?? "";

    if (depositContractAddress.length > 0) {
      txHash = await submitAptosDepositRefundRequest(
        depositContractAddress,
        record.src_send_info.token.address,
        wdmsg,
        sigs,
        signers,
        powers,
        signAndSubmitTransaction,
      );
    }

    const burnContractAddress =
      transferInfo.transferConfig.pegged_pair_configs.find(peggedPairConfig => {
        return (
          peggedPairConfig.pegged_chain_id === record?.src_send_info?.chain?.id &&
          peggedPairConfig.pegged_token.token.symbol === record.src_send_info.token.symbol
        );
      })?.pegged_burn_contract_addr ?? "";

    if (burnContractAddress.length > 0) {
      txHash = await submitAptosBurnRefundRequest(
        burnContractAddress,
        record.src_send_info.token.address,
        wdmsg,
        sigs,
        signers,
        powers,
        signAndSubmitTransaction,
      );
    }

    setLoading(false);
    console.debug("txHash", txHash);

    if (txHash.length > 0) {
      const transferJson: TransferHistory = {
        dst_block_tx_link: record.dst_block_tx_link,
        src_send_info: record.src_send_info,
        src_block_tx_link: `${getNetworkById(record.src_send_info.chain.id).blockExplorerUrl}/txn/${txHash}`,
        srcAddress: address,
        dstAddress: address,
        dst_received_info: record.dst_received_info,
        status: TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND,
        transfer_id: record.transfer_id,
        nonce: record.nonce,
        ts: record.ts,
        isLocal: true,
        updateTime: new Date().getTime(),
        txIsFailed: false,
      };
      const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
      let localTransferList: TransferHistory[] = [];
      if (localTransferListJsonStr) {
        localTransferList = JSON.parse(localTransferListJsonStr) || [];
      }
      let isHave = false;
      localTransferList.map(item => {
        if (item.transfer_id === record.transfer_id) {
          isHave = true;
          item.updateTime = new Date().getTime();
          item.txIsFailed = false;
          item.src_block_tx_link = `${getNetworkById(record.src_send_info.chain.id).blockExplorerUrl}/txn/${txHash}`;
        }
        return item;
      });

      if (!isHave) {
        localTransferList.unshift(transferJson);
      }
      localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
      setLoading(false);
      setTransfState(TransferHistoryStatus.TRANSFER_REFUNDED);
    }
  };
  const confirmSeiRefund = async () => {
    let nowWithdrawDetail = withdrawDetail;
    if (!nowWithdrawDetail) {
      const res = await getTransferStatus({
        transfer_id: record.transfer_id,
      });
      setTransferStatusInfo(res);
      const { wd_onchain, sorted_sigs, signers, powers } = res;
      nowWithdrawDetail = {
        _wdmsg: wd_onchain,
        _sigs: sorted_sigs,
        _signers: signers,
        _powers: powers,
      };
    }
    setLoading(true);
    const { _wdmsg, _sigs } = nowWithdrawDetail;
    let txHash = "";
    const depositContractAddress =
      transferInfo.transferConfig.pegged_pair_configs.find(peggedPairConfig => {
        return (
          peggedPairConfig.org_chain_id === record?.src_send_info?.chain?.id &&
          peggedPairConfig.org_token.token.symbol === record.src_send_info.token.symbol
        );
      })?.pegged_deposit_contract_addr ?? "";

    if (depositContractAddress.length > 0) {
      const res = await seiDepositRefund(seiAddress, depositContractAddress, _wdmsg, _sigs, seiProvider);
      txHash = res?.transactionHash || "";
    }
    const burnContractAddress =
      transferInfo.transferConfig.pegged_pair_configs.find(peggedPairConfig => {
        return (
          peggedPairConfig.pegged_chain_id === record?.src_send_info?.chain?.id &&
          peggedPairConfig.pegged_token.token.symbol === record.src_send_info.token.symbol
        );
      })?.pegged_burn_contract_addr ?? "";

    if (burnContractAddress.length > 0) {
      const res = await seiBurnRefund(seiAddress, burnContractAddress, _wdmsg, _sigs, seiProvider);
      txHash = res?.transactionHash || "";
    }
    setLoading(false);
    console.debug("txHash", txHash);

    if (txHash.length > 0) {
      const transferJson: TransferHistory = {
        dst_block_tx_link: record.dst_block_tx_link,
        src_send_info: record.src_send_info,
        src_block_tx_link: `${getNetworkById(record.src_send_info.chain.id).blockExplorerUrl}/transactions/${txHash}`,
        srcAddress: address,
        dstAddress: address,
        dst_received_info: record.dst_received_info,
        status: TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND,
        transfer_id: record.transfer_id,
        nonce: record.nonce,
        ts: record.ts,
        isLocal: true,
        updateTime: new Date().getTime(),
        txIsFailed: false,
      };
      const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
      let localTransferList: TransferHistory[] = [];
      if (localTransferListJsonStr) {
        localTransferList = JSON.parse(localTransferListJsonStr) || [];
      }
      let isHave = false;
      localTransferList.map(item => {
        if (item.transfer_id === record.transfer_id) {
          isHave = true;
          item.updateTime = new Date().getTime();
          item.txIsFailed = false;
          item.src_block_tx_link = `${
            getNetworkById(record.src_send_info.chain.id).blockExplorerUrl
          }/transactions/${txHash}`;
        }
        return item;
      });

      if (!isHave) {
        localTransferList.unshift(transferJson);
      }
      localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
      setLoading(false);
      setTransfState(TransferHistoryStatus.TRANSFER_REFUNDED);
    }
  };

  const confirmInjRefund = async () => {
    let nowWithdrawDetail = withdrawDetail;
    if (!nowWithdrawDetail) {
      const res = await getTransferStatus({
        transfer_id: record.transfer_id,
      });
      setTransferStatusInfo(res);
      const { wd_onchain, sorted_sigs, signers, powers } = res;
      nowWithdrawDetail = {
        _wdmsg: wd_onchain,
        _sigs: sorted_sigs,
        _signers: signers,
        _powers: powers,
      };
    }
    setLoading(true);
    const { _wdmsg, _sigs } = nowWithdrawDetail;
    let txHash = "";
    const depositContractAddress =
      transferInfo.transferConfig.pegged_pair_configs.find(peggedPairConfig => {
        return (
          peggedPairConfig.org_chain_id === record?.src_send_info?.chain?.id &&
          peggedPairConfig.org_token.token.symbol === record.src_send_info.token.symbol
        );
      })?.pegged_deposit_contract_addr ?? "";

    if (depositContractAddress.length > 0) {
      const res = await injDepositRefund(injAddress, depositContractAddress, _wdmsg, _sigs);
      txHash = res?.txHash || "";
    }
    const burnContractAddress =
      transferInfo.transferConfig.pegged_pair_configs.find(peggedPairConfig => {
        return (
          peggedPairConfig.pegged_chain_id === record?.src_send_info?.chain?.id &&
          peggedPairConfig.pegged_token.token.symbol === record.src_send_info.token.symbol
        );
      })?.pegged_burn_contract_addr ?? "";

    if (burnContractAddress.length > 0) {
      const res = await injBurnRefund(injAddress, burnContractAddress, _wdmsg, _sigs);
      txHash = res?.txHash || "";
    }
    setLoading(false);
    console.debug("txHash", txHash);

    if (txHash.length > 0) {
      const transferJson: TransferHistory = {
        dst_block_tx_link: record.dst_block_tx_link,
        src_send_info: record.src_send_info,
        src_block_tx_link: `${getNetworkById(record.src_send_info.chain.id).blockExplorerUrl}/transactions/${txHash}`,
        srcAddress: address,
        dstAddress: address,
        dst_received_info: record.dst_received_info,
        status: TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND,
        transfer_id: record.transfer_id,
        nonce: record.nonce,
        ts: record.ts,
        isLocal: true,
        updateTime: new Date().getTime(),
        txIsFailed: false,
      };
      const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
      let localTransferList: TransferHistory[] = [];
      if (localTransferListJsonStr) {
        localTransferList = JSON.parse(localTransferListJsonStr) || [];
      }
      let isHave = false;
      localTransferList.map(item => {
        if (item.transfer_id === record.transfer_id) {
          isHave = true;
          item.updateTime = new Date().getTime();
          item.txIsFailed = false;
          item.src_block_tx_link = `${
            getNetworkById(record.src_send_info.chain.id).blockExplorerUrl
          }/transactions/${txHash}`;
        }
        return item;
      });

      if (!isHave) {
        localTransferList.unshift(transferJson);
      }
      localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
      setLoading(false);
      setTransfState(TransferHistoryStatus.TRANSFER_REFUNDED);
    }
  };

  const confirmRefund = async signAgain => {
    if (!transactor) {
      return;
    }
    setLoading(true);
    const isBlocked = await getUserIsBlocked(address, Number(record?.src_send_info?.chain.id));
    if (isBlocked) {
      dispatch(openModal(ModalName.userIsBlocked));
      setLoading(false);
      return;
    }
    let nowWithdrawDetail = withdrawDetail;
    if (signAgain || !nowWithdrawDetail) {
      const res = await getTransferStatus({
        transfer_id: record.transfer_id,
      });
      setTransferStatusInfo(res);
      const { wd_onchain, sorted_sigs, signers, powers } = res;
      nowWithdrawDetail = {
        _wdmsg: wd_onchain,
        _sigs: sorted_sigs,
        _signers: signers,
        _powers: powers,
      };
    }
    const { _wdmsg, _signers, _sigs, _powers } = nowWithdrawDetail;
    const wdmsg = base64.decode(_wdmsg);
    const signers = _signers.map(item => {
      const decodeSigners = base64.decode(item);
      const hexlifyObj = hexlify(decodeSigners);
      return getAddress(hexlifyObj);
    });
    const sigs = _sigs.map(item => {
      return base64.decode(item);
    });
    const powers = _powers.map(item => {
      const decodeNum = base64.decode(item);
      return BigNumber.from(decodeNum);
    });
    const debugSigners = debugTools.input("please input signers", "Array");
    const postSigners = debugSigners || signers;
    let bridge: Bridge | undefined = undefined;
    if (peggedMode === PeggedChainMode.Off) {
      const chainInfo = transferConfig.chains.find(chainId => {
        return chainId.id === record?.src_send_info?.chain.id;
      });
      bridge = (await loadContract(signer, chainInfo?.contract_addr, Bridge__factory)) as Bridge;
    }
    const executor = () => {
      if (peggedMode === PeggedChainMode.Burn) {
        if (peggedTokenBridgeV2) {
          return transactor(peggedTokenBridgeV2.mint(wdmsg, sigs, postSigners, powers));
        } else if (peggedTokenBridge) {
          return transactor(peggedTokenBridge.mint(wdmsg, sigs, postSigners, powers));
        }
      }
      if (peggedMode === PeggedChainMode.Deposit) {
        if (originalTokenVaultV2) {
          return transactor(originalTokenVaultV2.withdraw(wdmsg, sigs, postSigners, powers));
        } else if (originalTokenVault) {
          return transactor(originalTokenVault.withdraw(wdmsg, sigs, postSigners, powers));
        }
      }

      if (peggedMode === PeggedChainMode.Off && bridge) {
        return transactor(bridge.withdraw(wdmsg, sigs, postSigners, powers));
      }
    };
    let res;
    try {
      res = await executor();
    } catch (e: any) {
      console.log("catch refund error", e);
      if (isSignerMisMatchErr(e.data || e)) {
        const isSignAgainSuccess = await initiateSignAgain();
        if (isSignAgainSuccess) {
          confirmRefund(true);
        } else {
          setTransfState(TransferHistoryStatus?.TRANSFER_REFUND_TO_BE_CONFIRMED);
          setLoading(false);
        }
      } else {
        setTransfState(TransferHistoryStatus?.TRANSFER_REFUND_TO_BE_CONFIRMED);
        setLoading(false);
      }
    }
    if (res) {
      const transferJson: TransferHistory = {
        dst_block_tx_link: record.dst_block_tx_link,
        src_send_info: record.src_send_info,
        src_block_tx_link: formatBlockExplorerUrlWithTxHash({
          chainId: record.src_send_info.chain.id,
          txHash: res.hash,
        }),
        srcAddress: address,
        dstAddress: address,
        dst_received_info: record.dst_received_info,
        status: TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND,
        transfer_id: record.transfer_id,
        nonce: record.nonce,
        ts: record.ts,
        isLocal: true,
        updateTime: new Date().getTime(),
        txIsFailed: false,
      };
      const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
      let localTransferList: TransferHistory[] = [];
      if (localTransferListJsonStr) {
        localTransferList = JSON.parse(localTransferListJsonStr) || [];
      }
      let isHave = false;
      localTransferList.map(item => {
        if (item.transfer_id === record.transfer_id) {
          isHave = true;
          item.updateTime = new Date().getTime();
          item.txIsFailed = false;
          item.src_block_tx_link = formatBlockExplorerUrlWithTxHash({
            chainId: record.src_send_info.chain.id,
            txHash: res.hash,
          });
        }
        return item;
      });

      if (!isHave) {
        localTransferList.unshift(transferJson);
      }
      localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
      setLoading(false);
      setTransfState(TransferHistoryStatus.TRANSFER_REFUNDED);
    }
  };

  const confirmRfqRefund = async () => {
    if (!transactor || !rfqContract) {
      return;
    }

    setLoading(true);
    const rfqRefundRequest = new GetRefundExecMsgCallDataRequest();
    rfqRefundRequest.setQuoteHash(record.transfer_id);
    const rfqRefundRes = await getRfqRefundExecMsgCallData(rfqRefundRequest);
    if (!rfqRefundRes) {
      return;
    }
    const rfqRefundResObj = rfqRefundRes.toObject();
    const quote = rfqRefundResObj.quote;
    const exec_msg_call_data = rfqRefundResObj.execMsgCallData.length > 0 ? rfqRefundRes.getExecMsgCallData() : [];

    const contractQuote = {
      srcChainId: BigNumber.from(quote?.srcToken?.chainId),
      srcToken: quote?.srcToken?.address ?? "",
      srcAmount: BigNumber.from(quote?.srcAmount ?? "0"),
      srcReleaseAmount: BigNumber.from(quote?.srcReleaseAmount ?? "0"),
      dstChainId: BigNumber.from(quote?.dstToken?.chainId),
      dstToken: quote?.dstToken?.address ?? "",
      dstAmount: BigNumber.from(quote?.dstAmount ?? "0"),
      deadline: BigNumber.from(quote?.dstDeadline) ?? 0,
      nonce: BigNumber.from(quote?.nonce),
      sender: quote?.sender ?? "",
      receiver: quote?.receiver ?? "",
      refundTo: quote?.refundTo ?? "",
      liquidityProvider: quote?.mmAddr ?? "",
    };

    const executor = () => {
      if (rfqRefundResObj.srcNative) {
        return transactor(
          rfqContract.executeRefundNative(contractQuote, exec_msg_call_data, { gasLimit: BigNumber.from(1000000) }),
        );
      } else {
        return transactor(
          rfqContract.executeRefund(contractQuote, exec_msg_call_data, { gasLimit: BigNumber.from(1000000) }),
        );
      }
    };
    let res;
    try {
      res = await executor();
    } catch (e: any) {
      console.log("catch refund error", e);
      if (isSignerMisMatchErr(e.data || e)) {
        const isSignAgainSuccess = await initiateSignAgain();
        if (isSignAgainSuccess) {
          confirmRefund(true);
        } else {
          setTransfState(TransferHistoryStatus?.TRANSFER_REFUND_TO_BE_CONFIRMED);
          setLoading(false);
        }
      } else {
        setTransfState(TransferHistoryStatus?.TRANSFER_REFUND_TO_BE_CONFIRMED);
        setLoading(false);
      }
    }
    if (res) {
      const transferJson: TransferHistory = {
        dst_block_tx_link: record.dst_block_tx_link,
        src_send_info: record.src_send_info,
        src_block_tx_link: formatBlockExplorerUrlWithTxHash({
          chainId: record.src_send_info.chain.id,
          txHash: res.hash,
        }),
        srcAddress: address,
        dstAddress: address,
        dst_received_info: record.dst_received_info,
        status: TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND,
        transfer_id: record.transfer_id,
        nonce: record.nonce,
        ts: record.ts,
        isLocal: true,
        updateTime: new Date().getTime(),
        txIsFailed: false,
      };
      const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
      let localTransferList: TransferHistory[] = [];
      if (localTransferListJsonStr) {
        localTransferList = JSON.parse(localTransferListJsonStr) || [];
      }
      let isHave = false;
      localTransferList.map(item => {
        if (item.transfer_id === record.transfer_id) {
          isHave = true;
          item.updateTime = new Date().getTime();
          item.txIsFailed = false;
          item.src_block_tx_link = formatBlockExplorerUrlWithTxHash({
            chainId: record.src_send_info.chain.id,
            txHash: res.hash,
          });
        }
        return item;
      });

      if (!isHave) {
        localTransferList.unshift(transferJson);
      }
      localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
      setLoading(false);
      setTransfState(TransferHistoryStatus.TRANSFER_REFUNDED);
    }
  };

  if (srcSendChainNonEVMMode === NonEVMMode.off && record?.src_send_info?.chain.id !== chainId) {
    content = (
      <div>
        <div style={{ textAlign: "center" }}>
          <WarningFilled style={{ fontSize: 50, color: "#ffaa00", marginTop: 40 }} />
        </div>
        <div className={classes.modaldes}>
          Please switch to <div className={classes.yellowText}>{record?.src_send_info?.chain.name} </div> before{" "}
          requesting a refund.
        </div>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => {
            if (!isMobile) {
              switchChain(record?.src_send_info?.chain.id, "", (chainId: number) => {
                const chain = transferConfig.chains.find(chainInfo => {
                  return chainInfo.id === chainId;
                });
                if (chain !== undefined) {
                  dispatch(setFromChain(chain));
                }
              });
            } else {
              onCancel();
            }
          }}
          className={classes.button}
        >
          OK
        </Button>
      </div>
    );
  } else if (
    (srcSendChainNonEVMMode === NonEVMMode.flowTest || srcSendChainNonEVMMode === NonEVMMode.flowMainnet) &&
    !flowConnected
  ) {
    content = (
      <div>
        <div style={{ textAlign: "center" }}>
          <WarningFilled style={{ fontSize: 50, color: "#ffaa00", marginTop: 40 }} />
        </div>
        <div className={classes.modaldes}>
          Please connect <div className={classes.yellowText}>{record?.src_send_info?.chain.name} </div> before{" "}
          requesting a refund.
        </div>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => {
            if (!isMobile) {
              loadNonEVMModal(NonEVMMode.flowTest);
            } else {
              onCancel();
            }
          }}
          className={classes.button}
        >
          OK
        </Button>
      </div>
    );
  } else if (transfState === TransferHistoryStatus.TRANSFER_TO_BE_REFUNDED) {
    content = (
      <>
        <div className={classes.modalTop}>
          <div className={classes.modaldes2}>
            The transfer cannot be completed because{" "}
            {errorMessages[transferStatusInfo?.refund_reason ?? record?.refund_reason] ||
              "the bridge rate has moved unfavorably by your slippage tolerance"}
            . Please click the button below to get a refund.
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => {
            clickRefundButton();
          }}
          className={classes.button}
        >
          Request Refund
        </Button>
      </>
    );
  } else if (transfState === TransferHistoryStatus.TRANSFER_REQUESTING_REFUND) {
    content = (
      <>
        <div className={classes.modalTop}>
          <div className={classes.modalTopIcon}>
            <LoadingOutlined style={{ fontSize: 50, fontWeight: "bold", color: "#3366FF" }} />
          </div>
          <div className={classes.modaldes}>
            Your refund request is waiting for Celer State Guardian Network (SGN) confirmation, which may take a few
            minutes to complete.
          </div>
        </div>
      </>
    );
  } else if (transfState === TransferHistoryStatus.TRANSFER_REFUNDED) {
    content = (
      <>
        <div className={classes.modalTop}>
          <div className={classes.modaldes}>
            Your refund request has been submitted. You should receive your refund on{" "}
            {record?.src_send_info.chain?.name} in a few minutes.
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => {
            onCancel();
          }}
          className={classes.button}
        >
          OK
        </Button>
      </>
    );
  } else if (transfState === TransferHistoryStatus.TRANSFER_REFUND_TO_BE_CONFIRMED || isToBeConfirmRefund(record)) {
    content = (
      <>
        <div className={classes.modalTop}>
          <div className={classes.modaldes} style={{ marginTop: 70 }}>
            Click the "Confirm Refund" button to get your refund.
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => {
            clickComnfirmRefundButton();
          }}
          className={classes.button}
        >
          Confirm Refund
        </Button>
      </>
    );
  }

  return (
    <Modal
      className={classes.transferModal}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={512}
      maskClosable={false}
    >
      {content}
    </Modal>
  );
};

export default HistoryTransferModal;
