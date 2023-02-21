import * as jspb from 'google-protobuf'

import * as google_api_annotations_pb from './google/api/annotations_pb';
import * as error_pb from './error_pb';
import * as common_pb from './common_pb';


export class GetTokenListRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTokenListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTokenListRequest): GetTokenListRequest.AsObject;
  static serializeBinaryToWriter(message: GetTokenListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTokenListRequest;
  static deserializeBinaryFromReader(message: GetTokenListRequest, reader: jspb.BinaryReader): GetTokenListRequest;
}

export namespace GetTokenListRequest {
  export type AsObject = {
  }
}

export class GetTokenListResponse extends jspb.Message {
  getTokensList(): Array<common_pb.Token>;
  setTokensList(value: Array<common_pb.Token>): GetTokenListResponse;
  clearTokensList(): GetTokenListResponse;
  addTokens(value?: common_pb.Token, index?: number): common_pb.Token;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTokenListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTokenListResponse): GetTokenListResponse.AsObject;
  static serializeBinaryToWriter(message: GetTokenListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTokenListResponse;
  static deserializeBinaryFromReader(message: GetTokenListResponse, reader: jspb.BinaryReader): GetTokenListResponse;
}

export namespace GetTokenListResponse {
  export type AsObject = {
    tokensList: Array<common_pb.Token.AsObject>,
  }
}

export class InternalGetHistoryRequest extends jspb.Message {
  getNextPageToken(): string;
  setNextPageToken(value: string): InternalGetHistoryRequest;

  getPageSize(): number;
  setPageSize(value: number): InternalGetHistoryRequest;

  getAddressesList(): Array<string>;
  setAddressesList(value: Array<string>): InternalGetHistoryRequest;
  clearAddressesList(): InternalGetHistoryRequest;
  addAddresses(value: string, index?: number): InternalGetHistoryRequest;

  getSrcChainIdsList(): Array<number>;
  setSrcChainIdsList(value: Array<number>): InternalGetHistoryRequest;
  clearSrcChainIdsList(): InternalGetHistoryRequest;
  addSrcChainIds(value: number, index?: number): InternalGetHistoryRequest;

  getDstChainIdsList(): Array<number>;
  setDstChainIdsList(value: Array<number>): InternalGetHistoryRequest;
  clearDstChainIdsList(): InternalGetHistoryRequest;
  addDstChainIds(value: number, index?: number): InternalGetHistoryRequest;

  getFromTime(): number;
  setFromTime(value: number): InternalGetHistoryRequest;

  getToTime(): number;
  setToTime(value: number): InternalGetHistoryRequest;

  getStatusList(): Array<number>;
  setStatusList(value: Array<number>): InternalGetHistoryRequest;
  clearStatusList(): InternalGetHistoryRequest;
  addStatus(value: number, index?: number): InternalGetHistoryRequest;

  getBridgeTypesList(): Array<string>;
  setBridgeTypesList(value: Array<string>): InternalGetHistoryRequest;
  clearBridgeTypesList(): InternalGetHistoryRequest;
  addBridgeTypes(value: string, index?: number): InternalGetHistoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InternalGetHistoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InternalGetHistoryRequest): InternalGetHistoryRequest.AsObject;
  static serializeBinaryToWriter(message: InternalGetHistoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InternalGetHistoryRequest;
  static deserializeBinaryFromReader(message: InternalGetHistoryRequest, reader: jspb.BinaryReader): InternalGetHistoryRequest;
}

export namespace InternalGetHistoryRequest {
  export type AsObject = {
    nextPageToken: string,
    pageSize: number,
    addressesList: Array<string>,
    srcChainIdsList: Array<number>,
    dstChainIdsList: Array<number>,
    fromTime: number,
    toTime: number,
    statusList: Array<number>,
    bridgeTypesList: Array<string>,
  }
}

export class InternalGetHistoryResponse extends jspb.Message {
  getNextPageToken(): string;
  setNextPageToken(value: string): InternalGetHistoryResponse;

  getTotal(): number;
  setTotal(value: number): InternalGetHistoryResponse;

  getEntriesList(): Array<InternalHistory>;
  setEntriesList(value: Array<InternalHistory>): InternalGetHistoryResponse;
  clearEntriesList(): InternalGetHistoryResponse;
  addEntries(value?: InternalHistory, index?: number): InternalHistory;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InternalGetHistoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: InternalGetHistoryResponse): InternalGetHistoryResponse.AsObject;
  static serializeBinaryToWriter(message: InternalGetHistoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InternalGetHistoryResponse;
  static deserializeBinaryFromReader(message: InternalGetHistoryResponse, reader: jspb.BinaryReader): InternalGetHistoryResponse;
}

export namespace InternalGetHistoryResponse {
  export type AsObject = {
    nextPageToken: string,
    total: number,
    entriesList: Array<InternalHistory.AsObject>,
  }
}

export class InternalHistory extends jspb.Message {
  getHistory(): common_pb.HopHistory | undefined;
  setHistory(value?: common_pb.HopHistory): InternalHistory;
  hasHistory(): boolean;
  clearHistory(): InternalHistory;

  getUserAddress(): string;
  setUserAddress(value: string): InternalHistory;

  getCbridgeStatus(): number;
  setCbridgeStatus(value: number): InternalHistory;

  getExecutorFee(): number;
  setExecutorFee(value: number): InternalHistory;

  getExecutorFeeToken(): common_pb.Token | undefined;
  setExecutorFeeToken(value?: common_pb.Token): InternalHistory;
  hasExecutorFeeToken(): boolean;
  clearExecutorFeeToken(): InternalHistory;

  getSrcTxExplorerLink(): string;
  setSrcTxExplorerLink(value: string): InternalHistory;

  getRefId(): string;
  setRefId(value: string): InternalHistory;

  getSrcTokenUsdPrice(): number;
  setSrcTokenUsdPrice(value: number): InternalHistory;

  getDstTokenUsdPrice(): number;
  setDstTokenUsdPrice(value: number): InternalHistory;

  getUsdVolume(): number;
  setUsdVolume(value: number): InternalHistory;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InternalHistory.AsObject;
  static toObject(includeInstance: boolean, msg: InternalHistory): InternalHistory.AsObject;
  static serializeBinaryToWriter(message: InternalHistory, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InternalHistory;
  static deserializeBinaryFromReader(message: InternalHistory, reader: jspb.BinaryReader): InternalHistory;
}

export namespace InternalHistory {
  export type AsObject = {
    history?: common_pb.HopHistory.AsObject,
    userAddress: string,
    cbridgeStatus: number,
    executorFee: number,
    executorFeeToken?: common_pb.Token.AsObject,
    srcTxExplorerLink: string,
    refId: string,
    srcTokenUsdPrice: number,
    dstTokenUsdPrice: number,
    usdVolume: number,
  }
}

export class FixSwapRequest extends jspb.Message {
  getSrcTx(): string;
  setSrcTx(value: string): FixSwapRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FixSwapRequest.AsObject;
  static toObject(includeInstance: boolean, msg: FixSwapRequest): FixSwapRequest.AsObject;
  static serializeBinaryToWriter(message: FixSwapRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FixSwapRequest;
  static deserializeBinaryFromReader(message: FixSwapRequest, reader: jspb.BinaryReader): FixSwapRequest;
}

export namespace FixSwapRequest {
  export type AsObject = {
    srcTx: string,
  }
}

export class FixSwapResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FixSwapResponse.AsObject;
  static toObject(includeInstance: boolean, msg: FixSwapResponse): FixSwapResponse.AsObject;
  static serializeBinaryToWriter(message: FixSwapResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FixSwapResponse;
  static deserializeBinaryFromReader(message: FixSwapResponse, reader: jspb.BinaryReader): FixSwapResponse;
}

export namespace FixSwapResponse {
  export type AsObject = {
  }
}

export class MarkRefRelationRequest extends jspb.Message {
  getUsrAddr(): string;
  setUsrAddr(value: string): MarkRefRelationRequest;

  getSwapId(): string;
  setSwapId(value: string): MarkRefRelationRequest;

  getRefId(): string;
  setRefId(value: string): MarkRefRelationRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MarkRefRelationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MarkRefRelationRequest): MarkRefRelationRequest.AsObject;
  static serializeBinaryToWriter(message: MarkRefRelationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MarkRefRelationRequest;
  static deserializeBinaryFromReader(message: MarkRefRelationRequest, reader: jspb.BinaryReader): MarkRefRelationRequest;
}

export namespace MarkRefRelationRequest {
  export type AsObject = {
    usrAddr: string,
    swapId: string,
    refId: string,
  }
}

export class MarkRefRelationResponse extends jspb.Message {
  getErr(): error_pb.ErrMsg | undefined;
  setErr(value?: error_pb.ErrMsg): MarkRefRelationResponse;
  hasErr(): boolean;
  clearErr(): MarkRefRelationResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MarkRefRelationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MarkRefRelationResponse): MarkRefRelationResponse.AsObject;
  static serializeBinaryToWriter(message: MarkRefRelationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MarkRefRelationResponse;
  static deserializeBinaryFromReader(message: MarkRefRelationResponse, reader: jspb.BinaryReader): MarkRefRelationResponse;
}

export namespace MarkRefRelationResponse {
  export type AsObject = {
    err?: error_pb.ErrMsg.AsObject,
  }
}

export class AnalyticsDataRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AnalyticsDataRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AnalyticsDataRequest): AnalyticsDataRequest.AsObject;
  static serializeBinaryToWriter(message: AnalyticsDataRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AnalyticsDataRequest;
  static deserializeBinaryFromReader(message: AnalyticsDataRequest, reader: jspb.BinaryReader): AnalyticsDataRequest;
}

export namespace AnalyticsDataRequest {
  export type AsObject = {
  }
}

export class AnalyticsDataResponse extends jspb.Message {
  getErr(): error_pb.ErrMsg | undefined;
  setErr(value?: error_pb.ErrMsg): AnalyticsDataResponse;
  hasErr(): boolean;
  clearErr(): AnalyticsDataResponse;

  getVolumeTotal(): number;
  setVolumeTotal(value: number): AnalyticsDataResponse;

  getVolume24h(): number;
  setVolume24h(value: number): AnalyticsDataResponse;

  getCntSwapTotal(): number;
  setCntSwapTotal(value: number): AnalyticsDataResponse;

  getCntSwap24h(): number;
  setCntSwap24h(value: number): AnalyticsDataResponse;

  getCntUniqueAddr(): number;
  setCntUniqueAddr(value: number): AnalyticsDataResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AnalyticsDataResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AnalyticsDataResponse): AnalyticsDataResponse.AsObject;
  static serializeBinaryToWriter(message: AnalyticsDataResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AnalyticsDataResponse;
  static deserializeBinaryFromReader(message: AnalyticsDataResponse, reader: jspb.BinaryReader): AnalyticsDataResponse;
}

export namespace AnalyticsDataResponse {
  export type AsObject = {
    err?: error_pb.ErrMsg.AsObject,
    volumeTotal: number,
    volume24h: number,
    cntSwapTotal: number,
    cntSwap24h: number,
    cntUniqueAddr: number,
  }
}

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
  getErr(): error_pb.ErrMsg | undefined;
  setErr(value?: error_pb.ErrMsg): GetConfigsResponse;
  hasErr(): boolean;
  clearErr(): GetConfigsResponse;

  getChainsList(): Array<common_pb.Chain>;
  setChainsList(value: Array<common_pb.Chain>): GetConfigsResponse;
  clearChainsList(): GetConfigsResponse;
  addChains(value?: common_pb.Chain, index?: number): common_pb.Chain;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetConfigsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetConfigsResponse): GetConfigsResponse.AsObject;
  static serializeBinaryToWriter(message: GetConfigsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetConfigsResponse;
  static deserializeBinaryFromReader(message: GetConfigsResponse, reader: jspb.BinaryReader): GetConfigsResponse;
}

export namespace GetConfigsResponse {
  export type AsObject = {
    err?: error_pb.ErrMsg.AsObject,
    chainsList: Array<common_pb.Chain.AsObject>,
  }
}

export class QuoteRequest extends jspb.Message {
  getSrcToken(): common_pb.Token | undefined;
  setSrcToken(value?: common_pb.Token): QuoteRequest;
  hasSrcToken(): boolean;
  clearSrcToken(): QuoteRequest;

  getDstToken(): common_pb.Token | undefined;
  setDstToken(value?: common_pb.Token): QuoteRequest;
  hasDstToken(): boolean;
  clearDstToken(): QuoteRequest;

  getAmountIn(): string;
  setAmountIn(value: string): QuoteRequest;

  getSlippageTolerance(): number;
  setSlippageTolerance(value: number): QuoteRequest;

  getNativeOut(): boolean;
  setNativeOut(value: boolean): QuoteRequest;

  getOnlySwapsList(): Array<string>;
  setOnlySwapsList(value: Array<string>): QuoteRequest;
  clearOnlySwapsList(): QuoteRequest;
  addOnlySwaps(value: string, index?: number): QuoteRequest;

  getOnlyBridgesList(): Array<string>;
  setOnlyBridgesList(value: Array<string>): QuoteRequest;
  clearOnlyBridgesList(): QuoteRequest;
  addOnlyBridges(value: string, index?: number): QuoteRequest;

  getNonce(): number;
  setNonce(value: number): QuoteRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteRequest): QuoteRequest.AsObject;
  static serializeBinaryToWriter(message: QuoteRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteRequest;
  static deserializeBinaryFromReader(message: QuoteRequest, reader: jspb.BinaryReader): QuoteRequest;
}

export namespace QuoteRequest {
  export type AsObject = {
    srcToken?: common_pb.Token.AsObject,
    dstToken?: common_pb.Token.AsObject,
    amountIn: string,
    slippageTolerance: number,
    nativeOut: boolean,
    onlySwapsList: Array<string>,
    onlyBridgesList: Array<string>,
    nonce: number,
  }
}

export class QuoteResponse extends jspb.Message {
  getErr(): error_pb.ErrMsg | undefined;
  setErr(value?: error_pb.ErrMsg): QuoteResponse;
  hasErr(): boolean;
  clearErr(): QuoteResponse;

  getSrcTokenUsdPrice(): number;
  setSrcTokenUsdPrice(value: number): QuoteResponse;

  getDstTokenUsdPrice(): number;
  setDstTokenUsdPrice(value: number): QuoteResponse;

  getPathsList(): Array<common_pb.Path>;
  setPathsList(value: Array<common_pb.Path>): QuoteResponse;
  clearPathsList(): QuoteResponse;
  addPaths(value?: common_pb.Path, index?: number): common_pb.Path;

  getNonce(): number;
  setNonce(value: number): QuoteResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteResponse): QuoteResponse.AsObject;
  static serializeBinaryToWriter(message: QuoteResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteResponse;
  static deserializeBinaryFromReader(message: QuoteResponse, reader: jspb.BinaryReader): QuoteResponse;
}

export namespace QuoteResponse {
  export type AsObject = {
    err?: error_pb.ErrMsg.AsObject,
    srcTokenUsdPrice: number,
    dstTokenUsdPrice: number,
    pathsList: Array<common_pb.Path.AsObject>,
    nonce: number,
  }
}

export class SwapRequest extends jspb.Message {
  getStepsList(): Array<common_pb.Step>;
  setStepsList(value: Array<common_pb.Step>): SwapRequest;
  clearStepsList(): SwapRequest;
  addSteps(value?: common_pb.Step, index?: number): common_pb.Step;

  getAmountIn(): string;
  setAmountIn(value: string): SwapRequest;

  getSlippageTolerance(): number;
  setSlippageTolerance(value: number): SwapRequest;

  getNativeIn(): boolean;
  setNativeIn(value: boolean): SwapRequest;

  getNativeOut(): boolean;
  setNativeOut(value: boolean): SwapRequest;

  getReceiver(): string;
  setReceiver(value: string): SwapRequest;

  getNonce(): number;
  setNonce(value: number): SwapRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SwapRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SwapRequest): SwapRequest.AsObject;
  static serializeBinaryToWriter(message: SwapRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SwapRequest;
  static deserializeBinaryFromReader(message: SwapRequest, reader: jspb.BinaryReader): SwapRequest;
}

export namespace SwapRequest {
  export type AsObject = {
    stepsList: Array<common_pb.Step.AsObject>,
    amountIn: string,
    slippageTolerance: number,
    nativeIn: boolean,
    nativeOut: boolean,
    receiver: string,
    nonce: number,
  }
}

export class SwapResponse extends jspb.Message {
  getErr(): error_pb.ErrMsg | undefined;
  setErr(value?: error_pb.ErrMsg): SwapResponse;
  hasErr(): boolean;
  clearErr(): SwapResponse;

  getTxData(): string;
  setTxData(value: string): SwapResponse;

  getTxValue(): string;
  setTxValue(value: string): SwapResponse;

  getPath(): common_pb.Path | undefined;
  setPath(value?: common_pb.Path): SwapResponse;
  hasPath(): boolean;
  clearPath(): SwapResponse;

  getNonce(): number;
  setNonce(value: number): SwapResponse;

  getSwapId(): string;
  setSwapId(value: string): SwapResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SwapResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SwapResponse): SwapResponse.AsObject;
  static serializeBinaryToWriter(message: SwapResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SwapResponse;
  static deserializeBinaryFromReader(message: SwapResponse, reader: jspb.BinaryReader): SwapResponse;
}

export namespace SwapResponse {
  export type AsObject = {
    err?: error_pb.ErrMsg.AsObject,
    txData: string,
    txValue: string,
    path?: common_pb.Path.AsObject,
    nonce: number,
    swapId: string,
  }
}

export class GetHistoryByTxRequest extends jspb.Message {
  getSrcTxHash(): string;
  setSrcTxHash(value: string): GetHistoryByTxRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHistoryByTxRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetHistoryByTxRequest): GetHistoryByTxRequest.AsObject;
  static serializeBinaryToWriter(message: GetHistoryByTxRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHistoryByTxRequest;
  static deserializeBinaryFromReader(message: GetHistoryByTxRequest, reader: jspb.BinaryReader): GetHistoryByTxRequest;
}

export namespace GetHistoryByTxRequest {
  export type AsObject = {
    srcTxHash: string,
  }
}

export class GetHistoryByTxResponse extends jspb.Message {
  getRecord(): common_pb.HopHistory | undefined;
  setRecord(value?: common_pb.HopHistory): GetHistoryByTxResponse;
  hasRecord(): boolean;
  clearRecord(): GetHistoryByTxResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHistoryByTxResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetHistoryByTxResponse): GetHistoryByTxResponse.AsObject;
  static serializeBinaryToWriter(message: GetHistoryByTxResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHistoryByTxResponse;
  static deserializeBinaryFromReader(message: GetHistoryByTxResponse, reader: jspb.BinaryReader): GetHistoryByTxResponse;
}

export namespace GetHistoryByTxResponse {
  export type AsObject = {
    record?: common_pb.HopHistory.AsObject,
  }
}

export class GetHistoryRequest extends jspb.Message {
  getNextPageToken(): string;
  setNextPageToken(value: string): GetHistoryRequest;

  getPageSize(): number;
  setPageSize(value: number): GetHistoryRequest;

  getAddr(): string;
  setAddr(value: string): GetHistoryRequest;

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
    addr: string,
  }
}

export class GetHistoryResponse extends jspb.Message {
  getErr(): error_pb.ErrMsg | undefined;
  setErr(value?: error_pb.ErrMsg): GetHistoryResponse;
  hasErr(): boolean;
  clearErr(): GetHistoryResponse;

  getHistoryList(): Array<common_pb.HopHistory>;
  setHistoryList(value: Array<common_pb.HopHistory>): GetHistoryResponse;
  clearHistoryList(): GetHistoryResponse;
  addHistory(value?: common_pb.HopHistory, index?: number): common_pb.HopHistory;

  getNextPageToken(): string;
  setNextPageToken(value: string): GetHistoryResponse;

  getCurrentSize(): number;
  setCurrentSize(value: number): GetHistoryResponse;

  getTotalSize(): number;
  setTotalSize(value: number): GetHistoryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHistoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetHistoryResponse): GetHistoryResponse.AsObject;
  static serializeBinaryToWriter(message: GetHistoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHistoryResponse;
  static deserializeBinaryFromReader(message: GetHistoryResponse, reader: jspb.BinaryReader): GetHistoryResponse;
}

export namespace GetHistoryResponse {
  export type AsObject = {
    err?: error_pb.ErrMsg.AsObject,
    historyList: Array<common_pb.HopHistory.AsObject>,
    nextPageToken: string,
    currentSize: number,
    totalSize: number,
  }
}

export class GetStatusRequest extends jspb.Message {
  getSwapId(): string;
  setSwapId(value: string): GetStatusRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetStatusRequest): GetStatusRequest.AsObject;
  static serializeBinaryToWriter(message: GetStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStatusRequest;
  static deserializeBinaryFromReader(message: GetStatusRequest, reader: jspb.BinaryReader): GetStatusRequest;
}

export namespace GetStatusRequest {
  export type AsObject = {
    swapId: string,
  }
}

export class GetStatusResponse extends jspb.Message {
  getErr(): error_pb.ErrMsg | undefined;
  setErr(value?: error_pb.ErrMsg): GetStatusResponse;
  hasErr(): boolean;
  clearErr(): GetStatusResponse;

  getSwapStatus(): common_pb.SwapStatus;
  setSwapStatus(value: common_pb.SwapStatus): GetStatusResponse;

  getCbrTransferId(): string;
  setCbrTransferId(value: string): GetStatusResponse;

  getSrcBlockTxLink(): string;
  setSrcBlockTxLink(value: string): GetStatusResponse;

  getDstBlockTxLink(): string;
  setDstBlockTxLink(value: string): GetStatusResponse;

  getSwapType(): common_pb.SwapType;
  setSwapType(value: common_pb.SwapType): GetStatusResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetStatusResponse): GetStatusResponse.AsObject;
  static serializeBinaryToWriter(message: GetStatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStatusResponse;
  static deserializeBinaryFromReader(message: GetStatusResponse, reader: jspb.BinaryReader): GetStatusResponse;
}

export namespace GetStatusResponse {
  export type AsObject = {
    err?: error_pb.ErrMsg.AsObject,
    swapStatus: common_pb.SwapStatus,
    cbrTransferId: string,
    srcBlockTxLink: string,
    dstBlockTxLink: string,
    swapType: common_pb.SwapType,
  }
}

export class GetLatest7DayTransferLatencyForQueryRequest extends jspb.Message {
  getSrcChainId(): number;
  setSrcChainId(value: number): GetLatest7DayTransferLatencyForQueryRequest;

  getDstChainId(): number;
  setDstChainId(value: number): GetLatest7DayTransferLatencyForQueryRequest;

  getBridgeType(): string;
  setBridgeType(value: string): GetLatest7DayTransferLatencyForQueryRequest;

  getSwapType(): common_pb.SwapType;
  setSwapType(value: common_pb.SwapType): GetLatest7DayTransferLatencyForQueryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLatest7DayTransferLatencyForQueryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetLatest7DayTransferLatencyForQueryRequest): GetLatest7DayTransferLatencyForQueryRequest.AsObject;
  static serializeBinaryToWriter(message: GetLatest7DayTransferLatencyForQueryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLatest7DayTransferLatencyForQueryRequest;
  static deserializeBinaryFromReader(message: GetLatest7DayTransferLatencyForQueryRequest, reader: jspb.BinaryReader): GetLatest7DayTransferLatencyForQueryRequest;
}

export namespace GetLatest7DayTransferLatencyForQueryRequest {
  export type AsObject = {
    srcChainId: number,
    dstChainId: number,
    bridgeType: string,
    swapType: common_pb.SwapType,
  }
}

export class GetLatest7DayTransferLatencyForQueryResponse extends jspb.Message {
  getErr(): error_pb.ErrMsg | undefined;
  setErr(value?: error_pb.ErrMsg): GetLatest7DayTransferLatencyForQueryResponse;
  hasErr(): boolean;
  clearErr(): GetLatest7DayTransferLatencyForQueryResponse;

  getMedianTransferLatencyInSecond(): number;
  setMedianTransferLatencyInSecond(value: number): GetLatest7DayTransferLatencyForQueryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLatest7DayTransferLatencyForQueryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetLatest7DayTransferLatencyForQueryResponse): GetLatest7DayTransferLatencyForQueryResponse.AsObject;
  static serializeBinaryToWriter(message: GetLatest7DayTransferLatencyForQueryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLatest7DayTransferLatencyForQueryResponse;
  static deserializeBinaryFromReader(message: GetLatest7DayTransferLatencyForQueryResponse, reader: jspb.BinaryReader): GetLatest7DayTransferLatencyForQueryResponse;
}

export namespace GetLatest7DayTransferLatencyForQueryResponse {
  export type AsObject = {
    err?: error_pb.ErrMsg.AsObject,
    medianTransferLatencyInSecond: number,
  }
}

export class RfqQuoteRequest extends jspb.Message {
  getPrice(): common_pb.RfqPrice | undefined;
  setPrice(value?: common_pb.RfqPrice): RfqQuoteRequest;
  hasPrice(): boolean;
  clearPrice(): RfqQuoteRequest;

  getMmId(): string;
  setMmId(value: string): RfqQuoteRequest;

  getSender(): string;
  setSender(value: string): RfqQuoteRequest;

  getReceiver(): string;
  setReceiver(value: string): RfqQuoteRequest;

  getRefundTo(): string;
  setRefundTo(value: string): RfqQuoteRequest;

  getSrcDeadline(): number;
  setSrcDeadline(value: number): RfqQuoteRequest;

  getDstDeadline(): number;
  setDstDeadline(value: number): RfqQuoteRequest;

  getDstNative(): boolean;
  setDstNative(value: boolean): RfqQuoteRequest;

  getSrcNative(): boolean;
  setSrcNative(value: boolean): RfqQuoteRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RfqQuoteRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RfqQuoteRequest): RfqQuoteRequest.AsObject;
  static serializeBinaryToWriter(message: RfqQuoteRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RfqQuoteRequest;
  static deserializeBinaryFromReader(message: RfqQuoteRequest, reader: jspb.BinaryReader): RfqQuoteRequest;
}

export namespace RfqQuoteRequest {
  export type AsObject = {
    price?: common_pb.RfqPrice.AsObject,
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

export class RfqQuoteResponse extends jspb.Message {
  getErr(): error_pb.ErrMsg | undefined;
  setErr(value?: error_pb.ErrMsg): RfqQuoteResponse;
  hasErr(): boolean;
  clearErr(): RfqQuoteResponse;

  getQuote(): RfqQuote | undefined;
  setQuote(value?: RfqQuote): RfqQuoteResponse;
  hasQuote(): boolean;
  clearQuote(): RfqQuoteResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RfqQuoteResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RfqQuoteResponse): RfqQuoteResponse.AsObject;
  static serializeBinaryToWriter(message: RfqQuoteResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RfqQuoteResponse;
  static deserializeBinaryFromReader(message: RfqQuoteResponse, reader: jspb.BinaryReader): RfqQuoteResponse;
}

export namespace RfqQuoteResponse {
  export type AsObject = {
    err?: error_pb.ErrMsg.AsObject,
    quote?: RfqQuote.AsObject,
  }
}

export class RfqQuote extends jspb.Message {
  getHash(): string;
  setHash(value: string): RfqQuote;

  getSrcToken(): common_pb.Token | undefined;
  setSrcToken(value?: common_pb.Token): RfqQuote;
  hasSrcToken(): boolean;
  clearSrcToken(): RfqQuote;

  getSrcAmount(): string;
  setSrcAmount(value: string): RfqQuote;

  getSrcReleaseAmount(): string;
  setSrcReleaseAmount(value: string): RfqQuote;

  getDstToken(): common_pb.Token | undefined;
  setDstToken(value?: common_pb.Token): RfqQuote;
  hasDstToken(): boolean;
  clearDstToken(): RfqQuote;

  getDstAmount(): string;
  setDstAmount(value: string): RfqQuote;

  getDstDeadline(): number;
  setDstDeadline(value: number): RfqQuote;

  getNonce(): number;
  setNonce(value: number): RfqQuote;

  getSender(): string;
  setSender(value: string): RfqQuote;

  getReceiver(): string;
  setReceiver(value: string): RfqQuote;

  getRefundTo(): string;
  setRefundTo(value: string): RfqQuote;

  getMmAddr(): string;
  setMmAddr(value: string): RfqQuote;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RfqQuote.AsObject;
  static toObject(includeInstance: boolean, msg: RfqQuote): RfqQuote.AsObject;
  static serializeBinaryToWriter(message: RfqQuote, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RfqQuote;
  static deserializeBinaryFromReader(message: RfqQuote, reader: jspb.BinaryReader): RfqQuote;
}

export namespace RfqQuote {
  export type AsObject = {
    hash: string,
    srcToken?: common_pb.Token.AsObject,
    srcAmount: string,
    srcReleaseAmount: string,
    dstToken?: common_pb.Token.AsObject,
    dstAmount: string,
    dstDeadline: number,
    nonce: number,
    sender: string,
    receiver: string,
    refundTo: string,
    mmAddr: string,
  }
}

export class RfqRefundRequest extends jspb.Message {
  getSwapId(): string;
  setSwapId(value: string): RfqRefundRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RfqRefundRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RfqRefundRequest): RfqRefundRequest.AsObject;
  static serializeBinaryToWriter(message: RfqRefundRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RfqRefundRequest;
  static deserializeBinaryFromReader(message: RfqRefundRequest, reader: jspb.BinaryReader): RfqRefundRequest;
}

export namespace RfqRefundRequest {
  export type AsObject = {
    swapId: string,
  }
}

export class RfqRefundResponse extends jspb.Message {
  getErr(): error_pb.ErrMsg | undefined;
  setErr(value?: error_pb.ErrMsg): RfqRefundResponse;
  hasErr(): boolean;
  clearErr(): RfqRefundResponse;

  getQuote(): RfqQuote | undefined;
  setQuote(value?: RfqQuote): RfqRefundResponse;
  hasQuote(): boolean;
  clearQuote(): RfqRefundResponse;

  getExecMsgCallData(): Uint8Array | string;
  getExecMsgCallData_asU8(): Uint8Array;
  getExecMsgCallData_asB64(): string;
  setExecMsgCallData(value: Uint8Array | string): RfqRefundResponse;

  getSrcNative(): boolean;
  setSrcNative(value: boolean): RfqRefundResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RfqRefundResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RfqRefundResponse): RfqRefundResponse.AsObject;
  static serializeBinaryToWriter(message: RfqRefundResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RfqRefundResponse;
  static deserializeBinaryFromReader(message: RfqRefundResponse, reader: jspb.BinaryReader): RfqRefundResponse;
}

export namespace RfqRefundResponse {
  export type AsObject = {
    err?: error_pb.ErrMsg.AsObject,
    quote?: RfqQuote.AsObject,
    execMsgCallData: Uint8Array | string,
    srcNative: boolean,
  }
}

export class RfqMarkAsSubmittingRequest extends jspb.Message {
  getQuoteHash(): string;
  setQuoteHash(value: string): RfqMarkAsSubmittingRequest;

  getSrcTx(): string;
  setSrcTx(value: string): RfqMarkAsSubmittingRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RfqMarkAsSubmittingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RfqMarkAsSubmittingRequest): RfqMarkAsSubmittingRequest.AsObject;
  static serializeBinaryToWriter(message: RfqMarkAsSubmittingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RfqMarkAsSubmittingRequest;
  static deserializeBinaryFromReader(message: RfqMarkAsSubmittingRequest, reader: jspb.BinaryReader): RfqMarkAsSubmittingRequest;
}

export namespace RfqMarkAsSubmittingRequest {
  export type AsObject = {
    quoteHash: string,
    srcTx: string,
  }
}

export class RfqMarkAsSubmittingResponse extends jspb.Message {
  getErr(): error_pb.ErrMsg | undefined;
  setErr(value?: error_pb.ErrMsg): RfqMarkAsSubmittingResponse;
  hasErr(): boolean;
  clearErr(): RfqMarkAsSubmittingResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RfqMarkAsSubmittingResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RfqMarkAsSubmittingResponse): RfqMarkAsSubmittingResponse.AsObject;
  static serializeBinaryToWriter(message: RfqMarkAsSubmittingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RfqMarkAsSubmittingResponse;
  static deserializeBinaryFromReader(message: RfqMarkAsSubmittingResponse, reader: jspb.BinaryReader): RfqMarkAsSubmittingResponse;
}

export namespace RfqMarkAsSubmittingResponse {
  export type AsObject = {
    err?: error_pb.ErrMsg.AsObject,
  }
}

