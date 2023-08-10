import { ethers } from "ethers";
import { PeggedChainMode } from "../../../hooks/usePeggedPairConfig";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";
import { PeggedTokenBridge } from "../../../typechain/typechain";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";

export default class PeggedBridgeAdapter extends ITransferAdapter<ITransfer> {
  peggedTokenBridge: PeggedTokenBridge | undefined = this.transferData.contracts.peggedTokenBridge;

  getTransferId = (): string => {
    switch (this.transferData.pegConfig.mode) {
      case PeggedChainMode.BurnThenSwap:
        return ethers.utils.solidityKeccak256(
          ["address", "address", "uint256", "address", "uint64", "uint64"],
          [
            this.transferData.address,
            this.transferData.pegConfig.config.pegged_token.token.address,
            this.transferData.value.toString(),
            this.transferData.toAccount,
            this.nonce.toString(),
            this.transferData.fromChain.id.toString(),
          ],
        );
      case PeggedChainMode.Burn:
      case PeggedChainMode.TransitionPegV2:
        return ethers.utils.solidityKeccak256(
          ["address", "address", "uint256", "address", "uint64", "uint64"],
          [
            this.transferData.address,
            this.transferData.selectedToken?.token?.address,
            this.transferData.value.toString(),
            this.transferData.toAccount,
            this.nonce.toString(),
            this.transferData.fromChain?.id.toString(),
          ],
        );
      default:
        return "";
    }
  };

  getInteractContract(): string[] {
    return [sgnOpsDataCheck[this.transferData.fromChain.id]?.ptbridge, this.peggedTokenBridge?.address];
  }

  transfer = () => {
    if (!this.transferData.transactor || !this.peggedTokenBridge) return;
    const gasLimit = sessionStorage.getItem("bot") ? { gasLimit: 50000000 } : {};

    // eslint-disable-next-line consistent-return
    return this.transferData.transactor(
      this.peggedTokenBridge.burn(
        this.transferData.pegConfig.config.pegged_token.token.address,
        this.transferData.value,
        this.transferData.toAccount,
        this.nonce,
        gasLimit,
      ),
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
    this.receiverAddress = this.transferData.dstAddress;
  };

  estimateGas = async () => {
    if (!this.transferData.transactor || !this.peggedTokenBridge) return;
    // eslint-disable-next-line consistent-return
    return this.peggedTokenBridge.estimateGas.burn(
      this.transferData.pegConfig.config.pegged_token.token.address,
      this.transferData.value,
      this.transferData.toAccount,
      this.nonce,
    );
  };
}
