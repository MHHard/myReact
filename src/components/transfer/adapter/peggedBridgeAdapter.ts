
import { BigNumber, ethers } from "ethers";
import { PeggedChainMode, PeggedPair } from "../../../hooks/usePeggedPairConfig";
import { Chain, TokenInfo } from "../../../constants/type";
import { Transactor } from "../../../helpers/transactorWithNotifier";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";
import { PeggedTokenBridge } from "../../../typechain/typechain";
import { getNetworkById } from "../../../constants/network";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";

export default class PeggedBridgeAdapter implements ITransferAdapter{
    value: BigNumber;

    address: string;

    fromChain: Chain;

    toChain: Chain;

    selectedToken: TokenInfo;

    toAccount: string;

    nonce = new Date().getTime();

    pegConfig: PeggedPair;

    peggedTokenBridge: PeggedTokenBridge | undefined;

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
      this.peggedTokenBridge = params.contracts.peggedTokenBridge;
      this.transactor = params.transactor;
  }

    getTransferId(): string {
        switch (this.pegConfig.mode) {
            case PeggedChainMode.BurnThenSwap:
              return ethers.utils.solidityKeccak256(
                ["address", "address", "uint256", "address", "uint64", "uint64"],
                [
                  this.address,
                  this.pegConfig.config.pegged_token.token.address,
                  this.value.toString(),
                  this.toAccount,
                  this.nonce.toString(),
                  this.fromChain?.id.toString(),
                ],
              );
            case PeggedChainMode.Burn:
            case PeggedChainMode.TransitionPegV2:
              return ethers.utils.solidityKeccak256(
                ["address", "address", "uint256", "address", "uint64", "uint64"],
                [
                  this.address,
                  this.selectedToken?.token?.address,
                  this.value.toString(),
                  this.toAccount,
                  this.nonce.toString(),
                  this.fromChain?.id.toString(),
                ],
              );
            default:
              return ''
        }
    }

    getInteractContract(): string[] {
      return [sgnOpsDataCheck[this.fromChain.id]?.ptbridge, this.peggedTokenBridge?.address];
    }

    transfer = () => {
        if(!this.transactor || !this.peggedTokenBridge) return
        // eslint-disable-next-line consistent-return
        return this.transactor(this.peggedTokenBridge.burn(
            this.pegConfig.config.pegged_token.token.address,
            this.value,
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
      if(!this.transactor || !this.peggedTokenBridge) return
      // eslint-disable-next-line consistent-return
      return this.peggedTokenBridge.estimateGas.burn(
          this.pegConfig.config.pegged_token.token.address,
          this.value,
          this.toAccount,
          this.nonce,
      )
    }
}
