import * as jspb from 'google-protobuf'



export class Err extends jspb.Message {
  getCode(): number;
  setCode(value: number): Err;

  getMsg(): string;
  setMsg(value: string): Err;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Err.AsObject;
  static toObject(includeInstance: boolean, msg: Err): Err.AsObject;
  static serializeBinaryToWriter(message: Err, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Err;
  static deserializeBinaryFromReader(message: Err, reader: jspb.BinaryReader): Err;
}

export namespace Err {
  export type AsObject = {
    code: number,
    msg: string,
  }
}

