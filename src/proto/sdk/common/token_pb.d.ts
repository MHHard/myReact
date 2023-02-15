import * as jspb from 'google-protobuf'



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

export class Tokens extends jspb.Message {
  getTokensList(): Array<Token>;
  setTokensList(value: Array<Token>): Tokens;
  clearTokensList(): Tokens;
  addTokens(value?: Token, index?: number): Token;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Tokens.AsObject;
  static toObject(includeInstance: boolean, msg: Tokens): Tokens.AsObject;
  static serializeBinaryToWriter(message: Tokens, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Tokens;
  static deserializeBinaryFromReader(message: Tokens, reader: jspb.BinaryReader): Tokens;
}

export namespace Tokens {
  export type AsObject = {
    tokensList: Array<Token.AsObject>,
  }
}

