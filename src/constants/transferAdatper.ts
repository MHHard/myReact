/* eslint-disable */
import { PeggedPair } from "../hooks/usePeggedPairConfig";
import { FlowDepositResponse, FlowBurnResponse, Chain, TokenInfo, FlowTokenPathConfig } from "./type";
import { BigNumber, ethers, ContractTransaction } from "ethers";
import { TransactionResponse } from "@ethersproject/providers";
import { Transactor } from "../helpers/transactorWithNotifier";
import { PegTokenSupply } from "../hooks/usePegV2Transition";
import { BridgeContracts } from "../hooks/contractLoader";
import { Quote } from "../proto/sdk/service/rfqmm/api_pb";
import { CircleBridgeProxy } from "../typechain/typechain";

export abstract class ITransferAdapter<T> {
  transferData: T;

  nonce = new Date().getTime();

  transferId = "";

  srcBlockTxLink = "";

  senderAddress = "";

  receiverAddress = "";

  constructor(transferData: T) {
    this.transferData = transferData;
  }

  abstract getInteractContract(): Array<string>;
  abstract getTransferId(): string;
  abstract transfer: () =>
    | Promise<
        FlowBurnResponse | FlowDepositResponse | ContractTransaction | TransactionResponse | Uint8Array | undefined
      >
    | undefined;
  abstract isResponseValid: (response: any) => boolean;
  abstract onSuccess: (response: any) => void;
  abstract estimateGas: () => Promise<BigNumber | undefined>;
}

export interface MaxITransfer {
  fromChain: Chain;
  toChain: Chain;
  isNativeToken: boolean;
  address: string;
  value: BigNumber;
  selectedToken: TokenInfo;
  contracts: BridgeContracts;
  transactor: Transactor<ethers.ContractTransaction> | undefined;
  chainId: number;
  amount: string;
  pegConfig: PeggedPair;
  pegSupply: PegTokenSupply | undefined;
  selectedToChain: Chain | undefined;
  maxSlippage: number;
  dstAddress: string;
  nonEVMReceiverAddress: string;
  flowTokenPathConfigs: FlowTokenPathConfig[];
  toAccount: string;
  receiverEVMCompatibleAddress: string;
  quote?: Quote.AsObject;
  msgFee?: string;
  type?: "RfqITransfer" | "CircleUSDCITransfer";
  circleBridgeProxy: CircleBridgeProxy | undefined;
  seiProvider?: any;
  suiProvider?: any;
  auraProvider?: any;
  getNetworkById: any;
}

export interface BaseITransfer {
  fromChain: Chain;
  toChain: Chain;
  isNativeToken: boolean;
  address: string;
  dstAddress: string;
  value: BigNumber;
  selectedToken: TokenInfo;
  contracts: BridgeContracts;
  transactor: Transactor<ethers.ContractTransaction> | undefined;
  getNetworkById: any;
}

export interface ITransfer extends BaseITransfer {
  pegConfig: PeggedPair;
  pegSupply: PegTokenSupply | undefined;
  selectedToChain: Chain | undefined;
  maxSlippage: number;
  toAccount: string;
}

export interface FlowITransfer extends BaseITransfer {
  amount: string;
  nonEVMAddress: string;
  nonEVMReceiverAddress: string;
  flowTokenPathConfigs: FlowTokenPathConfig[];
  flowDepositContractAddress: string;
  flowBurnContractAddress: string;
}

export interface RfqITransfer extends BaseITransfer {
  quote: Quote.AsObject;
  msgFee: string;
  type: "RfqITransfer";
}

export interface CircleUSDCITransfer extends BaseITransfer {
  circleBridgeProxy: CircleBridgeProxy | undefined;
}
