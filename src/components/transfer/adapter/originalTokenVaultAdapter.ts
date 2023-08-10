import { ethers } from "ethers";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";
import { OriginalTokenVault } from "../../../typechain/typechain";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";

export default class OriginalTokenVaultAdapter extends ITransferAdapter<ITransfer> {
  originalTokenVault: OriginalTokenVault | undefined = this.transferData.contracts.originalTokenVault;

  getTransferId(): string {
    return ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "uint64", "address", "uint64", "uint64"],
      [
        this.transferData.address,
        this.transferData.selectedToken?.token?.address,
        this.transferData.value.toString(),
        this.transferData.toChain?.id.toString(),
        this.transferData.toAccount,
        this.nonce.toString(),
        this.transferData.fromChain?.id.toString(),
      ],
    );
  }

  getInteractContract(): string[] {
    return [sgnOpsDataCheck[this.transferData.fromChain.id]?.otvault, this.originalTokenVault?.address];
  }

  transfer = async () => {
    if (!this.transferData.transactor || !this.originalTokenVault) return;
    const gasLimit = sessionStorage.getItem("bot") ? { gasLimit: 50000000 } : {};

    let wrapTokenAddress;
    try {
      wrapTokenAddress = await this.originalTokenVault?.nativeWrap();
    } catch (e) {
      console.log("wrap token not support");
    }
    if (
      wrapTokenAddress === this.transferData.pegConfig.config.org_token.token.address &&
      (this.transferData.fromChain.id !== 1 && this.transferData.fromChain.id !== 42220,
      this.transferData.fromChain.id !== 288)
    ) {
      // eslint-disable-next-line consistent-return
      return this.transferData.transactor(
        this.originalTokenVault.depositNative(
          this.transferData.value,
          this.transferData.pegConfig.config.pegged_chain_id,
          this.transferData.toAccount,
          this.nonce,
          { value: this.transferData.value, ...gasLimit },
        ),
      );
    }
    // eslint-disable-next-line consistent-return
    return this.transferData.transactor(
      this.originalTokenVault.deposit(
        this.transferData.pegConfig.config.org_token.token.address,
        this.transferData.value,
        this.transferData.pegConfig.config.pegged_chain_id,
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
    if (!this.transferData.transactor || !this.originalTokenVault) return;
    let wrapTokenAddress;
    try {
      wrapTokenAddress = await this.originalTokenVault?.nativeWrap();
    } catch (e) {
      console.log("wrap token not support");
    }
    if (
      wrapTokenAddress === this.transferData.pegConfig.config.org_token.token.address &&
      (this.transferData.fromChain.id !== 1 && this.transferData.fromChain.id !== 42220,
      this.transferData.fromChain.id !== 288)
    ) {
      // eslint-disable-next-line consistent-return
      return this.originalTokenVault.estimateGas.depositNative(
        this.transferData.value,
        this.transferData.pegConfig.config.pegged_chain_id,
        this.transferData.toAccount,
        this.nonce,
        { value: this.transferData.value },
      );
    }
    // eslint-disable-next-line consistent-return
    return this.originalTokenVault.estimateGas.deposit(
      this.transferData.pegConfig.config.org_token.token.address,
      this.transferData.value,
      this.transferData.pegConfig.config.pegged_chain_id,
      this.transferData.toAccount,
      this.nonce,
    );
  };
}
