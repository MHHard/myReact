import { BigNumber, ethers } from "ethers";
import { getNetworkById } from "../../../constants/network";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";
import { Chain, TokenInfo } from "../../../constants/type";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";
import { convertInjToCanonicalAddress, injBurn } from "../../../redux/NonEVMAPIs/injectiveAPI";

export default class InjPeggedBridgeAdapter implements ITransferAdapter {
  value: BigNumber;

  address: string;

  tokenInfo: TokenInfo;

  fromChain: Chain;

  toChain: Chain;

  receiverEVMCompatibleAddress: string;

  toAccount: string;

  nonce = new Date().getTime();

  transferId = "";

  srcBlockTxLink = "";

  srcAddress = "";

  dstAddress: string;

  peggedBurnContractAddress: string;

  constructor(params: ITransfer, peggedBurnContractAddress: string) {
    this.tokenInfo = params.selectedToken;
    this.value = params.value;
    this.address = params.address;
    this.toChain = params.toChain;
    this.fromChain = params.fromChain;
    this.receiverEVMCompatibleAddress = params.receiverEVMCompatibleAddress;
    this.toAccount = params.toAccount;
    this.dstAddress = params.dstAddress;
    this.peggedBurnContractAddress = peggedBurnContractAddress;
  }

  getInteractContract(): string[] {
    return [sgnOpsDataCheck[this.fromChain.id]?.ptbridge, this.peggedBurnContractAddress];
  }

  getTransferId(): string {
    const transferId = ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "uint64", "address", "uint64", "uint64"],
      [
        convertInjToCanonicalAddress(this.address) ?? "",
        this.tokenInfo?.token?.address,
        this.value.toString(),
        this.toChain?.id.toString(),
        this.toAccount,
        this.nonce.toString(),
        this.fromChain?.id.toString(),
      ],
    );

    return transferId;
  }

  transfer = async () => {
    return injBurn(this.address, this.dstAddress, this.tokenInfo.token.address, this.toChain, this.nonce, this.value);
  };

  isResponseValid = response => {
    return response.transactionSubmitted;
  };

  onSuccess = response => {
    this.transferId = this.getTransferId();
    this.srcBlockTxLink = `${getNetworkById(this.fromChain.id).blockExplorerUrl}/transactions/${response.txHash}`;
    this.srcAddress = this.address;
  };

  estimateGas = async () => {
    return BigNumber.from(0);
  };
}
