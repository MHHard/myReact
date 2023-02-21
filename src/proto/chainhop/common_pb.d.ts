import * as jspb from 'google-protobuf'



export class Path extends jspb.Message {
  getStepsList(): Array<Step>;
  setStepsList(value: Array<Step>): Path;
  clearStepsList(): Path;
  addSteps(value?: Step, index?: number): Step;

  getAmountOut(): string;
  setAmountOut(value: string): Path;

  getAmountOutRaw(): string;
  setAmountOutRaw(value: string): Path;

  getAmountOutMin(): string;
  setAmountOutMin(value: string): Path;

  getReturnAmount(): string;
  setReturnAmount(value: string): Path;

  getBridgeFee(): string;
  setBridgeFee(value: string): Path;

  getPriceImpact(): number;
  setPriceImpact(value: number): Path;

  getEtaSeconds(): number;
  setEtaSeconds(value: number): Path;

  getSrcGasFee(): string;
  setSrcGasFee(value: string): Path;

  getSrcGasFeeUsd(): number;
  setSrcGasFeeUsd(value: number): Path;

  getPathType(): string;
  setPathType(value: string): Path;

  getMmId(): string;
  setMmId(value: string): Path;

  getRfqPrice(): RfqPrice | undefined;
  setRfqPrice(value?: RfqPrice): Path;
  hasRfqPrice(): boolean;
  clearRfqPrice(): Path;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Path.AsObject;
  static toObject(includeInstance: boolean, msg: Path): Path.AsObject;
  static serializeBinaryToWriter(message: Path, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Path;
  static deserializeBinaryFromReader(message: Path, reader: jspb.BinaryReader): Path;
}

export namespace Path {
  export type AsObject = {
    stepsList: Array<Step.AsObject>,
    amountOut: string,
    amountOutRaw: string,
    amountOutMin: string,
    returnAmount: string,
    bridgeFee: string,
    priceImpact: number,
    etaSeconds: number,
    srcGasFee: string,
    srcGasFeeUsd: number,
    pathType: string,
    mmId: string,
    rfqPrice?: RfqPrice.AsObject,
  }
}

export class Step extends jspb.Message {
  getType(): StepType;
  setType(value: StepType): Step;

  getTokenIn(): Token | undefined;
  setTokenIn(value?: Token): Step;
  hasTokenIn(): boolean;
  clearTokenIn(): Step;

  getTokenOut(): Token | undefined;
  setTokenOut(value?: Token): Step;
  hasTokenOut(): boolean;
  clearTokenOut(): Step;

  getProviderName(): string;
  setProviderName(value: string): Step;

  getProviderIconUrl(): string;
  setProviderIconUrl(value: string): Step;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Step.AsObject;
  static toObject(includeInstance: boolean, msg: Step): Step.AsObject;
  static serializeBinaryToWriter(message: Step, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Step;
  static deserializeBinaryFromReader(message: Step, reader: jspb.BinaryReader): Step;
}

export namespace Step {
  export type AsObject = {
    type: StepType,
    tokenIn?: Token.AsObject,
    tokenOut?: Token.AsObject,
    providerName: string,
    providerIconUrl: string,
  }
}

export class TokenAmount extends jspb.Message {
  getToken(): Token | undefined;
  setToken(value?: Token): TokenAmount;
  hasToken(): boolean;
  clearToken(): TokenAmount;

  getAmount(): string;
  setAmount(value: string): TokenAmount;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TokenAmount.AsObject;
  static toObject(includeInstance: boolean, msg: TokenAmount): TokenAmount.AsObject;
  static serializeBinaryToWriter(message: TokenAmount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TokenAmount;
  static deserializeBinaryFromReader(message: TokenAmount, reader: jspb.BinaryReader): TokenAmount;
}

export namespace TokenAmount {
  export type AsObject = {
    token?: Token.AsObject,
    amount: string,
  }
}

export class Chain extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): Chain;

  getName(): string;
  setName(value: string): Chain;

  getIcon(): string;
  setIcon(value: string): Chain;

  getBlkdelay(): number;
  setBlkdelay(value: number): Chain;

  getExploreUrl(): string;
  setExploreUrl(value: string): Chain;

  getExecutionNode(): string;
  setExecutionNode(value: string): Chain;

  getCbridgeMessagebus(): string;
  setCbridgeMessagebus(value: string): Chain;

  getRfqInfo(): Rfq | undefined;
  setRfqInfo(value?: Rfq): Chain;
  hasRfqInfo(): boolean;
  clearRfqInfo(): Chain;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Chain.AsObject;
  static toObject(includeInstance: boolean, msg: Chain): Chain.AsObject;
  static serializeBinaryToWriter(message: Chain, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Chain;
  static deserializeBinaryFromReader(message: Chain, reader: jspb.BinaryReader): Chain;
}

export namespace Chain {
  export type AsObject = {
    chainId: number,
    name: string,
    icon: string,
    blkdelay: number,
    exploreUrl: string,
    executionNode: string,
    cbridgeMessagebus: string,
    rfqInfo?: Rfq.AsObject,
  }
}

export class Rfq extends jspb.Message {
  getTokensList(): Array<Token>;
  setTokensList(value: Array<Token>): Rfq;
  clearTokensList(): Rfq;
  addTokens(value?: Token, index?: number): Token;

  getContractAddr(): string;
  setContractAddr(value: string): Rfq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Rfq.AsObject;
  static toObject(includeInstance: boolean, msg: Rfq): Rfq.AsObject;
  static serializeBinaryToWriter(message: Rfq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Rfq;
  static deserializeBinaryFromReader(message: Rfq, reader: jspb.BinaryReader): Rfq;
}

export namespace Rfq {
  export type AsObject = {
    tokensList: Array<Token.AsObject>,
    contractAddr: string,
  }
}

export class RfqPrice extends jspb.Message {
  getSrcToken(): Token | undefined;
  setSrcToken(value?: Token): RfqPrice;
  hasSrcToken(): boolean;
  clearSrcToken(): RfqPrice;

  getSrcAmount(): string;
  setSrcAmount(value: string): RfqPrice;

  getDstToken(): Token | undefined;
  setDstToken(value?: Token): RfqPrice;
  hasDstToken(): boolean;
  clearDstToken(): RfqPrice;

  getSrcReleaseAmount(): string;
  setSrcReleaseAmount(value: string): RfqPrice;

  getDstAmount(): string;
  setDstAmount(value: string): RfqPrice;

  getValidThru(): number;
  setValidThru(value: number): RfqPrice;

  getMmAddr(): string;
  setMmAddr(value: string): RfqPrice;

  getSig(): string;
  setSig(value: string): RfqPrice;

  getSrcDeadlinePeriod(): number;
  setSrcDeadlinePeriod(value: number): RfqPrice;

  getDstDeadlinePeriod(): number;
  setDstDeadlinePeriod(value: number): RfqPrice;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RfqPrice.AsObject;
  static toObject(includeInstance: boolean, msg: RfqPrice): RfqPrice.AsObject;
  static serializeBinaryToWriter(message: RfqPrice, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RfqPrice;
  static deserializeBinaryFromReader(message: RfqPrice, reader: jspb.BinaryReader): RfqPrice;
}

export namespace RfqPrice {
  export type AsObject = {
    srcToken?: Token.AsObject,
    srcAmount: string,
    dstToken?: Token.AsObject,
    srcReleaseAmount: string,
    dstAmount: string,
    validThru: number,
    mmAddr: string,
    sig: string,
    srcDeadlinePeriod: number,
    dstDeadlinePeriod: number,
  }
}

export class Token extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): Token;

  getSymbol(): string;
  setSymbol(value: string): Token;

  getAddress(): string;
  setAddress(value: string): Token;

  getDecimals(): number;
  setDecimals(value: number): Token;

  getName(): string;
  setName(value: string): Token;

  getLogoUri(): string;
  setLogoUri(value: string): Token;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Token.AsObject;
  static toObject(includeInstance: boolean, msg: Token): Token.AsObject;
  static serializeBinaryToWriter(message: Token, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Token;
  static deserializeBinaryFromReader(message: Token, reader: jspb.BinaryReader): Token;
}

export namespace Token {
  export type AsObject = {
    chainId: number,
    symbol: string,
    address: string,
    decimals: number,
    name: string,
    logoUri: string,
  }
}

export class HopHistory extends jspb.Message {
  getSwapId(): string;
  setSwapId(value: string): HopHistory;

  getAmountIn(): TokenAmount | undefined;
  setAmountIn(value?: TokenAmount): HopHistory;
  hasAmountIn(): boolean;
  clearAmountIn(): HopHistory;

  getAmountOut(): TokenAmount | undefined;
  setAmountOut(value?: TokenAmount): HopHistory;
  hasAmountOut(): boolean;
  clearAmountOut(): HopHistory;

  getCreateTs(): number;
  setCreateTs(value: number): HopHistory;

  getSrcBlockTxLink(): string;
  setSrcBlockTxLink(value: string): HopHistory;

  getDstBlockTxLink(): string;
  setDstBlockTxLink(value: string): HopHistory;

  getSwapStatus(): SwapStatus;
  setSwapStatus(value: SwapStatus): HopHistory;

  getCbrTransferId(): string;
  setCbrTransferId(value: string): HopHistory;

  getRefundedMidTokenOnDst(): Token | undefined;
  setRefundedMidTokenOnDst(value?: Token): HopHistory;
  hasRefundedMidTokenOnDst(): boolean;
  clearRefundedMidTokenOnDst(): HopHistory;

  getRefundedTokenAmtOnDst(): string;
  setRefundedTokenAmtOnDst(value: string): HopHistory;

  getBridgeType(): string;
  setBridgeType(value: string): HopHistory;

  getSwapType(): SwapType;
  setSwapType(value: SwapType): HopHistory;

  getUpdateTs(): number;
  setUpdateTs(value: number): HopHistory;

  getDstDeadline(): number;
  setDstDeadline(value: number): HopHistory;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HopHistory.AsObject;
  static toObject(includeInstance: boolean, msg: HopHistory): HopHistory.AsObject;
  static serializeBinaryToWriter(message: HopHistory, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HopHistory;
  static deserializeBinaryFromReader(message: HopHistory, reader: jspb.BinaryReader): HopHistory;
}

export namespace HopHistory {
  export type AsObject = {
    swapId: string,
    amountIn?: TokenAmount.AsObject,
    amountOut?: TokenAmount.AsObject,
    createTs: number,
    srcBlockTxLink: string,
    dstBlockTxLink: string,
    swapStatus: SwapStatus,
    cbrTransferId: string,
    refundedMidTokenOnDst?: Token.AsObject,
    refundedTokenAmtOnDst: string,
    bridgeType: string,
    swapType: SwapType,
    updateTs: number,
    dstDeadline: number,
  }
}

export enum SwapStatus { 
  SS_UNKNOWN = 0,
  SS_PENDING = 1,
  SS_SRC_SUCCESS = 2,
  SS_SRC_FAILED = 3,
  SS_DST_COMPLETED = 4,
  SS_DST_REFUNDED = 5,
  SS_SRC_REFUNDED = 6,
  SS_RFQ_PENDING = 7,
  SS_RFQ_SUBMITTING = 8,
  SS_RFQ_NO_SUBMIT = 9,
}
export enum SwapType { 
  ST_UNKNOWN = 0,
  ST_CROSS_CHAIN = 1,
  ST_DIRECT = 2,
  ST_CROSS_CHAIN_TO_USR = 3,
  ST_2HOPS = 4,
  ST_RFQ = 5,
}
export enum StepType { 
  STEP_UNKNOWN = 0,
  STEP_DEX = 1,
  STEP_BRIDGE = 2,
}
