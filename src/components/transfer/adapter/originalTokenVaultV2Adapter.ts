import { ethers } from "ethers";
import { OriginalTokenVaultV2 } from "../../../typechain/typechain";
import { isApeChain } from "../../../hooks/useTransfer";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";
import { isETH } from "../../../helpers/tokenInfo";

export default class OriginalTokenVaultV2Adapter extends ITransferAdapter<ITransfer> {
  nonce = new Date().getTime();

  transferId = "";

  srcBlockTxLink = "";

  srcAddress = "";

  contract: OriginalTokenVaultV2 | undefined = this.transferData.contracts.originalTokenVaultV2;

  getTransferId(): string {
    return ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "uint64", "address", "uint64", "uint64", "address"],
      [
        this.transferData.address,
        this.transferData.selectedToken?.token?.address,
        this.transferData.value.toString(),
        this.transferData.toChain?.id.toString(),
        this.transferData.toAccount,
        this.nonce.toString(),
        this.transferData.fromChain?.id.toString(),
        this.contract?.address,
      ],
    );
  }

  getInteractContract(): string[] {
    return [sgnOpsDataCheck[this.transferData.fromChain.id]?.otvault2, this.contract?.address];
  }

  transfer = async () => {
    if (!this.transferData.transactor || !this.contract) return;
    const gasLimit = sessionStorage.getItem("bot") ? { gasLimit: 50000000 } : {};

    let wrapTokenAddress;
    try {
      wrapTokenAddress = await this.contract?.nativeWrap();
    } catch (e) {
      console.log("wrap token not support");
    }
    if (wrapTokenAddress === this.transferData.selectedToken.token.address) {
      // except the case of Ethereum WETH
      if (
        (this.transferData.fromChain.id === 1 || this.transferData.fromChain.id === 5) &&
        !isETH(this.transferData.selectedToken.token)
      ) {
        // eslint-disable-next-line consistent-return
        return this.transferData.transactor(
          this.contract?.deposit(
            this.transferData.pegConfig.config.org_token.token.address,
            this.transferData.value,
            this.transferData.pegConfig.config.pegged_chain_id,
            this.transferData.toAccount,
            this.nonce,
            gasLimit,
          ),
        );
      }

      if (isApeChain(this.transferData.fromChain.id)) {
        // eslint-disable-next-line consistent-return
        return this.transferData.transactor(
          this.contract?.depositNative(
            this.transferData.value,
            this.transferData.pegConfig.config.pegged_chain_id,
            this.transferData.toAccount,
            this.nonce,
            { value: this.transferData.value, gasPrice: 0, ...gasLimit },
          ),
        );
      }

      // eslint-disable-next-line consistent-return
      return this.transferData.transactor(
        this.contract?.depositNative(
          this.transferData.value,
          this.transferData.pegConfig.config.pegged_chain_id,
          this.transferData.toAccount,
          this.nonce,
          { value: this.transferData.value, ...gasLimit },
        ),
      );
    }
    if (isApeChain(this.transferData.fromChain.id)) {
      // eslint-disable-next-line consistent-return
      return this.transferData.transactor(
        this.contract?.deposit(
          this.transferData.pegConfig.config.org_token.token.address,
          this.transferData.value,
          this.transferData.pegConfig.config.pegged_chain_id,
          this.transferData.toAccount,
          this.nonce,
          { gasPrice: 0, ...gasLimit },
        ),
      );
    }

    // eslint-disable-next-line consistent-return
    return this.transferData.transactor(
      this.contract?.deposit(
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
    if (!this.transferData.transactor || !this.contract) return;
    let wrapTokenAddress;
    try {
      wrapTokenAddress = await this.contract?.nativeWrap();
    } catch (e) {
      console.log("wrap token not support");
    }
    if (wrapTokenAddress === this.transferData.pegConfig.config.org_token.token.address) {
      if (isApeChain(this.transferData.fromChain.id)) {
        // eslint-disable-next-line consistent-return
        return this.contract?.estimateGas.depositNative(
          this.transferData.value,
          this.transferData.pegConfig.config.pegged_chain_id,
          this.transferData.toAccount,
          this.nonce,
          { value: this.transferData.value, gasPrice: 0 },
        );
      }
      // eslint-disable-next-line consistent-return
      return this.contract?.estimateGas.depositNative(
        this.transferData.value,
        this.transferData.pegConfig.config.pegged_chain_id,
        this.transferData.toAccount,
        this.nonce,
        { value: this.transferData.value },
      );
    }
    if (isApeChain(this.transferData.fromChain.id)) {
      // eslint-disable-next-line consistent-return
      return this.contract?.estimateGas.deposit(
        this.transferData.pegConfig.config.org_token.token.address,
        this.transferData.value,
        this.transferData.pegConfig.config.pegged_chain_id,
        this.transferData.toAccount,
        this.nonce,
        { gasPrice: 0 },
      );
    }
    // eslint-disable-next-line consistent-return
    return this.contract?.estimateGas.deposit(
      this.transferData.pegConfig.config.org_token.token.address,
      this.transferData.value,
      this.transferData.pegConfig.config.pegged_chain_id,
      this.transferData.toAccount,
      this.nonce,
    );
  };
}
