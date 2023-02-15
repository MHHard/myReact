import { BigNumber, ethers } from "ethers";
import { Chain } from "../../../constants/type";
import { Transactor } from "../../../helpers/transactorWithNotifier";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";
import { getNetworkById } from "../../../constants/network";
import { ITransferAdapter, IRfqTransfer } from "../../../constants/transferAdatper";
import { Quote } from "../../../proto/sdk/service/rfqmm/api_pb";
import { RFQ } from "../../../typechain/typechain/RFQ";

export default class RfqBridgeAdapter implements ITransferAdapter {
  isNativeToken: boolean;

  value: BigNumber;

  address: string;

  fromChain: Chain;

  toChain: Chain;

  rfqContract: RFQ | undefined;

  transactor: Transactor<ethers.ContractTransaction> | undefined;

  transferId = "";

  srcBlockTxLink = "";

  srcAddress = "";

  dstAddress = "";

  nonce = new Date().getTime();

  quote: Quote.AsObject;

  msgFee: string;

  constructor(params: IRfqTransfer) {
    this.isNativeToken = params.isNativeToken;
    this.value = params.value;
    this.address = params.address;
    this.toChain = params.toChain;
    this.fromChain = params.fromChain;

    this.rfqContract = params.contracts.rfqContract;
    this.transactor = params.transactor;
    this.quote = params.quote;
    this.msgFee = params.msgFee;
  }

  getTransferId(): string {
    return this.quote.hash;
  }

  getInteractContract(): string[] {
    return [sgnOpsDataCheck[this.fromChain.id]?.rfqContract, this.rfqContract?.address];
  }

  transfer = () => {
    if (!this.transactor || !this.rfqContract) return;

    const contractQuote = {
      srcChainId: BigNumber.from(this.quote?.srcToken?.chainId),
      srcToken: this.quote?.srcToken?.address ?? "",
      srcAmount: BigNumber.from(this.quote?.srcAmount ?? "0"),
      srcReleaseAmount: BigNumber.from(this.quote?.srcReleaseAmount ?? "0"),
      dstChainId: BigNumber.from(this.quote?.dstToken?.chainId),
      dstToken: this.quote?.dstToken?.address ?? "",
      dstAmount: BigNumber.from(this.quote?.dstAmount ?? "0"),
      deadline: BigNumber.from(this.quote?.dstDeadline) ?? 0,
      nonce: BigNumber.from(this.quote?.nonce),
      sender: this.quote?.sender ?? "",
      receiver: this.quote?.receiver ?? "",
      refundTo: this.quote?.refundTo ?? "",
      liquidityProvider: this.quote?.mmAddr ?? "",
    };

    const submitDeadline = this.quote?.srcDeadline ?? 0;

    // eslint-disable-next-line consistent-return
    return this.transactor(
      this.isNativeToken
        ? this.rfqContract.srcDepositNative(contractQuote, submitDeadline, {
            value: this.msgFee,
            gasLimit: BigNumber.from(1000000),
          })
        : this.rfqContract.srcDeposit(contractQuote, submitDeadline, {
            value: this.msgFee,
            gasLimit: BigNumber.from(1000000),
          }),
    );
  };

  isResponseValid = response => {
    const newtxStr = JSON.stringify(response);
    const newtx = JSON.parse(newtxStr);
    return !newtx.code;
  };

  onSuccess(response) {
    this.transferId = this.getTransferId();
    this.srcBlockTxLink = `${getNetworkById(this.fromChain.id).blockExplorerUrl}/tx/${response.hash}`;
    this.srcAddress = this.address;
    this.dstAddress = this.address;
  }

  estimateGas = async () => {
    return BigNumber.from(0)
  }
}
