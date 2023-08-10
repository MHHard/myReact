import { ethers } from "ethers";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";
import { CircleUSDCITransfer, ITransferAdapter } from "../../../constants/transferAdatper";
import { updateTransferId } from "../../../utils/localTransferHistoryList";

export default class CircleBridgeAdapter extends ITransferAdapter<CircleUSDCITransfer> {
  transferId = "";

  srcBlockTxLink = "";

  srcAddress = "";

  dstAddress = "";

  getTransferId(): string {
    return ethers.utils.solidityKeccak256(
      ["string", "address", "uint64", "uint64"],
      ["CircleTransfer", this.transferData.address, this.transferData.fromChain?.id.toString(), this.nonce.toString()],
    );
  }

  getInteractContract(): string[] {
    return [
      sgnOpsDataCheck[this.transferData.fromChain.id]?.circleBridgeProxy,
      this.transferData.circleBridgeProxy?.address,
    ];
  }

  transfer = async () => {
    if (!this.transferData.transactor || !this.transferData.circleBridgeProxy) return;

    const transaction = await this.transferData.circleBridgeProxy.depositForBurn(
      this.transferData.value,
      this.transferData.toChain?.id,
      this.transferData.address,
      this.transferData.selectedToken.token.address,
    );

    const tempTransferId = this.getTransferId();
    transaction.wait().then(finalReceipt => {
      if (finalReceipt.events) {
        const lastEvent = finalReceipt.events[finalReceipt.events.length - 1];
        if (lastEvent.args) {
          this.nonce = Number(lastEvent.args[lastEvent.args.length - 1].toString());
        }
        const realTransferId = this.getTransferId();
        updateTransferId(tempTransferId, realTransferId);
      }
    });

    // eslint-disable-next-line consistent-return
    return this.transferData.transactor(Promise.resolve(transaction));
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
    this.srcAddress = this.transferData.address;
    this.senderAddress = this.transferData.address;
    this.receiverAddress = this.transferData.dstAddress;
  };

  estimateGas = async () => {
    if (!this.transferData.transactor || !this.transferData.circleBridgeProxy) return;
    // eslint-disable-next-line consistent-return
    return this.transferData.circleBridgeProxy.estimateGas.depositForBurn(
      this.transferData.value,
      this.transferData.toChain.id,
      this.transferData.address,
      this.transferData.selectedToken.token.address,
    );
  };
}
