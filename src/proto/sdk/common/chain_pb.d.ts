import * as jspb from 'google-protobuf'



export class ChainConfig extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): ChainConfig;

  getName(): string;
  setName(value: string): ChainConfig;

  getGateway(): string;
  setGateway(value: string): ChainConfig;

  getBlockInterval(): number;
  setBlockInterval(value: number): ChainConfig;

  getBlockDelay(): number;
  setBlockDelay(value: number): ChainConfig;

  getMaxBlockDelta(): number;
  setMaxBlockDelta(value: number): ChainConfig;

  getForwardBlockDelay(): number;
  setForwardBlockDelay(value: number): ChainConfig;

  getGasLimit(): number;
  setGasLimit(value: number): ChainConfig;

  getAddGasEstimateRatio(): number;
  setAddGasEstimateRatio(value: number): ChainConfig;

  getAddGasGwei(): number;
  setAddGasGwei(value: number): ChainConfig;

  getMinGasGwei(): number;
  setMinGasGwei(value: number): ChainConfig;

  getMaxGasGwei(): number;
  setMaxGasGwei(value: number): ChainConfig;

  getForceGasGwei(): string;
  setForceGasGwei(value: string): ChainConfig;

  getMaxFeePerGasGwei(): number;
  setMaxFeePerGasGwei(value: number): ChainConfig;

  getMaxPriorityFeePerGasGwei(): number;
  setMaxPriorityFeePerGasGwei(value: number): ChainConfig;

  getProxyPort(): number;
  setProxyPort(value: number): ChainConfig;

  getCBridge(): string;
  setCBridge(value: string): ChainConfig;

  getOTVault(): string;
  setOTVault(value: string): ChainConfig;

  getPTBridge(): string;
  setPTBridge(value: string): ChainConfig;

  getOTVault2(): string;
  setOTVault2(value: string): ChainConfig;

  getPTBridge2(): string;
  setPTBridge2(value: string): ChainConfig;

  getWdInbox(): string;
  setWdInbox(value: string): ChainConfig;

  getMsgBus(): string;
  setMsgBus(value: string): ChainConfig;

  getXferAgt(): string;
  setXferAgt(value: string): ChainConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainConfig.AsObject;
  static toObject(includeInstance: boolean, msg: ChainConfig): ChainConfig.AsObject;
  static serializeBinaryToWriter(message: ChainConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainConfig;
  static deserializeBinaryFromReader(message: ChainConfig, reader: jspb.BinaryReader): ChainConfig;
}

export namespace ChainConfig {
  export type AsObject = {
    chainId: number,
    name: string,
    gateway: string,
    blockInterval: number,
    blockDelay: number,
    maxBlockDelta: number,
    forwardBlockDelay: number,
    gasLimit: number,
    addGasEstimateRatio: number,
    addGasGwei: number,
    minGasGwei: number,
    maxGasGwei: number,
    forceGasGwei: string,
    maxFeePerGasGwei: number,
    maxPriorityFeePerGasGwei: number,
    proxyPort: number,
    cBridge: string,
    oTVault: string,
    pTBridge: string,
    oTVault2: string,
    pTBridge2: string,
    wdInbox: string,
    msgBus: string,
    xferAgt: string,
  }
}

