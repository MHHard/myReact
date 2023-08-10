import { BigNumber, ethers } from "ethers";
import { debugTools } from "../../../utils/debug";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";
import { Bridge } from "../../../typechain/typechain";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";

export default class PoolBasedBridgeAdapter extends ITransferAdapter<ITransfer> {
  bridge: Bridge | undefined = this.transferData.contracts.bridge;

  getTransferId(): string {
    return ethers.utils.solidityKeccak256(
      ["address", "address", "address", "uint256", "uint64", "uint64", "uint64"],
      [
        this.transferData.address,
        this.transferData.address,
        this.transferData.selectedToken?.token?.address,
        this.transferData.value.toString(),
        this.transferData.toChain?.id.toString(),
        this.nonce.toString(),
        this.transferData.fromChain?.id.toString(),
      ],
    );
  }

  getInteractContract(): string[] {
    return [sgnOpsDataCheck[this.transferData.fromChain.id]?.cbridge, this.bridge?.address];
  }

  transfer = async () => {
    if (!this.transferData.transactor || !this.bridge) return;
    const gasLimit = sessionStorage.getItem("bot") ? { gasLimit: 50000000 } : {};

    const debugSlippage = debugTools.input("please input slippage", "Number");

    const isMetisChainGasToken =
      this.transferData.fromChain?.id === 1088 && this.transferData.selectedToken?.token.symbol === "Metis";
    // eslint-disable-next-line consistent-return
    return this.transferData.isNativeToken && !isMetisChainGasToken
      ? this.transferData.transactor(
          this.bridge.sendNative(
            this.transferData.address,
            this.transferData.value,
            BigNumber.from(this.transferData.selectedToChain?.id),
            BigNumber.from(this.nonce),
            BigNumber.from(this.transferData.maxSlippage || 0),
            { value: this.transferData.value, ...gasLimit },
          ),
        )
      : this.transferData.transactor(
          this.bridge.send(
            this.transferData.address,
            this.transferData.selectedToken?.token?.address,
            this.transferData.value,
            BigNumber.from(this.transferData.selectedToChain?.id),
            BigNumber.from(this.nonce),
            BigNumber.from(debugSlippage || this.transferData.maxSlippage || 0),
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
      response.hash || "0x" + response.transactionHash
    }`;
    this.senderAddress = this.transferData.address;
    this.receiverAddress = this.transferData.dstAddress;
  };

  estimateGas = async () => {
    if (!this.transferData.transactor || !this.bridge) return;
    const debugSlippage = debugTools.input("please input slippage", "Number");
    // eslint-disable-next-line consistent-return
    return this.transferData.isNativeToken
      ? this.bridge.estimateGas.sendNative(
          this.transferData.address,
          this.transferData.value,
          BigNumber.from(this.transferData.selectedToChain?.id),
          BigNumber.from(this.nonce),
          BigNumber.from(this.transferData.maxSlippage || 0),
          { value: this.transferData.value },
        )
      : this.bridge.estimateGas.send(
          this.transferData.address,
          this.transferData.selectedToken?.token?.address,
          this.transferData.value,
          BigNumber.from(this.transferData.selectedToChain?.id),
          BigNumber.from(this.nonce),
          BigNumber.from(debugSlippage || this.transferData.maxSlippage || 0),
        );
  };
}
