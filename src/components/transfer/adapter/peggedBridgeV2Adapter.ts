import { ethers } from "ethers";
import { pegV2ThirdPartDeployTokens, pegNativeDeployTokens } from "../../../constants/const";
import { PeggedTokenBridgeV2 } from "../../../typechain/typechain";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";
import { PeggedNativeTokenBridge } from "../../../typechain/typechain/PeggedNativeTokenBridge";

export interface PeggedBridgeV2Transfer extends ITransfer {
  peggedV2BurnTokenAddress: string;
}
export default class PeggedBridgeV2Adapter extends ITransferAdapter<PeggedBridgeV2Transfer> {
  peggedTokenBridgeV2: PeggedTokenBridgeV2 | undefined = this.transferData.contracts.peggedTokenBridgeV2;

  peggedNativeTokenBridge: PeggedNativeTokenBridge | undefined = this.transferData.contracts.peggedNativeTokenBridge;

  getTransferId(): string {
    return ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "uint64", "address", "uint64", "uint64", "address"],
      [
        this.transferData.address,
        this.transferData.peggedV2BurnTokenAddress,
        this.transferData.value.toString(),
        this.transferData.toChain?.id.toString(),
        this.transferData.toAccount,
        this.nonce.toString(),
        this.transferData.fromChain?.id.toString(),
        this.peggedTokenBridgeV2?.address,
      ],
    );
  }

  getInteractContract(): string[] {
    return [sgnOpsDataCheck[this.transferData.fromChain.id]?.ptbridge2, this.peggedTokenBridgeV2?.address];
  }

  transfer = () => {
    if (!this.transferData.transactor || !this.peggedTokenBridgeV2) return;
    const gasLimit = sessionStorage.getItem("bot") ? { gasLimit: 50000000 } : {};

    if (
      pegNativeDeployTokens[this.transferData.fromChain?.id]
        ?.map(item => item.toLocaleLowerCase())
        ?.includes(this.transferData.peggedV2BurnTokenAddress.toLocaleLowerCase())
    ) {
      if (this.peggedNativeTokenBridge) {
        // eslint-disable-next-line consistent-return
        return this.transferData.transactor(
          this.peggedNativeTokenBridge.burnNative(
            this.transferData.toChain?.id ?? 0,
            this.transferData.toAccount,
            this.nonce,
            { value: this.transferData.value, ...gasLimit },
          ),
        );
      }
    }
    if (
      pegV2ThirdPartDeployTokens[this.transferData.fromChain?.id]
        ?.map(item => item.toLocaleLowerCase())
        ?.includes(this.transferData.peggedV2BurnTokenAddress.toLocaleLowerCase())
    ) {
      // eslint-disable-next-line consistent-return
      return this.transferData.transactor(
        this.peggedTokenBridgeV2?.burnFrom(
          this.transferData.peggedV2BurnTokenAddress,
          this.transferData.value,
          this.transferData.toChain?.id ?? 0,
          this.transferData.toAccount,
          this.nonce,
          gasLimit,
        ),
      );
    }
    // eslint-disable-next-line consistent-return
    return this.transferData.transactor(
      this.peggedTokenBridgeV2?.burn(
        this.transferData.peggedV2BurnTokenAddress,
        this.transferData.value,
        this.transferData.toChain?.id ?? 0,
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
    if (!this.transferData.transactor || !this.peggedTokenBridgeV2) return;
    if (
      pegV2ThirdPartDeployTokens[this.transferData.fromChain?.id]
        ?.map(item => item.toLocaleLowerCase())
        ?.includes(this.transferData.peggedV2BurnTokenAddress.toLocaleLowerCase())
    ) {
      // eslint-disable-next-line consistent-return
      return this.peggedTokenBridgeV2?.estimateGas.burnFrom(
        this.transferData.peggedV2BurnTokenAddress,
        this.transferData.value,
        this.transferData.toChain?.id ?? 0,
        this.transferData.toAccount,
        this.nonce,
      );
    }
    // eslint-disable-next-line consistent-return
    return this.peggedTokenBridgeV2?.estimateGas.burn(
      this.transferData.peggedV2BurnTokenAddress,
      this.transferData.value,
      this.transferData.toChain?.id ?? 0,
      this.transferData.toAccount,
      this.nonce,
    );
  };
}
