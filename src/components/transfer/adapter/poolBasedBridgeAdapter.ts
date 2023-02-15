import { BigNumber, ethers } from "ethers";
import { debugTools } from "../../../utils/debug";
import { Chain, TokenInfo } from "../../../constants/type";
import { Transactor } from "../../../helpers/transactorWithNotifier";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";
import { Bridge } from "../../../typechain/typechain";
import { getNetworkById } from "../../../constants/network";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";

export default class PoolBasedBridgeAdapter implements ITransferAdapter {
  isNative: boolean;

  value: BigNumber;

  maxSlippage: number;

  address: string;

  fromChain: Chain;

  toChain: Chain;

  selectedToken: TokenInfo;

  selectedToChain: Chain | undefined;

  nonce = new Date().getTime();

  bridge: Bridge | undefined;

  transactor: Transactor<ethers.ContractTransaction> | undefined;

  transferId = "";

  srcBlockTxLink = "";

  srcAddress = "";

  dstAddress = "";

  constructor(params: ITransfer) {
    this.value = params.value;
    this.maxSlippage = params.maxSlippage;
    this.address = params.address;
    this.toChain = params.toChain;
    this.fromChain = params.fromChain;
    this.selectedToken = params.selectedToken;
    this.selectedToChain = params.selectedToChain;
    this.dstAddress = params.dstAddress;
    this.bridge = params.contracts.bridge;
    this.isNative = params.isNativeToken;
    this.transactor = params.transactor;
  }

  getTransferId(): string {
    return ethers.utils.solidityKeccak256(
      ["address", "address", "address", "uint256", "uint64", "uint64", "uint64"],
      [
        this.address,
        this.address,
        this.selectedToken?.token?.address,
        this.value.toString(),
        this.toChain?.id.toString(),
        this.nonce.toString(),
        this.fromChain?.id.toString(),
      ],
    );
  }

  getInteractContract(): string[] {
    return [sgnOpsDataCheck[this.fromChain.id]?.cbridge, this.bridge?.address];
  }

  transfer = async () => {
    if (!this.transactor || !this.bridge) return;
    const debugSlippage = debugTools.input("please input slippage", "Number");

    const isMetisChainGasToken = this.fromChain?.id === 1088 && this.selectedToken?.token.symbol === "Metis";
    // eslint-disable-next-line consistent-return
    return this.isNative && !isMetisChainGasToken
      ? this.transactor(
          this.bridge.sendNative(
            this.address,
            this.value,
            BigNumber.from(this.selectedToChain?.id),
            BigNumber.from(this.nonce),
            BigNumber.from(this.maxSlippage || 0),
            { value: this.value },
          ),
        )
      : this.transactor(
          this.bridge.send(
            this.address,
            this.selectedToken?.token?.address,
            this.value,
            BigNumber.from(this.selectedToChain?.id),
            BigNumber.from(this.nonce),
            BigNumber.from(debugSlippage || this.maxSlippage || 0),
          ),
        );
  };

  isResponseValid = response => {
    const newtxStr = JSON.stringify(response);
    const newtx = JSON.parse(newtxStr);
    return !newtx.code;
  };

  onSuccess(response) {
    this.transferId = this.getTransferId();
    this.srcBlockTxLink = `${getNetworkById(this.fromChain.id).blockExplorerUrl}/tx/${
      response.hash || "0x" + response.transactionHash
    }`;
    this.srcAddress = this.address;
  }

    estimateGas = async () => {
      if(!this.transactor || !this.bridge) return;
      const debugSlippage = debugTools.input("please input slippage", "Number");
      // eslint-disable-next-line consistent-return
      return this.isNative ? 
        this.bridge.estimateGas.sendNative(
          this.address,
          this.value,
          BigNumber.from(this.selectedToChain?.id),
          BigNumber.from(this.nonce),
          BigNumber.from(this.maxSlippage || 0),
          { value: this.value },
        ) 
        : 
        this.bridge.estimateGas.send(
            this.address,
            this.selectedToken?.token?.address,
            this.value,
            BigNumber.from(this.selectedToChain?.id),
            BigNumber.from(this.nonce),
            BigNumber.from(debugSlippage || this.maxSlippage || 0),
        )

    }
}
