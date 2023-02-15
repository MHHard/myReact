import * as jspb from 'google-protobuf'

import * as sdk_common_token_pb from '../../../sdk/common/token_pb';
import * as sdk_common_error_pb from '../../../sdk/common/error_pb';
import * as google_api_annotations_pb from '../../../google/api/annotations_pb';


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

  getPrice(): Price | undefined;
  setPrice(value?: Price): PriceResponse;
  hasPrice(): boolean;
  clearPrice(): PriceResponse;

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
    price?: Price.AsObject,
  }
}

export class QuoteRequest extends jspb.Message {
  getPrice(): Price | undefined;
  setPrice(value?: Price): QuoteRequest;
  hasPrice(): boolean;
  clearPrice(): QuoteRequest;

  getQuote(): Quote | undefined;
  setQuote(value?: Quote): QuoteRequest;
  hasQuote(): boolean;
  clearQuote(): QuoteRequest;

  getDstNative(): boolean;
  setDstNative(value: boolean): QuoteRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteRequest): QuoteRequest.AsObject;
  static serializeBinaryToWriter(message: QuoteRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteRequest;
  static deserializeBinaryFromReader(message: QuoteRequest, reader: jspb.BinaryReader): QuoteRequest;
}

export namespace QuoteRequest {
  export type AsObject = {
    price?: Price.AsObject,
    quote?: Quote.AsObject,
    dstNative: boolean,
  }
}

export class QuoteResponse extends jspb.Message {
  getErr(): sdk_common_error_pb.Err | undefined;
  setErr(value?: sdk_common_error_pb.Err): QuoteResponse;
  hasErr(): boolean;
  clearErr(): QuoteResponse;

  getQuoteSig(): string;
  setQuoteSig(value: string): QuoteResponse;

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
    quoteSig: string,
  }
}

export class Config extends jspb.Message {
  getTokensList(): Array<sdk_common_token_pb.Token>;
  setTokensList(value: Array<sdk_common_token_pb.Token>): Config;
  clearTokensList(): Config;
  addTokens(value?: sdk_common_token_pb.Token, index?: number): sdk_common_token_pb.Token;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Config.AsObject;
  static toObject(includeInstance: boolean, msg: Config): Config.AsObject;
  static serializeBinaryToWriter(message: Config, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Config;
  static deserializeBinaryFromReader(message: Config, reader: jspb.BinaryReader): Config;
}

export namespace Config {
  export type AsObject = {
    tokensList: Array<sdk_common_token_pb.Token.AsObject>,
  }
}

export class Price extends jspb.Message {
  getSrcToken(): sdk_common_token_pb.Token | undefined;
  setSrcToken(value?: sdk_common_token_pb.Token): Price;
  hasSrcToken(): boolean;
  clearSrcToken(): Price;

  getSrcAmount(): string;
  setSrcAmount(value: string): Price;

  getDstToken(): sdk_common_token_pb.Token | undefined;
  setDstToken(value?: sdk_common_token_pb.Token): Price;
  hasDstToken(): boolean;
  clearDstToken(): Price;

  getSrcReleaseAmount(): string;
  setSrcReleaseAmount(value: string): Price;

  getDstAmount(): string;
  setDstAmount(value: string): Price;

  getFeeAmount(): string;
  setFeeAmount(value: string): Price;

  getValidThru(): number;
  setValidThru(value: number): Price;

  getMmAddr(): string;
  setMmAddr(value: string): Price;

  getSig(): string;
  setSig(value: string): Price;

  getSrcDepositPeriod(): number;
  setSrcDepositPeriod(value: number): Price;

  getDstTransferPeriod(): number;
  setDstTransferPeriod(value: number): Price;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Price.AsObject;
  static toObject(includeInstance: boolean, msg: Price): Price.AsObject;
  static serializeBinaryToWriter(message: Price, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Price;
  static deserializeBinaryFromReader(message: Price, reader: jspb.BinaryReader): Price;
}

export namespace Price {
  export type AsObject = {
    srcToken?: sdk_common_token_pb.Token.AsObject,
    srcAmount: string,
    dstToken?: sdk_common_token_pb.Token.AsObject,
    srcReleaseAmount: string,
    dstAmount: string,
    feeAmount: string,
    validThru: number,
    mmAddr: string,
    sig: string,
    srcDepositPeriod: number,
    dstTransferPeriod: number,
  }
}

export class Quote extends jspb.Message {
  getHash(): string;
  setHash(value: string): Quote;

  getSrcToken(): sdk_common_token_pb.Token | undefined;
  setSrcToken(value?: sdk_common_token_pb.Token): Quote;
  hasSrcToken(): boolean;
  clearSrcToken(): Quote;

  getSrcAmount(): string;
  setSrcAmount(value: string): Quote;

  getSrcReleaseAmount(): string;
  setSrcReleaseAmount(value: string): Quote;

  getDstToken(): sdk_common_token_pb.Token | undefined;
  setDstToken(value?: sdk_common_token_pb.Token): Quote;
  hasDstToken(): boolean;
  clearDstToken(): Quote;

  getDstAmount(): string;
  setDstAmount(value: string): Quote;

  getSrcDeadline(): number;
  setSrcDeadline(value: number): Quote;

  getDstDeadline(): number;
  setDstDeadline(value: number): Quote;

  getNonce(): number;
  setNonce(value: number): Quote;

  getSender(): string;
  setSender(value: string): Quote;

  getReceiver(): string;
  setReceiver(value: string): Quote;

  getRefundTo(): string;
  setRefundTo(value: string): Quote;

  getMmAddr(): string;
  setMmAddr(value: string): Quote;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Quote.AsObject;
  static toObject(includeInstance: boolean, msg: Quote): Quote.AsObject;
  static serializeBinaryToWriter(message: Quote, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Quote;
  static deserializeBinaryFromReader(message: Quote, reader: jspb.BinaryReader): Quote;
}

export namespace Quote {
  export type AsObject = {
    hash: string,
    srcToken?: sdk_common_token_pb.Token.AsObject,
    srcAmount: string,
    srcReleaseAmount: string,
    dstToken?: sdk_common_token_pb.Token.AsObject,
    dstAmount: string,
    srcDeadline: number,
    dstDeadline: number,
    nonce: number,
    sender: string,
    receiver: string,
    refundTo: string,
    mmAddr: string,
  }
}

export class DstTransferRequest extends jspb.Message {
  getQuote(): Quote | undefined;
  setQuote(value?: Quote): DstTransferRequest;
  hasQuote(): boolean;
  clearQuote(): DstTransferRequest;

  getQuoteSig(): Uint8Array | string;
  getQuoteSig_asU8(): Uint8Array;
  getQuoteSig_asB64(): string;
  setQuoteSig(value: Uint8Array | string): DstTransferRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DstTransferRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DstTransferRequest): DstTransferRequest.AsObject;
  static serializeBinaryToWriter(message: DstTransferRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DstTransferRequest;
  static deserializeBinaryFromReader(message: DstTransferRequest, reader: jspb.BinaryReader): DstTransferRequest;
}

export namespace DstTransferRequest {
  export type AsObject = {
    quote?: Quote.AsObject,
    quoteSig: Uint8Array | string,
  }
}

export enum ErrCode { 
  ERROR_UNDEFINED = 0,
  ERROR_INVALID_ARGUMENTS = 1,
  ERROR_LIQUIDITY_PROVIDER = 2,
  ERROR_PRICE_PROVIDER = 3,
  ERROR_AMOUNT_CALCULATOR = 4,
  ERROR_REQUEST_SIGNER = 5,
  ERROR_LIQUIDITY_MANAGER = 6,
  ERROR_CHAIN_MANAGER = 7,
}
