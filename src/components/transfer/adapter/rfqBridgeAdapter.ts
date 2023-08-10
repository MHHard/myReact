import { BigNumber } from "ethers";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";
import { ITransferAdapter, RfqITransfer } from "../../../constants/transferAdatper";
import { RFQ } from "../../../typechain/typechain/RFQ";

export default class RfqBridgeAdapter extends ITransferAdapter<RfqITransfer> {
  rfqContract: RFQ | undefined = this.transferData.contracts.rfqContract;

  getTransferId(): string {
    return this.transferData.quote.hash;
  }

  getInteractContract(): string[] {
    return [sgnOpsDataCheck[this.transferData.fromChain.id]?.rfqContract, this.rfqContract?.address];
  }

  transfer = () => {
    if (!this.transferData.transactor || !this.rfqContract) return;
    const quote = this.transferData.quote;
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

    const submitDeadline = quote?.srcDeadline ?? 0;

    // eslint-disable-next-line consistent-return
    return this.transferData.transactor(
      this.transferData.isNativeToken
        ? this.rfqContract.srcDepositNative(contractQuote, submitDeadline, {
            value: this.transferData.msgFee,
            gasLimit: BigNumber.from(1000000),
          })
        : this.rfqContract.srcDeposit(contractQuote, submitDeadline, {
            value: this.transferData.msgFee,
            gasLimit: BigNumber.from(1000000),
          }),
    );
  };

  isResponseValid = response => {
    const newtxStr = JSON.stringify(response);
    const newtx = JSON.parse(newtxStr);
    return !newtx.code;
  };

  onSuccess = response => {
    this.transferId = this.getTransferId();
    this.srcBlockTxLink = `${this.transferData.getNetworkById(this.transferData.fromChain.id).blockExplorerUrl}/tx/${
      response.hash
    }`;
    this.senderAddress = this.transferData.address;
    this.receiverAddress = this.transferData.address;
  };

  estimateGas = async () => {
    return BigNumber.from(0);
  };
}
