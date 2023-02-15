/* eslint-disable */
import { PeggedPair } from "../hooks/usePeggedPairConfig";
import {
  FlowDepositResponse,
  FlowBurnResponse,
  Chain,
  MultiBurnPairConfig,
  TokenInfo,
  GetTransferConfigsResponse,
  FlowTokenPathConfig,
} from "./type";
import { BigNumber, ethers, ContractTransaction } from "ethers";
import { TransactionResponse } from "@ethersproject/providers";
import { Transactor } from "../helpers/transactorWithNotifier";
import { PegTokenSupply } from "../hooks/usePegV2Transition";
import { BridgeContracts } from "../hooks/contractLoader";
import { Quote } from "../proto/sdk/service/rfqmm/api_pb";
import { AptosTransactionResponse } from "../redux/NonEVMAPIs/aptosAPIs";
import { Types } from "aptos";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { TxResponse } from "@injectivelabs/sdk-ts";
export interface ITransferAdapter {
  getInteractContract(): Array<string>;
  getTransferId(): string;
  transfer: () =>
    | Promise<
        | FlowBurnResponse
        | FlowDepositResponse
        | ContractTransaction
        | TransactionResponse
        | AptosTransactionResponse
        | DeliverTxResponse
        | ExecuteResult
        | Uint8Array
        | TxResponse
        | undefined
      >
    | undefined;
  isResponseValid: (response: any) => boolean;
  onSuccess: (response: any) => void;
  estimateGas: () => Promise<BigNumber | undefined>;
}

export interface BaseITransfer {
  isTestNet: boolean;
  isNativeToken: boolean;
  chainId: number;
  address: string;
  fromChain: Chain;
  toChain: Chain;
  amount: string;
  value: BigNumber;
  transactor: Transactor<ethers.ContractTransaction> | undefined;
  contracts: BridgeContracts;
}

export interface ITransfer extends BaseITransfer {
  multiBurnConfig: MultiBurnPairConfig | undefined;
  pegConfig: PeggedPair;
  pegSupply: PegTokenSupply | undefined;
  selectedToken: TokenInfo;
  selectedToChain: Chain | undefined;
  maxSlippage: number;
  receiverEVMCompatibleAddress: string;
  toAccount: string;
  dstAddress: string;
  transferConfig: GetTransferConfigsResponse;
  flowTokenPathConfigs: FlowTokenPathConfig[];
  nonEVMAddress: string;
  nonEVMReceiverAddress: string;
  signAndSubmitTransaction?: (
    transaction: Types.TransactionPayload,
    options?: any,
  ) => Promise<{ hash: Types.HexEncodedBytes }>;
  seiProvider?: any;
  fee?: number;
}

export interface IRfqTransfer extends BaseITransfer {
  quote: Quote.AsObject;
  msgFee: string;
  type: "IRfqTransfer";
}

// export interface ITransfer {
//   isTestNet: boolean;
//   isNativeToken: boolean;
//   chainId: number;
//   address: string;
//   fromChain: Chain;
//   toChain: Chain;
//   multiBurnConfig: MultiBurnPairConfig | undefined;
//   pegConfig: PeggedPair;
//   pegSupply: PegTokenSupply | undefined;
//   amount: string;
//   selectedToken: TokenInfo;
//   selectedToChain: Chain | undefined;
//   value: BigNumber;
//   maxSlippage: number;
//   receiverEVMCompatibleAddress: string;
//   toAccount: string;
//   dstAddress: string;
//   transferConfig: GetTransferConfigsResponse;
//   flowTokenPathConfigs: FlowTokenPathConfig[];
//   nonEVMAddress: string;
//   nonEVMReceiverAddress: string;
//   transactor: Transactor<ethers.ContractTransaction> | undefined;
//   contracts: BridgeContracts;
// }
