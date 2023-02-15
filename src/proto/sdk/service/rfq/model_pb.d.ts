import * as jspb from 'google-protobuf'

import * as sdk_service_rfqmm_api_pb from '../../../sdk/service/rfqmm/api_pb';


export class PendingOrder extends jspb.Message {
  getQuote(): sdk_service_rfqmm_api_pb.Quote | undefined;
  setQuote(value?: sdk_service_rfqmm_api_pb.Quote): PendingOrder;
  hasQuote(): boolean;
  clearQuote(): PendingOrder;

  getSrcDepositTxHash(): string;
  setSrcDepositTxHash(value: string): PendingOrder;

  getDstNative(): boolean;
  setDstNative(value: boolean): PendingOrder;

  getExecMsgCallData(): Uint8Array | string;
  getExecMsgCallData_asU8(): Uint8Array;
  getExecMsgCallData_asB64(): string;
  setExecMsgCallData(value: Uint8Array | string): PendingOrder;

  getQuoteSig(): string;
  setQuoteSig(value: string): PendingOrder;

  getStatus(): OrderStatus;
  setStatus(value: OrderStatus): PendingOrder;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PendingOrder.AsObject;
  static toObject(includeInstance: boolean, msg: PendingOrder): PendingOrder.AsObject;
  static serializeBinaryToWriter(message: PendingOrder, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PendingOrder;
  static deserializeBinaryFromReader(message: PendingOrder, reader: jspb.BinaryReader): PendingOrder;
}

export namespace PendingOrder {
  export type AsObject = {
    quote?: sdk_service_rfqmm_api_pb.Quote.AsObject,
    srcDepositTxHash: string,
    dstNative: boolean,
    execMsgCallData: Uint8Array | string,
    quoteSig: string,
    status: OrderStatus,
  }
}

export class UserOrder extends jspb.Message {
  getQuote(): sdk_service_rfqmm_api_pb.Quote | undefined;
  setQuote(value?: sdk_service_rfqmm_api_pb.Quote): UserOrder;
  hasQuote(): boolean;
  clearQuote(): UserOrder;

  getDstNative(): boolean;
  setDstNative(value: boolean): UserOrder;

  getLastUpdated(): number;
  setLastUpdated(value: number): UserOrder;

  getStatus(): OrderStatus;
  setStatus(value: OrderStatus): UserOrder;

  getMmId(): string;
  setMmId(value: string): UserOrder;

  getMmAddr(): string;
  setMmAddr(value: string): UserOrder;

  getSrcDepositTxHash(): string;
  setSrcDepositTxHash(value: string): UserOrder;

  getDstTransferTxHash(): string;
  setDstTransferTxHash(value: string): UserOrder;

  getSrcReleaseTxHash(): string;
  setSrcReleaseTxHash(value: string): UserOrder;

  getDstRefundInitTxHash(): string;
  setDstRefundInitTxHash(value: string): UserOrder;

  getSrcRefundTxHash(): string;
  setSrcRefundTxHash(value: string): UserOrder;

  getCreatedTime(): number;
  setCreatedTime(value: number): UserOrder;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserOrder.AsObject;
  static toObject(includeInstance: boolean, msg: UserOrder): UserOrder.AsObject;
  static serializeBinaryToWriter(message: UserOrder, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserOrder;
  static deserializeBinaryFromReader(message: UserOrder, reader: jspb.BinaryReader): UserOrder;
}

export namespace UserOrder {
  export type AsObject = {
    quote?: sdk_service_rfqmm_api_pb.Quote.AsObject,
    dstNative: boolean,
    lastUpdated: number,
    status: OrderStatus,
    mmId: string,
    mmAddr: string,
    srcDepositTxHash: string,
    dstTransferTxHash: string,
    srcReleaseTxHash: string,
    dstRefundInitTxHash: string,
    srcRefundTxHash: string,
    createdTime: number,
  }
}

export class MarketMaker extends jspb.Message {
  getId(): string;
  setId(value: string): MarketMaker;

  getName(): string;
  setName(value: string): MarketMaker;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MarketMaker.AsObject;
  static toObject(includeInstance: boolean, msg: MarketMaker): MarketMaker.AsObject;
  static serializeBinaryToWriter(message: MarketMaker, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MarketMaker;
  static deserializeBinaryFromReader(message: MarketMaker, reader: jspb.BinaryReader): MarketMaker;
}

export namespace MarketMaker {
  export type AsObject = {
    id: string,
    name: string,
  }
}

export enum OrderStatus { 
  STATUS_PENDING = 0,
  STATUS_SRC_DEPOSITED = 10,
  STATUS_MM_REJECTED = 20,
  STATUS_MM_DST_EXECUTED = 30,
  STATUS_DST_TRANSFERRED = 40,
  STATUS_MM_SRC_EXECUTED = 50,
  STATUS_REFUND_INITIATED = 60,
  STATUS_SRC_RELEASED = 70,
  STATUS_REFUNDED = 80,
}
