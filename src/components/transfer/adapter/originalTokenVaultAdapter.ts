
import { BigNumber, ethers } from "ethers";
import { PeggedPair } from "../../../hooks/usePeggedPairConfig";
import { Chain, TokenInfo } from "../../../constants/type";
import { Transactor } from "../../../helpers/transactorWithNotifier";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";
import { OriginalTokenVault } from "../../../typechain/typechain";
import { getNetworkById } from "../../../constants/network";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";

export default class OriginalTokenVaultAdapter implements ITransferAdapter{
    value: BigNumber;

    address: string;

    fromChain: Chain;

    toChain: Chain;

    selectedToken: TokenInfo;

    toAccount: string;

    nonce = new Date().getTime();

    pegConfig: PeggedPair;

    originalTokenVault: OriginalTokenVault | undefined;

    transactor: Transactor<ethers.ContractTransaction> | undefined;

    transferId = '';

    srcBlockTxLink = '';
 
    srcAddress = '';

    dstAddress = '';

    constructor(params: ITransfer) {
      this.value = params.value;
      this.address = params.address;
      this.toChain = params.toChain;
      this.fromChain = params.fromChain;
      this.selectedToken = params.selectedToken;
      this.toAccount = params.toAccount;
      this.dstAddress = params.dstAddress 
      this.pegConfig = params.pegConfig;
      this.originalTokenVault = params.contracts.originalTokenVault;
      this.transactor = params.transactor;
  }

    getTransferId(): string {
        return ethers.utils.solidityKeccak256(
            ["address", "address", "uint256", "uint64", "address", "uint64", "uint64"],
            [
              this.address,
              this.selectedToken?.token?.address,
              this.value.toString(),
              this.toChain?.id.toString(),
              this.toAccount,
              this.nonce.toString(),
              this.fromChain?.id.toString(),
            ],
        );
    }

    getInteractContract(): string[] {
      return [sgnOpsDataCheck[this.fromChain.id]?.otvault, this.originalTokenVault?.address];
    }

    transfer = async () => {
        if(!this.transactor || !this.originalTokenVault) return;
        let wrapTokenAddress;
        try {
            wrapTokenAddress = await this.originalTokenVault?.nativeWrap();
        } catch (e) {
            console.log("wrap token not support");
        }
        if (
            wrapTokenAddress === this.pegConfig.config.org_token.token.address &&
            (this.fromChain.id !== 1 && this.fromChain.id !== 42220, this.fromChain.id !== 288)
        ) {
            // eslint-disable-next-line consistent-return
            return this.transactor(this.originalTokenVault.depositNative(
                this.value,
                this.pegConfig.config.pegged_chain_id,
                this.toAccount,
                this.nonce,
                { value: this.value },
            ))
        } 
        // eslint-disable-next-line consistent-return
        return this.transactor(this.originalTokenVault.deposit(
            this.pegConfig.config.org_token.token.address,
            this.value,
            this.pegConfig.config.pegged_chain_id,
            this.toAccount,
            this.nonce,
        ))
    };

    isResponseValid = (response) => {
      const newtxStr = JSON.stringify(response);
      const newtx = JSON.parse(newtxStr);
      return !newtx.code;
    }

    onSuccess(response) {
      this.transferId = this.getTransferId();
      this.srcBlockTxLink = `${getNetworkById(this.fromChain.id).blockExplorerUrl}/tx/${response.hash}`;
      this.srcAddress = this.address;
    }

    estimateGas = async () => {
        if(!this.transactor || !this.originalTokenVault) return;
        let wrapTokenAddress;
        try {
            wrapTokenAddress = await this.originalTokenVault?.nativeWrap();
        } catch (e) {
            console.log("wrap token not support");
        }
        if (
            wrapTokenAddress === this.pegConfig.config.org_token.token.address &&
            (this.fromChain.id !== 1 && this.fromChain.id !== 42220, this.fromChain.id !== 288)
        ) {
            // eslint-disable-next-line consistent-return
            return this.originalTokenVault.estimateGas.depositNative(
                this.value,
                this.pegConfig.config.pegged_chain_id,
                this.toAccount,
                this.nonce,
                { value: this.value },
            );
        } 
        // eslint-disable-next-line consistent-return
        return this.originalTokenVault.estimateGas.deposit(
            this.pegConfig.config.org_token.token.address,
            this.value,
            this.pegConfig.config.pegged_chain_id,
            this.toAccount,
            this.nonce,
        );
    }
}
