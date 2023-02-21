import * as jspb from 'google-protobuf'



export class ErrMsg extends jspb.Message {
  getCode(): ErrCode;
  setCode(value: ErrCode): ErrMsg;

  getMsg(): string;
  setMsg(value: string): ErrMsg;

  getErrMinMaxSend(): ErrMinMaxSend | undefined;
  setErrMinMaxSend(value?: ErrMinMaxSend): ErrMsg;
  hasErrMinMaxSend(): boolean;
  clearErrMinMaxSend(): ErrMsg;

  getErrCase(): ErrMsg.ErrCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ErrMsg): ErrMsg.AsObject;
  static serializeBinaryToWriter(message: ErrMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrMsg;
  static deserializeBinaryFromReader(message: ErrMsg, reader: jspb.BinaryReader): ErrMsg;
}

export namespace ErrMsg {
  export type AsObject = {
    code: ErrCode,
    msg: string,
    errMinMaxSend?: ErrMinMaxSend.AsObject,
  }

  export enum ErrCase { 
    ERR_NOT_SET = 0,
    ERR_MIN_MAX_SEND = 3,
  }
}

export class ErrMinMaxSend extends jspb.Message {
  getAmountIn(): string;
  setAmountIn(value: string): ErrMinMaxSend;

  getMinSend(): string;
  setMinSend(value: string): ErrMinMaxSend;

  getMaxSend(): string;
  setMaxSend(value: string): ErrMinMaxSend;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrMinMaxSend.AsObject;
  static toObject(includeInstance: boolean, msg: ErrMinMaxSend): ErrMinMaxSend.AsObject;
  static serializeBinaryToWriter(message: ErrMinMaxSend, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrMinMaxSend;
  static deserializeBinaryFromReader(message: ErrMinMaxSend, reader: jspb.BinaryReader): ErrMinMaxSend;
}

export namespace ErrMinMaxSend {
  export type AsObject = {
    amountIn: string,
    minSend: string,
    maxSend: string,
  }
}

export enum ErrCode { 
  ERROR_CODE_UNDEFINED = 0,
  ERROR_CODE_COMMON = 500,
  ERROR_CODE_NO_ROUTE = 1001,
  ERROR_CODE_NEGATIVE_AMT_OUT = 1002,
  ERROR_CODE_MIN_MAX_SEND = 2001,
}
