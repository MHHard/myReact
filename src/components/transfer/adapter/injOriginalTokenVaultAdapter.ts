import { BigNumber, ethers } from "ethers";
import { getNetworkById, isGasToken } from "../../../constants/network";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";
import { Chain, TokenInfo } from "../../../constants/type";
import { convertInjToCanonicalAddress, injDeposit, injDepositNative } from "../../../redux/NonEVMAPIs/injectiveAPI";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";

export default class InjOriginalTokenVaultAdapter implements ITransferAdapter {
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

  constructor(params: ITransfer, contractAddress: string) {
    this.tokenInfo = params.selectedToken;
    this.value = params.value;
    this.address = params.address;
    this.toChain = params.toChain;
    this.fromChain = params.fromChain;
    this.receiverEVMCompatibleAddress = params.receiverEVMCompatibleAddress;
    this.toAccount = params.toAccount;
    this.dstAddress = params.dstAddress;
    this.contractAddress = contractAddress;
  }

  getInteractContract(): string[] {
    return [sgnOpsDataCheck[this.fromChain.id]?.otvault, this.contractAddress];
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
    const isNative = isGasToken(this.fromChain?.id, this.tokenInfo.token.symbol);
    if (isNative) {
      return injDepositNative(
        this.address,
        this.toAccount,
        this.contractAddress,
        this.toChain,
        this.value,
        this.nonce,
        this.tokenInfo.token.symbol,
      );
    }
    return injDeposit(
      this.address,
      this.toAccount,
      this.tokenInfo.token.address,
      this.contractAddress,
      this.toChain,
      this.value,
      this.nonce,
    );
  };

  isResponseValid = response => {
    return response?.transactionSubmitted;
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
