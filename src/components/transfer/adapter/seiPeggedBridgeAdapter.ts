import { BigNumber, ethers } from "ethers";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { getNetworkById } from "../../../constants/network";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";
import { Chain, TokenInfo } from "../../../constants/type";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";
import { convertSeiToCanonicalAddress, seiBurn } from "../../../redux/NonEVMAPIs/seiAPI";

export default class SeiPeggedBridgeAdapter implements ITransferAdapter {
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

  offlineSigner: OfflineSigner;

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
    this.offlineSigner = params.seiProvider;
  }

  getInteractContract(): string[] {
    return [sgnOpsDataCheck[this.fromChain.id]?.ptbridge, this.peggedBurnContractAddress];
  }

  getTransferId(): string {
    const transferId = ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "uint64", "address", "uint64", "uint64"],
      [
        convertSeiToCanonicalAddress(this.address) ?? "",
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
    return seiBurn(
      this.address,
      this.dstAddress,
      this.tokenInfo.token.address,
      this.toChain,
      this.nonce,
      this.value,
      this.offlineSigner,
    );
  };

  isResponseValid = response => {
    return response.transactionSubmitted;
  };

  onSuccess = response => {
    this.transferId = this.getTransferId();
    this.srcBlockTxLink = `${getNetworkById(this.fromChain.id).blockExplorerUrl}/transactions/${
      response.transactionHash
    }`;
    this.srcAddress = this.address;
  };

  estimateGas = async () => {
    return BigNumber.from(0);
  };
}
