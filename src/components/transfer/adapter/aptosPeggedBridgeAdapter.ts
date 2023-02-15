import { Types } from "aptos";
import { BigNumber, ethers } from "ethers";
import { getNetworkById } from "../../../constants/network";
import { ITransfer, ITransferAdapter } from "../../../constants/transferAdatper";
import { Chain, TokenInfo } from "../../../constants/type";
import { burnTokenFromAptosAccount } from "../../../redux/NonEVMAPIs/aptosAPIs";
import { sgnOpsDataCheck } from "../../../sgn-ops-data-check/sgn-ops-data-check";

export default class AptosPeggedBridgeAdapter implements ITransferAdapter {
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

  signAndSubmitTransaction?: (
    transaction: Types.TransactionPayload,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any,
  ) => Promise<{ hash: Types.HexEncodedBytes }>;

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
    this.signAndSubmitTransaction = params.signAndSubmitTransaction;
  }

  getInteractContract(): string[] {
    return [sgnOpsDataCheck[this.fromChain.id]?.ptbridge, this.peggedBurnContractAddress];
  }

  getTransferId(): string {
    const receiverAddressWithout0x = this.toAccount.replace("0x", "");

    const transferId = ethers.utils.solidityKeccak256(
      [
        "bytes32",
        "string",
        "uint64",
        "uint64",
        `bytes${Math.floor(receiverAddressWithout0x.length / 2)}`,
        "uint64",
        "uint64",
        "bytes32",
        "string",
      ],
      [
        this.address, /// Aptos wallet address, 32-byte hexString
        this.tokenInfo.token.address, /// Aptos token address
        this.value.toString(), /// Transfer amount
        this.toChain.id.toString(), /// Destination chain id
        `0x${receiverAddressWithout0x}`, /// Receiver address which length may vary based on different chains
        this.nonce.toString(), /// Nonce
        this.fromChain.id.toString(), /// Source chain id
        `0x${this.peggedBurnContractAddress}`, /// Aptos contract address, 32-byte hexString
        "peg_bridge", /// hardcoded message
      ],
    );

    return transferId;
  }

  transfer = async () => {
    if (!this.signAndSubmitTransaction) {
      return undefined;
    }
    return burnTokenFromAptosAccount(
      this.value.toString(),
      this.toChain.id,
      this.receiverEVMCompatibleAddress,
      this.nonce.toString(),
      this.peggedBurnContractAddress,
      this.tokenInfo.token.address,
      this.signAndSubmitTransaction,
    );
  };

  isResponseValid = response => {
    return response.transactionSubmitted;
  };

  onSuccess = response => {
    this.transferId = this.getTransferId();
    this.srcBlockTxLink = `${getNetworkById(this.fromChain.id).blockExplorerUrl}/txn/${
      response.transactionHash
    }?network=${process.env.REACT_APP_APTOS_NET?.toLowerCase()}`;
    this.srcAddress = this.address;
  };

  estimateGas = async () => {
    return BigNumber.from(0)
  }
}
