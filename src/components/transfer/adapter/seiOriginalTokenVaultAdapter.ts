import { BigNumber, ethers } from "ethers";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { getNetworkById, isGasToken } from "../../../constants/network";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";
import { Chain, TokenInfo } from "../../../constants/type";
import { convertSeiToCanonicalAddress, seiDeposit, seiDepositNative } from "../../../redux/NonEVMAPIs/seiAPI";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";

export default class SeiOriginalTokenVaultAdapter implements ITransferAdapter {
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

  contractAddress: string;

  offlineSigner: OfflineSigner;

  constructor(params: ITransfer, contractAddress: string) {
    this.tokenInfo = params.selectedToken;
    this.value = params.value;
    this.address = params.address;
    this.toChain = params.toChain;
    this.fromChain = params.fromChain;
    this.receiverEVMCompatibleAddress = params.receiverEVMCompatibleAddress;
    this.toAccount = params.toAccount;
    this.dstAddress = params.dstAddress;
    this.offlineSigner = params.seiProvider;
    this.contractAddress = contractAddress;
  }

  getInteractContract(): string[] {
    return [sgnOpsDataCheck[this.fromChain.id]?.otvault, this.contractAddress];
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
    const isNative = isGasToken(this.fromChain?.id, this.tokenInfo.token.symbol);
    if (isNative) {
      return seiDepositNative(
        this.address,
        this.toAccount,
        this.contractAddress,
        this.toChain,
        this.value,
        this.nonce,
        this.tokenInfo.token.symbol,
        this.offlineSigner,
      );
    }
    return seiDeposit(
      this.address,
      this.toAccount,
      this.tokenInfo.token.address,
      this.contractAddress,
      this.toChain,
      this.value,
      this.nonce,
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
