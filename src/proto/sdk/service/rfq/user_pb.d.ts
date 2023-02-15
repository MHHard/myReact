import * as jspb from 'google-protobuf'

import * as sdk_common_token_pb from '../../../sdk/common/token_pb';
import * as sdk_common_error_pb from '../../../sdk/common/error_pb';
import * as sdk_service_rfq_model_pb from '../../../sdk/service/rfq/model_pb';
import * as sdk_service_rfqmm_api_pb from '../../../sdk/service/rfqmm/api_pb';


export class GetConfigsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetConfigsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetConfigsRequest): GetConfigsRequest.AsObject;
  static serializeBinaryToWriter(message: GetConfigsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetConfigsRequest;
  static deserializeBinaryFromReader(message: GetConfigsRequest, reader: jspb.BinaryReader): GetConfigsRequest;
}

export namespace GetConfigsRequest {
  export type AsObject = {
  }
}

export class GetConfigsResponse extends jspb.Message {
  getContractAddrsMap(): jspb.Map<number, string>;
  clearContractAddrsMap(): GetConfigsResponse;

  getTokensList(): Array<sdk_common_token_pb.Token>;
  setTokensList(value: Array<sdk_common_token_pb.Token>): GetConfigsResponse;
  clearTokensList(): GetConfigsResponse;
  addTokens(value?: sdk_common_token_pb.Token, index?: number): sdk_common_token_pb.Token;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetConfigsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetConfigsResponse): GetConfigsResponse.AsObject;
  static serializeBinaryToWriter(message: GetConfigsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetConfigsResponse;
  static deserializeBinaryFromReader(message: GetConfigsResponse, reader: jspb.BinaryReader): GetConfigsResponse;
}

export namespace GetConfigsResponse {
  export type AsObject = {
    contractAddrsMap: Array<[number, string]>,
    tokensList: Array<sdk_common_token_pb.Token.AsObject>,
  }
}

export class PriceRequest extends jspb.Message {
  getSrcToken(): sdk_common_token_pb.Token | undefined;
  setSrcToken(value?: sdk_common_token_pb.Token): PriceRequest;
  hasSrcToken(): boolean;
  clearSrcToken(): PriceRequest;

  getDstToken(): sdk_common_token_pb.Token | undefined;
  setDstToken(value?: sdk_common_token_pb.Token): PriceRequest;
  hasDstToken(): boolean;
  clearDstToken(): PriceRequest;

  getSrcAmount(): string;
  setSrcAmount(value: string): PriceRequest;

  getDstAmount(): string;
  setDstAmount(value: string): PriceRequest;

  getDstNative(): boolean;
  setDstNative(value: boolean): PriceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PriceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PriceRequest): PriceRequest.AsObject;
  static serializeBinaryToWriter(message: PriceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PriceRequest;
  static deserializeBinaryFromReader(message: PriceRequest, reader: jspb.BinaryReader): PriceRequest;
}

export namespace PriceRequest {
  export type AsObject = {
    srcToken?: sdk_common_token_pb.Token.AsObject,
    dstToken?: sdk_common_token_pb.Token.AsObject,
    srcAmount: string,
    dstAmount: string,
    dstNative: boolean,
  }
}

export class PriceResponse extends jspb.Message {
  getErr(): sdk_common_error_pb.Err | undefined;
  setErr(value?: sdk_common_error_pb.Err): PriceResponse;
  hasErr(): boolean;
  clearErr(): PriceResponse;

  getPrice(): sdk_service_rfqmm_api_pb.Price | undefined;
  setPrice(value?: sdk_service_rfqmm_api_pb.Price): PriceResponse;
  hasPrice(): boolean;
  clearPrice(): PriceResponse;

  getFee(): string;
  setFee(value: string): PriceResponse;

  getMmId(): string;
  setMmId(value: string): PriceResponse;

  getTxMsgFee(): string;
  setTxMsgFee(value: string): PriceResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PriceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PriceResponse): PriceResponse.AsObject;
  static serializeBinaryToWriter(message: PriceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PriceResponse;
  static deserializeBinaryFromReader(message: PriceResponse, reader: jspb.BinaryReader): PriceResponse;
}

export namespace PriceResponse {
  export type AsObject = {
    err?: sdk_common_error_pb.Err.AsObject,
    price?: sdk_service_rfqmm_api_pb.Price.AsObject,
    fee: string,
    mmId: string,
    txMsgFee: string,
  }
}

export class QuoteRequest extends jspb.Message {
  getPrice(): sdk_service_rfqmm_api_pb.Price | undefined;
  setPrice(value?: sdk_service_rfqmm_api_pb.Price): QuoteRequest;
  hasPrice(): boolean;
  clearPrice(): QuoteRequest;

  getMmId(): string;
  setMmId(value: string): QuoteRequest;

  getSender(): string;
  setSender(value: string): QuoteRequest;

  getReceiver(): string;
  setReceiver(value: string): QuoteRequest;

  getRefundTo(): string;
  setRefundTo(value: string): QuoteRequest;

  getSrcDeadline(): number;
  setSrcDeadline(value: number): QuoteRequest;

  getDstDeadline(): number;
  setDstDeadline(value: number): QuoteRequest;

  getDstNative(): boolean;
  setDstNative(value: boolean): QuoteRequest;

  getSrcNative(): boolean;
  setSrcNative(value: boolean): QuoteRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteRequest): QuoteRequest.AsObject;
  static serializeBinaryToWriter(message: QuoteRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteRequest;
  static deserializeBinaryFromReader(message: QuoteRequest, reader: jspb.BinaryReader): QuoteRequest;
}

export namespace QuoteRequest {
  export type AsObject = {
    price?: sdk_service_rfqmm_api_pb.Price.AsObject,
    mmId: string,
    sender: string,
    receiver: string,
    refundTo: string,
    srcDeadline: number,
    dstDeadline: number,
    dstNative: boolean,
    srcNative: boolean,
  }
}

export class QuoteResponse extends jspb.Message {
  getErr(): sdk_common_error_pb.Err | undefined;
  setErr(value?: sdk_common_error_pb.Err): QuoteResponse;
  hasErr(): boolean;
  clearErr(): QuoteResponse;

  getSrcTokenUsdPrice(): number;
  setSrcTokenUsdPrice(value: number): QuoteResponse;

  getDstTokenUsdPrice(): number;
  setDstTokenUsdPrice(value: number): QuoteResponse;

  getQuote(): sdk_service_rfqmm_api_pb.Quote | undefined;
  setQuote(value?: sdk_service_rfqmm_api_pb.Quote): QuoteResponse;
  hasQuote(): boolean;
  clearQuote(): QuoteResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteResponse): QuoteResponse.AsObject;
  static serializeBinaryToWriter(message: QuoteResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteResponse;
  static deserializeBinaryFromReader(message: QuoteResponse, reader: jspb.BinaryReader): QuoteResponse;
}

export namespace QuoteResponse {
  export type AsObject = {
    err?: sdk_common_error_pb.Err.AsObject,
    srcTokenUsdPrice: number,
    dstTokenUsdPrice: number,
    quote?: sdk_service_rfqmm_api_pb.Quote.AsObject,
  }
}

export class GetHistoryRequest extends jspb.Message {
  getNextPageToken(): string;
  setNextPageToken(value: string): GetHistoryRequest;

  getPageSize(): number;
  setPageSize(value: number): GetHistoryRequest;

  getUserAddr(): string;
  setUserAddr(value: string): GetHistoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHistoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetHistoryRequest): GetHistoryRequest.AsObject;
  static serializeBinaryToWriter(message: GetHistoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHistoryRequest;
  static deserializeBinaryFromReader(message: GetHistoryRequest, reader: jspb.BinaryReader): GetHistoryRequest;
}

export namespace GetHistoryRequest {
  export type AsObject = {
    nextPageToken: string,
    pageSize: number,
    userAddr: string,
  }
}

export class GetHistoryResponse extends jspb.Message {
  getOrdersList(): Array<sdk_service_rfq_model_pb.UserOrder>;
  setOrdersList(value: Array<sdk_service_rfq_model_pb.UserOrder>): GetHistoryResponse;
  clearOrdersList(): GetHistoryResponse;
  addOrders(value?: sdk_service_rfq_model_pb.UserOrder, index?: number): sdk_service_rfq_model_pb.UserOrder;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHistoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetHistoryResponse): GetHistoryResponse.AsObject;
  static serializeBinaryToWriter(message: GetHistoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHistoryResponse;
  static deserializeBinaryFromReader(message: GetHistoryResponse, reader: jspb.BinaryReader): GetHistoryResponse;
}

export namespace GetHistoryResponse {
  export type AsObject = {
    ordersList: Array<sdk_service_rfq_model_pb.UserOrder.AsObject>,
  }
}

export class GetOrdersRequest extends jspb.Message {
  getQuoteHashesList(): Array<string>;
  setQuoteHashesList(value: Array<string>): GetOrdersRequest;
  clearQuoteHashesList(): GetOrdersRequest;
  addQuoteHashes(value: string, index?: number): GetOrdersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetOrdersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetOrdersRequest): GetOrdersRequest.AsObject;
  static serializeBinaryToWriter(message: GetOrdersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetOrdersRequest;
  static deserializeBinaryFromReader(message: GetOrdersRequest, reader: jspb.BinaryReader): GetOrdersRequest;
}

export namespace GetOrdersRequest {
  export type AsObject = {
    quoteHashesList: Array<string>,
  }
}

export class GetOrdersResponse extends jspb.Message {
  getOrdersList(): Array<sdk_service_rfq_model_pb.UserOrder>;
  setOrdersList(value: Array<sdk_service_rfq_model_pb.UserOrder>): GetOrdersResponse;
  clearOrdersList(): GetOrdersResponse;
  addOrders(value?: sdk_service_rfq_model_pb.UserOrder, index?: number): sdk_service_rfq_model_pb.UserOrder;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetOrdersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetOrdersResponse): GetOrdersResponse.AsObject;
  static serializeBinaryToWriter(message: GetOrdersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetOrdersResponse;
  static deserializeBinaryFromReader(message: GetOrdersResponse, reader: jspb.BinaryReader): GetOrdersResponse;
}

export namespace GetOrdersResponse {
  export type AsObject = {
    ordersList: Array<sdk_service_rfq_model_pb.UserOrder.AsObject>,
  }
}

export class FilterOrdersRequest extends jspb.Message {
  getStartTime(): number;
  setStartTime(value: number): FilterOrdersRequest;

  getEndTime(): number;
  setEndTime(value: number): FilterOrdersRequest;

  getLimit(): number;
  setLimit(value: number): FilterOrdersRequest;

  getOffset(): number;
  setOffset(value: number): FilterOrdersRequest;

  getStatusesList(): Array<sdk_service_rfq_model_pb.OrderStatus>;
  setStatusesList(value: Array<sdk_service_rfq_model_pb.OrderStatus>): FilterOrdersRequest;
  clearStatusesList(): FilterOrdersRequest;
  addStatuses(value: sdk_service_rfq_model_pb.OrderStatus, index?: number): FilterOrdersRequest;

  getMmIdsList(): Array<string>;
  setMmIdsList(value: Array<string>): FilterOrdersRequest;
  clearMmIdsList(): FilterOrdersRequest;
  addMmIds(value: string, index?: number): FilterOrdersRequest;

  getMmAddrsList(): Array<string>;
  setMmAddrsList(value: Array<string>): FilterOrdersRequest;
  clearMmAddrsList(): FilterOrdersRequest;
  addMmAddrs(value: string, index?: number): FilterOrdersRequest;

  getUsrAddrsList(): Array<string>;
  setUsrAddrsList(value: Array<string>): FilterOrdersRequest;
  clearUsrAddrsList(): FilterOrdersRequest;
  addUsrAddrs(value: string, index?: number): FilterOrdersRequest;

  getSrcChainIdsList(): Array<number>;
  setSrcChainIdsList(value: Array<number>): FilterOrdersRequest;
  clearSrcChainIdsList(): FilterOrdersRequest;
  addSrcChainIds(value: number, index?: number): FilterOrdersRequest;

  getDstChainIdsList(): Array<number>;
  setDstChainIdsList(value: Array<number>): FilterOrdersRequest;
  clearDstChainIdsList(): FilterOrdersRequest;
  addDstChainIds(value: number, index?: number): FilterOrdersRequest;

  getSrcTokenAddrsList(): Array<string>;
  setSrcTokenAddrsList(value: Array<string>): FilterOrdersRequest;
  clearSrcTokenAddrsList(): FilterOrdersRequest;
  addSrcTokenAddrs(value: string, index?: number): FilterOrdersRequest;

  getDstTokenAddrsList(): Array<string>;
  setDstTokenAddrsList(value: Array<string>): FilterOrdersRequest;
  clearDstTokenAddrsList(): FilterOrdersRequest;
  addDstTokenAddrs(value: string, index?: number): FilterOrdersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FilterOrdersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: FilterOrdersRequest): FilterOrdersRequest.AsObject;
  static serializeBinaryToWriter(message: FilterOrdersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FilterOrdersRequest;
  static deserializeBinaryFromReader(message: FilterOrdersRequest, reader: jspb.BinaryReader): FilterOrdersRequest;
}

export namespace FilterOrdersRequest {
  export type AsObject = {
    startTime: number,
    endTime: number,
    limit: number,
    offset: number,
    statusesList: Array<sdk_service_rfq_model_pb.OrderStatus>,
    mmIdsList: Array<string>,
    mmAddrsList: Array<string>,
    usrAddrsList: Array<string>,
    srcChainIdsList: Array<number>,
    dstChainIdsList: Array<number>,
    srcTokenAddrsList: Array<string>,
    dstTokenAddrsList: Array<string>,
  }
}

export class FilterOrdersResponse extends jspb.Message {
  getOrdersList(): Array<sdk_service_rfq_model_pb.UserOrder>;
  setOrdersList(value: Array<sdk_service_rfq_model_pb.UserOrder>): FilterOrdersResponse;
  clearOrdersList(): FilterOrdersResponse;
  addOrders(value?: sdk_service_rfq_model_pb.UserOrder, index?: number): sdk_service_rfq_model_pb.UserOrder;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FilterOrdersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: FilterOrdersResponse): FilterOrdersResponse.AsObject;
  static serializeBinaryToWriter(message: FilterOrdersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FilterOrdersResponse;
  static deserializeBinaryFromReader(message: FilterOrdersResponse, reader: jspb.BinaryReader): FilterOrdersResponse;
}

export namespace FilterOrdersResponse {
  export type AsObject = {
    ordersList: Array<sdk_service_rfq_model_pb.UserOrder.AsObject>,
  }
}

export class GetMarketMakersRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMarketMakersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMarketMakersRequest): GetMarketMakersRequest.AsObject;
  static serializeBinaryToWriter(message: GetMarketMakersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMarketMakersRequest;
  static deserializeBinaryFromReader(message: GetMarketMakersRequest, reader: jspb.BinaryReader): GetMarketMakersRequest;
}

export namespace GetMarketMakersRequest {
  export type AsObject = {
  }
}

export class GetMarketMakersResponse extends jspb.Message {
  getMarketMakersList(): Array<sdk_service_rfq_model_pb.MarketMaker>;
  setMarketMakersList(value: Array<sdk_service_rfq_model_pb.MarketMaker>): GetMarketMakersResponse;
  clearMarketMakersList(): GetMarketMakersResponse;
  addMarketMakers(value?: sdk_service_rfq_model_pb.MarketMaker, index?: number): sdk_service_rfq_model_pb.MarketMaker;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMarketMakersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMarketMakersResponse): GetMarketMakersResponse.AsObject;
  static serializeBinaryToWriter(message: GetMarketMakersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMarketMakersResponse;
  static deserializeBinaryFromReader(message: GetMarketMakersResponse, reader: jspb.BinaryReader): GetMarketMakersResponse;
}

export namespace GetMarketMakersResponse {
  export type AsObject = {
    marketMakersList: Array<sdk_service_rfq_model_pb.MarketMaker.AsObject>,
  }
}

export class GetRefundExecMsgCallDataRequest extends jspb.Message {
  getQuoteHash(): string;
  setQuoteHash(value: string): GetRefundExecMsgCallDataRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRefundExecMsgCallDataRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetRefundExecMsgCallDataRequest): GetRefundExecMsgCallDataRequest.AsObject;
  static serializeBinaryToWriter(message: GetRefundExecMsgCallDataRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRefundExecMsgCallDataRequest;
  static deserializeBinaryFromReader(message: GetRefundExecMsgCallDataRequest, reader: jspb.BinaryReader): GetRefundExecMsgCallDataRequest;
}

export namespace GetRefundExecMsgCallDataRequest {
  export type AsObject = {
    quoteHash: string,
  }
}

export class GetRefundExecMsgCallDataResponse extends jspb.Message {
  getExecMsgCallData(): Uint8Array | string;
  getExecMsgCallData_asU8(): Uint8Array;
  getExecMsgCallData_asB64(): string;
  setExecMsgCallData(value: Uint8Array | string): GetRefundExecMsgCallDataResponse;

  getQuote(): sdk_service_rfqmm_api_pb.Quote | undefined;
  setQuote(value?: sdk_service_rfqmm_api_pb.Quote): GetRefundExecMsgCallDataResponse;
  hasQuote(): boolean;
  clearQuote(): GetRefundExecMsgCallDataResponse;

  getSrcNative(): boolean;
  setSrcNative(value: boolean): GetRefundExecMsgCallDataResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRefundExecMsgCallDataResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetRefundExecMsgCallDataResponse): GetRefundExecMsgCallDataResponse.AsObject;
  static serializeBinaryToWriter(message: GetRefundExecMsgCallDataResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRefundExecMsgCallDataResponse;
  static deserializeBinaryFromReader(message: GetRefundExecMsgCallDataResponse, reader: jspb.BinaryReader): GetRefundExecMsgCallDataResponse;
}

export namespace GetRefundExecMsgCallDataResponse {
  export type AsObject = {
    execMsgCallData: Uint8Array | string,
    quote?: sdk_service_rfqmm_api_pb.Quote.AsObject,
    srcNative: boolean,
  }
}

