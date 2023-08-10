import { ethers } from "ethers";
import { pegV2ThirdPartDeployTokens } from "../../../constants/const";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";
import { PeggedNativeTokenBridge } from "../../../typechain/typechain/PeggedNativeTokenBridge";

export interface PeggedNativeBridgeTransfer extends ITransfer {
  peggedNativeTokenAddress: string;
}
export default class PeggedNativeBridgeAdapter extends ITransferAdapter<PeggedNativeBridgeTransfer> {
  peggedNativeTokenBridge: PeggedNativeTokenBridge | undefined = this.transferData.contracts.peggedNativeTokenBridge;

  getTransferId(): string {
    return ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "uint64", "address", "uint64", "uint64", "address"],
      [
        this.transferData.address,
        this.transferData.peggedNativeTokenAddress,
        this.transferData.value.toString(),
        this.transferData.toChain?.id.toString(),
        this.transferData.toAccount,
        this.nonce.toString(),
        this.transferData.fromChain?.id.toString(),
        this.peggedNativeTokenBridge?.address,
      ],
    );
  }

  getInteractContract(): string[] {
    return [sgnOpsDataCheck[this.transferData.fromChain.id]?.ptbridge2, this.peggedNativeTokenBridge?.address];
  }

  transfer = () => {
    if (!this.transferData.transactor || !this.peggedNativeTokenBridge) return;
    const gasLimit = sessionStorage.getItem("bot") ? { gasLimit: 50000000 } : {};

    if (this.peggedNativeTokenBridge) {
      // eslint-disable-next-line consistent-return
      return this.transferData.transactor(
        this.peggedNativeTokenBridge.burnNative(
          this.transferData.toChain?.id ?? 0,
          this.transferData.toAccount,
          this.nonce,
          gasLimit,
        ),
      );
    }
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
    if (!this.transferData.transactor || !this.peggedNativeTokenBridge) return;
    if (
      pegV2ThirdPartDeployTokens[this.transferData.fromChain?.id]
        ?.map(item => item.toLocaleLowerCase())
        ?.includes(this.transferData.peggedNativeTokenAddress.toLocaleLowerCase())
    ) {
      // eslint-disable-next-line consistent-return
      return this.peggedNativeTokenBridge?.estimateGas.burnFrom(
        this.transferData.peggedNativeTokenAddress,
        this.transferData.value,
        this.transferData.toChain?.id ?? 0,
        this.transferData.toAccount,
        this.nonce,
      );
    }
    // eslint-disable-next-line consistent-return
    return this.peggedNativeTokenBridge?.estimateGas.burn(
      this.transferData.peggedNativeTokenAddress,
      this.transferData.value,
      this.transferData.toChain?.id ?? 0,
      this.transferData.toAccount,
      this.nonce,
    );
  };
}
