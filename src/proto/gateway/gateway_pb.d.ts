import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../gogoproto/gogo_pb';
import * as google_api_annotations_pb from '../google/api/annotations_pb';
import * as sgn_cbridge_v1_query_pb from '../sgn/cbridge/v1/query_pb';
import * as sgn_cbridge_v1_cbridge_pb from '../sgn/cbridge/v1/cbridge_pb';
import * as sgn_common_v1_common_pb from '../sgn/common/v1/common_pb';
import * as sgn_farming_v1_farming_pb from '../sgn/farming/v1/farming_pb';
import * as sgn_distribution_v1_distribution_pb from '../sgn/distribution/v1/distribution_pb';
import * as sgn_pegbridge_v1_pegbridge_pb from '../sgn/pegbridge/v1/pegbridge_pb';
import * as sgn_pegbridge_v1_tx_pb from '../sgn/pegbridge/v1/tx_pb';
import * as cosmos_base_v1beta1_coin_pb from '../cosmos/base/v1beta1/coin_pb';
import * as sgn_health_v1_health_pb from '../sgn/health/v1/health_pb';
import * as sdk_service_rfq_user_pb from '../sdk/service/rfq/user_pb';
import * as sdk_service_rfq_model_pb from '../sdk/service/rfq/model_pb';


export class GetDataByTimeRangeAndBridgeTypeRequest extends jspb.Message {
  getBegin(): number;
  setBegin(value: number): GetDataByTimeRangeAndBridgeTypeRequest;

  getEnd(): number;
  setEnd(value: number): GetDataByTimeRangeAndBridgeTypeRequest;

  getBridgeType(): number;
  setBridgeType(value: number): GetDataByTimeRangeAndBridgeTypeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDataByTimeRangeAndBridgeTypeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDataByTimeRangeAndBridgeTypeRequest): GetDataByTimeRangeAndBridgeTypeRequest.AsObject;
  static serializeBinaryToWriter(message: GetDataByTimeRangeAndBridgeTypeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDataByTimeRangeAndBridgeTypeRequest;
  static deserializeBinaryFromReader(message: GetDataByTimeRangeAndBridgeTypeRequest, reader: jspb.BinaryReader): GetDataByTimeRangeAndBridgeTypeRequest;
}

export namespace GetDataByTimeRangeAndBridgeTypeRequest {
  export type AsObject = {
    begin: number,
    end: number,
    bridgeType: number,
  }
}

export class GetDataByTimeRangeAndBridgeTypeResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetDataByTimeRangeAndBridgeTypeResponse;
  hasErr(): boolean;
  clearErr(): GetDataByTimeRangeAndBridgeTypeResponse;

  getVolume(): number;
  setVolume(value: number): GetDataByTimeRangeAndBridgeTypeResponse;

  getTxCount(): number;
  setTxCount(value: number): GetDataByTimeRangeAndBridgeTypeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDataByTimeRangeAndBridgeTypeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetDataByTimeRangeAndBridgeTypeResponse): GetDataByTimeRangeAndBridgeTypeResponse.AsObject;
  static serializeBinaryToWriter(message: GetDataByTimeRangeAndBridgeTypeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDataByTimeRangeAndBridgeTypeResponse;
  static deserializeBinaryFromReader(message: GetDataByTimeRangeAndBridgeTypeResponse, reader: jspb.BinaryReader): GetDataByTimeRangeAndBridgeTypeResponse;
}

export namespace GetDataByTimeRangeAndBridgeTypeResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    volume: number,
    txCount: number,
  }
}

export class GetUniqueUserAddrByTimeRangeAndBridgeTypeRequest extends jspb.Message {
  getBegin(): number;
  setBegin(value: number): GetUniqueUserAddrByTimeRangeAndBridgeTypeRequest;

  getEnd(): number;
  setEnd(value: number): GetUniqueUserAddrByTimeRangeAndBridgeTypeRequest;

  getBridgeType(): number;
  setBridgeType(value: number): GetUniqueUserAddrByTimeRangeAndBridgeTypeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUniqueUserAddrByTimeRangeAndBridgeTypeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUniqueUserAddrByTimeRangeAndBridgeTypeRequest): GetUniqueUserAddrByTimeRangeAndBridgeTypeRequest.AsObject;
  static serializeBinaryToWriter(message: GetUniqueUserAddrByTimeRangeAndBridgeTypeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUniqueUserAddrByTimeRangeAndBridgeTypeRequest;
  static deserializeBinaryFromReader(message: GetUniqueUserAddrByTimeRangeAndBridgeTypeRequest, reader: jspb.BinaryReader): GetUniqueUserAddrByTimeRangeAndBridgeTypeRequest;
}

export namespace GetUniqueUserAddrByTimeRangeAndBridgeTypeRequest {
  export type AsObject = {
    begin: number,
    end: number,
    bridgeType: number,
  }
}

export class GetUniqueUserAddrByTimeRangeAndBridgeTypeResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetUniqueUserAddrByTimeRangeAndBridgeTypeResponse;
  hasErr(): boolean;
  clearErr(): GetUniqueUserAddrByTimeRangeAndBridgeTypeResponse;

  getUsersList(): Array<string>;
  setUsersList(value: Array<string>): GetUniqueUserAddrByTimeRangeAndBridgeTypeResponse;
  clearUsersList(): GetUniqueUserAddrByTimeRangeAndBridgeTypeResponse;
  addUsers(value: string, index?: number): GetUniqueUserAddrByTimeRangeAndBridgeTypeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUniqueUserAddrByTimeRangeAndBridgeTypeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUniqueUserAddrByTimeRangeAndBridgeTypeResponse): GetUniqueUserAddrByTimeRangeAndBridgeTypeResponse.AsObject;
  static serializeBinaryToWriter(message: GetUniqueUserAddrByTimeRangeAndBridgeTypeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUniqueUserAddrByTimeRangeAndBridgeTypeResponse;
  static deserializeBinaryFromReader(message: GetUniqueUserAddrByTimeRangeAndBridgeTypeResponse, reader: jspb.BinaryReader): GetUniqueUserAddrByTimeRangeAndBridgeTypeResponse;
}

export namespace GetUniqueUserAddrByTimeRangeAndBridgeTypeResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    usersList: Array<string>,
  }
}

export class GetRiskSeverityLevelRequest extends jspb.Message {
  getUsrAddr(): string;
  setUsrAddr(value: string): GetRiskSeverityLevelRequest;

  getChainId(): number;
  setChainId(value: number): GetRiskSeverityLevelRequest;

  getDisableTrm(): boolean;
  setDisableTrm(value: boolean): GetRiskSeverityLevelRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRiskSeverityLevelRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetRiskSeverityLevelRequest): GetRiskSeverityLevelRequest.AsObject;
  static serializeBinaryToWriter(message: GetRiskSeverityLevelRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRiskSeverityLevelRequest;
  static deserializeBinaryFromReader(message: GetRiskSeverityLevelRequest, reader: jspb.BinaryReader): GetRiskSeverityLevelRequest;
}

export namespace GetRiskSeverityLevelRequest {
  export type AsObject = {
    usrAddr: string,
    chainId: number,
    disableTrm: boolean,
  }
}

export class GetRiskSeverityLevelResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetRiskSeverityLevelResponse;
  hasErr(): boolean;
  clearErr(): GetRiskSeverityLevelResponse;

  getIsBlocked(): boolean;
  setIsBlocked(value: boolean): GetRiskSeverityLevelResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRiskSeverityLevelResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetRiskSeverityLevelResponse): GetRiskSeverityLevelResponse.AsObject;
  static serializeBinaryToWriter(message: GetRiskSeverityLevelResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRiskSeverityLevelResponse;
  static deserializeBinaryFromReader(message: GetRiskSeverityLevelResponse, reader: jspb.BinaryReader): GetRiskSeverityLevelResponse;
}

export namespace GetRiskSeverityLevelResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    isBlocked: boolean,
  }
}

export class GetBalanceDetailRequest extends jspb.Message {
  getUsrAddr(): string;
  setUsrAddr(value: string): GetBalanceDetailRequest;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): GetBalanceDetailRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBalanceDetailRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBalanceDetailRequest): GetBalanceDetailRequest.AsObject;
  static serializeBinaryToWriter(message: GetBalanceDetailRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBalanceDetailRequest;
  static deserializeBinaryFromReader(message: GetBalanceDetailRequest, reader: jspb.BinaryReader): GetBalanceDetailRequest;
}

export namespace GetBalanceDetailRequest {
  export type AsObject = {
    usrAddr: string,
    tokenSymbol: string,
  }
}

export class GetBalanceDetailResponse extends jspb.Message {
  getWithdraw(): string;
  setWithdraw(value: string): GetBalanceDetailResponse;

  getDeposit(): string;
  setDeposit(value: string): GetBalanceDetailResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBalanceDetailResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetBalanceDetailResponse): GetBalanceDetailResponse.AsObject;
  static serializeBinaryToWriter(message: GetBalanceDetailResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBalanceDetailResponse;
  static deserializeBinaryFromReader(message: GetBalanceDetailResponse, reader: jspb.BinaryReader): GetBalanceDetailResponse;
}

export namespace GetBalanceDetailResponse {
  export type AsObject = {
    withdraw: string,
    deposit: string,
  }
}

export class UpdateRiskSeverityLevelForCsToolRequest extends jspb.Message {
  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): UpdateRiskSeverityLevelForCsToolRequest;

  getSigAddr(): string;
  setSigAddr(value: string): UpdateRiskSeverityLevelForCsToolRequest;

  getUsrAddr(): string;
  setUsrAddr(value: string): UpdateRiskSeverityLevelForCsToolRequest;

  getIsWhitelist(): boolean;
  setIsWhitelist(value: boolean): UpdateRiskSeverityLevelForCsToolRequest;

  getWhitelistReason(): string;
  setWhitelistReason(value: string): UpdateRiskSeverityLevelForCsToolRequest;

  getIsBlacklist(): boolean;
  setIsBlacklist(value: boolean): UpdateRiskSeverityLevelForCsToolRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateRiskSeverityLevelForCsToolRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateRiskSeverityLevelForCsToolRequest): UpdateRiskSeverityLevelForCsToolRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateRiskSeverityLevelForCsToolRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateRiskSeverityLevelForCsToolRequest;
  static deserializeBinaryFromReader(message: UpdateRiskSeverityLevelForCsToolRequest, reader: jspb.BinaryReader): UpdateRiskSeverityLevelForCsToolRequest;
}

export namespace UpdateRiskSeverityLevelForCsToolRequest {
  export type AsObject = {
    sig: Uint8Array | string,
    sigAddr: string,
    usrAddr: string,
    isWhitelist: boolean,
    whitelistReason: string,
    isBlacklist: boolean,
  }
}

export class UpdateRiskSeverityLevelForCsToolResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): UpdateRiskSeverityLevelForCsToolResponse;
  hasErr(): boolean;
  clearErr(): UpdateRiskSeverityLevelForCsToolResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateRiskSeverityLevelForCsToolResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateRiskSeverityLevelForCsToolResponse): UpdateRiskSeverityLevelForCsToolResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateRiskSeverityLevelForCsToolResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateRiskSeverityLevelForCsToolResponse;
  static deserializeBinaryFromReader(message: UpdateRiskSeverityLevelForCsToolResponse, reader: jspb.BinaryReader): UpdateRiskSeverityLevelForCsToolResponse;
}

export namespace UpdateRiskSeverityLevelForCsToolResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class GetRiskSeverityLevelForCsToolRequest extends jspb.Message {
  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): GetRiskSeverityLevelForCsToolRequest;

  getSigAddr(): string;
  setSigAddr(value: string): GetRiskSeverityLevelForCsToolRequest;

  getUsrAddrsList(): Array<string>;
  setUsrAddrsList(value: Array<string>): GetRiskSeverityLevelForCsToolRequest;
  clearUsrAddrsList(): GetRiskSeverityLevelForCsToolRequest;
  addUsrAddrs(value: string, index?: number): GetRiskSeverityLevelForCsToolRequest;

  getPageNo(): number;
  setPageNo(value: number): GetRiskSeverityLevelForCsToolRequest;

  getPageSize(): number;
  setPageSize(value: number): GetRiskSeverityLevelForCsToolRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRiskSeverityLevelForCsToolRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetRiskSeverityLevelForCsToolRequest): GetRiskSeverityLevelForCsToolRequest.AsObject;
  static serializeBinaryToWriter(message: GetRiskSeverityLevelForCsToolRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRiskSeverityLevelForCsToolRequest;
  static deserializeBinaryFromReader(message: GetRiskSeverityLevelForCsToolRequest, reader: jspb.BinaryReader): GetRiskSeverityLevelForCsToolRequest;
}

export namespace GetRiskSeverityLevelForCsToolRequest {
  export type AsObject = {
    sig: Uint8Array | string,
    sigAddr: string,
    usrAddrsList: Array<string>,
    pageNo: number,
    pageSize: number,
  }
}

export class GetRiskSeverityLevelForCsToolResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetRiskSeverityLevelForCsToolResponse;
  hasErr(): boolean;
  clearErr(): GetRiskSeverityLevelForCsToolResponse;

  getElementsList(): Array<RiskSeverityLevelDataElement>;
  setElementsList(value: Array<RiskSeverityLevelDataElement>): GetRiskSeverityLevelForCsToolResponse;
  clearElementsList(): GetRiskSeverityLevelForCsToolResponse;
  addElements(value?: RiskSeverityLevelDataElement, index?: number): RiskSeverityLevelDataElement;

  getCount(): number;
  setCount(value: number): GetRiskSeverityLevelForCsToolResponse;

  getPageNo(): number;
  setPageNo(value: number): GetRiskSeverityLevelForCsToolResponse;

  getPageSize(): number;
  setPageSize(value: number): GetRiskSeverityLevelForCsToolResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRiskSeverityLevelForCsToolResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetRiskSeverityLevelForCsToolResponse): GetRiskSeverityLevelForCsToolResponse.AsObject;
  static serializeBinaryToWriter(message: GetRiskSeverityLevelForCsToolResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRiskSeverityLevelForCsToolResponse;
  static deserializeBinaryFromReader(message: GetRiskSeverityLevelForCsToolResponse, reader: jspb.BinaryReader): GetRiskSeverityLevelForCsToolResponse;
}

export namespace GetRiskSeverityLevelForCsToolResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    elementsList: Array<RiskSeverityLevelDataElement.AsObject>,
    count: number,
    pageNo: number,
    pageSize: number,
  }
}

export class RiskSeverityLevelDataElement extends jspb.Message {
  getUsrAddr(): string;
  setUsrAddr(value: string): RiskSeverityLevelDataElement;

  getIpAddr(): string;
  setIpAddr(value: string): RiskSeverityLevelDataElement;

  getRiskCategory(): string;
  setRiskCategory(value: string): RiskSeverityLevelDataElement;

  getRiskType(): string;
  setRiskType(value: string): RiskSeverityLevelDataElement;

  getRiskSeverity(): string;
  setRiskSeverity(value: string): RiskSeverityLevelDataElement;

  getIsWhitelist(): boolean;
  setIsWhitelist(value: boolean): RiskSeverityLevelDataElement;

  getWhitelistReason(): string;
  setWhitelistReason(value: string): RiskSeverityLevelDataElement;

  getLastUpdateTimeInSecond(): number;
  setLastUpdateTimeInSecond(value: number): RiskSeverityLevelDataElement;

  getIsBlacklist(): boolean;
  setIsBlacklist(value: boolean): RiskSeverityLevelDataElement;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RiskSeverityLevelDataElement.AsObject;
  static toObject(includeInstance: boolean, msg: RiskSeverityLevelDataElement): RiskSeverityLevelDataElement.AsObject;
  static serializeBinaryToWriter(message: RiskSeverityLevelDataElement, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RiskSeverityLevelDataElement;
  static deserializeBinaryFromReader(message: RiskSeverityLevelDataElement, reader: jspb.BinaryReader): RiskSeverityLevelDataElement;
}

export namespace RiskSeverityLevelDataElement {
  export type AsObject = {
    usrAddr: string,
    ipAddr: string,
    riskCategory: string,
    riskType: string,
    riskSeverity: string,
    isWhitelist: boolean,
    whitelistReason: string,
    lastUpdateTimeInSecond: number,
    isBlacklist: boolean,
  }
}

export class TrmScreenRequestElement extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): TrmScreenRequestElement;

  getChain(): string;
  setChain(value: string): TrmScreenRequestElement;

  getAccountExternalId(): string;
  setAccountExternalId(value: string): TrmScreenRequestElement;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrmScreenRequestElement.AsObject;
  static toObject(includeInstance: boolean, msg: TrmScreenRequestElement): TrmScreenRequestElement.AsObject;
  static serializeBinaryToWriter(message: TrmScreenRequestElement, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrmScreenRequestElement;
  static deserializeBinaryFromReader(message: TrmScreenRequestElement, reader: jspb.BinaryReader): TrmScreenRequestElement;
}

export namespace TrmScreenRequestElement {
  export type AsObject = {
    address: string,
    chain: string,
    accountExternalId: string,
  }
}

export class TrmScreenResponseElement extends jspb.Message {
  getAccountExternalId(): string;
  setAccountExternalId(value: string): TrmScreenResponseElement;

  getAddress(): string;
  setAddress(value: string): TrmScreenResponseElement;

  getAddressSubmitted(): string;
  setAddressSubmitted(value: string): TrmScreenResponseElement;

  getChain(): string;
  setChain(value: string): TrmScreenResponseElement;

  getTrmAppUrl(): string;
  setTrmAppUrl(value: string): TrmScreenResponseElement;

  getAddressRiskIndicatorsList(): Array<TrmScreenAddressRiskIndicator>;
  setAddressRiskIndicatorsList(value: Array<TrmScreenAddressRiskIndicator>): TrmScreenResponseElement;
  clearAddressRiskIndicatorsList(): TrmScreenResponseElement;
  addAddressRiskIndicators(value?: TrmScreenAddressRiskIndicator, index?: number): TrmScreenAddressRiskIndicator;

  getEntitiesList(): Array<TrmScreenEntity>;
  setEntitiesList(value: Array<TrmScreenEntity>): TrmScreenResponseElement;
  clearEntitiesList(): TrmScreenResponseElement;
  addEntities(value?: TrmScreenEntity, index?: number): TrmScreenEntity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrmScreenResponseElement.AsObject;
  static toObject(includeInstance: boolean, msg: TrmScreenResponseElement): TrmScreenResponseElement.AsObject;
  static serializeBinaryToWriter(message: TrmScreenResponseElement, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrmScreenResponseElement;
  static deserializeBinaryFromReader(message: TrmScreenResponseElement, reader: jspb.BinaryReader): TrmScreenResponseElement;
}

export namespace TrmScreenResponseElement {
  export type AsObject = {
    accountExternalId: string,
    address: string,
    addressSubmitted: string,
    chain: string,
    trmAppUrl: string,
    addressRiskIndicatorsList: Array<TrmScreenAddressRiskIndicator.AsObject>,
    entitiesList: Array<TrmScreenEntity.AsObject>,
  }
}

export class TrmScreenAddressRiskIndicator extends jspb.Message {
  getCategory(): string;
  setCategory(value: string): TrmScreenAddressRiskIndicator;

  getCategoryId(): string;
  setCategoryId(value: string): TrmScreenAddressRiskIndicator;

  getCategoryRiskScoreLevel(): number;
  setCategoryRiskScoreLevel(value: number): TrmScreenAddressRiskIndicator;

  getCategoryRiskScoreLevelLabel(): string;
  setCategoryRiskScoreLevelLabel(value: string): TrmScreenAddressRiskIndicator;

  getIncomingVolumeUsd(): string;
  setIncomingVolumeUsd(value: string): TrmScreenAddressRiskIndicator;

  getOutgoingVolumeUsd(): string;
  setOutgoingVolumeUsd(value: string): TrmScreenAddressRiskIndicator;

  getRiskType(): string;
  setRiskType(value: string): TrmScreenAddressRiskIndicator;

  getTotalVolumeUsd(): string;
  setTotalVolumeUsd(value: string): TrmScreenAddressRiskIndicator;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrmScreenAddressRiskIndicator.AsObject;
  static toObject(includeInstance: boolean, msg: TrmScreenAddressRiskIndicator): TrmScreenAddressRiskIndicator.AsObject;
  static serializeBinaryToWriter(message: TrmScreenAddressRiskIndicator, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrmScreenAddressRiskIndicator;
  static deserializeBinaryFromReader(message: TrmScreenAddressRiskIndicator, reader: jspb.BinaryReader): TrmScreenAddressRiskIndicator;
}

export namespace TrmScreenAddressRiskIndicator {
  export type AsObject = {
    category: string,
    categoryId: string,
    categoryRiskScoreLevel: number,
    categoryRiskScoreLevelLabel: string,
    incomingVolumeUsd: string,
    outgoingVolumeUsd: string,
    riskType: string,
    totalVolumeUsd: string,
  }
}

export class TrmScreenEntity extends jspb.Message {
  getCategory(): string;
  setCategory(value: string): TrmScreenEntity;

  getCategoryId(): string;
  setCategoryId(value: string): TrmScreenEntity;

  getEntity(): string;
  setEntity(value: string): TrmScreenEntity;

  getRiskScoreLevel(): number;
  setRiskScoreLevel(value: number): TrmScreenEntity;

  getRiskScoreLevelLabel(): string;
  setRiskScoreLevelLabel(value: string): TrmScreenEntity;

  getTrmAppUrl(): string;
  setTrmAppUrl(value: string): TrmScreenEntity;

  getTrmUrn(): string;
  setTrmUrn(value: string): TrmScreenEntity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrmScreenEntity.AsObject;
  static toObject(includeInstance: boolean, msg: TrmScreenEntity): TrmScreenEntity.AsObject;
  static serializeBinaryToWriter(message: TrmScreenEntity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrmScreenEntity;
  static deserializeBinaryFromReader(message: TrmScreenEntity, reader: jspb.BinaryReader): TrmScreenEntity;
}

export namespace TrmScreenEntity {
  export type AsObject = {
    category: string,
    categoryId: string,
    entity: string,
    riskScoreLevel: number,
    riskScoreLevelLabel: string,
    trmAppUrl: string,
    trmUrn: string,
  }
}

export class TrmScreenResponse extends jspb.Message {
  getName(): string;
  setName(value: string): TrmScreenResponse;

  getClassName(): string;
  setClassName(value: string): TrmScreenResponse;

  getCode(): number;
  setCode(value: number): TrmScreenResponse;

  getMessage(): string;
  setMessage(value: string): TrmScreenResponse;

  getData(): TrmScreenRequestElement | undefined;
  setData(value?: TrmScreenRequestElement): TrmScreenResponse;
  hasData(): boolean;
  clearData(): TrmScreenResponse;

  getElementsList(): Array<TrmScreenResponseElement>;
  setElementsList(value: Array<TrmScreenResponseElement>): TrmScreenResponse;
  clearElementsList(): TrmScreenResponse;
  addElements(value?: TrmScreenResponseElement, index?: number): TrmScreenResponseElement;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrmScreenResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TrmScreenResponse): TrmScreenResponse.AsObject;
  static serializeBinaryToWriter(message: TrmScreenResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrmScreenResponse;
  static deserializeBinaryFromReader(message: TrmScreenResponse, reader: jspb.BinaryReader): TrmScreenResponse;
}

export namespace TrmScreenResponse {
  export type AsObject = {
    name: string,
    className: string,
    code: number,
    message: string,
    data?: TrmScreenRequestElement.AsObject,
    elementsList: Array<TrmScreenResponseElement.AsObject>,
  }
}

export class PingRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): PingRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PingRequest): PingRequest.AsObject;
  static serializeBinaryToWriter(message: PingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PingRequest;
  static deserializeBinaryFromReader(message: PingRequest, reader: jspb.BinaryReader): PingRequest;
}

export namespace PingRequest {
  export type AsObject = {
    addr: string,
  }
}

export class PingResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): PingResponse;
  hasErr(): boolean;
  clearErr(): PingResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PingResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PingResponse): PingResponse.AsObject;
  static serializeBinaryToWriter(message: PingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PingResponse;
  static deserializeBinaryFromReader(message: PingResponse, reader: jspb.BinaryReader): PingResponse;
}

export namespace PingResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class PingLpRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): PingLpRequest;

  getLpType(): LPType;
  setLpType(value: LPType): PingLpRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PingLpRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PingLpRequest): PingLpRequest.AsObject;
  static serializeBinaryToWriter(message: PingLpRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PingLpRequest;
  static deserializeBinaryFromReader(message: PingLpRequest, reader: jspb.BinaryReader): PingLpRequest;
}

export namespace PingLpRequest {
  export type AsObject = {
    addr: string,
    lpType: LPType,
  }
}

export class PingLpResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): PingLpResponse;
  hasErr(): boolean;
  clearErr(): PingLpResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PingLpResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PingLpResponse): PingLpResponse.AsObject;
  static serializeBinaryToWriter(message: PingLpResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PingLpResponse;
  static deserializeBinaryFromReader(message: PingLpResponse, reader: jspb.BinaryReader): PingLpResponse;
}

export namespace PingLpResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class GetTransferRefIdRequest extends jspb.Message {
  getTransferId(): string;
  setTransferId(value: string): GetTransferRefIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferRefIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferRefIdRequest): GetTransferRefIdRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransferRefIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferRefIdRequest;
  static deserializeBinaryFromReader(message: GetTransferRefIdRequest, reader: jspb.BinaryReader): GetTransferRefIdRequest;
}

export namespace GetTransferRefIdRequest {
  export type AsObject = {
    transferId: string,
  }
}

export class GetTransferRefIdResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTransferRefIdResponse;
  hasErr(): boolean;
  clearErr(): GetTransferRefIdResponse;

  getRefId(): string;
  setRefId(value: string): GetTransferRefIdResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferRefIdResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferRefIdResponse): GetTransferRefIdResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransferRefIdResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferRefIdResponse;
  static deserializeBinaryFromReader(message: GetTransferRefIdResponse, reader: jspb.BinaryReader): GetTransferRefIdResponse;
}

export namespace GetTransferRefIdResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    refId: string,
  }
}

export class GetLatest7DayTransferLatencyForQueryRequest extends jspb.Message {
  getSrcChainId(): number;
  setSrcChainId(value: number): GetLatest7DayTransferLatencyForQueryRequest;

  getDstChainId(): number;
  setDstChainId(value: number): GetLatest7DayTransferLatencyForQueryRequest;

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
  }
}

export class GetLatest7DayTransferLatencyForQueryResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetLatest7DayTransferLatencyForQueryResponse;
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
    err?: ErrMsg.AsObject,
    medianTransferLatencyInSecond: number,
  }
}

export class TransferLatencyForQuery extends jspb.Message {
  getMedianTransferLatencyInSecond(): number;
  setMedianTransferLatencyInSecond(value: number): TransferLatencyForQuery;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferLatencyForQuery.AsObject;
  static toObject(includeInstance: boolean, msg: TransferLatencyForQuery): TransferLatencyForQuery.AsObject;
  static serializeBinaryToWriter(message: TransferLatencyForQuery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferLatencyForQuery;
  static deserializeBinaryFromReader(message: TransferLatencyForQuery, reader: jspb.BinaryReader): TransferLatencyForQuery;
}

export namespace TransferLatencyForQuery {
  export type AsObject = {
    medianTransferLatencyInSecond: number,
  }
}

export class GetLatest24HourTransferLatencyForInternalDashboardRequest extends jspb.Message {
  getAuth(): DashboardAuth | undefined;
  setAuth(value?: DashboardAuth): GetLatest24HourTransferLatencyForInternalDashboardRequest;
  hasAuth(): boolean;
  clearAuth(): GetLatest24HourTransferLatencyForInternalDashboardRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLatest24HourTransferLatencyForInternalDashboardRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetLatest24HourTransferLatencyForInternalDashboardRequest): GetLatest24HourTransferLatencyForInternalDashboardRequest.AsObject;
  static serializeBinaryToWriter(message: GetLatest24HourTransferLatencyForInternalDashboardRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLatest24HourTransferLatencyForInternalDashboardRequest;
  static deserializeBinaryFromReader(message: GetLatest24HourTransferLatencyForInternalDashboardRequest, reader: jspb.BinaryReader): GetLatest24HourTransferLatencyForInternalDashboardRequest;
}

export namespace GetLatest24HourTransferLatencyForInternalDashboardRequest {
  export type AsObject = {
    auth?: DashboardAuth.AsObject,
  }
}

export class GetLatest24HourTransferLatencyForInternalDashboardResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetLatest24HourTransferLatencyForInternalDashboardResponse;
  hasErr(): boolean;
  clearErr(): GetLatest24HourTransferLatencyForInternalDashboardResponse;

  getData(): TransferLatencyElement | undefined;
  setData(value?: TransferLatencyElement): GetLatest24HourTransferLatencyForInternalDashboardResponse;
  hasData(): boolean;
  clearData(): GetLatest24HourTransferLatencyForInternalDashboardResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLatest24HourTransferLatencyForInternalDashboardResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetLatest24HourTransferLatencyForInternalDashboardResponse): GetLatest24HourTransferLatencyForInternalDashboardResponse.AsObject;
  static serializeBinaryToWriter(message: GetLatest24HourTransferLatencyForInternalDashboardResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLatest24HourTransferLatencyForInternalDashboardResponse;
  static deserializeBinaryFromReader(message: GetLatest24HourTransferLatencyForInternalDashboardResponse, reader: jspb.BinaryReader): GetLatest24HourTransferLatencyForInternalDashboardResponse;
}

export namespace GetLatest24HourTransferLatencyForInternalDashboardResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    data?: TransferLatencyElement.AsObject,
  }
}

export class GetTransferLatencyByFilterForInternalDashboardRequest extends jspb.Message {
  getAuth(): DashboardAuth | undefined;
  setAuth(value?: DashboardAuth): GetTransferLatencyByFilterForInternalDashboardRequest;
  hasAuth(): boolean;
  clearAuth(): GetTransferLatencyByFilterForInternalDashboardRequest;

  getStartTimeInSecond(): number;
  setStartTimeInSecond(value: number): GetTransferLatencyByFilterForInternalDashboardRequest;

  getEndTimeInSecond(): number;
  setEndTimeInSecond(value: number): GetTransferLatencyByFilterForInternalDashboardRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferLatencyByFilterForInternalDashboardRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferLatencyByFilterForInternalDashboardRequest): GetTransferLatencyByFilterForInternalDashboardRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransferLatencyByFilterForInternalDashboardRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferLatencyByFilterForInternalDashboardRequest;
  static deserializeBinaryFromReader(message: GetTransferLatencyByFilterForInternalDashboardRequest, reader: jspb.BinaryReader): GetTransferLatencyByFilterForInternalDashboardRequest;
}

export namespace GetTransferLatencyByFilterForInternalDashboardRequest {
  export type AsObject = {
    auth?: DashboardAuth.AsObject,
    startTimeInSecond: number,
    endTimeInSecond: number,
  }
}

export class GetTransferLatencyByFilterForInternalDashboardResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTransferLatencyByFilterForInternalDashboardResponse;
  hasErr(): boolean;
  clearErr(): GetTransferLatencyByFilterForInternalDashboardResponse;

  getData(): TransferLatencyByFilterForInternalDashboard | undefined;
  setData(value?: TransferLatencyByFilterForInternalDashboard): GetTransferLatencyByFilterForInternalDashboardResponse;
  hasData(): boolean;
  clearData(): GetTransferLatencyByFilterForInternalDashboardResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferLatencyByFilterForInternalDashboardResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferLatencyByFilterForInternalDashboardResponse): GetTransferLatencyByFilterForInternalDashboardResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransferLatencyByFilterForInternalDashboardResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferLatencyByFilterForInternalDashboardResponse;
  static deserializeBinaryFromReader(message: GetTransferLatencyByFilterForInternalDashboardResponse, reader: jspb.BinaryReader): GetTransferLatencyByFilterForInternalDashboardResponse;
}

export namespace GetTransferLatencyByFilterForInternalDashboardResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    data?: TransferLatencyByFilterForInternalDashboard.AsObject,
  }
}

export class TransferLatencyByFilterForInternalDashboard extends jspb.Message {
  getElementsList(): Array<TransferLatencyElement>;
  setElementsList(value: Array<TransferLatencyElement>): TransferLatencyByFilterForInternalDashboard;
  clearElementsList(): TransferLatencyByFilterForInternalDashboard;
  addElements(value?: TransferLatencyElement, index?: number): TransferLatencyElement;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferLatencyByFilterForInternalDashboard.AsObject;
  static toObject(includeInstance: boolean, msg: TransferLatencyByFilterForInternalDashboard): TransferLatencyByFilterForInternalDashboard.AsObject;
  static serializeBinaryToWriter(message: TransferLatencyByFilterForInternalDashboard, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferLatencyByFilterForInternalDashboard;
  static deserializeBinaryFromReader(message: TransferLatencyByFilterForInternalDashboard, reader: jspb.BinaryReader): TransferLatencyByFilterForInternalDashboard;
}

export namespace TransferLatencyByFilterForInternalDashboard {
  export type AsObject = {
    elementsList: Array<TransferLatencyElement.AsObject>,
  }
}

export class TransferLatencyElement extends jspb.Message {
  getMedianTransferLatencyInSecond(): number;
  setMedianTransferLatencyInSecond(value: number): TransferLatencyElement;

  getPercentile75TransferLatencyInSecond(): number;
  setPercentile75TransferLatencyInSecond(value: number): TransferLatencyElement;

  getPercentile95TransferLatencyInSecond(): number;
  setPercentile95TransferLatencyInSecond(value: number): TransferLatencyElement;

  getPercentile99TransferLatencyInSecond(): number;
  setPercentile99TransferLatencyInSecond(value: number): TransferLatencyElement;

  getMaxTransferLatency(): number;
  setMaxTransferLatency(value: number): TransferLatencyElement;

  getDstChainName(): string;
  setDstChainName(value: string): TransferLatencyElement;

  getDstChainIcon(): string;
  setDstChainIcon(value: string): TransferLatencyElement;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferLatencyElement.AsObject;
  static toObject(includeInstance: boolean, msg: TransferLatencyElement): TransferLatencyElement.AsObject;
  static serializeBinaryToWriter(message: TransferLatencyElement, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferLatencyElement;
  static deserializeBinaryFromReader(message: TransferLatencyElement, reader: jspb.BinaryReader): TransferLatencyElement;
}

export namespace TransferLatencyElement {
  export type AsObject = {
    medianTransferLatencyInSecond: number,
    percentile75TransferLatencyInSecond: number,
    percentile95TransferLatencyInSecond: number,
    percentile99TransferLatencyInSecond: number,
    maxTransferLatency: number,
    dstChainName: string,
    dstChainIcon: string,
  }
}

export class DashboardAuth extends jspb.Message {
  getSignData(): DashboardSignData | undefined;
  setSignData(value?: DashboardSignData): DashboardAuth;
  hasSignData(): boolean;
  clearSignData(): DashboardAuth;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): DashboardAuth;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DashboardAuth.AsObject;
  static toObject(includeInstance: boolean, msg: DashboardAuth): DashboardAuth.AsObject;
  static serializeBinaryToWriter(message: DashboardAuth, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DashboardAuth;
  static deserializeBinaryFromReader(message: DashboardAuth, reader: jspb.BinaryReader): DashboardAuth;
}

export namespace DashboardAuth {
  export type AsObject = {
    signData?: DashboardSignData.AsObject,
    sig: Uint8Array | string,
  }
}

export class DashboardSignData extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): DashboardSignData;

  getSignTime(): number;
  setSignTime(value: number): DashboardSignData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DashboardSignData.AsObject;
  static toObject(includeInstance: boolean, msg: DashboardSignData): DashboardSignData.AsObject;
  static serializeBinaryToWriter(message: DashboardSignData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DashboardSignData;
  static deserializeBinaryFromReader(message: DashboardSignData, reader: jspb.BinaryReader): DashboardSignData;
}

export namespace DashboardSignData {
  export type AsObject = {
    addr: string,
    signTime: number,
  }
}

export class GetWithdrawInfoRequest extends jspb.Message {
  getLpAddr(): string;
  setLpAddr(value: string): GetWithdrawInfoRequest;

  getChainId(): number;
  setChainId(value: number): GetWithdrawInfoRequest;

  getSeqNum(): number;
  setSeqNum(value: number): GetWithdrawInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetWithdrawInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetWithdrawInfoRequest): GetWithdrawInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetWithdrawInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetWithdrawInfoRequest;
  static deserializeBinaryFromReader(message: GetWithdrawInfoRequest, reader: jspb.BinaryReader): GetWithdrawInfoRequest;
}

export namespace GetWithdrawInfoRequest {
  export type AsObject = {
    lpAddr: string,
    chainId: number,
    seqNum: number,
  }
}

export class GetWithdrawInfoResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetWithdrawInfoResponse;
  hasErr(): boolean;
  clearErr(): GetWithdrawInfoResponse;

  getMethodType(): WithdrawMethodType;
  setMethodType(value: WithdrawMethodType): GetWithdrawInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetWithdrawInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetWithdrawInfoResponse): GetWithdrawInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetWithdrawInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetWithdrawInfoResponse;
  static deserializeBinaryFromReader(message: GetWithdrawInfoResponse, reader: jspb.BinaryReader): GetWithdrawInfoResponse;
}

export namespace GetWithdrawInfoResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    methodType: WithdrawMethodType,
  }
}

export class MarkRefRelationRequest extends jspb.Message {
  getTransferId(): string;
  setTransferId(value: string): MarkRefRelationRequest;

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
    transferId: string,
    refId: string,
  }
}

export class MarkRefRelationResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): MarkRefRelationResponse;
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
    err?: ErrMsg.AsObject,
  }
}

export class SignAgainRequest extends jspb.Message {
  getType(): SignAgainType;
  setType(value: SignAgainType): SignAgainRequest;

  getUsrAddr(): string;
  setUsrAddr(value: string): SignAgainRequest;

  getChainId(): number;
  setChainId(value: number): SignAgainRequest;

  getRefundId(): string;
  setRefundId(value: string): SignAgainRequest;

  getSeqNum(): number;
  setSeqNum(value: number): SignAgainRequest;

  getNonce(): number;
  setNonce(value: number): SignAgainRequest;

  getTransferId(): string;
  setTransferId(value: string): SignAgainRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignAgainRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SignAgainRequest): SignAgainRequest.AsObject;
  static serializeBinaryToWriter(message: SignAgainRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignAgainRequest;
  static deserializeBinaryFromReader(message: SignAgainRequest, reader: jspb.BinaryReader): SignAgainRequest;
}

export namespace SignAgainRequest {
  export type AsObject = {
    type: SignAgainType,
    usrAddr: string,
    chainId: number,
    refundId: string,
    seqNum: number,
    nonce: number,
    transferId: string,
  }
}

export class SignAgainResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): SignAgainResponse;
  hasErr(): boolean;
  clearErr(): SignAgainResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignAgainResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SignAgainResponse): SignAgainResponse.AsObject;
  static serializeBinaryToWriter(message: SignAgainResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignAgainResponse;
  static deserializeBinaryFromReader(message: SignAgainResponse, reader: jspb.BinaryReader): SignAgainResponse;
}

export namespace SignAgainResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class GetTransferOnChainKeyRequest extends jspb.Message {
  getSrcTransferId(): string;
  setSrcTransferId(value: string): GetTransferOnChainKeyRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferOnChainKeyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferOnChainKeyRequest): GetTransferOnChainKeyRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransferOnChainKeyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferOnChainKeyRequest;
  static deserializeBinaryFromReader(message: GetTransferOnChainKeyRequest, reader: jspb.BinaryReader): GetTransferOnChainKeyRequest;
}

export namespace GetTransferOnChainKeyRequest {
  export type AsObject = {
    srcTransferId: string,
  }
}

export class GetTransferOnChainKeyResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTransferOnChainKeyResponse;
  hasErr(): boolean;
  clearErr(): GetTransferOnChainKeyResponse;

  getDstTransferId(): string;
  setDstTransferId(value: string): GetTransferOnChainKeyResponse;

  getMsgId(): string;
  setMsgId(value: string): GetTransferOnChainKeyResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferOnChainKeyResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferOnChainKeyResponse): GetTransferOnChainKeyResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransferOnChainKeyResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferOnChainKeyResponse;
  static deserializeBinaryFromReader(message: GetTransferOnChainKeyResponse, reader: jspb.BinaryReader): GetTransferOnChainKeyResponse;
}

export namespace GetTransferOnChainKeyResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    dstTransferId: string,
    msgId: string,
  }
}

export class GetTransferDataRequest extends jspb.Message {
  getTransferIdList(): Array<string>;
  setTransferIdList(value: Array<string>): GetTransferDataRequest;
  clearTransferIdList(): GetTransferDataRequest;
  addTransferId(value: string, index?: number): GetTransferDataRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferDataRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferDataRequest): GetTransferDataRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransferDataRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferDataRequest;
  static deserializeBinaryFromReader(message: GetTransferDataRequest, reader: jspb.BinaryReader): GetTransferDataRequest;
}

export namespace GetTransferDataRequest {
  export type AsObject = {
    transferIdList: Array<string>,
  }
}

export class GetTransferDataResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTransferDataResponse;
  hasErr(): boolean;
  clearErr(): GetTransferDataResponse;

  getDataMap(): jspb.Map<string, TransferData>;
  clearDataMap(): GetTransferDataResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferDataResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferDataResponse): GetTransferDataResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransferDataResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferDataResponse;
  static deserializeBinaryFromReader(message: GetTransferDataResponse, reader: jspb.BinaryReader): GetTransferDataResponse;
}

export namespace GetTransferDataResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    dataMap: Array<[string, TransferData.AsObject]>,
  }
}

export class TransferData extends jspb.Message {
  getVolume(): number;
  setVolume(value: number): TransferData;

  getBaseFee(): string;
  setBaseFee(value: string): TransferData;

  getPercFee(): string;
  setPercFee(value: string): TransferData;

  getStatus(): number;
  setStatus(value: number): TransferData;

  getDstAmt(): string;
  setDstAmt(value: string): TransferData;

  getDstTx(): string;
  setDstTx(value: string): TransferData;

  getRefundTx(): string;
  setRefundTx(value: string): TransferData;

  getDstChainId(): number;
  setDstChainId(value: number): TransferData;

  getDstTokenAddr(): string;
  setDstTokenAddr(value: string): TransferData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferData.AsObject;
  static toObject(includeInstance: boolean, msg: TransferData): TransferData.AsObject;
  static serializeBinaryToWriter(message: TransferData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferData;
  static deserializeBinaryFromReader(message: TransferData, reader: jspb.BinaryReader): TransferData;
}

export namespace TransferData {
  export type AsObject = {
    volume: number,
    baseFee: string,
    percFee: string,
    status: number,
    dstAmt: string,
    dstTx: string,
    refundTx: string,
    dstChainId: number,
    dstTokenAddr: string,
  }
}

export class GetLPOriginRequest extends jspb.Message {
  getUsrAddr(): string;
  setUsrAddr(value: string): GetLPOriginRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLPOriginRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetLPOriginRequest): GetLPOriginRequest.AsObject;
  static serializeBinaryToWriter(message: GetLPOriginRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLPOriginRequest;
  static deserializeBinaryFromReader(message: GetLPOriginRequest, reader: jspb.BinaryReader): GetLPOriginRequest;
}

export namespace GetLPOriginRequest {
  export type AsObject = {
    usrAddr: string,
  }
}

export class GetLPOriginResponse extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): GetLPOriginResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLPOriginResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetLPOriginResponse): GetLPOriginResponse.AsObject;
  static serializeBinaryToWriter(message: GetLPOriginResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLPOriginResponse;
  static deserializeBinaryFromReader(message: GetLPOriginResponse, reader: jspb.BinaryReader): GetLPOriginResponse;
}

export namespace GetLPOriginResponse {
  export type AsObject = {
    chainId: number,
  }
}

export class GetTokenBoundRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): GetTokenBoundRequest;

  getTokenAddr(): string;
  setTokenAddr(value: string): GetTokenBoundRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTokenBoundRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTokenBoundRequest): GetTokenBoundRequest.AsObject;
  static serializeBinaryToWriter(message: GetTokenBoundRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTokenBoundRequest;
  static deserializeBinaryFromReader(message: GetTokenBoundRequest, reader: jspb.BinaryReader): GetTokenBoundRequest;
}

export namespace GetTokenBoundRequest {
  export type AsObject = {
    chainId: number,
    tokenAddr: string,
  }
}

export class GetTokenBoundResponse extends jspb.Message {
  getValue(): string;
  setValue(value: string): GetTokenBoundResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTokenBoundResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTokenBoundResponse): GetTokenBoundResponse.AsObject;
  static serializeBinaryToWriter(message: GetTokenBoundResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTokenBoundResponse;
  static deserializeBinaryFromReader(message: GetTokenBoundResponse, reader: jspb.BinaryReader): GetTokenBoundResponse;
}

export namespace GetTokenBoundResponse {
  export type AsObject = {
    value: string,
  }
}

export class GetTokenUsdPriceRequest extends jspb.Message {
  getTokenSymbolsList(): Array<string>;
  setTokenSymbolsList(value: Array<string>): GetTokenUsdPriceRequest;
  clearTokenSymbolsList(): GetTokenUsdPriceRequest;
  addTokenSymbols(value: string, index?: number): GetTokenUsdPriceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTokenUsdPriceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTokenUsdPriceRequest): GetTokenUsdPriceRequest.AsObject;
  static serializeBinaryToWriter(message: GetTokenUsdPriceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTokenUsdPriceRequest;
  static deserializeBinaryFromReader(message: GetTokenUsdPriceRequest, reader: jspb.BinaryReader): GetTokenUsdPriceRequest;
}

export namespace GetTokenUsdPriceRequest {
  export type AsObject = {
    tokenSymbolsList: Array<string>,
  }
}

export class GetTokenUsdPriceResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTokenUsdPriceResponse;
  hasErr(): boolean;
  clearErr(): GetTokenUsdPriceResponse;

  getPriceMap(): jspb.Map<string, number>;
  clearPriceMap(): GetTokenUsdPriceResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTokenUsdPriceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTokenUsdPriceResponse): GetTokenUsdPriceResponse.AsObject;
  static serializeBinaryToWriter(message: GetTokenUsdPriceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTokenUsdPriceResponse;
  static deserializeBinaryFromReader(message: GetTokenUsdPriceResponse, reader: jspb.BinaryReader): GetTokenUsdPriceResponse;
}

export namespace GetTokenUsdPriceResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    priceMap: Array<[string, number]>,
  }
}

export class InitPegRefundRequest extends jspb.Message {
  getRefId(): Uint8Array | string;
  getRefId_asU8(): Uint8Array;
  getRefId_asB64(): string;
  setRefId(value: Uint8Array | string): InitPegRefundRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitPegRefundRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InitPegRefundRequest): InitPegRefundRequest.AsObject;
  static serializeBinaryToWriter(message: InitPegRefundRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitPegRefundRequest;
  static deserializeBinaryFromReader(message: InitPegRefundRequest, reader: jspb.BinaryReader): InitPegRefundRequest;
}

export namespace InitPegRefundRequest {
  export type AsObject = {
    refId: Uint8Array | string,
  }
}

export class InitPegRefundResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): InitPegRefundResponse;
  hasErr(): boolean;
  clearErr(): InitPegRefundResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitPegRefundResponse.AsObject;
  static toObject(includeInstance: boolean, msg: InitPegRefundResponse): InitPegRefundResponse.AsObject;
  static serializeBinaryToWriter(message: InitPegRefundResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitPegRefundResponse;
  static deserializeBinaryFromReader(message: InitPegRefundResponse, reader: jspb.BinaryReader): InitPegRefundResponse;
}

export namespace InitPegRefundResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class InitWithdrawRequest extends jspb.Message {
  getWithdrawReq(): Uint8Array | string;
  getWithdrawReq_asU8(): Uint8Array;
  getWithdrawReq_asB64(): string;
  setWithdrawReq(value: Uint8Array | string): InitWithdrawRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): InitWithdrawRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitWithdrawRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InitWithdrawRequest): InitWithdrawRequest.AsObject;
  static serializeBinaryToWriter(message: InitWithdrawRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitWithdrawRequest;
  static deserializeBinaryFromReader(message: InitWithdrawRequest, reader: jspb.BinaryReader): InitWithdrawRequest;
}

export namespace InitWithdrawRequest {
  export type AsObject = {
    withdrawReq: Uint8Array | string,
    sig: Uint8Array | string,
  }
}

export class InitWithdrawResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): InitWithdrawResponse;
  hasErr(): boolean;
  clearErr(): InitWithdrawResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitWithdrawResponse.AsObject;
  static toObject(includeInstance: boolean, msg: InitWithdrawResponse): InitWithdrawResponse.AsObject;
  static serializeBinaryToWriter(message: InitWithdrawResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitWithdrawResponse;
  static deserializeBinaryFromReader(message: InitWithdrawResponse, reader: jspb.BinaryReader): InitWithdrawResponse;
}

export namespace InitWithdrawResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class GetUsrBalanceRequest extends jspb.Message {
  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): GetUsrBalanceRequest;

  getSigAddr(): string;
  setSigAddr(value: string): GetUsrBalanceRequest;

  getUsrAddr(): string;
  setUsrAddr(value: string): GetUsrBalanceRequest;

  getChainId(): number;
  setChainId(value: number): GetUsrBalanceRequest;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): GetUsrBalanceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUsrBalanceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUsrBalanceRequest): GetUsrBalanceRequest.AsObject;
  static serializeBinaryToWriter(message: GetUsrBalanceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUsrBalanceRequest;
  static deserializeBinaryFromReader(message: GetUsrBalanceRequest, reader: jspb.BinaryReader): GetUsrBalanceRequest;
}

export namespace GetUsrBalanceRequest {
  export type AsObject = {
    sig: Uint8Array | string,
    sigAddr: string,
    usrAddr: string,
    chainId: number,
    tokenSymbol: string,
  }
}

export class GetUsrBalanceResponse extends jspb.Message {
  getBalance(): string;
  setBalance(value: string): GetUsrBalanceResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUsrBalanceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUsrBalanceResponse): GetUsrBalanceResponse.AsObject;
  static serializeBinaryToWriter(message: GetUsrBalanceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUsrBalanceResponse;
  static deserializeBinaryFromReader(message: GetUsrBalanceResponse, reader: jspb.BinaryReader): GetUsrBalanceResponse;
}

export namespace GetUsrBalanceResponse {
  export type AsObject = {
    balance: string,
  }
}

export class ClaimPegBridgeFeeRequest extends jspb.Message {
  getMsg(): sgn_pegbridge_v1_tx_pb.MsgClaimFee | undefined;
  setMsg(value?: sgn_pegbridge_v1_tx_pb.MsgClaimFee): ClaimPegBridgeFeeRequest;
  hasMsg(): boolean;
  clearMsg(): ClaimPegBridgeFeeRequest;

  getAmt(): string;
  setAmt(value: string): ClaimPegBridgeFeeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimPegBridgeFeeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimPegBridgeFeeRequest): ClaimPegBridgeFeeRequest.AsObject;
  static serializeBinaryToWriter(message: ClaimPegBridgeFeeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimPegBridgeFeeRequest;
  static deserializeBinaryFromReader(message: ClaimPegBridgeFeeRequest, reader: jspb.BinaryReader): ClaimPegBridgeFeeRequest;
}

export namespace ClaimPegBridgeFeeRequest {
  export type AsObject = {
    msg?: sgn_pegbridge_v1_tx_pb.MsgClaimFee.AsObject,
    amt: string,
  }
}

export class ClaimPegBridgeFeeResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): ClaimPegBridgeFeeResponse;
  hasErr(): boolean;
  clearErr(): ClaimPegBridgeFeeResponse;

  getResp(): sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse | undefined;
  setResp(value?: sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse): ClaimPegBridgeFeeResponse;
  hasResp(): boolean;
  clearResp(): ClaimPegBridgeFeeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimPegBridgeFeeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimPegBridgeFeeResponse): ClaimPegBridgeFeeResponse.AsObject;
  static serializeBinaryToWriter(message: ClaimPegBridgeFeeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimPegBridgeFeeResponse;
  static deserializeBinaryFromReader(message: ClaimPegBridgeFeeResponse, reader: jspb.BinaryReader): ClaimPegBridgeFeeResponse;
}

export namespace ClaimPegBridgeFeeResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    resp?: sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse.AsObject,
  }
}

export class GetCampaignScoresRequest extends jspb.Message {
  getDate(): number;
  setDate(value: number): GetCampaignScoresRequest;

  getBeginBlock(): number;
  setBeginBlock(value: number): GetCampaignScoresRequest;

  getEndBlock(): number;
  setEndBlock(value: number): GetCampaignScoresRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCampaignScoresRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCampaignScoresRequest): GetCampaignScoresRequest.AsObject;
  static serializeBinaryToWriter(message: GetCampaignScoresRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCampaignScoresRequest;
  static deserializeBinaryFromReader(message: GetCampaignScoresRequest, reader: jspb.BinaryReader): GetCampaignScoresRequest;
}

export namespace GetCampaignScoresRequest {
  export type AsObject = {
    date: number,
    beginBlock: number,
    endBlock: number,
  }
}

export class GetCampaignScoresResponse extends jspb.Message {
  getScoresList(): Array<CampaignScore>;
  setScoresList(value: Array<CampaignScore>): GetCampaignScoresResponse;
  clearScoresList(): GetCampaignScoresResponse;
  addScores(value?: CampaignScore, index?: number): CampaignScore;

  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetCampaignScoresResponse;
  hasErr(): boolean;
  clearErr(): GetCampaignScoresResponse;

  getBegin(): number;
  setBegin(value: number): GetCampaignScoresResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCampaignScoresResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCampaignScoresResponse): GetCampaignScoresResponse.AsObject;
  static serializeBinaryToWriter(message: GetCampaignScoresResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCampaignScoresResponse;
  static deserializeBinaryFromReader(message: GetCampaignScoresResponse, reader: jspb.BinaryReader): GetCampaignScoresResponse;
}

export namespace GetCampaignScoresResponse {
  export type AsObject = {
    scoresList: Array<CampaignScore.AsObject>,
    err?: ErrMsg.AsObject,
    begin: number,
  }
}

export class CampaignScore extends jspb.Message {
  getUsrAddr(): string;
  setUsrAddr(value: string): CampaignScore;

  getScore(): number;
  setScore(value: number): CampaignScore;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CampaignScore.AsObject;
  static toObject(includeInstance: boolean, msg: CampaignScore): CampaignScore.AsObject;
  static serializeBinaryToWriter(message: CampaignScore, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CampaignScore;
  static deserializeBinaryFromReader(message: CampaignScore, reader: jspb.BinaryReader): CampaignScore;
}

export namespace CampaignScore {
  export type AsObject = {
    usrAddr: string,
    score: number,
  }
}

export class QueryLiquidityStatusResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): QueryLiquidityStatusResponse;
  hasErr(): boolean;
  clearErr(): QueryLiquidityStatusResponse;

  getStatus(): sgn_cbridge_v1_query_pb.WithdrawStatus;
  setStatus(value: sgn_cbridge_v1_query_pb.WithdrawStatus): QueryLiquidityStatusResponse;

  getWdOnchain(): Uint8Array | string;
  getWdOnchain_asU8(): Uint8Array;
  getWdOnchain_asB64(): string;
  setWdOnchain(value: Uint8Array | string): QueryLiquidityStatusResponse;

  getSortedSigsList(): Array<Uint8Array | string>;
  setSortedSigsList(value: Array<Uint8Array | string>): QueryLiquidityStatusResponse;
  clearSortedSigsList(): QueryLiquidityStatusResponse;
  addSortedSigs(value: Uint8Array | string, index?: number): QueryLiquidityStatusResponse;

  getSignersList(): Array<Uint8Array | string>;
  setSignersList(value: Array<Uint8Array | string>): QueryLiquidityStatusResponse;
  clearSignersList(): QueryLiquidityStatusResponse;
  addSigners(value: Uint8Array | string, index?: number): QueryLiquidityStatusResponse;

  getPowersList(): Array<Uint8Array | string>;
  setPowersList(value: Array<Uint8Array | string>): QueryLiquidityStatusResponse;
  clearPowersList(): QueryLiquidityStatusResponse;
  addPowers(value: Uint8Array | string, index?: number): QueryLiquidityStatusResponse;

  getBlockTxLink(): string;
  setBlockTxLink(value: string): QueryLiquidityStatusResponse;

  getBlockDelay(): number;
  setBlockDelay(value: number): QueryLiquidityStatusResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryLiquidityStatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryLiquidityStatusResponse): QueryLiquidityStatusResponse.AsObject;
  static serializeBinaryToWriter(message: QueryLiquidityStatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryLiquidityStatusResponse;
  static deserializeBinaryFromReader(message: QueryLiquidityStatusResponse, reader: jspb.BinaryReader): QueryLiquidityStatusResponse;
}

export namespace QueryLiquidityStatusResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    status: sgn_cbridge_v1_query_pb.WithdrawStatus,
    wdOnchain: Uint8Array | string,
    sortedSigsList: Array<Uint8Array | string>,
    signersList: Array<Uint8Array | string>,
    powersList: Array<Uint8Array | string>,
    blockTxLink: string,
    blockDelay: number,
  }
}

export class Chain extends jspb.Message {
  getId(): number;
  setId(value: number): Chain;

  getName(): string;
  setName(value: string): Chain;

  getIcon(): string;
  setIcon(value: string): Chain;

  getBlockDelay(): number;
  setBlockDelay(value: number): Chain;

  getGasTokenSymbol(): string;
  setGasTokenSymbol(value: string): Chain;

  getExploreUrl(): string;
  setExploreUrl(value: string): Chain;

  getContractAddr(): string;
  setContractAddr(value: string): Chain;

  getDropGasAmt(): string;
  setDropGasAmt(value: string): Chain;

  getDropGasCostAmt(): string;
  setDropGasCostAmt(value: string): Chain;

  getDropGasBalanceAlert(): string;
  setDropGasBalanceAlert(value: string): Chain;

  getSuggestedGasCost(): number;
  setSuggestedGasCost(value: number): Chain;

  getFlatUsdFee(): number;
  setFlatUsdFee(value: number): Chain;

  getFarmingRewardContractAddr(): string;
  setFarmingRewardContractAddr(value: string): Chain;

  getTransferAgentContractAddr(): string;
  setTransferAgentContractAddr(value: string): Chain;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Chain.AsObject;
  static toObject(includeInstance: boolean, msg: Chain): Chain.AsObject;
  static serializeBinaryToWriter(message: Chain, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Chain;
  static deserializeBinaryFromReader(message: Chain, reader: jspb.BinaryReader): Chain;
}

export namespace Chain {
  export type AsObject = {
    id: number,
    name: string,
    icon: string,
    blockDelay: number,
    gasTokenSymbol: string,
    exploreUrl: string,
    contractAddr: string,
    dropGasAmt: string,
    dropGasCostAmt: string,
    dropGasBalanceAlert: string,
    suggestedGasCost: number,
    flatUsdFee: number,
    farmingRewardContractAddr: string,
    transferAgentContractAddr: string,
  }
}

export class RfqChainToken extends jspb.Message {
  getTokeninfo(): ChainToken | undefined;
  setTokeninfo(value?: ChainToken): RfqChainToken;
  hasTokeninfo(): boolean;
  clearTokeninfo(): RfqChainToken;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RfqChainToken.AsObject;
  static toObject(includeInstance: boolean, msg: RfqChainToken): RfqChainToken.AsObject;
  static serializeBinaryToWriter(message: RfqChainToken, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RfqChainToken;
  static deserializeBinaryFromReader(message: RfqChainToken, reader: jspb.BinaryReader): RfqChainToken;
}

export namespace RfqChainToken {
  export type AsObject = {
    tokeninfo?: ChainToken.AsObject,
  }
}

export class ChainToken extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): ChainToken;

  getSymbol(): string;
  setSymbol(value: string): ChainToken;

  getAddress(): string;
  setAddress(value: string): ChainToken;

  getDecimals(): number;
  setDecimals(value: number): ChainToken;

  getName(): string;
  setName(value: string): ChainToken;

  getLogoUri(): string;
  setLogoUri(value: string): ChainToken;

  getDisabled(): boolean;
  setDisabled(value: boolean): ChainToken;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainToken.AsObject;
  static toObject(includeInstance: boolean, msg: ChainToken): ChainToken.AsObject;
  static serializeBinaryToWriter(message: ChainToken, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainToken;
  static deserializeBinaryFromReader(message: ChainToken, reader: jspb.BinaryReader): ChainToken;
}

export namespace ChainToken {
  export type AsObject = {
    chainId: number,
    symbol: string,
    address: string,
    decimals: number,
    name: string,
    logoUri: string,
    disabled: boolean,
  }
}

export class ChainTokenInfo extends jspb.Message {
  getTokenList(): Array<TokenInfo>;
  setTokenList(value: Array<TokenInfo>): ChainTokenInfo;
  clearTokenList(): ChainTokenInfo;
  addToken(value?: TokenInfo, index?: number): TokenInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainTokenInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ChainTokenInfo): ChainTokenInfo.AsObject;
  static serializeBinaryToWriter(message: ChainTokenInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainTokenInfo;
  static deserializeBinaryFromReader(message: ChainTokenInfo, reader: jspb.BinaryReader): ChainTokenInfo;
}

export namespace ChainTokenInfo {
  export type AsObject = {
    tokenList: Array<TokenInfo.AsObject>,
  }
}

export class TokenInfo extends jspb.Message {
  getToken(): sgn_cbridge_v1_query_pb.Token | undefined;
  setToken(value?: sgn_cbridge_v1_query_pb.Token): TokenInfo;
  hasToken(): boolean;
  clearToken(): TokenInfo;

  getName(): string;
  setName(value: string): TokenInfo;

  getIcon(): string;
  setIcon(value: string): TokenInfo;

  getInboundLmt(): string;
  setInboundLmt(value: string): TokenInfo;

  getInboundEpochCap(): string;
  setInboundEpochCap(value: string): TokenInfo;

  getTransferDisabled(): boolean;
  setTransferDisabled(value: boolean): TokenInfo;

  getLiqAddDisabled(): boolean;
  setLiqAddDisabled(value: boolean): TokenInfo;

  getLiqRmDisabled(): boolean;
  setLiqRmDisabled(value: boolean): TokenInfo;

  getLiqAggRmSrcDisabled(): boolean;
  setLiqAggRmSrcDisabled(value: boolean): TokenInfo;

  getDelayThreshold(): string;
  setDelayThreshold(value: string): TokenInfo;

  getDelayPeriod(): number;
  setDelayPeriod(value: number): TokenInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TokenInfo.AsObject;
  static toObject(includeInstance: boolean, msg: TokenInfo): TokenInfo.AsObject;
  static serializeBinaryToWriter(message: TokenInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TokenInfo;
  static deserializeBinaryFromReader(message: TokenInfo, reader: jspb.BinaryReader): TokenInfo;
}

export namespace TokenInfo {
  export type AsObject = {
    token?: sgn_cbridge_v1_query_pb.Token.AsObject,
    name: string,
    icon: string,
    inboundLmt: string,
    inboundEpochCap: string,
    transferDisabled: boolean,
    liqAddDisabled: boolean,
    liqRmDisabled: boolean,
    liqAggRmSrcDisabled: boolean,
    delayThreshold: string,
    delayPeriod: number,
  }
}

export class TransferInfo extends jspb.Message {
  getChain(): Chain | undefined;
  setChain(value?: Chain): TransferInfo;
  hasChain(): boolean;
  clearChain(): TransferInfo;

  getToken(): sgn_cbridge_v1_query_pb.Token | undefined;
  setToken(value?: sgn_cbridge_v1_query_pb.Token): TransferInfo;
  hasToken(): boolean;
  clearToken(): TransferInfo;

  getAmount(): string;
  setAmount(value: string): TransferInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferInfo.AsObject;
  static toObject(includeInstance: boolean, msg: TransferInfo): TransferInfo.AsObject;
  static serializeBinaryToWriter(message: TransferInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferInfo;
  static deserializeBinaryFromReader(message: TransferInfo, reader: jspb.BinaryReader): TransferInfo;
}

export namespace TransferInfo {
  export type AsObject = {
    chain?: Chain.AsObject,
    token?: sgn_cbridge_v1_query_pb.Token.AsObject,
    amount: string,
  }
}

export class GetTransferRelayInfoRequest extends jspb.Message {
  getTransferId(): string;
  setTransferId(value: string): GetTransferRelayInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferRelayInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferRelayInfoRequest): GetTransferRelayInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransferRelayInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferRelayInfoRequest;
  static deserializeBinaryFromReader(message: GetTransferRelayInfoRequest, reader: jspb.BinaryReader): GetTransferRelayInfoRequest;
}

export namespace GetTransferRelayInfoRequest {
  export type AsObject = {
    transferId: string,
  }
}

export class GetTransferRelayInfoResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTransferRelayInfoResponse;
  hasErr(): boolean;
  clearErr(): GetTransferRelayInfoResponse;

  getRequest(): Uint8Array | string;
  getRequest_asU8(): Uint8Array;
  getRequest_asB64(): string;
  setRequest(value: Uint8Array | string): GetTransferRelayInfoResponse;

  getType(): BridgeType;
  setType(value: BridgeType): GetTransferRelayInfoResponse;

  getSortedSigsList(): Array<Uint8Array | string>;
  setSortedSigsList(value: Array<Uint8Array | string>): GetTransferRelayInfoResponse;
  clearSortedSigsList(): GetTransferRelayInfoResponse;
  addSortedSigs(value: Uint8Array | string, index?: number): GetTransferRelayInfoResponse;

  getSignersList(): Array<Uint8Array | string>;
  setSignersList(value: Array<Uint8Array | string>): GetTransferRelayInfoResponse;
  clearSignersList(): GetTransferRelayInfoResponse;
  addSigners(value: Uint8Array | string, index?: number): GetTransferRelayInfoResponse;

  getPowersList(): Array<Uint8Array | string>;
  setPowersList(value: Array<Uint8Array | string>): GetTransferRelayInfoResponse;
  clearPowersList(): GetTransferRelayInfoResponse;
  addPowers(value: Uint8Array | string, index?: number): GetTransferRelayInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferRelayInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferRelayInfoResponse): GetTransferRelayInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransferRelayInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferRelayInfoResponse;
  static deserializeBinaryFromReader(message: GetTransferRelayInfoResponse, reader: jspb.BinaryReader): GetTransferRelayInfoResponse;
}

export namespace GetTransferRelayInfoResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    request: Uint8Array | string,
    type: BridgeType,
    sortedSigsList: Array<Uint8Array | string>,
    signersList: Array<Uint8Array | string>,
    powersList: Array<Uint8Array | string>,
  }
}

export class GetTransferStatusRequest extends jspb.Message {
  getTransferId(): string;
  setTransferId(value: string): GetTransferStatusRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferStatusRequest): GetTransferStatusRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransferStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferStatusRequest;
  static deserializeBinaryFromReader(message: GetTransferStatusRequest, reader: jspb.BinaryReader): GetTransferStatusRequest;
}

export namespace GetTransferStatusRequest {
  export type AsObject = {
    transferId: string,
  }
}

export class GetTransferStatusResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTransferStatusResponse;
  hasErr(): boolean;
  clearErr(): GetTransferStatusResponse;

  getStatus(): sgn_cbridge_v1_query_pb.TransferHistoryStatus;
  setStatus(value: sgn_cbridge_v1_query_pb.TransferHistoryStatus): GetTransferStatusResponse;

  getWdOnchain(): Uint8Array | string;
  getWdOnchain_asU8(): Uint8Array;
  getWdOnchain_asB64(): string;
  setWdOnchain(value: Uint8Array | string): GetTransferStatusResponse;

  getSortedSigsList(): Array<Uint8Array | string>;
  setSortedSigsList(value: Array<Uint8Array | string>): GetTransferStatusResponse;
  clearSortedSigsList(): GetTransferStatusResponse;
  addSortedSigs(value: Uint8Array | string, index?: number): GetTransferStatusResponse;

  getSignersList(): Array<Uint8Array | string>;
  setSignersList(value: Array<Uint8Array | string>): GetTransferStatusResponse;
  clearSignersList(): GetTransferStatusResponse;
  addSigners(value: Uint8Array | string, index?: number): GetTransferStatusResponse;

  getPowersList(): Array<Uint8Array | string>;
  setPowersList(value: Array<Uint8Array | string>): GetTransferStatusResponse;
  clearPowersList(): GetTransferStatusResponse;
  addPowers(value: Uint8Array | string, index?: number): GetTransferStatusResponse;

  getRefundReason(): sgn_cbridge_v1_cbridge_pb.XferStatus;
  setRefundReason(value: sgn_cbridge_v1_cbridge_pb.XferStatus): GetTransferStatusResponse;

  getBlockDelay(): number;
  setBlockDelay(value: number): GetTransferStatusResponse;

  getSrcBlockTxLink(): string;
  setSrcBlockTxLink(value: string): GetTransferStatusResponse;

  getDstBlockTxLink(): string;
  setDstBlockTxLink(value: string): GetTransferStatusResponse;

  getBridgeType(): BridgeType;
  setBridgeType(value: BridgeType): GetTransferStatusResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferStatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferStatusResponse): GetTransferStatusResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransferStatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferStatusResponse;
  static deserializeBinaryFromReader(message: GetTransferStatusResponse, reader: jspb.BinaryReader): GetTransferStatusResponse;
}

export namespace GetTransferStatusResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    status: sgn_cbridge_v1_query_pb.TransferHistoryStatus,
    wdOnchain: Uint8Array | string,
    sortedSigsList: Array<Uint8Array | string>,
    signersList: Array<Uint8Array | string>,
    powersList: Array<Uint8Array | string>,
    refundReason: sgn_cbridge_v1_cbridge_pb.XferStatus,
    blockDelay: number,
    srcBlockTxLink: string,
    dstBlockTxLink: string,
    bridgeType: BridgeType,
  }
}

export class GetTransferConfigsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferConfigsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferConfigsRequest): GetTransferConfigsRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransferConfigsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferConfigsRequest;
  static deserializeBinaryFromReader(message: GetTransferConfigsRequest, reader: jspb.BinaryReader): GetTransferConfigsRequest;
}

export namespace GetTransferConfigsRequest {
  export type AsObject = {
  }
}

export class GetTransferConfigsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTransferConfigsResponse;
  hasErr(): boolean;
  clearErr(): GetTransferConfigsResponse;

  getChainsList(): Array<Chain>;
  setChainsList(value: Array<Chain>): GetTransferConfigsResponse;
  clearChainsList(): GetTransferConfigsResponse;
  addChains(value?: Chain, index?: number): Chain;

  getChainTokenMap(): jspb.Map<number, ChainTokenInfo>;
  clearChainTokenMap(): GetTransferConfigsResponse;

  getFarmingRewardContractAddr(): string;
  setFarmingRewardContractAddr(value: string): GetTransferConfigsResponse;

  getPeggedPairConfigsList(): Array<PeggedPairConfig>;
  setPeggedPairConfigsList(value: Array<PeggedPairConfig>): GetTransferConfigsResponse;
  clearPeggedPairConfigsList(): GetTransferConfigsResponse;
  addPeggedPairConfigs(value?: PeggedPairConfig, index?: number): PeggedPairConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferConfigsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferConfigsResponse): GetTransferConfigsResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransferConfigsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferConfigsResponse;
  static deserializeBinaryFromReader(message: GetTransferConfigsResponse, reader: jspb.BinaryReader): GetTransferConfigsResponse;
}

export namespace GetTransferConfigsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    chainsList: Array<Chain.AsObject>,
    chainTokenMap: Array<[number, ChainTokenInfo.AsObject]>,
    farmingRewardContractAddr: string,
    peggedPairConfigsList: Array<PeggedPairConfig.AsObject>,
  }
}

export class GetRfqConfigsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRfqConfigsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetRfqConfigsRequest): GetRfqConfigsRequest.AsObject;
  static serializeBinaryToWriter(message: GetRfqConfigsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRfqConfigsRequest;
  static deserializeBinaryFromReader(message: GetRfqConfigsRequest, reader: jspb.BinaryReader): GetRfqConfigsRequest;
}

export namespace GetRfqConfigsRequest {
  export type AsObject = {
  }
}

export class GetRfqConfigsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetRfqConfigsResponse;
  hasErr(): boolean;
  clearErr(): GetRfqConfigsResponse;

  getChaintokensList(): Array<RfqChainToken>;
  setChaintokensList(value: Array<RfqChainToken>): GetRfqConfigsResponse;
  clearChaintokensList(): GetRfqConfigsResponse;
  addChaintokens(value?: RfqChainToken, index?: number): RfqChainToken;

  getRfqContractAddressesMap(): jspb.Map<number, string>;
  clearRfqContractAddressesMap(): GetRfqConfigsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRfqConfigsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetRfqConfigsResponse): GetRfqConfigsResponse.AsObject;
  static serializeBinaryToWriter(message: GetRfqConfigsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRfqConfigsResponse;
  static deserializeBinaryFromReader(message: GetRfqConfigsResponse, reader: jspb.BinaryReader): GetRfqConfigsResponse;
}

export namespace GetRfqConfigsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    chaintokensList: Array<RfqChainToken.AsObject>,
    rfqContractAddressesMap: Array<[number, string]>,
  }
}

export class RfqPrice extends jspb.Message {
  getSendToken(): ChainToken | undefined;
  setSendToken(value?: ChainToken): RfqPrice;
  hasSendToken(): boolean;
  clearSendToken(): RfqPrice;

  getSendAmount(): string;
  setSendAmount(value: string): RfqPrice;

  getReceiveToken(): ChainToken | undefined;
  setReceiveToken(value?: ChainToken): RfqPrice;
  hasReceiveToken(): boolean;
  clearReceiveToken(): RfqPrice;

  getReceiveAmount(): string;
  setReceiveAmount(value: string): RfqPrice;

  getValidThru(): number;
  setValidThru(value: number): RfqPrice;

  getMmAddr(): string;
  setMmAddr(value: string): RfqPrice;

  getSig(): string;
  setSig(value: string): RfqPrice;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RfqPrice.AsObject;
  static toObject(includeInstance: boolean, msg: RfqPrice): RfqPrice.AsObject;
  static serializeBinaryToWriter(message: RfqPrice, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RfqPrice;
  static deserializeBinaryFromReader(message: RfqPrice, reader: jspb.BinaryReader): RfqPrice;
}

export namespace RfqPrice {
  export type AsObject = {
    sendToken?: ChainToken.AsObject,
    sendAmount: string,
    receiveToken?: ChainToken.AsObject,
    receiveAmount: string,
    validThru: number,
    mmAddr: string,
    sig: string,
  }
}

export class PeggedPairConfig extends jspb.Message {
  getOrgChainId(): number;
  setOrgChainId(value: number): PeggedPairConfig;

  getOrgToken(): TokenInfo | undefined;
  setOrgToken(value?: TokenInfo): PeggedPairConfig;
  hasOrgToken(): boolean;
  clearOrgToken(): PeggedPairConfig;

  getPeggedChainId(): number;
  setPeggedChainId(value: number): PeggedPairConfig;

  getPeggedToken(): TokenInfo | undefined;
  setPeggedToken(value?: TokenInfo): PeggedPairConfig;
  hasPeggedToken(): boolean;
  clearPeggedToken(): PeggedPairConfig;

  getPeggedDepositContractAddr(): string;
  setPeggedDepositContractAddr(value: string): PeggedPairConfig;

  getPeggedBurnContractAddr(): string;
  setPeggedBurnContractAddr(value: string): PeggedPairConfig;

  getCanonicalTokenContractAddr(): string;
  setCanonicalTokenContractAddr(value: string): PeggedPairConfig;

  getVaultVersion(): number;
  setVaultVersion(value: number): PeggedPairConfig;

  getBridgeVersion(): number;
  setBridgeVersion(value: number): PeggedPairConfig;

  getMigrationPegBurnContractAddr(): string;
  setMigrationPegBurnContractAddr(value: string): PeggedPairConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PeggedPairConfig.AsObject;
  static toObject(includeInstance: boolean, msg: PeggedPairConfig): PeggedPairConfig.AsObject;
  static serializeBinaryToWriter(message: PeggedPairConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PeggedPairConfig;
  static deserializeBinaryFromReader(message: PeggedPairConfig, reader: jspb.BinaryReader): PeggedPairConfig;
}

export namespace PeggedPairConfig {
  export type AsObject = {
    orgChainId: number,
    orgToken?: TokenInfo.AsObject,
    peggedChainId: number,
    peggedToken?: TokenInfo.AsObject,
    peggedDepositContractAddr: string,
    peggedBurnContractAddr: string,
    canonicalTokenContractAddr: string,
    vaultVersion: number,
    bridgeVersion: number,
    migrationPegBurnContractAddr: string,
  }
}

export class RfqMarkRequest extends jspb.Message {
  getTransferId(): string;
  setTransferId(value: string): RfqMarkRequest;

  getSrcTxHash(): string;
  setSrcTxHash(value: string): RfqMarkRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RfqMarkRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RfqMarkRequest): RfqMarkRequest.AsObject;
  static serializeBinaryToWriter(message: RfqMarkRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RfqMarkRequest;
  static deserializeBinaryFromReader(message: RfqMarkRequest, reader: jspb.BinaryReader): RfqMarkRequest;
}

export namespace RfqMarkRequest {
  export type AsObject = {
    transferId: string,
    srcTxHash: string,
  }
}

export class RfqMarkResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): RfqMarkResponse;
  hasErr(): boolean;
  clearErr(): RfqMarkResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RfqMarkResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RfqMarkResponse): RfqMarkResponse.AsObject;
  static serializeBinaryToWriter(message: RfqMarkResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RfqMarkResponse;
  static deserializeBinaryFromReader(message: RfqMarkResponse, reader: jspb.BinaryReader): RfqMarkResponse;
}

export namespace RfqMarkResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class GetTokenInfoRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): GetTokenInfoRequest;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): GetTokenInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTokenInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTokenInfoRequest): GetTokenInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetTokenInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTokenInfoRequest;
  static deserializeBinaryFromReader(message: GetTokenInfoRequest, reader: jspb.BinaryReader): GetTokenInfoRequest;
}

export namespace GetTokenInfoRequest {
  export type AsObject = {
    chainId: number,
    tokenSymbol: string,
  }
}

export class GetTokenInfoResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTokenInfoResponse;
  hasErr(): boolean;
  clearErr(): GetTokenInfoResponse;

  getTokenInfo(): TokenInfo | undefined;
  setTokenInfo(value?: TokenInfo): GetTokenInfoResponse;
  hasTokenInfo(): boolean;
  clearTokenInfo(): GetTokenInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTokenInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTokenInfoResponse): GetTokenInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetTokenInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTokenInfoResponse;
  static deserializeBinaryFromReader(message: GetTokenInfoResponse, reader: jspb.BinaryReader): GetTokenInfoResponse;
}

export namespace GetTokenInfoResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    tokenInfo?: TokenInfo.AsObject,
  }
}

export class EstimateAmtRequest extends jspb.Message {
  getSrcChainId(): number;
  setSrcChainId(value: number): EstimateAmtRequest;

  getDstChainId(): number;
  setDstChainId(value: number): EstimateAmtRequest;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): EstimateAmtRequest;

  getAmt(): string;
  setAmt(value: string): EstimateAmtRequest;

  getUsrAddr(): string;
  setUsrAddr(value: string): EstimateAmtRequest;

  getSlippageTolerance(): number;
  setSlippageTolerance(value: number): EstimateAmtRequest;

  getIsPegged(): boolean;
  setIsPegged(value: boolean): EstimateAmtRequest;

  getNeedDetailInfo(): boolean;
  setNeedDetailInfo(value: boolean): EstimateAmtRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EstimateAmtRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EstimateAmtRequest): EstimateAmtRequest.AsObject;
  static serializeBinaryToWriter(message: EstimateAmtRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EstimateAmtRequest;
  static deserializeBinaryFromReader(message: EstimateAmtRequest, reader: jspb.BinaryReader): EstimateAmtRequest;
}

export namespace EstimateAmtRequest {
  export type AsObject = {
    srcChainId: number,
    dstChainId: number,
    tokenSymbol: string,
    amt: string,
    usrAddr: string,
    slippageTolerance: number,
    isPegged: boolean,
    needDetailInfo: boolean,
  }
}

export class EstimateAmtResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): EstimateAmtResponse;
  hasErr(): boolean;
  clearErr(): EstimateAmtResponse;

  getEqValueTokenAmt(): string;
  setEqValueTokenAmt(value: string): EstimateAmtResponse;

  getBridgeRate(): number;
  setBridgeRate(value: number): EstimateAmtResponse;

  getPercFee(): string;
  setPercFee(value: string): EstimateAmtResponse;

  getBaseFee(): string;
  setBaseFee(value: string): EstimateAmtResponse;

  getSlippageTolerance(): number;
  setSlippageTolerance(value: number): EstimateAmtResponse;

  getMaxSlippage(): number;
  setMaxSlippage(value: number): EstimateAmtResponse;

  getEstimatedReceiveAmt(): string;
  setEstimatedReceiveAmt(value: string): EstimateAmtResponse;

  getDropGasAmt(): string;
  setDropGasAmt(value: string): EstimateAmtResponse;

  getOpFeeRebate(): number;
  setOpFeeRebate(value: number): EstimateAmtResponse;

  getOpFeeRebatePortion(): number;
  setOpFeeRebatePortion(value: number): EstimateAmtResponse;

  getOpFeeRebateEndTime(): number;
  setOpFeeRebateEndTime(value: number): EstimateAmtResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EstimateAmtResponse.AsObject;
  static toObject(includeInstance: boolean, msg: EstimateAmtResponse): EstimateAmtResponse.AsObject;
  static serializeBinaryToWriter(message: EstimateAmtResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EstimateAmtResponse;
  static deserializeBinaryFromReader(message: EstimateAmtResponse, reader: jspb.BinaryReader): EstimateAmtResponse;
}

export namespace EstimateAmtResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    eqValueTokenAmt: string,
    bridgeRate: number,
    percFee: string,
    baseFee: string,
    slippageTolerance: number,
    maxSlippage: number,
    estimatedReceiveAmt: string,
    dropGasAmt: string,
    opFeeRebate: number,
    opFeeRebatePortion: number,
    opFeeRebateEndTime: number,
  }
}

export class WithdrawInfo extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): WithdrawInfo;

  getAmount(): string;
  setAmount(value: string): WithdrawInfo;

  getSlippageTolerance(): number;
  setSlippageTolerance(value: number): WithdrawInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawInfo.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawInfo): WithdrawInfo.AsObject;
  static serializeBinaryToWriter(message: WithdrawInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawInfo;
  static deserializeBinaryFromReader(message: WithdrawInfo, reader: jspb.BinaryReader): WithdrawInfo;
}

export namespace WithdrawInfo {
  export type AsObject = {
    chainId: number,
    amount: string,
    slippageTolerance: number,
  }
}

export class EstimateWithdrawAmtRequest extends jspb.Message {
  getSrcWithdrawsList(): Array<WithdrawInfo>;
  setSrcWithdrawsList(value: Array<WithdrawInfo>): EstimateWithdrawAmtRequest;
  clearSrcWithdrawsList(): EstimateWithdrawAmtRequest;
  addSrcWithdraws(value?: WithdrawInfo, index?: number): WithdrawInfo;

  getDstChainId(): number;
  setDstChainId(value: number): EstimateWithdrawAmtRequest;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): EstimateWithdrawAmtRequest;

  getUsrAddr(): string;
  setUsrAddr(value: string): EstimateWithdrawAmtRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EstimateWithdrawAmtRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EstimateWithdrawAmtRequest): EstimateWithdrawAmtRequest.AsObject;
  static serializeBinaryToWriter(message: EstimateWithdrawAmtRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EstimateWithdrawAmtRequest;
  static deserializeBinaryFromReader(message: EstimateWithdrawAmtRequest, reader: jspb.BinaryReader): EstimateWithdrawAmtRequest;
}

export namespace EstimateWithdrawAmtRequest {
  export type AsObject = {
    srcWithdrawsList: Array<WithdrawInfo.AsObject>,
    dstChainId: number,
    tokenSymbol: string,
    usrAddr: string,
  }
}

export class EstimateWithdrawAmtResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): EstimateWithdrawAmtResponse;
  hasErr(): boolean;
  clearErr(): EstimateWithdrawAmtResponse;

  getReqAmtMap(): jspb.Map<number, EstimateWithdrawAmt>;
  clearReqAmtMap(): EstimateWithdrawAmtResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EstimateWithdrawAmtResponse.AsObject;
  static toObject(includeInstance: boolean, msg: EstimateWithdrawAmtResponse): EstimateWithdrawAmtResponse.AsObject;
  static serializeBinaryToWriter(message: EstimateWithdrawAmtResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EstimateWithdrawAmtResponse;
  static deserializeBinaryFromReader(message: EstimateWithdrawAmtResponse, reader: jspb.BinaryReader): EstimateWithdrawAmtResponse;
}

export namespace EstimateWithdrawAmtResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    reqAmtMap: Array<[number, EstimateWithdrawAmt.AsObject]>,
  }
}

export class EstimateWithdrawAmt extends jspb.Message {
  getEqValueTokenAmt(): string;
  setEqValueTokenAmt(value: string): EstimateWithdrawAmt;

  getBridgeRate(): number;
  setBridgeRate(value: number): EstimateWithdrawAmt;

  getPercFee(): string;
  setPercFee(value: string): EstimateWithdrawAmt;

  getBaseFee(): string;
  setBaseFee(value: string): EstimateWithdrawAmt;

  getSlippageTolerance(): number;
  setSlippageTolerance(value: number): EstimateWithdrawAmt;

  getMaxSlippage(): number;
  setMaxSlippage(value: number): EstimateWithdrawAmt;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EstimateWithdrawAmt.AsObject;
  static toObject(includeInstance: boolean, msg: EstimateWithdrawAmt): EstimateWithdrawAmt.AsObject;
  static serializeBinaryToWriter(message: EstimateWithdrawAmt, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EstimateWithdrawAmt;
  static deserializeBinaryFromReader(message: EstimateWithdrawAmt, reader: jspb.BinaryReader): EstimateWithdrawAmt;
}

export namespace EstimateWithdrawAmt {
  export type AsObject = {
    eqValueTokenAmt: string,
    bridgeRate: number,
    percFee: string,
    baseFee: string,
    slippageTolerance: number,
    maxSlippage: number,
  }
}

export class GetLPInfoListRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): GetLPInfoListRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLPInfoListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetLPInfoListRequest): GetLPInfoListRequest.AsObject;
  static serializeBinaryToWriter(message: GetLPInfoListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLPInfoListRequest;
  static deserializeBinaryFromReader(message: GetLPInfoListRequest, reader: jspb.BinaryReader): GetLPInfoListRequest;
}

export namespace GetLPInfoListRequest {
  export type AsObject = {
    addr: string,
  }
}

export class LPInfo extends jspb.Message {
  getChain(): Chain | undefined;
  setChain(value?: Chain): LPInfo;
  hasChain(): boolean;
  clearChain(): LPInfo;

  getToken(): TokenInfo | undefined;
  setToken(value?: TokenInfo): LPInfo;
  hasToken(): boolean;
  clearToken(): LPInfo;

  getLiquidity(): number;
  setLiquidity(value: number): LPInfo;

  getLiquidityAmt(): string;
  setLiquidityAmt(value: string): LPInfo;

  getHasFarmingSessions(): boolean;
  setHasFarmingSessions(value: boolean): LPInfo;

  getLpFeeEarning(): number;
  setLpFeeEarning(value: number): LPInfo;

  getFarmingRewardEarning(): number;
  setFarmingRewardEarning(value: number): LPInfo;

  getVolume24h(): number;
  setVolume24h(value: number): LPInfo;

  getTotalLiquidity(): number;
  setTotalLiquidity(value: number): LPInfo;

  getTotalLiquidityAmt(): string;
  setTotalLiquidityAmt(value: string): LPInfo;

  getLpFeeEarningApy(): number;
  setLpFeeEarningApy(value: number): LPInfo;

  getFarmingApy(): number;
  setFarmingApy(value: number): LPInfo;

  getFarmingSessionTokensList(): Array<TokenInfo>;
  setFarmingSessionTokensList(value: Array<TokenInfo>): LPInfo;
  clearFarmingSessionTokensList(): LPInfo;
  addFarmingSessionTokens(value?: TokenInfo, index?: number): TokenInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LPInfo.AsObject;
  static toObject(includeInstance: boolean, msg: LPInfo): LPInfo.AsObject;
  static serializeBinaryToWriter(message: LPInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LPInfo;
  static deserializeBinaryFromReader(message: LPInfo, reader: jspb.BinaryReader): LPInfo;
}

export namespace LPInfo {
  export type AsObject = {
    chain?: Chain.AsObject,
    token?: TokenInfo.AsObject,
    liquidity: number,
    liquidityAmt: string,
    hasFarmingSessions: boolean,
    lpFeeEarning: number,
    farmingRewardEarning: number,
    volume24h: number,
    totalLiquidity: number,
    totalLiquidityAmt: string,
    lpFeeEarningApy: number,
    farmingApy: number,
    farmingSessionTokensList: Array<TokenInfo.AsObject>,
  }
}

export class GetLPInfoListResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetLPInfoListResponse;
  hasErr(): boolean;
  clearErr(): GetLPInfoListResponse;

  getLpInfoList(): Array<LPInfo>;
  setLpInfoList(value: Array<LPInfo>): GetLPInfoListResponse;
  clearLpInfoList(): GetLPInfoListResponse;
  addLpInfo(value?: LPInfo, index?: number): LPInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLPInfoListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetLPInfoListResponse): GetLPInfoListResponse.AsObject;
  static serializeBinaryToWriter(message: GetLPInfoListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLPInfoListResponse;
  static deserializeBinaryFromReader(message: GetLPInfoListResponse, reader: jspb.BinaryReader): GetLPInfoListResponse;
}

export namespace GetLPInfoListResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    lpInfoList: Array<LPInfo.AsObject>,
  }
}

export class WithdrawLiquidityRequest extends jspb.Message {
  getWithdrawReq(): Uint8Array | string;
  getWithdrawReq_asU8(): Uint8Array;
  getWithdrawReq_asB64(): string;
  setWithdrawReq(value: Uint8Array | string): WithdrawLiquidityRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): WithdrawLiquidityRequest;

  getEstimatedReceivedAmt(): string;
  setEstimatedReceivedAmt(value: string): WithdrawLiquidityRequest;

  getMethodType(): WithdrawMethodType;
  setMethodType(value: WithdrawMethodType): WithdrawLiquidityRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawLiquidityRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawLiquidityRequest): WithdrawLiquidityRequest.AsObject;
  static serializeBinaryToWriter(message: WithdrawLiquidityRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawLiquidityRequest;
  static deserializeBinaryFromReader(message: WithdrawLiquidityRequest, reader: jspb.BinaryReader): WithdrawLiquidityRequest;
}

export namespace WithdrawLiquidityRequest {
  export type AsObject = {
    withdrawReq: Uint8Array | string,
    sig: Uint8Array | string,
    estimatedReceivedAmt: string,
    methodType: WithdrawMethodType,
  }
}

export class WithdrawLiquidityResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): WithdrawLiquidityResponse;
  hasErr(): boolean;
  clearErr(): WithdrawLiquidityResponse;

  getSeqNum(): number;
  setSeqNum(value: number): WithdrawLiquidityResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawLiquidityResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawLiquidityResponse): WithdrawLiquidityResponse.AsObject;
  static serializeBinaryToWriter(message: WithdrawLiquidityResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawLiquidityResponse;
  static deserializeBinaryFromReader(message: WithdrawLiquidityResponse, reader: jspb.BinaryReader): WithdrawLiquidityResponse;
}

export namespace WithdrawLiquidityResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    seqNum: number,
  }
}

export class UnlockFarmingRewardRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): UnlockFarmingRewardRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnlockFarmingRewardRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UnlockFarmingRewardRequest): UnlockFarmingRewardRequest.AsObject;
  static serializeBinaryToWriter(message: UnlockFarmingRewardRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnlockFarmingRewardRequest;
  static deserializeBinaryFromReader(message: UnlockFarmingRewardRequest, reader: jspb.BinaryReader): UnlockFarmingRewardRequest;
}

export namespace UnlockFarmingRewardRequest {
  export type AsObject = {
    addr: string,
  }
}

export class UnlockFarmingRewardResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): UnlockFarmingRewardResponse;
  hasErr(): boolean;
  clearErr(): UnlockFarmingRewardResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnlockFarmingRewardResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UnlockFarmingRewardResponse): UnlockFarmingRewardResponse.AsObject;
  static serializeBinaryToWriter(message: UnlockFarmingRewardResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnlockFarmingRewardResponse;
  static deserializeBinaryFromReader(message: UnlockFarmingRewardResponse, reader: jspb.BinaryReader): UnlockFarmingRewardResponse;
}

export namespace UnlockFarmingRewardResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class GetFarmingRewardDetailsRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): GetFarmingRewardDetailsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFarmingRewardDetailsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFarmingRewardDetailsRequest): GetFarmingRewardDetailsRequest.AsObject;
  static serializeBinaryToWriter(message: GetFarmingRewardDetailsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFarmingRewardDetailsRequest;
  static deserializeBinaryFromReader(message: GetFarmingRewardDetailsRequest, reader: jspb.BinaryReader): GetFarmingRewardDetailsRequest;
}

export namespace GetFarmingRewardDetailsRequest {
  export type AsObject = {
    addr: string,
  }
}

export class GetFarmingRewardDetailsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetFarmingRewardDetailsResponse;
  hasErr(): boolean;
  clearErr(): GetFarmingRewardDetailsResponse;

  getDetailsList(): Array<sgn_farming_v1_farming_pb.RewardClaimDetails>;
  setDetailsList(value: Array<sgn_farming_v1_farming_pb.RewardClaimDetails>): GetFarmingRewardDetailsResponse;
  clearDetailsList(): GetFarmingRewardDetailsResponse;
  addDetails(value?: sgn_farming_v1_farming_pb.RewardClaimDetails, index?: number): sgn_farming_v1_farming_pb.RewardClaimDetails;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFarmingRewardDetailsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFarmingRewardDetailsResponse): GetFarmingRewardDetailsResponse.AsObject;
  static serializeBinaryToWriter(message: GetFarmingRewardDetailsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFarmingRewardDetailsResponse;
  static deserializeBinaryFromReader(message: GetFarmingRewardDetailsResponse, reader: jspb.BinaryReader): GetFarmingRewardDetailsResponse;
}

export namespace GetFarmingRewardDetailsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    detailsList: Array<sgn_farming_v1_farming_pb.RewardClaimDetails.AsObject>,
  }
}

export class QueryLiquidityStatusRequest extends jspb.Message {
  getSeqNum(): number;
  setSeqNum(value: number): QueryLiquidityStatusRequest;

  getTxHash(): string;
  setTxHash(value: string): QueryLiquidityStatusRequest;

  getLpAddr(): string;
  setLpAddr(value: string): QueryLiquidityStatusRequest;

  getChainId(): number;
  setChainId(value: number): QueryLiquidityStatusRequest;

  getType(): LPType;
  setType(value: LPType): QueryLiquidityStatusRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryLiquidityStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryLiquidityStatusRequest): QueryLiquidityStatusRequest.AsObject;
  static serializeBinaryToWriter(message: QueryLiquidityStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryLiquidityStatusRequest;
  static deserializeBinaryFromReader(message: QueryLiquidityStatusRequest, reader: jspb.BinaryReader): QueryLiquidityStatusRequest;
}

export namespace QueryLiquidityStatusRequest {
  export type AsObject = {
    seqNum: number,
    txHash: string,
    lpAddr: string,
    chainId: number,
    type: LPType,
  }
}

export class TransferHistory extends jspb.Message {
  getTransferId(): string;
  setTransferId(value: string): TransferHistory;

  getSrcSendInfo(): TransferInfo | undefined;
  setSrcSendInfo(value?: TransferInfo): TransferHistory;
  hasSrcSendInfo(): boolean;
  clearSrcSendInfo(): TransferHistory;

  getDstReceivedInfo(): TransferInfo | undefined;
  setDstReceivedInfo(value?: TransferInfo): TransferHistory;
  hasDstReceivedInfo(): boolean;
  clearDstReceivedInfo(): TransferHistory;

  getTs(): number;
  setTs(value: number): TransferHistory;

  getSrcBlockTxLink(): string;
  setSrcBlockTxLink(value: string): TransferHistory;

  getDstBlockTxLink(): string;
  setDstBlockTxLink(value: string): TransferHistory;

  getStatus(): sgn_cbridge_v1_query_pb.TransferHistoryStatus;
  setStatus(value: sgn_cbridge_v1_query_pb.TransferHistoryStatus): TransferHistory;

  getRefundReason(): sgn_cbridge_v1_cbridge_pb.XferStatus;
  setRefundReason(value: sgn_cbridge_v1_cbridge_pb.XferStatus): TransferHistory;

  getUpdateTs(): number;
  setUpdateTs(value: number): TransferHistory;

  getBridgeType(): BridgeType;
  setBridgeType(value: BridgeType): TransferHistory;

  getDstDeadline(): number;
  setDstDeadline(value: number): TransferHistory;

  getSender(): string;
  setSender(value: string): TransferHistory;

  getReceiver(): string;
  setReceiver(value: string): TransferHistory;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferHistory.AsObject;
  static toObject(includeInstance: boolean, msg: TransferHistory): TransferHistory.AsObject;
  static serializeBinaryToWriter(message: TransferHistory, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferHistory;
  static deserializeBinaryFromReader(message: TransferHistory, reader: jspb.BinaryReader): TransferHistory;
}

export namespace TransferHistory {
  export type AsObject = {
    transferId: string,
    srcSendInfo?: TransferInfo.AsObject,
    dstReceivedInfo?: TransferInfo.AsObject,
    ts: number,
    srcBlockTxLink: string,
    dstBlockTxLink: string,
    status: sgn_cbridge_v1_query_pb.TransferHistoryStatus,
    refundReason: sgn_cbridge_v1_cbridge_pb.XferStatus,
    updateTs: number,
    bridgeType: BridgeType,
    dstDeadline: number,
    sender: string,
    receiver: string,
  }
}

export class LPHistory extends jspb.Message {
  getChain(): Chain | undefined;
  setChain(value?: Chain): LPHistory;
  hasChain(): boolean;
  clearChain(): LPHistory;

  getToken(): TokenInfo | undefined;
  setToken(value?: TokenInfo): LPHistory;
  hasToken(): boolean;
  clearToken(): LPHistory;

  getAmount(): string;
  setAmount(value: string): LPHistory;

  getTs(): number;
  setTs(value: number): LPHistory;

  getBlockTxLink(): string;
  setBlockTxLink(value: string): LPHistory;

  getStatus(): sgn_cbridge_v1_query_pb.WithdrawStatus;
  setStatus(value: sgn_cbridge_v1_query_pb.WithdrawStatus): LPHistory;

  getType(): LPType;
  setType(value: LPType): LPHistory;

  getSeqNum(): number;
  setSeqNum(value: number): LPHistory;

  getMethodType(): WithdrawMethodType;
  setMethodType(value: WithdrawMethodType): LPHistory;

  getNonce(): number;
  setNonce(value: number): LPHistory;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LPHistory.AsObject;
  static toObject(includeInstance: boolean, msg: LPHistory): LPHistory.AsObject;
  static serializeBinaryToWriter(message: LPHistory, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LPHistory;
  static deserializeBinaryFromReader(message: LPHistory, reader: jspb.BinaryReader): LPHistory;
}

export namespace LPHistory {
  export type AsObject = {
    chain?: Chain.AsObject,
    token?: TokenInfo.AsObject,
    amount: string,
    ts: number,
    blockTxLink: string,
    status: sgn_cbridge_v1_query_pb.WithdrawStatus,
    type: LPType,
    seqNum: number,
    methodType: WithdrawMethodType,
    nonce: number,
  }
}

export class ClaimHistory extends jspb.Message {
  getChain(): Chain | undefined;
  setChain(value?: Chain): ClaimHistory;
  hasChain(): boolean;
  clearChain(): ClaimHistory;

  getToken(): TokenInfo | undefined;
  setToken(value?: TokenInfo): ClaimHistory;
  hasToken(): boolean;
  clearToken(): ClaimHistory;

  getAmount(): string;
  setAmount(value: string): ClaimHistory;

  getTs(): number;
  setTs(value: number): ClaimHistory;

  getBlockTxLink(): string;
  setBlockTxLink(value: string): ClaimHistory;

  getStatus(): ClaimStatus;
  setStatus(value: ClaimStatus): ClaimHistory;

  getMethodType(): WithdrawMethodType;
  setMethodType(value: WithdrawMethodType): ClaimHistory;

  getSeqNum(): number;
  setSeqNum(value: number): ClaimHistory;

  getNonce(): number;
  setNonce(value: number): ClaimHistory;

  getWithdrawId(): string;
  setWithdrawId(value: string): ClaimHistory;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimHistory.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimHistory): ClaimHistory.AsObject;
  static serializeBinaryToWriter(message: ClaimHistory, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimHistory;
  static deserializeBinaryFromReader(message: ClaimHistory, reader: jspb.BinaryReader): ClaimHistory;
}

export namespace ClaimHistory {
  export type AsObject = {
    chain?: Chain.AsObject,
    token?: TokenInfo.AsObject,
    amount: string,
    ts: number,
    blockTxLink: string,
    status: ClaimStatus,
    methodType: WithdrawMethodType,
    seqNum: number,
    nonce: number,
    withdrawId: string,
  }
}

export class PendingHistoryRequest extends jspb.Message {
  getAddrList(): Array<string>;
  setAddrList(value: Array<string>): PendingHistoryRequest;
  clearAddrList(): PendingHistoryRequest;
  addAddr(value: string, index?: number): PendingHistoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PendingHistoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PendingHistoryRequest): PendingHistoryRequest.AsObject;
  static serializeBinaryToWriter(message: PendingHistoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PendingHistoryRequest;
  static deserializeBinaryFromReader(message: PendingHistoryRequest, reader: jspb.BinaryReader): PendingHistoryRequest;
}

export namespace PendingHistoryRequest {
  export type AsObject = {
    addrList: Array<string>,
  }
}

export class PendingHistoryResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): PendingHistoryResponse;
  hasErr(): boolean;
  clearErr(): PendingHistoryResponse;

  getActionTransferHistoryList(): Array<TransferHistory>;
  setActionTransferHistoryList(value: Array<TransferHistory>): PendingHistoryResponse;
  clearActionTransferHistoryList(): PendingHistoryResponse;
  addActionTransferHistory(value?: TransferHistory, index?: number): TransferHistory;

  getPendingTransferHistoryList(): Array<TransferHistory>;
  setPendingTransferHistoryList(value: Array<TransferHistory>): PendingHistoryResponse;
  clearPendingTransferHistoryList(): PendingHistoryResponse;
  addPendingTransferHistory(value?: TransferHistory, index?: number): TransferHistory;

  getActionLpHistoryList(): Array<LPHistory>;
  setActionLpHistoryList(value: Array<LPHistory>): PendingHistoryResponse;
  clearActionLpHistoryList(): PendingHistoryResponse;
  addActionLpHistory(value?: LPHistory, index?: number): LPHistory;

  getPendingLpHistoryList(): Array<LPHistory>;
  setPendingLpHistoryList(value: Array<LPHistory>): PendingHistoryResponse;
  clearPendingLpHistoryList(): PendingHistoryResponse;
  addPendingLpHistory(value?: LPHistory, index?: number): LPHistory;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PendingHistoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PendingHistoryResponse): PendingHistoryResponse.AsObject;
  static serializeBinaryToWriter(message: PendingHistoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PendingHistoryResponse;
  static deserializeBinaryFromReader(message: PendingHistoryResponse, reader: jspb.BinaryReader): PendingHistoryResponse;
}

export namespace PendingHistoryResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    actionTransferHistoryList: Array<TransferHistory.AsObject>,
    pendingTransferHistoryList: Array<TransferHistory.AsObject>,
    actionLpHistoryList: Array<LPHistory.AsObject>,
    pendingLpHistoryList: Array<LPHistory.AsObject>,
  }
}

export class TransferHistoryRequest extends jspb.Message {
  getNextPageToken(): string;
  setNextPageToken(value: string): TransferHistoryRequest;

  getPageSize(): number;
  setPageSize(value: number): TransferHistoryRequest;

  getAddr(): string;
  setAddr(value: string): TransferHistoryRequest;

  getAcctAddrList(): Array<string>;
  setAcctAddrList(value: Array<string>): TransferHistoryRequest;
  clearAcctAddrList(): TransferHistoryRequest;
  addAcctAddr(value: string, index?: number): TransferHistoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferHistoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferHistoryRequest): TransferHistoryRequest.AsObject;
  static serializeBinaryToWriter(message: TransferHistoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferHistoryRequest;
  static deserializeBinaryFromReader(message: TransferHistoryRequest, reader: jspb.BinaryReader): TransferHistoryRequest;
}

export namespace TransferHistoryRequest {
  export type AsObject = {
    nextPageToken: string,
    pageSize: number,
    addr: string,
    acctAddrList: Array<string>,
  }
}

export class TransferHistoryResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): TransferHistoryResponse;
  hasErr(): boolean;
  clearErr(): TransferHistoryResponse;

  getHistoryList(): Array<TransferHistory>;
  setHistoryList(value: Array<TransferHistory>): TransferHistoryResponse;
  clearHistoryList(): TransferHistoryResponse;
  addHistory(value?: TransferHistory, index?: number): TransferHistory;

  getNextPageToken(): string;
  setNextPageToken(value: string): TransferHistoryResponse;

  getCurrentSize(): number;
  setCurrentSize(value: number): TransferHistoryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferHistoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransferHistoryResponse): TransferHistoryResponse.AsObject;
  static serializeBinaryToWriter(message: TransferHistoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferHistoryResponse;
  static deserializeBinaryFromReader(message: TransferHistoryResponse, reader: jspb.BinaryReader): TransferHistoryResponse;
}

export namespace TransferHistoryResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    historyList: Array<TransferHistory.AsObject>,
    nextPageToken: string,
    currentSize: number,
  }
}

export class GetTransferRequest extends jspb.Message {
  getTransferId(): string;
  setTransferId(value: string): GetTransferRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferRequest): GetTransferRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransferRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferRequest;
  static deserializeBinaryFromReader(message: GetTransferRequest, reader: jspb.BinaryReader): GetTransferRequest;
}

export namespace GetTransferRequest {
  export type AsObject = {
    transferId: string,
  }
}

export class GetTransferResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTransferResponse;
  hasErr(): boolean;
  clearErr(): GetTransferResponse;

  getTransfer(): TransferHistory | undefined;
  setTransfer(value?: TransferHistory): GetTransferResponse;
  hasTransfer(): boolean;
  clearTransfer(): GetTransferResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferResponse): GetTransferResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransferResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferResponse;
  static deserializeBinaryFromReader(message: GetTransferResponse, reader: jspb.BinaryReader): GetTransferResponse;
}

export namespace GetTransferResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    transfer?: TransferHistory.AsObject,
  }
}

export class LPHistoryRequest extends jspb.Message {
  getNextPageToken(): string;
  setNextPageToken(value: string): LPHistoryRequest;

  getPageSize(): number;
  setPageSize(value: number): LPHistoryRequest;

  getAddr(): string;
  setAddr(value: string): LPHistoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LPHistoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LPHistoryRequest): LPHistoryRequest.AsObject;
  static serializeBinaryToWriter(message: LPHistoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LPHistoryRequest;
  static deserializeBinaryFromReader(message: LPHistoryRequest, reader: jspb.BinaryReader): LPHistoryRequest;
}

export namespace LPHistoryRequest {
  export type AsObject = {
    nextPageToken: string,
    pageSize: number,
    addr: string,
  }
}

export class LPHistoryResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): LPHistoryResponse;
  hasErr(): boolean;
  clearErr(): LPHistoryResponse;

  getHistoryList(): Array<LPHistory>;
  setHistoryList(value: Array<LPHistory>): LPHistoryResponse;
  clearHistoryList(): LPHistoryResponse;
  addHistory(value?: LPHistory, index?: number): LPHistory;

  getNextPageToken(): string;
  setNextPageToken(value: string): LPHistoryResponse;

  getCurrentSize(): number;
  setCurrentSize(value: number): LPHistoryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LPHistoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LPHistoryResponse): LPHistoryResponse.AsObject;
  static serializeBinaryToWriter(message: LPHistoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LPHistoryResponse;
  static deserializeBinaryFromReader(message: LPHistoryResponse, reader: jspb.BinaryReader): LPHistoryResponse;
}

export namespace LPHistoryResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    historyList: Array<LPHistory.AsObject>,
    nextPageToken: string,
    currentSize: number,
  }
}

export class ClaimHistoryRequest extends jspb.Message {
  getNextPageToken(): string;
  setNextPageToken(value: string): ClaimHistoryRequest;

  getPageSize(): number;
  setPageSize(value: number): ClaimHistoryRequest;

  getAddr(): string;
  setAddr(value: string): ClaimHistoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimHistoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimHistoryRequest): ClaimHistoryRequest.AsObject;
  static serializeBinaryToWriter(message: ClaimHistoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimHistoryRequest;
  static deserializeBinaryFromReader(message: ClaimHistoryRequest, reader: jspb.BinaryReader): ClaimHistoryRequest;
}

export namespace ClaimHistoryRequest {
  export type AsObject = {
    nextPageToken: string,
    pageSize: number,
    addr: string,
  }
}

export class ClaimHistoryResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): ClaimHistoryResponse;
  hasErr(): boolean;
  clearErr(): ClaimHistoryResponse;

  getHistoryList(): Array<ClaimHistory>;
  setHistoryList(value: Array<ClaimHistory>): ClaimHistoryResponse;
  clearHistoryList(): ClaimHistoryResponse;
  addHistory(value?: ClaimHistory, index?: number): ClaimHistory;

  getNextPageToken(): string;
  setNextPageToken(value: string): ClaimHistoryResponse;

  getCurrentSize(): number;
  setCurrentSize(value: number): ClaimHistoryResponse;

  getType(): ClaimRewardHistoryType;
  setType(value: ClaimRewardHistoryType): ClaimHistoryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimHistoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimHistoryResponse): ClaimHistoryResponse.AsObject;
  static serializeBinaryToWriter(message: ClaimHistoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimHistoryResponse;
  static deserializeBinaryFromReader(message: ClaimHistoryResponse, reader: jspb.BinaryReader): ClaimHistoryResponse;
}

export namespace ClaimHistoryResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    historyList: Array<ClaimHistory.AsObject>,
    nextPageToken: string,
    currentSize: number,
    type: ClaimRewardHistoryType,
  }
}

export class PegClaimHistoryRequest extends jspb.Message {
  getNextPageToken(): string;
  setNextPageToken(value: string): PegClaimHistoryRequest;

  getPageSize(): number;
  setPageSize(value: number): PegClaimHistoryRequest;

  getAddr(): string;
  setAddr(value: string): PegClaimHistoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PegClaimHistoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PegClaimHistoryRequest): PegClaimHistoryRequest.AsObject;
  static serializeBinaryToWriter(message: PegClaimHistoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PegClaimHistoryRequest;
  static deserializeBinaryFromReader(message: PegClaimHistoryRequest, reader: jspb.BinaryReader): PegClaimHistoryRequest;
}

export namespace PegClaimHistoryRequest {
  export type AsObject = {
    nextPageToken: string,
    pageSize: number,
    addr: string,
  }
}

export class PegClaimHistoryResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): PegClaimHistoryResponse;
  hasErr(): boolean;
  clearErr(): PegClaimHistoryResponse;

  getHistoryList(): Array<ClaimHistory>;
  setHistoryList(value: Array<ClaimHistory>): PegClaimHistoryResponse;
  clearHistoryList(): PegClaimHistoryResponse;
  addHistory(value?: ClaimHistory, index?: number): ClaimHistory;

  getNextPageToken(): string;
  setNextPageToken(value: string): PegClaimHistoryResponse;

  getCurrentSize(): number;
  setCurrentSize(value: number): PegClaimHistoryResponse;

  getType(): ClaimRewardHistoryType;
  setType(value: ClaimRewardHistoryType): PegClaimHistoryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PegClaimHistoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PegClaimHistoryResponse): PegClaimHistoryResponse.AsObject;
  static serializeBinaryToWriter(message: PegClaimHistoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PegClaimHistoryResponse;
  static deserializeBinaryFromReader(message: PegClaimHistoryResponse, reader: jspb.BinaryReader): PegClaimHistoryResponse;
}

export namespace PegClaimHistoryResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    historyList: Array<ClaimHistory.AsObject>,
    nextPageToken: string,
    currentSize: number,
    type: ClaimRewardHistoryType,
  }
}

export class RewardingDataRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): RewardingDataRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RewardingDataRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RewardingDataRequest): RewardingDataRequest.AsObject;
  static serializeBinaryToWriter(message: RewardingDataRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RewardingDataRequest;
  static deserializeBinaryFromReader(message: RewardingDataRequest, reader: jspb.BinaryReader): RewardingDataRequest;
}

export namespace RewardingDataRequest {
  export type AsObject = {
    addr: string,
  }
}

export class Reward extends jspb.Message {
  getAmt(): number;
  setAmt(value: number): Reward;

  getToken(): sgn_cbridge_v1_query_pb.Token | undefined;
  setToken(value?: sgn_cbridge_v1_query_pb.Token): Reward;
  hasToken(): boolean;
  clearToken(): Reward;

  getChainId(): number;
  setChainId(value: number): Reward;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Reward.AsObject;
  static toObject(includeInstance: boolean, msg: Reward): Reward.AsObject;
  static serializeBinaryToWriter(message: Reward, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Reward;
  static deserializeBinaryFromReader(message: Reward, reader: jspb.BinaryReader): Reward;
}

export namespace Reward {
  export type AsObject = {
    amt: number,
    token?: sgn_cbridge_v1_query_pb.Token.AsObject,
    chainId: number,
  }
}

export class RewardingDataResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): RewardingDataResponse;
  hasErr(): boolean;
  clearErr(): RewardingDataResponse;

  getUsdPriceMap(): jspb.Map<string, number>;
  clearUsdPriceMap(): RewardingDataResponse;

  getHistoricalCumulativeRewardsList(): Array<Reward>;
  setHistoricalCumulativeRewardsList(value: Array<Reward>): RewardingDataResponse;
  clearHistoricalCumulativeRewardsList(): RewardingDataResponse;
  addHistoricalCumulativeRewards(value?: Reward, index?: number): Reward;

  getUnlockedCumulativeRewardsList(): Array<Reward>;
  setUnlockedCumulativeRewardsList(value: Array<Reward>): RewardingDataResponse;
  clearUnlockedCumulativeRewardsList(): RewardingDataResponse;
  addUnlockedCumulativeRewards(value?: Reward, index?: number): Reward;

  getHistoricalCumulativeRewardAmountsList(): Array<cosmos_base_v1beta1_coin_pb.DecCoin>;
  setHistoricalCumulativeRewardAmountsList(value: Array<cosmos_base_v1beta1_coin_pb.DecCoin>): RewardingDataResponse;
  clearHistoricalCumulativeRewardAmountsList(): RewardingDataResponse;
  addHistoricalCumulativeRewardAmounts(value?: cosmos_base_v1beta1_coin_pb.DecCoin, index?: number): cosmos_base_v1beta1_coin_pb.DecCoin;

  getUnlockedRewardDetailsList(): Array<sgn_farming_v1_farming_pb.RewardClaimDetails>;
  setUnlockedRewardDetailsList(value: Array<sgn_farming_v1_farming_pb.RewardClaimDetails>): RewardingDataResponse;
  clearUnlockedRewardDetailsList(): RewardingDataResponse;
  addUnlockedRewardDetails(value?: sgn_farming_v1_farming_pb.RewardClaimDetails, index?: number): sgn_farming_v1_farming_pb.RewardClaimDetails;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RewardingDataResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RewardingDataResponse): RewardingDataResponse.AsObject;
  static serializeBinaryToWriter(message: RewardingDataResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RewardingDataResponse;
  static deserializeBinaryFromReader(message: RewardingDataResponse, reader: jspb.BinaryReader): RewardingDataResponse;
}

export namespace RewardingDataResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    usdPriceMap: Array<[string, number]>,
    historicalCumulativeRewardsList: Array<Reward.AsObject>,
    unlockedCumulativeRewardsList: Array<Reward.AsObject>,
    historicalCumulativeRewardAmountsList: Array<cosmos_base_v1beta1_coin_pb.DecCoin.AsObject>,
    unlockedRewardDetailsList: Array<sgn_farming_v1_farming_pb.RewardClaimDetails.AsObject>,
  }
}

export class UpdateChainRequest extends jspb.Message {
  getChain(): Chain | undefined;
  setChain(value?: Chain): UpdateChainRequest;
  hasChain(): boolean;
  clearChain(): UpdateChainRequest;

  getTxUrlPrefix(): string;
  setTxUrlPrefix(value: string): UpdateChainRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): UpdateChainRequest;

  getAddr(): string;
  setAddr(value: string): UpdateChainRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateChainRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateChainRequest): UpdateChainRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateChainRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateChainRequest;
  static deserializeBinaryFromReader(message: UpdateChainRequest, reader: jspb.BinaryReader): UpdateChainRequest;
}

export namespace UpdateChainRequest {
  export type AsObject = {
    chain?: Chain.AsObject,
    txUrlPrefix: string,
    sig: Uint8Array | string,
    addr: string,
  }
}

export class UpdateChainResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): UpdateChainResponse;
  hasErr(): boolean;
  clearErr(): UpdateChainResponse;

  getChain(): Chain | undefined;
  setChain(value?: Chain): UpdateChainResponse;
  hasChain(): boolean;
  clearChain(): UpdateChainResponse;

  getTxUrlPrefix(): string;
  setTxUrlPrefix(value: string): UpdateChainResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateChainResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateChainResponse): UpdateChainResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateChainResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateChainResponse;
  static deserializeBinaryFromReader(message: UpdateChainResponse, reader: jspb.BinaryReader): UpdateChainResponse;
}

export namespace UpdateChainResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    chain?: Chain.AsObject,
    txUrlPrefix: string,
  }
}

export class UpdateTokenRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): UpdateTokenRequest;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): UpdateTokenRequest;

  getTokenName(): string;
  setTokenName(value: string): UpdateTokenRequest;

  getTokenIcon(): string;
  setTokenIcon(value: string): UpdateTokenRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): UpdateTokenRequest;

  getAddr(): string;
  setAddr(value: string): UpdateTokenRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateTokenRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateTokenRequest): UpdateTokenRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateTokenRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateTokenRequest;
  static deserializeBinaryFromReader(message: UpdateTokenRequest, reader: jspb.BinaryReader): UpdateTokenRequest;
}

export namespace UpdateTokenRequest {
  export type AsObject = {
    chainId: number,
    tokenSymbol: string,
    tokenName: string,
    tokenIcon: string,
    sig: Uint8Array | string,
    addr: string,
  }
}

export class UpdateTokenResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): UpdateTokenResponse;
  hasErr(): boolean;
  clearErr(): UpdateTokenResponse;

  getToken(): TokenInfo | undefined;
  setToken(value?: TokenInfo): UpdateTokenResponse;
  hasToken(): boolean;
  clearToken(): UpdateTokenResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateTokenResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateTokenResponse): UpdateTokenResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateTokenResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateTokenResponse;
  static deserializeBinaryFromReader(message: UpdateTokenResponse, reader: jspb.BinaryReader): UpdateTokenResponse;
}

export namespace UpdateTokenResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    token?: TokenInfo.AsObject,
  }
}

export class StakingConfigRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StakingConfigRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StakingConfigRequest): StakingConfigRequest.AsObject;
  static serializeBinaryToWriter(message: StakingConfigRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StakingConfigRequest;
  static deserializeBinaryFromReader(message: StakingConfigRequest, reader: jspb.BinaryReader): StakingConfigRequest;
}

export namespace StakingConfigRequest {
  export type AsObject = {
  }
}

export class StakingConfigResponse extends jspb.Message {
  getViewerContract(): string;
  setViewerContract(value: string): StakingConfigResponse;

  getStakingContract(): string;
  setStakingContract(value: string): StakingConfigResponse;

  getStakingRewardContract(): string;
  setStakingRewardContract(value: string): StakingConfigResponse;

  getCelrContract(): string;
  setCelrContract(value: string): StakingConfigResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StakingConfigResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StakingConfigResponse): StakingConfigResponse.AsObject;
  static serializeBinaryToWriter(message: StakingConfigResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StakingConfigResponse;
  static deserializeBinaryFromReader(message: StakingConfigResponse, reader: jspb.BinaryReader): StakingConfigResponse;
}

export namespace StakingConfigResponse {
  export type AsObject = {
    viewerContract: string,
    stakingContract: string,
    stakingRewardContract: string,
    celrContract: string,
  }
}

export class UnlockStakingRewardRequest extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): UnlockStakingRewardRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnlockStakingRewardRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UnlockStakingRewardRequest): UnlockStakingRewardRequest.AsObject;
  static serializeBinaryToWriter(message: UnlockStakingRewardRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnlockStakingRewardRequest;
  static deserializeBinaryFromReader(message: UnlockStakingRewardRequest, reader: jspb.BinaryReader): UnlockStakingRewardRequest;
}

export namespace UnlockStakingRewardRequest {
  export type AsObject = {
    delegatorAddress: string,
  }
}

export class UnlockStakingRewardResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): UnlockStakingRewardResponse;
  hasErr(): boolean;
  clearErr(): UnlockStakingRewardResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnlockStakingRewardResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UnlockStakingRewardResponse): UnlockStakingRewardResponse.AsObject;
  static serializeBinaryToWriter(message: UnlockStakingRewardResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnlockStakingRewardResponse;
  static deserializeBinaryFromReader(message: UnlockStakingRewardResponse, reader: jspb.BinaryReader): UnlockStakingRewardResponse;
}

export namespace UnlockStakingRewardResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class GetStakingRewardDetailsRequest extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): GetStakingRewardDetailsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStakingRewardDetailsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetStakingRewardDetailsRequest): GetStakingRewardDetailsRequest.AsObject;
  static serializeBinaryToWriter(message: GetStakingRewardDetailsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStakingRewardDetailsRequest;
  static deserializeBinaryFromReader(message: GetStakingRewardDetailsRequest, reader: jspb.BinaryReader): GetStakingRewardDetailsRequest;
}

export namespace GetStakingRewardDetailsRequest {
  export type AsObject = {
    delegatorAddress: string,
  }
}

export class GetStakingRewardDetailsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetStakingRewardDetailsResponse;
  hasErr(): boolean;
  clearErr(): GetStakingRewardDetailsResponse;

  getDetail(): sgn_distribution_v1_distribution_pb.StakingRewardClaimInfo | undefined;
  setDetail(value?: sgn_distribution_v1_distribution_pb.StakingRewardClaimInfo): GetStakingRewardDetailsResponse;
  hasDetail(): boolean;
  clearDetail(): GetStakingRewardDetailsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStakingRewardDetailsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetStakingRewardDetailsResponse): GetStakingRewardDetailsResponse.AsObject;
  static serializeBinaryToWriter(message: GetStakingRewardDetailsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStakingRewardDetailsResponse;
  static deserializeBinaryFromReader(message: GetStakingRewardDetailsResponse, reader: jspb.BinaryReader): GetStakingRewardDetailsResponse;
}

export namespace GetStakingRewardDetailsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    detail?: sgn_distribution_v1_distribution_pb.StakingRewardClaimInfo.AsObject,
  }
}

export class GetTotalLiquidityProviderTokenBalanceRequest extends jspb.Message {
  getChainIdsList(): Array<number>;
  setChainIdsList(value: Array<number>): GetTotalLiquidityProviderTokenBalanceRequest;
  clearChainIdsList(): GetTotalLiquidityProviderTokenBalanceRequest;
  addChainIds(value: number, index?: number): GetTotalLiquidityProviderTokenBalanceRequest;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): GetTotalLiquidityProviderTokenBalanceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTotalLiquidityProviderTokenBalanceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTotalLiquidityProviderTokenBalanceRequest): GetTotalLiquidityProviderTokenBalanceRequest.AsObject;
  static serializeBinaryToWriter(message: GetTotalLiquidityProviderTokenBalanceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTotalLiquidityProviderTokenBalanceRequest;
  static deserializeBinaryFromReader(message: GetTotalLiquidityProviderTokenBalanceRequest, reader: jspb.BinaryReader): GetTotalLiquidityProviderTokenBalanceRequest;
}

export namespace GetTotalLiquidityProviderTokenBalanceRequest {
  export type AsObject = {
    chainIdsList: Array<number>,
    tokenSymbol: string,
  }
}

export class GetTotalLiquidityProviderTokenBalanceResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTotalLiquidityProviderTokenBalanceResponse;
  hasErr(): boolean;
  clearErr(): GetTotalLiquidityProviderTokenBalanceResponse;

  getTotalLiqMap(): jspb.Map<number, string>;
  clearTotalLiqMap(): GetTotalLiquidityProviderTokenBalanceResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTotalLiquidityProviderTokenBalanceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTotalLiquidityProviderTokenBalanceResponse): GetTotalLiquidityProviderTokenBalanceResponse.AsObject;
  static serializeBinaryToWriter(message: GetTotalLiquidityProviderTokenBalanceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTotalLiquidityProviderTokenBalanceResponse;
  static deserializeBinaryFromReader(message: GetTotalLiquidityProviderTokenBalanceResponse, reader: jspb.BinaryReader): GetTotalLiquidityProviderTokenBalanceResponse;
}

export namespace GetTotalLiquidityProviderTokenBalanceResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    totalLiqMap: Array<[number, string]>,
  }
}

export class QueryLiquidityProviderTokenBalanceRequest extends jspb.Message {
  getChainIdsList(): Array<number>;
  setChainIdsList(value: Array<number>): QueryLiquidityProviderTokenBalanceRequest;
  clearChainIdsList(): QueryLiquidityProviderTokenBalanceRequest;
  addChainIds(value: number, index?: number): QueryLiquidityProviderTokenBalanceRequest;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): QueryLiquidityProviderTokenBalanceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryLiquidityProviderTokenBalanceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryLiquidityProviderTokenBalanceRequest): QueryLiquidityProviderTokenBalanceRequest.AsObject;
  static serializeBinaryToWriter(message: QueryLiquidityProviderTokenBalanceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryLiquidityProviderTokenBalanceRequest;
  static deserializeBinaryFromReader(message: QueryLiquidityProviderTokenBalanceRequest, reader: jspb.BinaryReader): QueryLiquidityProviderTokenBalanceRequest;
}

export namespace QueryLiquidityProviderTokenBalanceRequest {
  export type AsObject = {
    chainIdsList: Array<number>,
    tokenSymbol: string,
  }
}

export class QueryLiquidityProviderTokenBalanceResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): QueryLiquidityProviderTokenBalanceResponse;
  hasErr(): boolean;
  clearErr(): QueryLiquidityProviderTokenBalanceResponse;

  getTotalLiqMap(): jspb.Map<number, string>;
  clearTotalLiqMap(): QueryLiquidityProviderTokenBalanceResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryLiquidityProviderTokenBalanceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryLiquidityProviderTokenBalanceResponse): QueryLiquidityProviderTokenBalanceResponse.AsObject;
  static serializeBinaryToWriter(message: QueryLiquidityProviderTokenBalanceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryLiquidityProviderTokenBalanceResponse;
  static deserializeBinaryFromReader(message: QueryLiquidityProviderTokenBalanceResponse, reader: jspb.BinaryReader): QueryLiquidityProviderTokenBalanceResponse;
}

export namespace QueryLiquidityProviderTokenBalanceResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    totalLiqMap: Array<[number, string]>,
  }
}

export class GetAbnormalStatusInfoRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAbnormalStatusInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAbnormalStatusInfoRequest): GetAbnormalStatusInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetAbnormalStatusInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAbnormalStatusInfoRequest;
  static deserializeBinaryFromReader(message: GetAbnormalStatusInfoRequest, reader: jspb.BinaryReader): GetAbnormalStatusInfoRequest;
}

export namespace GetAbnormalStatusInfoRequest {
  export type AsObject = {
  }
}

export class GetAbnormalStatusInfoResponse extends jspb.Message {
  getInfoList(): Array<AbnormalStatusInfo>;
  setInfoList(value: Array<AbnormalStatusInfo>): GetAbnormalStatusInfoResponse;
  clearInfoList(): GetAbnormalStatusInfoResponse;
  addInfo(value?: AbnormalStatusInfo, index?: number): AbnormalStatusInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAbnormalStatusInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAbnormalStatusInfoResponse): GetAbnormalStatusInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetAbnormalStatusInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAbnormalStatusInfoResponse;
  static deserializeBinaryFromReader(message: GetAbnormalStatusInfoResponse, reader: jspb.BinaryReader): GetAbnormalStatusInfoResponse;
}

export namespace GetAbnormalStatusInfoResponse {
  export type AsObject = {
    infoList: Array<AbnormalStatusInfo.AsObject>,
  }
}

export class GetAllLPInfoRequest extends jspb.Message {
  getUsrAddressList(): Array<string>;
  setUsrAddressList(value: Array<string>): GetAllLPInfoRequest;
  clearUsrAddressList(): GetAllLPInfoRequest;
  addUsrAddress(value: string, index?: number): GetAllLPInfoRequest;

  getActionTypeList(): Array<LpActionType>;
  setActionTypeList(value: Array<LpActionType>): GetAllLPInfoRequest;
  clearActionTypeList(): GetAllLPInfoRequest;
  addActionType(value: LpActionType, index?: number): GetAllLPInfoRequest;

  getChainIdList(): Array<number>;
  setChainIdList(value: Array<number>): GetAllLPInfoRequest;
  clearChainIdList(): GetAllLPInfoRequest;
  addChainId(value: number, index?: number): GetAllLPInfoRequest;

  getTokenSymbolList(): Array<string>;
  setTokenSymbolList(value: Array<string>): GetAllLPInfoRequest;
  clearTokenSymbolList(): GetAllLPInfoRequest;
  addTokenSymbol(value: string, index?: number): GetAllLPInfoRequest;

  getBeginTime(): number;
  setBeginTime(value: number): GetAllLPInfoRequest;

  getEndTime(): number;
  setEndTime(value: number): GetAllLPInfoRequest;

  getNextPageToken(): number;
  setNextPageToken(value: number): GetAllLPInfoRequest;

  getSigAddr(): string;
  setSigAddr(value: string): GetAllLPInfoRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): GetAllLPInfoRequest;

  getStatusList(): Array<number>;
  setStatusList(value: Array<number>): GetAllLPInfoRequest;
  clearStatusList(): GetAllLPInfoRequest;
  addStatus(value: number, index?: number): GetAllLPInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllLPInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllLPInfoRequest): GetAllLPInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetAllLPInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllLPInfoRequest;
  static deserializeBinaryFromReader(message: GetAllLPInfoRequest, reader: jspb.BinaryReader): GetAllLPInfoRequest;
}

export namespace GetAllLPInfoRequest {
  export type AsObject = {
    usrAddressList: Array<string>,
    actionTypeList: Array<LpActionType>,
    chainIdList: Array<number>,
    tokenSymbolList: Array<string>,
    beginTime: number,
    endTime: number,
    nextPageToken: number,
    sigAddr: string,
    sig: Uint8Array | string,
    statusList: Array<number>,
  }
}

export class GetAllLPInfoResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetAllLPInfoResponse;
  hasErr(): boolean;
  clearErr(): GetAllLPInfoResponse;

  getOperationList(): Array<LPOperations>;
  setOperationList(value: Array<LPOperations>): GetAllLPInfoResponse;
  clearOperationList(): GetAllLPInfoResponse;
  addOperation(value?: LPOperations, index?: number): LPOperations;

  getNextPageToken(): number;
  setNextPageToken(value: number): GetAllLPInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllLPInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllLPInfoResponse): GetAllLPInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetAllLPInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllLPInfoResponse;
  static deserializeBinaryFromReader(message: GetAllLPInfoResponse, reader: jspb.BinaryReader): GetAllLPInfoResponse;
}

export namespace GetAllLPInfoResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    operationList: Array<LPOperations.AsObject>,
    nextPageToken: number,
  }
}

export class LPOperations extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): LPOperations;

  getAction(): LpActionType;
  setAction(value: LpActionType): LPOperations;

  getChainId(): number;
  setChainId(value: number): LPOperations;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): LPOperations;

  getAmount(): string;
  setAmount(value: string): LPOperations;

  getTimestamp(): number;
  setTimestamp(value: number): LPOperations;

  getTxLink(): string;
  setTxLink(value: string): LPOperations;

  getStatus(): sgn_cbridge_v1_query_pb.WithdrawStatus;
  setStatus(value: sgn_cbridge_v1_query_pb.WithdrawStatus): LPOperations;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LPOperations.AsObject;
  static toObject(includeInstance: boolean, msg: LPOperations): LPOperations.AsObject;
  static serializeBinaryToWriter(message: LPOperations, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LPOperations;
  static deserializeBinaryFromReader(message: LPOperations, reader: jspb.BinaryReader): LPOperations;
}

export namespace LPOperations {
  export type AsObject = {
    address: string,
    action: LpActionType,
    chainId: number,
    tokenSymbol: string,
    amount: string,
    timestamp: number,
    txLink: string,
    status: sgn_cbridge_v1_query_pb.WithdrawStatus,
  }
}

export class GetAllTXInfoRequest extends jspb.Message {
  getUsrAddressList(): Array<string>;
  setUsrAddressList(value: Array<string>): GetAllTXInfoRequest;
  clearUsrAddressList(): GetAllTXInfoRequest;
  addUsrAddress(value: string, index?: number): GetAllTXInfoRequest;

  getSrcChainIdList(): Array<number>;
  setSrcChainIdList(value: Array<number>): GetAllTXInfoRequest;
  clearSrcChainIdList(): GetAllTXInfoRequest;
  addSrcChainId(value: number, index?: number): GetAllTXInfoRequest;

  getDstChainIdList(): Array<number>;
  setDstChainIdList(value: Array<number>): GetAllTXInfoRequest;
  clearDstChainIdList(): GetAllTXInfoRequest;
  addDstChainId(value: number, index?: number): GetAllTXInfoRequest;

  getTokenSymbolList(): Array<string>;
  setTokenSymbolList(value: Array<string>): GetAllTXInfoRequest;
  clearTokenSymbolList(): GetAllTXInfoRequest;
  addTokenSymbol(value: string, index?: number): GetAllTXInfoRequest;

  getBeginTime(): number;
  setBeginTime(value: number): GetAllTXInfoRequest;

  getEndTime(): number;
  setEndTime(value: number): GetAllTXInfoRequest;

  getNextPageToken(): number;
  setNextPageToken(value: number): GetAllTXInfoRequest;

  getSigAddr(): string;
  setSigAddr(value: string): GetAllTXInfoRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): GetAllTXInfoRequest;

  getBridgeTypeList(): Array<BridgeType>;
  setBridgeTypeList(value: Array<BridgeType>): GetAllTXInfoRequest;
  clearBridgeTypeList(): GetAllTXInfoRequest;
  addBridgeType(value: BridgeType, index?: number): GetAllTXInfoRequest;

  getRefIdList(): Array<string>;
  setRefIdList(value: Array<string>): GetAllTXInfoRequest;
  clearRefIdList(): GetAllTXInfoRequest;
  addRefId(value: string, index?: number): GetAllTXInfoRequest;

  getPageSize(): number;
  setPageSize(value: number): GetAllTXInfoRequest;

  getStatusList(): Array<number>;
  setStatusList(value: Array<number>): GetAllTXInfoRequest;
  clearStatusList(): GetAllTXInfoRequest;
  addStatus(value: number, index?: number): GetAllTXInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllTXInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllTXInfoRequest): GetAllTXInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetAllTXInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllTXInfoRequest;
  static deserializeBinaryFromReader(message: GetAllTXInfoRequest, reader: jspb.BinaryReader): GetAllTXInfoRequest;
}

export namespace GetAllTXInfoRequest {
  export type AsObject = {
    usrAddressList: Array<string>,
    srcChainIdList: Array<number>,
    dstChainIdList: Array<number>,
    tokenSymbolList: Array<string>,
    beginTime: number,
    endTime: number,
    nextPageToken: number,
    sigAddr: string,
    sig: Uint8Array | string,
    bridgeTypeList: Array<BridgeType>,
    refIdList: Array<string>,
    pageSize: number,
    statusList: Array<number>,
  }
}

export class GetAllTXInfoResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetAllTXInfoResponse;
  hasErr(): boolean;
  clearErr(): GetAllTXInfoResponse;

  getOperationList(): Array<TXOperations>;
  setOperationList(value: Array<TXOperations>): GetAllTXInfoResponse;
  clearOperationList(): GetAllTXInfoResponse;
  addOperation(value?: TXOperations, index?: number): TXOperations;

  getNextPageToken(): number;
  setNextPageToken(value: number): GetAllTXInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllTXInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllTXInfoResponse): GetAllTXInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetAllTXInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllTXInfoResponse;
  static deserializeBinaryFromReader(message: GetAllTXInfoResponse, reader: jspb.BinaryReader): GetAllTXInfoResponse;
}

export namespace GetAllTXInfoResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    operationList: Array<TXOperations.AsObject>,
    nextPageToken: number,
  }
}

export class TXOperations extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): TXOperations;

  getSrcChainId(): number;
  setSrcChainId(value: number): TXOperations;

  getDstChainId(): number;
  setDstChainId(value: number): TXOperations;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): TXOperations;

  getSendAmount(): string;
  setSendAmount(value: string): TXOperations;

  getRecievedAmount(): string;
  setRecievedAmount(value: string): TXOperations;

  getBaseFee(): string;
  setBaseFee(value: string): TXOperations;

  getLiqFee(): string;
  setLiqFee(value: string): TXOperations;

  getPrice(): number;
  setPrice(value: number): TXOperations;

  getTimestamp(): number;
  setTimestamp(value: number): TXOperations;

  getSrcTxLink(): string;
  setSrcTxLink(value: string): TXOperations;

  getStatus(): sgn_cbridge_v1_query_pb.TransferHistoryStatus;
  setStatus(value: sgn_cbridge_v1_query_pb.TransferHistoryStatus): TXOperations;

  getRefId(): string;
  setRefId(value: string): TXOperations;

  getDstTxLink(): string;
  setDstTxLink(value: string): TXOperations;

  getBridgeType(): BridgeType;
  setBridgeType(value: BridgeType): TXOperations;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TXOperations.AsObject;
  static toObject(includeInstance: boolean, msg: TXOperations): TXOperations.AsObject;
  static serializeBinaryToWriter(message: TXOperations, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TXOperations;
  static deserializeBinaryFromReader(message: TXOperations, reader: jspb.BinaryReader): TXOperations;
}

export namespace TXOperations {
  export type AsObject = {
    address: string,
    srcChainId: number,
    dstChainId: number,
    tokenSymbol: string,
    sendAmount: string,
    recievedAmount: string,
    baseFee: string,
    liqFee: string,
    price: number,
    timestamp: number,
    srcTxLink: string,
    status: sgn_cbridge_v1_query_pb.TransferHistoryStatus,
    refId: string,
    dstTxLink: string,
    bridgeType: BridgeType,
  }
}

export class AbnormalStatusInfo extends jspb.Message {
  getType(): string;
  setType(value: string): AbnormalStatusInfo;

  getChainId(): number;
  setChainId(value: number): AbnormalStatusInfo;

  getDstChainId(): number;
  setDstChainId(value: number): AbnormalStatusInfo;

  getTxHash(): string;
  setTxHash(value: string): AbnormalStatusInfo;

  getTime(): string;
  setTime(value: string): AbnormalStatusInfo;

  getPeggedInfo(): string;
  setPeggedInfo(value: string): AbnormalStatusInfo;

  getSrcTransferId(): string;
  setSrcTransferId(value: string): AbnormalStatusInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AbnormalStatusInfo.AsObject;
  static toObject(includeInstance: boolean, msg: AbnormalStatusInfo): AbnormalStatusInfo.AsObject;
  static serializeBinaryToWriter(message: AbnormalStatusInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AbnormalStatusInfo;
  static deserializeBinaryFromReader(message: AbnormalStatusInfo, reader: jspb.BinaryReader): AbnormalStatusInfo;
}

export namespace AbnormalStatusInfo {
  export type AsObject = {
    type: string,
    chainId: number,
    dstChainId: number,
    txHash: string,
    time: string,
    peggedInfo: string,
    srcTransferId: string,
  }
}

export class GetInfoByTxHashRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): GetInfoByTxHashRequest;

  getTxHash(): string;
  setTxHash(value: string): GetInfoByTxHashRequest;

  getType(): CSType;
  setType(value: CSType): GetInfoByTxHashRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): GetInfoByTxHashRequest;

  getAddr(): string;
  setAddr(value: string): GetInfoByTxHashRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInfoByTxHashRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetInfoByTxHashRequest): GetInfoByTxHashRequest.AsObject;
  static serializeBinaryToWriter(message: GetInfoByTxHashRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInfoByTxHashRequest;
  static deserializeBinaryFromReader(message: GetInfoByTxHashRequest, reader: jspb.BinaryReader): GetInfoByTxHashRequest;
}

export namespace GetInfoByTxHashRequest {
  export type AsObject = {
    chainId: number,
    txHash: string,
    type: CSType,
    sig: Uint8Array | string,
    addr: string,
  }
}

export class GetInfoByTxHashResponse extends jspb.Message {
  getOperation(): CSOperation;
  setOperation(value: CSOperation): GetInfoByTxHashResponse;

  getStatus(): UserCaseStatus;
  setStatus(value: UserCaseStatus): GetInfoByTxHashResponse;

  getMemo(): string;
  setMemo(value: string): GetInfoByTxHashResponse;

  getInfo(): string;
  setInfo(value: string): GetInfoByTxHashResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInfoByTxHashResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetInfoByTxHashResponse): GetInfoByTxHashResponse.AsObject;
  static serializeBinaryToWriter(message: GetInfoByTxHashResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInfoByTxHashResponse;
  static deserializeBinaryFromReader(message: GetInfoByTxHashResponse, reader: jspb.BinaryReader): GetInfoByTxHashResponse;
}

export namespace GetInfoByTxHashResponse {
  export type AsObject = {
    operation: CSOperation,
    status: UserCaseStatus,
    memo: string,
    info: string,
  }
}

export class GetTransferBySrcTxRequest extends jspb.Message {
  getSrcTxHash(): string;
  setSrcTxHash(value: string): GetTransferBySrcTxRequest;

  getBridgeType(): BridgeType;
  setBridgeType(value: BridgeType): GetTransferBySrcTxRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferBySrcTxRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferBySrcTxRequest): GetTransferBySrcTxRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransferBySrcTxRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferBySrcTxRequest;
  static deserializeBinaryFromReader(message: GetTransferBySrcTxRequest, reader: jspb.BinaryReader): GetTransferBySrcTxRequest;
}

export namespace GetTransferBySrcTxRequest {
  export type AsObject = {
    srcTxHash: string,
    bridgeType: BridgeType,
  }
}

export class GetTransferBySrcTxResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTransferBySrcTxResponse;
  hasErr(): boolean;
  clearErr(): GetTransferBySrcTxResponse;

  getTransfer(): TransferHistory | undefined;
  setTransfer(value?: TransferHistory): GetTransferBySrcTxResponse;
  hasTransfer(): boolean;
  clearTransfer(): GetTransferBySrcTxResponse;

  getRefundTx(): string;
  setRefundTx(value: string): GetTransferBySrcTxResponse;

  getUsrAddr(): string;
  setUsrAddr(value: string): GetTransferBySrcTxResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferBySrcTxResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferBySrcTxResponse): GetTransferBySrcTxResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransferBySrcTxResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferBySrcTxResponse;
  static deserializeBinaryFromReader(message: GetTransferBySrcTxResponse, reader: jspb.BinaryReader): GetTransferBySrcTxResponse;
}

export namespace GetTransferBySrcTxResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    transfer?: TransferHistory.AsObject,
    refundTx: string,
    usrAddr: string,
  }
}

export class FixEventMissRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): FixEventMissRequest;

  getTxHash(): string;
  setTxHash(value: string): FixEventMissRequest;

  getType(): CSType;
  setType(value: CSType): FixEventMissRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): FixEventMissRequest;

  getAddr(): string;
  setAddr(value: string): FixEventMissRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FixEventMissRequest.AsObject;
  static toObject(includeInstance: boolean, msg: FixEventMissRequest): FixEventMissRequest.AsObject;
  static serializeBinaryToWriter(message: FixEventMissRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FixEventMissRequest;
  static deserializeBinaryFromReader(message: FixEventMissRequest, reader: jspb.BinaryReader): FixEventMissRequest;
}

export namespace FixEventMissRequest {
  export type AsObject = {
    chainId: number,
    txHash: string,
    type: CSType,
    sig: Uint8Array | string,
    addr: string,
  }
}

export class FixEventMissResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): FixEventMissResponse;
  hasErr(): boolean;
  clearErr(): FixEventMissResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FixEventMissResponse.AsObject;
  static toObject(includeInstance: boolean, msg: FixEventMissResponse): FixEventMissResponse.AsObject;
  static serializeBinaryToWriter(message: FixEventMissResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FixEventMissResponse;
  static deserializeBinaryFromReader(message: FixEventMissResponse, reader: jspb.BinaryReader): FixEventMissResponse;
}

export namespace FixEventMissResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class GetAllConfigsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllConfigsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllConfigsRequest): GetAllConfigsRequest.AsObject;
  static serializeBinaryToWriter(message: GetAllConfigsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllConfigsRequest;
  static deserializeBinaryFromReader(message: GetAllConfigsRequest, reader: jspb.BinaryReader): GetAllConfigsRequest;
}

export namespace GetAllConfigsRequest {
  export type AsObject = {
  }
}

export class ExtendedPair extends jspb.Message {
  getPeggedPair(): sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair | undefined;
  setPeggedPair(value?: sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair): ExtendedPair;
  hasPeggedPair(): boolean;
  clearPeggedPair(): ExtendedPair;

  getMinDeposit(): string;
  setMinDeposit(value: string): ExtendedPair;

  getMaxDeposit(): string;
  setMaxDeposit(value: string): ExtendedPair;

  getMinBurn(): string;
  setMinBurn(value: string): ExtendedPair;

  getMaxBurn(): string;
  setMaxBurn(value: string): ExtendedPair;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtendedPair.AsObject;
  static toObject(includeInstance: boolean, msg: ExtendedPair): ExtendedPair.AsObject;
  static serializeBinaryToWriter(message: ExtendedPair, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtendedPair;
  static deserializeBinaryFromReader(message: ExtendedPair, reader: jspb.BinaryReader): ExtendedPair;
}

export namespace ExtendedPair {
  export type AsObject = {
    peggedPair?: sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair.AsObject,
    minDeposit: string,
    maxDeposit: string,
    minBurn: string,
    maxBurn: string,
  }
}

export class GetAllConfigsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetAllConfigsResponse;
  hasErr(): boolean;
  clearErr(): GetAllConfigsResponse;

  getPeggedPairsList(): Array<ExtendedPair>;
  setPeggedPairsList(value: Array<ExtendedPair>): GetAllConfigsResponse;
  clearPeggedPairsList(): GetAllConfigsResponse;
  addPeggedPairs(value?: ExtendedPair, index?: number): ExtendedPair;

  getCbrConfig(): sgn_cbridge_v1_cbridge_pb.CbrConfig | undefined;
  setCbrConfig(value?: sgn_cbridge_v1_cbridge_pb.CbrConfig): GetAllConfigsResponse;
  hasCbrConfig(): boolean;
  clearCbrConfig(): GetAllConfigsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllConfigsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllConfigsResponse): GetAllConfigsResponse.AsObject;
  static serializeBinaryToWriter(message: GetAllConfigsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllConfigsResponse;
  static deserializeBinaryFromReader(message: GetAllConfigsResponse, reader: jspb.BinaryReader): GetAllConfigsResponse;
}

export namespace GetAllConfigsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    peggedPairsList: Array<ExtendedPair.AsObject>,
    cbrConfig?: sgn_cbridge_v1_cbridge_pb.CbrConfig.AsObject,
  }
}

export class GetCbrConfigsOnChainRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): GetCbrConfigsOnChainRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCbrConfigsOnChainRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCbrConfigsOnChainRequest): GetCbrConfigsOnChainRequest.AsObject;
  static serializeBinaryToWriter(message: GetCbrConfigsOnChainRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCbrConfigsOnChainRequest;
  static deserializeBinaryFromReader(message: GetCbrConfigsOnChainRequest, reader: jspb.BinaryReader): GetCbrConfigsOnChainRequest;
}

export namespace GetCbrConfigsOnChainRequest {
  export type AsObject = {
    chainId: number,
  }
}

export class RfqFilterOrdersRequest extends jspb.Message {
  getStartTime(): number;
  setStartTime(value: number): RfqFilterOrdersRequest;

  getEndTime(): number;
  setEndTime(value: number): RfqFilterOrdersRequest;

  getLimit(): number;
  setLimit(value: number): RfqFilterOrdersRequest;

  getOffset(): number;
  setOffset(value: number): RfqFilterOrdersRequest;

  getStatusesList(): Array<OrderStatus>;
  setStatusesList(value: Array<OrderStatus>): RfqFilterOrdersRequest;
  clearStatusesList(): RfqFilterOrdersRequest;
  addStatuses(value: OrderStatus, index?: number): RfqFilterOrdersRequest;

  getMmIdsList(): Array<string>;
  setMmIdsList(value: Array<string>): RfqFilterOrdersRequest;
  clearMmIdsList(): RfqFilterOrdersRequest;
  addMmIds(value: string, index?: number): RfqFilterOrdersRequest;

  getMmAddrsList(): Array<string>;
  setMmAddrsList(value: Array<string>): RfqFilterOrdersRequest;
  clearMmAddrsList(): RfqFilterOrdersRequest;
  addMmAddrs(value: string, index?: number): RfqFilterOrdersRequest;

  getUsrAddrsList(): Array<string>;
  setUsrAddrsList(value: Array<string>): RfqFilterOrdersRequest;
  clearUsrAddrsList(): RfqFilterOrdersRequest;
  addUsrAddrs(value: string, index?: number): RfqFilterOrdersRequest;

  getSrcChainIdsList(): Array<number>;
  setSrcChainIdsList(value: Array<number>): RfqFilterOrdersRequest;
  clearSrcChainIdsList(): RfqFilterOrdersRequest;
  addSrcChainIds(value: number, index?: number): RfqFilterOrdersRequest;

  getDstChainIdsList(): Array<number>;
  setDstChainIdsList(value: Array<number>): RfqFilterOrdersRequest;
  clearDstChainIdsList(): RfqFilterOrdersRequest;
  addDstChainIds(value: number, index?: number): RfqFilterOrdersRequest;

  getSrcTokenSymbolsList(): Array<string>;
  setSrcTokenSymbolsList(value: Array<string>): RfqFilterOrdersRequest;
  clearSrcTokenSymbolsList(): RfqFilterOrdersRequest;
  addSrcTokenSymbols(value: string, index?: number): RfqFilterOrdersRequest;

  getDstTokenSymbolsList(): Array<string>;
  setDstTokenSymbolsList(value: Array<string>): RfqFilterOrdersRequest;
  clearDstTokenSymbolsList(): RfqFilterOrdersRequest;
  addDstTokenSymbols(value: string, index?: number): RfqFilterOrdersRequest;

  getSigAddr(): string;
  setSigAddr(value: string): RfqFilterOrdersRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): RfqFilterOrdersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RfqFilterOrdersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RfqFilterOrdersRequest): RfqFilterOrdersRequest.AsObject;
  static serializeBinaryToWriter(message: RfqFilterOrdersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RfqFilterOrdersRequest;
  static deserializeBinaryFromReader(message: RfqFilterOrdersRequest, reader: jspb.BinaryReader): RfqFilterOrdersRequest;
}

export namespace RfqFilterOrdersRequest {
  export type AsObject = {
    startTime: number,
    endTime: number,
    limit: number,
    offset: number,
    statusesList: Array<OrderStatus>,
    mmIdsList: Array<string>,
    mmAddrsList: Array<string>,
    usrAddrsList: Array<string>,
    srcChainIdsList: Array<number>,
    dstChainIdsList: Array<number>,
    srcTokenSymbolsList: Array<string>,
    dstTokenSymbolsList: Array<string>,
    sigAddr: string,
    sig: Uint8Array | string,
  }
}

export class ExtendedToken extends jspb.Message {
  getToken(): sgn_cbridge_v1_query_pb.Token | undefined;
  setToken(value?: sgn_cbridge_v1_query_pb.Token): ExtendedToken;
  hasToken(): boolean;
  clearToken(): ExtendedToken;

  getDelayThreshold(): string;
  setDelayThreshold(value: string): ExtendedToken;

  getEpochVolumeCaps(): string;
  setEpochVolumeCaps(value: string): ExtendedToken;

  getMinSend(): string;
  setMinSend(value: string): ExtendedToken;

  getMaxSend(): string;
  setMaxSend(value: string): ExtendedToken;

  getMinAdd(): string;
  setMinAdd(value: string): ExtendedToken;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtendedToken.AsObject;
  static toObject(includeInstance: boolean, msg: ExtendedToken): ExtendedToken.AsObject;
  static serializeBinaryToWriter(message: ExtendedToken, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtendedToken;
  static deserializeBinaryFromReader(message: ExtendedToken, reader: jspb.BinaryReader): ExtendedToken;
}

export namespace ExtendedToken {
  export type AsObject = {
    token?: sgn_cbridge_v1_query_pb.Token.AsObject,
    delayThreshold: string,
    epochVolumeCaps: string,
    minSend: string,
    maxSend: string,
    minAdd: string,
  }
}

export class GetCbrConfigsOnChainResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetCbrConfigsOnChainResponse;
  hasErr(): boolean;
  clearErr(): GetCbrConfigsOnChainResponse;

  getDelayPeriod(): string;
  setDelayPeriod(value: string): GetCbrConfigsOnChainResponse;

  getEpochLength(): string;
  setEpochLength(value: string): GetCbrConfigsOnChainResponse;

  getNativeWrap(): string;
  setNativeWrap(value: string): GetCbrConfigsOnChainResponse;

  getTokensList(): Array<ExtendedToken>;
  setTokensList(value: Array<ExtendedToken>): GetCbrConfigsOnChainResponse;
  clearTokensList(): GetCbrConfigsOnChainResponse;
  addTokens(value?: ExtendedToken, index?: number): ExtendedToken;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCbrConfigsOnChainResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCbrConfigsOnChainResponse): GetCbrConfigsOnChainResponse.AsObject;
  static serializeBinaryToWriter(message: GetCbrConfigsOnChainResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCbrConfigsOnChainResponse;
  static deserializeBinaryFromReader(message: GetCbrConfigsOnChainResponse, reader: jspb.BinaryReader): GetCbrConfigsOnChainResponse;
}

export namespace GetCbrConfigsOnChainResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    delayPeriod: string,
    epochLength: string,
    nativeWrap: string,
    tokensList: Array<ExtendedToken.AsObject>,
  }
}

export class RetentionRewardsEvent extends jspb.Message {
  getEventId(): number;
  setEventId(value: number): RetentionRewardsEvent;

  getEventStartTime(): number;
  setEventStartTime(value: number): RetentionRewardsEvent;

  getEventEndTime(): number;
  setEventEndTime(value: number): RetentionRewardsEvent;

  getWrapper(): RetentionRewardsEventLevelConfigWrapper | undefined;
  setWrapper(value?: RetentionRewardsEventLevelConfigWrapper): RetentionRewardsEvent;
  hasWrapper(): boolean;
  clearWrapper(): RetentionRewardsEvent;

  getEventPromoImgUrl(): string;
  setEventPromoImgUrl(value: string): RetentionRewardsEvent;

  getEventFaqLinkUrl(): string;
  setEventFaqLinkUrl(value: string): RetentionRewardsEvent;

  getEventRewardsTooltip(): string;
  setEventRewardsTooltip(value: string): RetentionRewardsEvent;

  getEventDescription(): string;
  setEventDescription(value: string): RetentionRewardsEvent;

  getEventTitle(): string;
  setEventTitle(value: string): RetentionRewardsEvent;

  getEventMaxRewardCap(): number;
  setEventMaxRewardCap(value: number): RetentionRewardsEvent;

  getSoFarSumReward(): number;
  setSoFarSumReward(value: number): RetentionRewardsEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RetentionRewardsEvent.AsObject;
  static toObject(includeInstance: boolean, msg: RetentionRewardsEvent): RetentionRewardsEvent.AsObject;
  static serializeBinaryToWriter(message: RetentionRewardsEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RetentionRewardsEvent;
  static deserializeBinaryFromReader(message: RetentionRewardsEvent, reader: jspb.BinaryReader): RetentionRewardsEvent;
}

export namespace RetentionRewardsEvent {
  export type AsObject = {
    eventId: number,
    eventStartTime: number,
    eventEndTime: number,
    wrapper?: RetentionRewardsEventLevelConfigWrapper.AsObject,
    eventPromoImgUrl: string,
    eventFaqLinkUrl: string,
    eventRewardsTooltip: string,
    eventDescription: string,
    eventTitle: string,
    eventMaxRewardCap: number,
    soFarSumReward: number,
  }
}

export class RetentionRewardsEventLevelConfigWrapper extends jspb.Message {
  getLevelConfigMap(): jspb.Map<string, RetentionRewardsLevelConfig>;
  clearLevelConfigMap(): RetentionRewardsEventLevelConfigWrapper;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RetentionRewardsEventLevelConfigWrapper.AsObject;
  static toObject(includeInstance: boolean, msg: RetentionRewardsEventLevelConfigWrapper): RetentionRewardsEventLevelConfigWrapper.AsObject;
  static serializeBinaryToWriter(message: RetentionRewardsEventLevelConfigWrapper, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RetentionRewardsEventLevelConfigWrapper;
  static deserializeBinaryFromReader(message: RetentionRewardsEventLevelConfigWrapper, reader: jspb.BinaryReader): RetentionRewardsEventLevelConfigWrapper;
}

export namespace RetentionRewardsEventLevelConfigWrapper {
  export type AsObject = {
    levelConfigMap: Array<[string, RetentionRewardsLevelConfig.AsObject]>,
  }
}

export class RetentionRewardsLevelConfig extends jspb.Message {
  getMaxReward(): string;
  setMaxReward(value: string): RetentionRewardsLevelConfig;

  getMaxTransferVolume(): number;
  setMaxTransferVolume(value: number): RetentionRewardsLevelConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RetentionRewardsLevelConfig.AsObject;
  static toObject(includeInstance: boolean, msg: RetentionRewardsLevelConfig): RetentionRewardsLevelConfig.AsObject;
  static serializeBinaryToWriter(message: RetentionRewardsLevelConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RetentionRewardsLevelConfig;
  static deserializeBinaryFromReader(message: RetentionRewardsLevelConfig, reader: jspb.BinaryReader): RetentionRewardsLevelConfig;
}

export namespace RetentionRewardsLevelConfig {
  export type AsObject = {
    maxReward: string,
    maxTransferVolume: number,
  }
}

export class GetRetentionRewardsInfoRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): GetRetentionRewardsInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRetentionRewardsInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetRetentionRewardsInfoRequest): GetRetentionRewardsInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetRetentionRewardsInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRetentionRewardsInfoRequest;
  static deserializeBinaryFromReader(message: GetRetentionRewardsInfoRequest, reader: jspb.BinaryReader): GetRetentionRewardsInfoRequest;
}

export namespace GetRetentionRewardsInfoRequest {
  export type AsObject = {
    addr: string,
  }
}

export class GetRetentionRewardsInfoResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetRetentionRewardsInfoResponse;
  hasErr(): boolean;
  clearErr(): GetRetentionRewardsInfoResponse;

  getEventId(): number;
  setEventId(value: number): GetRetentionRewardsInfoResponse;

  getEventEndTime(): number;
  setEventEndTime(value: number): GetRetentionRewardsInfoResponse;

  getMaxReward(): string;
  setMaxReward(value: string): GetRetentionRewardsInfoResponse;

  getMaxTransferVolume(): number;
  setMaxTransferVolume(value: number): GetRetentionRewardsInfoResponse;

  getCurrentReward(): string;
  setCurrentReward(value: string): GetRetentionRewardsInfoResponse;

  getCelrUsdPrice(): number;
  setCelrUsdPrice(value: number): GetRetentionRewardsInfoResponse;

  getClaimTime(): number;
  setClaimTime(value: number): GetRetentionRewardsInfoResponse;

  getSignature(): sgn_common_v1_common_pb.Signature | undefined;
  setSignature(value?: sgn_common_v1_common_pb.Signature): GetRetentionRewardsInfoResponse;
  hasSignature(): boolean;
  clearSignature(): GetRetentionRewardsInfoResponse;

  getEventPromoImgUrl(): string;
  setEventPromoImgUrl(value: string): GetRetentionRewardsInfoResponse;

  getEventFaqLinkUrl(): string;
  setEventFaqLinkUrl(value: string): GetRetentionRewardsInfoResponse;

  getEventRewardsTooltip(): string;
  setEventRewardsTooltip(value: string): GetRetentionRewardsInfoResponse;

  getEventDescription(): string;
  setEventDescription(value: string): GetRetentionRewardsInfoResponse;

  getEventTitle(): string;
  setEventTitle(value: string): GetRetentionRewardsInfoResponse;

  getEventMaxRewardCap(): number;
  setEventMaxRewardCap(value: number): GetRetentionRewardsInfoResponse;

  getSoFarSumReward(): number;
  setSoFarSumReward(value: number): GetRetentionRewardsInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRetentionRewardsInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetRetentionRewardsInfoResponse): GetRetentionRewardsInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetRetentionRewardsInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRetentionRewardsInfoResponse;
  static deserializeBinaryFromReader(message: GetRetentionRewardsInfoResponse, reader: jspb.BinaryReader): GetRetentionRewardsInfoResponse;
}

export namespace GetRetentionRewardsInfoResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    eventId: number,
    eventEndTime: number,
    maxReward: string,
    maxTransferVolume: number,
    currentReward: string,
    celrUsdPrice: number,
    claimTime: number,
    signature?: sgn_common_v1_common_pb.Signature.AsObject,
    eventPromoImgUrl: string,
    eventFaqLinkUrl: string,
    eventRewardsTooltip: string,
    eventDescription: string,
    eventTitle: string,
    eventMaxRewardCap: number,
    soFarSumReward: number,
  }
}

export class ClaimRetentionRewardsRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): ClaimRetentionRewardsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimRetentionRewardsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimRetentionRewardsRequest): ClaimRetentionRewardsRequest.AsObject;
  static serializeBinaryToWriter(message: ClaimRetentionRewardsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimRetentionRewardsRequest;
  static deserializeBinaryFromReader(message: ClaimRetentionRewardsRequest, reader: jspb.BinaryReader): ClaimRetentionRewardsRequest;
}

export namespace ClaimRetentionRewardsRequest {
  export type AsObject = {
    addr: string,
  }
}

export class ClaimRetentionRewardsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): ClaimRetentionRewardsResponse;
  hasErr(): boolean;
  clearErr(): ClaimRetentionRewardsResponse;

  getEventId(): number;
  setEventId(value: number): ClaimRetentionRewardsResponse;

  getCurrentReward(): string;
  setCurrentReward(value: string): ClaimRetentionRewardsResponse;

  getSignature(): sgn_common_v1_common_pb.Signature | undefined;
  setSignature(value?: sgn_common_v1_common_pb.Signature): ClaimRetentionRewardsResponse;
  hasSignature(): boolean;
  clearSignature(): ClaimRetentionRewardsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimRetentionRewardsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimRetentionRewardsResponse): ClaimRetentionRewardsResponse.AsObject;
  static serializeBinaryToWriter(message: ClaimRetentionRewardsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimRetentionRewardsResponse;
  static deserializeBinaryFromReader(message: ClaimRetentionRewardsResponse, reader: jspb.BinaryReader): ClaimRetentionRewardsResponse;
}

export namespace ClaimRetentionRewardsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    eventId: number,
    currentReward: string,
    signature?: sgn_common_v1_common_pb.Signature.AsObject,
  }
}

export class GetIncentiveCampaignCelrRankRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetIncentiveCampaignCelrRankRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetIncentiveCampaignCelrRankRequest): GetIncentiveCampaignCelrRankRequest.AsObject;
  static serializeBinaryToWriter(message: GetIncentiveCampaignCelrRankRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetIncentiveCampaignCelrRankRequest;
  static deserializeBinaryFromReader(message: GetIncentiveCampaignCelrRankRequest, reader: jspb.BinaryReader): GetIncentiveCampaignCelrRankRequest;
}

export namespace GetIncentiveCampaignCelrRankRequest {
  export type AsObject = {
  }
}

export class GetIncentiveCampaignCelrRankResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetIncentiveCampaignCelrRankResponse;
  hasErr(): boolean;
  clearErr(): GetIncentiveCampaignCelrRankResponse;

  getRanksList(): Array<IncentiveCampaignRank>;
  setRanksList(value: Array<IncentiveCampaignRank>): GetIncentiveCampaignCelrRankResponse;
  clearRanksList(): GetIncentiveCampaignCelrRankResponse;
  addRanks(value?: IncentiveCampaignRank, index?: number): IncentiveCampaignRank;

  getUpdateTime(): number;
  setUpdateTime(value: number): GetIncentiveCampaignCelrRankResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetIncentiveCampaignCelrRankResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetIncentiveCampaignCelrRankResponse): GetIncentiveCampaignCelrRankResponse.AsObject;
  static serializeBinaryToWriter(message: GetIncentiveCampaignCelrRankResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetIncentiveCampaignCelrRankResponse;
  static deserializeBinaryFromReader(message: GetIncentiveCampaignCelrRankResponse, reader: jspb.BinaryReader): GetIncentiveCampaignCelrRankResponse;
}

export namespace GetIncentiveCampaignCelrRankResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    ranksList: Array<IncentiveCampaignRank.AsObject>,
    updateTime: number,
  }
}

export class GetIncentiveCampaignBnbRankRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetIncentiveCampaignBnbRankRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetIncentiveCampaignBnbRankRequest): GetIncentiveCampaignBnbRankRequest.AsObject;
  static serializeBinaryToWriter(message: GetIncentiveCampaignBnbRankRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetIncentiveCampaignBnbRankRequest;
  static deserializeBinaryFromReader(message: GetIncentiveCampaignBnbRankRequest, reader: jspb.BinaryReader): GetIncentiveCampaignBnbRankRequest;
}

export namespace GetIncentiveCampaignBnbRankRequest {
  export type AsObject = {
  }
}

export class GetIncentiveCampaignBnbRankResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetIncentiveCampaignBnbRankResponse;
  hasErr(): boolean;
  clearErr(): GetIncentiveCampaignBnbRankResponse;

  getRanksList(): Array<IncentiveCampaignRank>;
  setRanksList(value: Array<IncentiveCampaignRank>): GetIncentiveCampaignBnbRankResponse;
  clearRanksList(): GetIncentiveCampaignBnbRankResponse;
  addRanks(value?: IncentiveCampaignRank, index?: number): IncentiveCampaignRank;

  getUpdateTime(): number;
  setUpdateTime(value: number): GetIncentiveCampaignBnbRankResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetIncentiveCampaignBnbRankResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetIncentiveCampaignBnbRankResponse): GetIncentiveCampaignBnbRankResponse.AsObject;
  static serializeBinaryToWriter(message: GetIncentiveCampaignBnbRankResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetIncentiveCampaignBnbRankResponse;
  static deserializeBinaryFromReader(message: GetIncentiveCampaignBnbRankResponse, reader: jspb.BinaryReader): GetIncentiveCampaignBnbRankResponse;
}

export namespace GetIncentiveCampaignBnbRankResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    ranksList: Array<IncentiveCampaignRank.AsObject>,
    updateTime: number,
  }
}

export class InIncentiveCampaignBnbWhiteListRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): InIncentiveCampaignBnbWhiteListRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InIncentiveCampaignBnbWhiteListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InIncentiveCampaignBnbWhiteListRequest): InIncentiveCampaignBnbWhiteListRequest.AsObject;
  static serializeBinaryToWriter(message: InIncentiveCampaignBnbWhiteListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InIncentiveCampaignBnbWhiteListRequest;
  static deserializeBinaryFromReader(message: InIncentiveCampaignBnbWhiteListRequest, reader: jspb.BinaryReader): InIncentiveCampaignBnbWhiteListRequest;
}

export namespace InIncentiveCampaignBnbWhiteListRequest {
  export type AsObject = {
    addr: string,
  }
}

export class InIncentiveCampaignBnbWhiteListResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): InIncentiveCampaignBnbWhiteListResponse;
  hasErr(): boolean;
  clearErr(): InIncentiveCampaignBnbWhiteListResponse;

  getEligible(): boolean;
  setEligible(value: boolean): InIncentiveCampaignBnbWhiteListResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InIncentiveCampaignBnbWhiteListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: InIncentiveCampaignBnbWhiteListResponse): InIncentiveCampaignBnbWhiteListResponse.AsObject;
  static serializeBinaryToWriter(message: InIncentiveCampaignBnbWhiteListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InIncentiveCampaignBnbWhiteListResponse;
  static deserializeBinaryFromReader(message: InIncentiveCampaignBnbWhiteListResponse, reader: jspb.BinaryReader): InIncentiveCampaignBnbWhiteListResponse;
}

export namespace InIncentiveCampaignBnbWhiteListResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    eligible: boolean,
  }
}

export class IncentiveCampaignRank extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): IncentiveCampaignRank;

  getRank(): number;
  setRank(value: number): IncentiveCampaignRank;

  getVolume(): number;
  setVolume(value: number): IncentiveCampaignRank;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IncentiveCampaignRank.AsObject;
  static toObject(includeInstance: boolean, msg: IncentiveCampaignRank): IncentiveCampaignRank.AsObject;
  static serializeBinaryToWriter(message: IncentiveCampaignRank, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IncentiveCampaignRank;
  static deserializeBinaryFromReader(message: IncentiveCampaignRank, reader: jspb.BinaryReader): IncentiveCampaignRank;
}

export namespace IncentiveCampaignRank {
  export type AsObject = {
    addr: string,
    rank: number,
    volume: number,
  }
}

export class FeeRebateEvent extends jspb.Message {
  getEventId(): number;
  setEventId(value: number): FeeRebateEvent;

  getEventStartTime(): number;
  setEventStartTime(value: number): FeeRebateEvent;

  getEventEndTime(): number;
  setEventEndTime(value: number): FeeRebateEvent;

  getWrapper(): FeeRebateEventLevelConfigWrapper | undefined;
  setWrapper(value?: FeeRebateEventLevelConfigWrapper): FeeRebateEvent;
  hasWrapper(): boolean;
  clearWrapper(): FeeRebateEvent;

  getEventMaxRewardCap(): number;
  setEventMaxRewardCap(value: number): FeeRebateEvent;

  getSoFarSumReward(): number;
  setSoFarSumReward(value: number): FeeRebateEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeeRebateEvent.AsObject;
  static toObject(includeInstance: boolean, msg: FeeRebateEvent): FeeRebateEvent.AsObject;
  static serializeBinaryToWriter(message: FeeRebateEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeeRebateEvent;
  static deserializeBinaryFromReader(message: FeeRebateEvent, reader: jspb.BinaryReader): FeeRebateEvent;
}

export namespace FeeRebateEvent {
  export type AsObject = {
    eventId: number,
    eventStartTime: number,
    eventEndTime: number,
    wrapper?: FeeRebateEventLevelConfigWrapper.AsObject,
    eventMaxRewardCap: number,
    soFarSumReward: number,
  }
}

export class FeeRebateEventLevelConfigWrapper extends jspb.Message {
  getLevelDivisionLowerBoundList(): Array<number>;
  setLevelDivisionLowerBoundList(value: Array<number>): FeeRebateEventLevelConfigWrapper;
  clearLevelDivisionLowerBoundList(): FeeRebateEventLevelConfigWrapper;
  addLevelDivisionLowerBound(value: number, index?: number): FeeRebateEventLevelConfigWrapper;

  getLevelConfigMap(): jspb.Map<string, FeeRebateLevelConfig>;
  clearLevelConfigMap(): FeeRebateEventLevelConfigWrapper;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeeRebateEventLevelConfigWrapper.AsObject;
  static toObject(includeInstance: boolean, msg: FeeRebateEventLevelConfigWrapper): FeeRebateEventLevelConfigWrapper.AsObject;
  static serializeBinaryToWriter(message: FeeRebateEventLevelConfigWrapper, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeeRebateEventLevelConfigWrapper;
  static deserializeBinaryFromReader(message: FeeRebateEventLevelConfigWrapper, reader: jspb.BinaryReader): FeeRebateEventLevelConfigWrapper;
}

export namespace FeeRebateEventLevelConfigWrapper {
  export type AsObject = {
    levelDivisionLowerBoundList: Array<number>,
    levelConfigMap: Array<[string, FeeRebateLevelConfig.AsObject]>,
  }
}

export class FeeRebateLevelConfig extends jspb.Message {
  getRebatePortion(): number;
  setRebatePortion(value: number): FeeRebateLevelConfig;

  getMaxReward(): string;
  setMaxReward(value: string): FeeRebateLevelConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeeRebateLevelConfig.AsObject;
  static toObject(includeInstance: boolean, msg: FeeRebateLevelConfig): FeeRebateLevelConfig.AsObject;
  static serializeBinaryToWriter(message: FeeRebateLevelConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeeRebateLevelConfig;
  static deserializeBinaryFromReader(message: FeeRebateLevelConfig, reader: jspb.BinaryReader): FeeRebateLevelConfig;
}

export namespace FeeRebateLevelConfig {
  export type AsObject = {
    rebatePortion: number,
    maxReward: string,
  }
}

export class GetFeeRebateInfoRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): GetFeeRebateInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeeRebateInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeeRebateInfoRequest): GetFeeRebateInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetFeeRebateInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeeRebateInfoRequest;
  static deserializeBinaryFromReader(message: GetFeeRebateInfoRequest, reader: jspb.BinaryReader): GetFeeRebateInfoRequest;
}

export namespace GetFeeRebateInfoRequest {
  export type AsObject = {
    addr: string,
  }
}

export class GetFeeRebateInfoResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetFeeRebateInfoResponse;
  hasErr(): boolean;
  clearErr(): GetFeeRebateInfoResponse;

  getEventId(): number;
  setEventId(value: number): GetFeeRebateInfoResponse;

  getEventEndTime(): number;
  setEventEndTime(value: number): GetFeeRebateInfoResponse;

  getRebatePortion(): number;
  setRebatePortion(value: number): GetFeeRebateInfoResponse;

  getReward(): string;
  setReward(value: string): GetFeeRebateInfoResponse;

  getCelrUsdPrice(): number;
  setCelrUsdPrice(value: number): GetFeeRebateInfoResponse;

  getClaimTime(): number;
  setClaimTime(value: number): GetFeeRebateInfoResponse;

  getSignature(): sgn_common_v1_common_pb.Signature | undefined;
  setSignature(value?: sgn_common_v1_common_pb.Signature): GetFeeRebateInfoResponse;
  hasSignature(): boolean;
  clearSignature(): GetFeeRebateInfoResponse;

  getEventMaxRewardCap(): number;
  setEventMaxRewardCap(value: number): GetFeeRebateInfoResponse;

  getSoFarSumReward(): number;
  setSoFarSumReward(value: number): GetFeeRebateInfoResponse;

  getRewardTokenSymbol(): string;
  setRewardTokenSymbol(value: string): GetFeeRebateInfoResponse;

  getRewardAmt(): number;
  setRewardAmt(value: number): GetFeeRebateInfoResponse;

  getPerUserMaxRewardCap(): number;
  setPerUserMaxRewardCap(value: number): GetFeeRebateInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeeRebateInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeeRebateInfoResponse): GetFeeRebateInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetFeeRebateInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeeRebateInfoResponse;
  static deserializeBinaryFromReader(message: GetFeeRebateInfoResponse, reader: jspb.BinaryReader): GetFeeRebateInfoResponse;
}

export namespace GetFeeRebateInfoResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    eventId: number,
    eventEndTime: number,
    rebatePortion: number,
    reward: string,
    celrUsdPrice: number,
    claimTime: number,
    signature?: sgn_common_v1_common_pb.Signature.AsObject,
    eventMaxRewardCap: number,
    soFarSumReward: number,
    rewardTokenSymbol: string,
    rewardAmt: number,
    perUserMaxRewardCap: number,
  }
}

export class ClaimFeeRebateRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): ClaimFeeRebateRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimFeeRebateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimFeeRebateRequest): ClaimFeeRebateRequest.AsObject;
  static serializeBinaryToWriter(message: ClaimFeeRebateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimFeeRebateRequest;
  static deserializeBinaryFromReader(message: ClaimFeeRebateRequest, reader: jspb.BinaryReader): ClaimFeeRebateRequest;
}

export namespace ClaimFeeRebateRequest {
  export type AsObject = {
    addr: string,
  }
}

export class ClaimFeeRebateResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): ClaimFeeRebateResponse;
  hasErr(): boolean;
  clearErr(): ClaimFeeRebateResponse;

  getEventId(): number;
  setEventId(value: number): ClaimFeeRebateResponse;

  getReward(): string;
  setReward(value: string): ClaimFeeRebateResponse;

  getSignature(): sgn_common_v1_common_pb.Signature | undefined;
  setSignature(value?: sgn_common_v1_common_pb.Signature): ClaimFeeRebateResponse;
  hasSignature(): boolean;
  clearSignature(): ClaimFeeRebateResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimFeeRebateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimFeeRebateResponse): ClaimFeeRebateResponse.AsObject;
  static serializeBinaryToWriter(message: ClaimFeeRebateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimFeeRebateResponse;
  static deserializeBinaryFromReader(message: ClaimFeeRebateResponse, reader: jspb.BinaryReader): ClaimFeeRebateResponse;
}

export namespace ClaimFeeRebateResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    eventId: number,
    reward: string,
    signature?: sgn_common_v1_common_pb.Signature.AsObject,
  }
}

export class BscCampaignEventConfig extends jspb.Message {
  getEventId(): number;
  setEventId(value: number): BscCampaignEventConfig;

  getEventStartTime(): number;
  setEventStartTime(value: number): BscCampaignEventConfig;

  getEventEndTime(): number;
  setEventEndTime(value: number): BscCampaignEventConfig;

  getEventPromoImgUrl(): string;
  setEventPromoImgUrl(value: string): BscCampaignEventConfig;

  getEventFaqLinkUrl(): string;
  setEventFaqLinkUrl(value: string): BscCampaignEventConfig;

  getEventRewardsTooltip(): string;
  setEventRewardsTooltip(value: string): BscCampaignEventConfig;

  getEventDescription(): string;
  setEventDescription(value: string): BscCampaignEventConfig;

  getEventTitle(): string;
  setEventTitle(value: string): BscCampaignEventConfig;

  getWbnbAddr(): string;
  setWbnbAddr(value: string): BscCampaignEventConfig;

  getRewardContractAddr(): string;
  setRewardContractAddr(value: string): BscCampaignEventConfig;

  getEventMaxRewardCap(): number;
  setEventMaxRewardCap(value: number): BscCampaignEventConfig;

  getSoFarSumReward(): number;
  setSoFarSumReward(value: number): BscCampaignEventConfig;

  getMaxReward(): string;
  setMaxReward(value: string): BscCampaignEventConfig;

  getMaxTransferVolume(): number;
  setMaxTransferVolume(value: number): BscCampaignEventConfig;

  getTransferWhiteList(): BscCampaignTransferWhiteListWrapper | undefined;
  setTransferWhiteList(value?: BscCampaignTransferWhiteListWrapper): BscCampaignEventConfig;
  hasTransferWhiteList(): boolean;
  clearTransferWhiteList(): BscCampaignEventConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BscCampaignEventConfig.AsObject;
  static toObject(includeInstance: boolean, msg: BscCampaignEventConfig): BscCampaignEventConfig.AsObject;
  static serializeBinaryToWriter(message: BscCampaignEventConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BscCampaignEventConfig;
  static deserializeBinaryFromReader(message: BscCampaignEventConfig, reader: jspb.BinaryReader): BscCampaignEventConfig;
}

export namespace BscCampaignEventConfig {
  export type AsObject = {
    eventId: number,
    eventStartTime: number,
    eventEndTime: number,
    eventPromoImgUrl: string,
    eventFaqLinkUrl: string,
    eventRewardsTooltip: string,
    eventDescription: string,
    eventTitle: string,
    wbnbAddr: string,
    rewardContractAddr: string,
    eventMaxRewardCap: number,
    soFarSumReward: number,
    maxReward: string,
    maxTransferVolume: number,
    transferWhiteList?: BscCampaignTransferWhiteListWrapper.AsObject,
  }
}

export class BscCampaignTransferWhiteListWrapper extends jspb.Message {
  getTransferWhiteListMap(): jspb.Map<string, BscCampaignTransferWhiteList>;
  clearTransferWhiteListMap(): BscCampaignTransferWhiteListWrapper;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BscCampaignTransferWhiteListWrapper.AsObject;
  static toObject(includeInstance: boolean, msg: BscCampaignTransferWhiteListWrapper): BscCampaignTransferWhiteListWrapper.AsObject;
  static serializeBinaryToWriter(message: BscCampaignTransferWhiteListWrapper, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BscCampaignTransferWhiteListWrapper;
  static deserializeBinaryFromReader(message: BscCampaignTransferWhiteListWrapper, reader: jspb.BinaryReader): BscCampaignTransferWhiteListWrapper;
}

export namespace BscCampaignTransferWhiteListWrapper {
  export type AsObject = {
    transferWhiteListMap: Array<[string, BscCampaignTransferWhiteList.AsObject]>,
  }
}

export class BscCampaignTransferWhiteList extends jspb.Message {
  getChainIdsList(): Array<number>;
  setChainIdsList(value: Array<number>): BscCampaignTransferWhiteList;
  clearChainIdsList(): BscCampaignTransferWhiteList;
  addChainIds(value: number, index?: number): BscCampaignTransferWhiteList;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BscCampaignTransferWhiteList.AsObject;
  static toObject(includeInstance: boolean, msg: BscCampaignTransferWhiteList): BscCampaignTransferWhiteList.AsObject;
  static serializeBinaryToWriter(message: BscCampaignTransferWhiteList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BscCampaignTransferWhiteList;
  static deserializeBinaryFromReader(message: BscCampaignTransferWhiteList, reader: jspb.BinaryReader): BscCampaignTransferWhiteList;
}

export namespace BscCampaignTransferWhiteList {
  export type AsObject = {
    chainIdsList: Array<number>,
  }
}

export class GetBscCampaignInfoRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): GetBscCampaignInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBscCampaignInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBscCampaignInfoRequest): GetBscCampaignInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetBscCampaignInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBscCampaignInfoRequest;
  static deserializeBinaryFromReader(message: GetBscCampaignInfoRequest, reader: jspb.BinaryReader): GetBscCampaignInfoRequest;
}

export namespace GetBscCampaignInfoRequest {
  export type AsObject = {
    addr: string,
  }
}

export class BscCampaignInfo extends jspb.Message {
  getEventConfig(): BscCampaignEventConfig | undefined;
  setEventConfig(value?: BscCampaignEventConfig): BscCampaignInfo;
  hasEventConfig(): boolean;
  clearEventConfig(): BscCampaignInfo;

  getCurrentTransferVolume(): number;
  setCurrentTransferVolume(value: number): BscCampaignInfo;

  getWbnbUsdPrice(): number;
  setWbnbUsdPrice(value: number): BscCampaignInfo;

  getClaimTime(): number;
  setClaimTime(value: number): BscCampaignInfo;

  getSignature(): sgn_common_v1_common_pb.Signature | undefined;
  setSignature(value?: sgn_common_v1_common_pb.Signature): BscCampaignInfo;
  hasSignature(): boolean;
  clearSignature(): BscCampaignInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BscCampaignInfo.AsObject;
  static toObject(includeInstance: boolean, msg: BscCampaignInfo): BscCampaignInfo.AsObject;
  static serializeBinaryToWriter(message: BscCampaignInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BscCampaignInfo;
  static deserializeBinaryFromReader(message: BscCampaignInfo, reader: jspb.BinaryReader): BscCampaignInfo;
}

export namespace BscCampaignInfo {
  export type AsObject = {
    eventConfig?: BscCampaignEventConfig.AsObject,
    currentTransferVolume: number,
    wbnbUsdPrice: number,
    claimTime: number,
    signature?: sgn_common_v1_common_pb.Signature.AsObject,
  }
}

export class GetBscCampaignInfoResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetBscCampaignInfoResponse;
  hasErr(): boolean;
  clearErr(): GetBscCampaignInfoResponse;

  getInfoList(): Array<BscCampaignInfo>;
  setInfoList(value: Array<BscCampaignInfo>): GetBscCampaignInfoResponse;
  clearInfoList(): GetBscCampaignInfoResponse;
  addInfo(value?: BscCampaignInfo, index?: number): BscCampaignInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBscCampaignInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetBscCampaignInfoResponse): GetBscCampaignInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetBscCampaignInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBscCampaignInfoResponse;
  static deserializeBinaryFromReader(message: GetBscCampaignInfoResponse, reader: jspb.BinaryReader): GetBscCampaignInfoResponse;
}

export namespace GetBscCampaignInfoResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    infoList: Array<BscCampaignInfo.AsObject>,
  }
}

export class ClaimGetBscCampaignRewardRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): ClaimGetBscCampaignRewardRequest;

  getEventId(): number;
  setEventId(value: number): ClaimGetBscCampaignRewardRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimGetBscCampaignRewardRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimGetBscCampaignRewardRequest): ClaimGetBscCampaignRewardRequest.AsObject;
  static serializeBinaryToWriter(message: ClaimGetBscCampaignRewardRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimGetBscCampaignRewardRequest;
  static deserializeBinaryFromReader(message: ClaimGetBscCampaignRewardRequest, reader: jspb.BinaryReader): ClaimGetBscCampaignRewardRequest;
}

export namespace ClaimGetBscCampaignRewardRequest {
  export type AsObject = {
    addr: string,
    eventId: number,
  }
}

export class ClaimGetBscCampaignRewardResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): ClaimGetBscCampaignRewardResponse;
  hasErr(): boolean;
  clearErr(): ClaimGetBscCampaignRewardResponse;

  getEventId(): number;
  setEventId(value: number): ClaimGetBscCampaignRewardResponse;

  getCurrentReward(): string;
  setCurrentReward(value: string): ClaimGetBscCampaignRewardResponse;

  getSignature(): sgn_common_v1_common_pb.Signature | undefined;
  setSignature(value?: sgn_common_v1_common_pb.Signature): ClaimGetBscCampaignRewardResponse;
  hasSignature(): boolean;
  clearSignature(): ClaimGetBscCampaignRewardResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimGetBscCampaignRewardResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimGetBscCampaignRewardResponse): ClaimGetBscCampaignRewardResponse.AsObject;
  static serializeBinaryToWriter(message: ClaimGetBscCampaignRewardResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimGetBscCampaignRewardResponse;
  static deserializeBinaryFromReader(message: ClaimGetBscCampaignRewardResponse, reader: jspb.BinaryReader): ClaimGetBscCampaignRewardResponse;
}

export namespace ClaimGetBscCampaignRewardResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    eventId: number,
    currentReward: string,
    signature?: sgn_common_v1_common_pb.Signature.AsObject,
  }
}

export class GetCurrentBlockNumberByNodeRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCurrentBlockNumberByNodeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCurrentBlockNumberByNodeRequest): GetCurrentBlockNumberByNodeRequest.AsObject;
  static serializeBinaryToWriter(message: GetCurrentBlockNumberByNodeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCurrentBlockNumberByNodeRequest;
  static deserializeBinaryFromReader(message: GetCurrentBlockNumberByNodeRequest, reader: jspb.BinaryReader): GetCurrentBlockNumberByNodeRequest;
}

export namespace GetCurrentBlockNumberByNodeRequest {
  export type AsObject = {
  }
}

export class GetCurrentBlockNumberByNodeResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetCurrentBlockNumberByNodeResponse;
  hasErr(): boolean;
  clearErr(): GetCurrentBlockNumberByNodeResponse;

  getReportsMap(): jspb.Map<string, sgn_health_v1_health_pb.SgnAnalyticsReport>;
  clearReportsMap(): GetCurrentBlockNumberByNodeResponse;

  getProblematicAddrsList(): Array<string>;
  setProblematicAddrsList(value: Array<string>): GetCurrentBlockNumberByNodeResponse;
  clearProblematicAddrsList(): GetCurrentBlockNumberByNodeResponse;
  addProblematicAddrs(value: string, index?: number): GetCurrentBlockNumberByNodeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCurrentBlockNumberByNodeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCurrentBlockNumberByNodeResponse): GetCurrentBlockNumberByNodeResponse.AsObject;
  static serializeBinaryToWriter(message: GetCurrentBlockNumberByNodeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCurrentBlockNumberByNodeResponse;
  static deserializeBinaryFromReader(message: GetCurrentBlockNumberByNodeResponse, reader: jspb.BinaryReader): GetCurrentBlockNumberByNodeResponse;
}

export namespace GetCurrentBlockNumberByNodeResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    reportsMap: Array<[string, sgn_health_v1_health_pb.SgnAnalyticsReport.AsObject]>,
    problematicAddrsList: Array<string>,
  }
}

export class SaveServicePoolToggleConfigsRequest extends jspb.Message {
  getSigAddr(): string;
  setSigAddr(value: string): SaveServicePoolToggleConfigsRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): SaveServicePoolToggleConfigsRequest;

  getChainTokensList(): Array<TogglePoolTokenInfo>;
  setChainTokensList(value: Array<TogglePoolTokenInfo>): SaveServicePoolToggleConfigsRequest;
  clearChainTokensList(): SaveServicePoolToggleConfigsRequest;
  addChainTokens(value?: TogglePoolTokenInfo, index?: number): TogglePoolTokenInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SaveServicePoolToggleConfigsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SaveServicePoolToggleConfigsRequest): SaveServicePoolToggleConfigsRequest.AsObject;
  static serializeBinaryToWriter(message: SaveServicePoolToggleConfigsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SaveServicePoolToggleConfigsRequest;
  static deserializeBinaryFromReader(message: SaveServicePoolToggleConfigsRequest, reader: jspb.BinaryReader): SaveServicePoolToggleConfigsRequest;
}

export namespace SaveServicePoolToggleConfigsRequest {
  export type AsObject = {
    sigAddr: string,
    sig: Uint8Array | string,
    chainTokensList: Array<TogglePoolTokenInfo.AsObject>,
  }
}

export class SaveServicePoolToggleConfigsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): SaveServicePoolToggleConfigsResponse;
  hasErr(): boolean;
  clearErr(): SaveServicePoolToggleConfigsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SaveServicePoolToggleConfigsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SaveServicePoolToggleConfigsResponse): SaveServicePoolToggleConfigsResponse.AsObject;
  static serializeBinaryToWriter(message: SaveServicePoolToggleConfigsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SaveServicePoolToggleConfigsResponse;
  static deserializeBinaryFromReader(message: SaveServicePoolToggleConfigsResponse, reader: jspb.BinaryReader): SaveServicePoolToggleConfigsResponse;
}

export namespace SaveServicePoolToggleConfigsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class SaveServicePegToggleConfigsRequest extends jspb.Message {
  getSigAddr(): string;
  setSigAddr(value: string): SaveServicePegToggleConfigsRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): SaveServicePegToggleConfigsRequest;

  getChainTokensList(): Array<TogglePegTokenInfo>;
  setChainTokensList(value: Array<TogglePegTokenInfo>): SaveServicePegToggleConfigsRequest;
  clearChainTokensList(): SaveServicePegToggleConfigsRequest;
  addChainTokens(value?: TogglePegTokenInfo, index?: number): TogglePegTokenInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SaveServicePegToggleConfigsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SaveServicePegToggleConfigsRequest): SaveServicePegToggleConfigsRequest.AsObject;
  static serializeBinaryToWriter(message: SaveServicePegToggleConfigsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SaveServicePegToggleConfigsRequest;
  static deserializeBinaryFromReader(message: SaveServicePegToggleConfigsRequest, reader: jspb.BinaryReader): SaveServicePegToggleConfigsRequest;
}

export namespace SaveServicePegToggleConfigsRequest {
  export type AsObject = {
    sigAddr: string,
    sig: Uint8Array | string,
    chainTokensList: Array<TogglePegTokenInfo.AsObject>,
  }
}

export class SaveServicePegToggleConfigsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): SaveServicePegToggleConfigsResponse;
  hasErr(): boolean;
  clearErr(): SaveServicePegToggleConfigsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SaveServicePegToggleConfigsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SaveServicePegToggleConfigsResponse): SaveServicePegToggleConfigsResponse.AsObject;
  static serializeBinaryToWriter(message: SaveServicePegToggleConfigsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SaveServicePegToggleConfigsResponse;
  static deserializeBinaryFromReader(message: SaveServicePegToggleConfigsResponse, reader: jspb.BinaryReader): SaveServicePegToggleConfigsResponse;
}

export namespace SaveServicePegToggleConfigsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class GetServicePoolToggleConfigsRequest extends jspb.Message {
  getSigAddr(): string;
  setSigAddr(value: string): GetServicePoolToggleConfigsRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): GetServicePoolToggleConfigsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetServicePoolToggleConfigsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetServicePoolToggleConfigsRequest): GetServicePoolToggleConfigsRequest.AsObject;
  static serializeBinaryToWriter(message: GetServicePoolToggleConfigsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetServicePoolToggleConfigsRequest;
  static deserializeBinaryFromReader(message: GetServicePoolToggleConfigsRequest, reader: jspb.BinaryReader): GetServicePoolToggleConfigsRequest;
}

export namespace GetServicePoolToggleConfigsRequest {
  export type AsObject = {
    sigAddr: string,
    sig: Uint8Array | string,
  }
}

export class GetServicePoolToggleConfigsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetServicePoolToggleConfigsResponse;
  hasErr(): boolean;
  clearErr(): GetServicePoolToggleConfigsResponse;

  getChainTokensList(): Array<TogglePoolTokenInfo>;
  setChainTokensList(value: Array<TogglePoolTokenInfo>): GetServicePoolToggleConfigsResponse;
  clearChainTokensList(): GetServicePoolToggleConfigsResponse;
  addChainTokens(value?: TogglePoolTokenInfo, index?: number): TogglePoolTokenInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetServicePoolToggleConfigsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetServicePoolToggleConfigsResponse): GetServicePoolToggleConfigsResponse.AsObject;
  static serializeBinaryToWriter(message: GetServicePoolToggleConfigsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetServicePoolToggleConfigsResponse;
  static deserializeBinaryFromReader(message: GetServicePoolToggleConfigsResponse, reader: jspb.BinaryReader): GetServicePoolToggleConfigsResponse;
}

export namespace GetServicePoolToggleConfigsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    chainTokensList: Array<TogglePoolTokenInfo.AsObject>,
  }
}

export class TogglePoolTokenInfo extends jspb.Message {
  getToken(): sgn_cbridge_v1_query_pb.Token | undefined;
  setToken(value?: sgn_cbridge_v1_query_pb.Token): TogglePoolTokenInfo;
  hasToken(): boolean;
  clearToken(): TogglePoolTokenInfo;

  getIcon(): string;
  setIcon(value: string): TogglePoolTokenInfo;

  getChainId(): number;
  setChainId(value: number): TogglePoolTokenInfo;

  getTransferDisabled(): boolean;
  setTransferDisabled(value: boolean): TogglePoolTokenInfo;

  getLiqAddDisabled(): boolean;
  setLiqAddDisabled(value: boolean): TogglePoolTokenInfo;

  getLiqRmDisabled(): boolean;
  setLiqRmDisabled(value: boolean): TogglePoolTokenInfo;

  getLiqAggRmSrcDisabled(): boolean;
  setLiqAggRmSrcDisabled(value: boolean): TogglePoolTokenInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TogglePoolTokenInfo.AsObject;
  static toObject(includeInstance: boolean, msg: TogglePoolTokenInfo): TogglePoolTokenInfo.AsObject;
  static serializeBinaryToWriter(message: TogglePoolTokenInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TogglePoolTokenInfo;
  static deserializeBinaryFromReader(message: TogglePoolTokenInfo, reader: jspb.BinaryReader): TogglePoolTokenInfo;
}

export namespace TogglePoolTokenInfo {
  export type AsObject = {
    token?: sgn_cbridge_v1_query_pb.Token.AsObject,
    icon: string,
    chainId: number,
    transferDisabled: boolean,
    liqAddDisabled: boolean,
    liqRmDisabled: boolean,
    liqAggRmSrcDisabled: boolean,
  }
}

export class GetServicePegToggleConfigsRequest extends jspb.Message {
  getSigAddr(): string;
  setSigAddr(value: string): GetServicePegToggleConfigsRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): GetServicePegToggleConfigsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetServicePegToggleConfigsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetServicePegToggleConfigsRequest): GetServicePegToggleConfigsRequest.AsObject;
  static serializeBinaryToWriter(message: GetServicePegToggleConfigsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetServicePegToggleConfigsRequest;
  static deserializeBinaryFromReader(message: GetServicePegToggleConfigsRequest, reader: jspb.BinaryReader): GetServicePegToggleConfigsRequest;
}

export namespace GetServicePegToggleConfigsRequest {
  export type AsObject = {
    sigAddr: string,
    sig: Uint8Array | string,
  }
}

export class GetServicePegToggleConfigsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetServicePegToggleConfigsResponse;
  hasErr(): boolean;
  clearErr(): GetServicePegToggleConfigsResponse;

  getChainTokensList(): Array<TogglePegTokenInfo>;
  setChainTokensList(value: Array<TogglePegTokenInfo>): GetServicePegToggleConfigsResponse;
  clearChainTokensList(): GetServicePegToggleConfigsResponse;
  addChainTokens(value?: TogglePegTokenInfo, index?: number): TogglePegTokenInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetServicePegToggleConfigsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetServicePegToggleConfigsResponse): GetServicePegToggleConfigsResponse.AsObject;
  static serializeBinaryToWriter(message: GetServicePegToggleConfigsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetServicePegToggleConfigsResponse;
  static deserializeBinaryFromReader(message: GetServicePegToggleConfigsResponse, reader: jspb.BinaryReader): GetServicePegToggleConfigsResponse;
}

export namespace GetServicePegToggleConfigsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    chainTokensList: Array<TogglePegTokenInfo.AsObject>,
  }
}

export class TogglePegTokenInfo extends jspb.Message {
  getVaultToken(): sgn_cbridge_v1_query_pb.Token | undefined;
  setVaultToken(value?: sgn_cbridge_v1_query_pb.Token): TogglePegTokenInfo;
  hasVaultToken(): boolean;
  clearVaultToken(): TogglePegTokenInfo;

  getVaultIcon(): string;
  setVaultIcon(value: string): TogglePegTokenInfo;

  getVaultChainId(): number;
  setVaultChainId(value: number): TogglePegTokenInfo;

  getPegToken(): sgn_cbridge_v1_query_pb.Token | undefined;
  setPegToken(value?: sgn_cbridge_v1_query_pb.Token): TogglePegTokenInfo;
  hasPegToken(): boolean;
  clearPegToken(): TogglePegTokenInfo;

  getPegIcon(): string;
  setPegIcon(value: string): TogglePegTokenInfo;

  getPegChainId(): number;
  setPegChainId(value: number): TogglePegTokenInfo;

  getTransferDisabled(): boolean;
  setTransferDisabled(value: boolean): TogglePegTokenInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TogglePegTokenInfo.AsObject;
  static toObject(includeInstance: boolean, msg: TogglePegTokenInfo): TogglePegTokenInfo.AsObject;
  static serializeBinaryToWriter(message: TogglePegTokenInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TogglePegTokenInfo;
  static deserializeBinaryFromReader(message: TogglePegTokenInfo, reader: jspb.BinaryReader): TogglePegTokenInfo;
}

export namespace TogglePegTokenInfo {
  export type AsObject = {
    vaultToken?: sgn_cbridge_v1_query_pb.Token.AsObject,
    vaultIcon: string,
    vaultChainId: number,
    pegToken?: sgn_cbridge_v1_query_pb.Token.AsObject,
    pegIcon: string,
    pegChainId: number,
    transferDisabled: boolean,
  }
}

export class SaveSystemAnnouncementRequest extends jspb.Message {
  getSigAddr(): string;
  setSigAddr(value: string): SaveSystemAnnouncementRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): SaveSystemAnnouncementRequest;

  getSystemAnnouncement(): string;
  setSystemAnnouncement(value: string): SaveSystemAnnouncementRequest;

  getEnabled(): boolean;
  setEnabled(value: boolean): SaveSystemAnnouncementRequest;

  getAllfunctionalityenabled(): boolean;
  setAllfunctionalityenabled(value: boolean): SaveSystemAnnouncementRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SaveSystemAnnouncementRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SaveSystemAnnouncementRequest): SaveSystemAnnouncementRequest.AsObject;
  static serializeBinaryToWriter(message: SaveSystemAnnouncementRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SaveSystemAnnouncementRequest;
  static deserializeBinaryFromReader(message: SaveSystemAnnouncementRequest, reader: jspb.BinaryReader): SaveSystemAnnouncementRequest;
}

export namespace SaveSystemAnnouncementRequest {
  export type AsObject = {
    sigAddr: string,
    sig: Uint8Array | string,
    systemAnnouncement: string,
    enabled: boolean,
    allfunctionalityenabled: boolean,
  }
}

export class SaveSystemAnnouncementResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): SaveSystemAnnouncementResponse;
  hasErr(): boolean;
  clearErr(): SaveSystemAnnouncementResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SaveSystemAnnouncementResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SaveSystemAnnouncementResponse): SaveSystemAnnouncementResponse.AsObject;
  static serializeBinaryToWriter(message: SaveSystemAnnouncementResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SaveSystemAnnouncementResponse;
  static deserializeBinaryFromReader(message: SaveSystemAnnouncementResponse, reader: jspb.BinaryReader): SaveSystemAnnouncementResponse;
}

export namespace SaveSystemAnnouncementResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class GetSystemAnnouncementRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSystemAnnouncementRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetSystemAnnouncementRequest): GetSystemAnnouncementRequest.AsObject;
  static serializeBinaryToWriter(message: GetSystemAnnouncementRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSystemAnnouncementRequest;
  static deserializeBinaryFromReader(message: GetSystemAnnouncementRequest, reader: jspb.BinaryReader): GetSystemAnnouncementRequest;
}

export namespace GetSystemAnnouncementRequest {
  export type AsObject = {
  }
}

export class GetSystemAnnouncementResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetSystemAnnouncementResponse;
  hasErr(): boolean;
  clearErr(): GetSystemAnnouncementResponse;

  getSystemAnnouncement(): string;
  setSystemAnnouncement(value: string): GetSystemAnnouncementResponse;

  getEnabled(): boolean;
  setEnabled(value: boolean): GetSystemAnnouncementResponse;

  getAllfunctionalityenabled(): boolean;
  setAllfunctionalityenabled(value: boolean): GetSystemAnnouncementResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSystemAnnouncementResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetSystemAnnouncementResponse): GetSystemAnnouncementResponse.AsObject;
  static serializeBinaryToWriter(message: GetSystemAnnouncementResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSystemAnnouncementResponse;
  static deserializeBinaryFromReader(message: GetSystemAnnouncementResponse, reader: jspb.BinaryReader): GetSystemAnnouncementResponse;
}

export namespace GetSystemAnnouncementResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    systemAnnouncement: string,
    enabled: boolean,
    allfunctionalityenabled: boolean,
  }
}

export class ErrMsg extends jspb.Message {
  getCode(): ErrCode;
  setCode(value: ErrCode): ErrMsg;

  getMsg(): string;
  setMsg(value: string): ErrMsg;

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
  }
}

export class ClaimMsgFeeRequest extends jspb.Message {
  getUserAddr(): string;
  setUserAddr(value: string): ClaimMsgFeeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimMsgFeeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimMsgFeeRequest): ClaimMsgFeeRequest.AsObject;
  static serializeBinaryToWriter(message: ClaimMsgFeeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimMsgFeeRequest;
  static deserializeBinaryFromReader(message: ClaimMsgFeeRequest, reader: jspb.BinaryReader): ClaimMsgFeeRequest;
}

export namespace ClaimMsgFeeRequest {
  export type AsObject = {
    userAddr: string,
  }
}

export class ClaimMsgFeeResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): ClaimMsgFeeResponse;
  hasErr(): boolean;
  clearErr(): ClaimMsgFeeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimMsgFeeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimMsgFeeResponse): ClaimMsgFeeResponse.AsObject;
  static serializeBinaryToWriter(message: ClaimMsgFeeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimMsgFeeResponse;
  static deserializeBinaryFromReader(message: ClaimMsgFeeResponse, reader: jspb.BinaryReader): ClaimMsgFeeResponse;
}

export namespace ClaimMsgFeeResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class IpLogs extends jspb.Message {
  getIpLogsList(): Array<IpLog>;
  setIpLogsList(value: Array<IpLog>): IpLogs;
  clearIpLogsList(): IpLogs;
  addIpLogs(value?: IpLog, index?: number): IpLog;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IpLogs.AsObject;
  static toObject(includeInstance: boolean, msg: IpLogs): IpLogs.AsObject;
  static serializeBinaryToWriter(message: IpLogs, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IpLogs;
  static deserializeBinaryFromReader(message: IpLogs, reader: jspb.BinaryReader): IpLogs;
}

export namespace IpLogs {
  export type AsObject = {
    ipLogsList: Array<IpLog.AsObject>,
  }
}

export class IpLog extends jspb.Message {
  getIp(): string;
  setIp(value: string): IpLog;

  getUsrAddr(): string;
  setUsrAddr(value: string): IpLog;

  getTime(): string;
  setTime(value: string): IpLog;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IpLog.AsObject;
  static toObject(includeInstance: boolean, msg: IpLog): IpLog.AsObject;
  static serializeBinaryToWriter(message: IpLog, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IpLog;
  static deserializeBinaryFromReader(message: IpLog, reader: jspb.BinaryReader): IpLog;
}

export namespace IpLog {
  export type AsObject = {
    ip: string,
    usrAddr: string,
    time: string,
  }
}

export enum LPType { 
  LP_TYPE_UNKNOWN = 0,
  LP_TYPE_ADD = 1,
  LP_TYPE_REMOVE = 2,
}
export enum ClaimStatus { 
  CLM_UNKNOWN = 0,
  CLM_WAITING_FOR_SGN_CONFIRMATIONS = 1,
  CLM_WAITING_FOR_DELEGATOR_ACTION = 2,
  CLM_CONFIRMING_FEE_REWARDS_CLAIM = 3,
  CLM_COMPLETED = 4,
  CLM_FAILED = 5,
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
export enum CSType { 
  CT_UNKNOWN = 0,
  CT_TX = 1,
  CT_LP_ADD = 2,
  CT_LP_RM = 3,
  CT_DROP_GAS = 4,
}
export enum CSOperation { 
  CA_UNKNOWN = 0,
  CA_NORMAL = 1,
  CA_WAITING = 2,
  CA_REPORT = 3,
  CA_USE_RESYNC_TOOL = 4,
  CA_USE_RESIGN_TOOL = 5,
  CA_USE_RESUMBIT_TOOL = 6,
  CA_MORE_INFO_NEEDED = 7,
  CA_CS_TOOL = 8,
}
export enum UserCaseStatus { 
  CC_UNKNOWN = 0,
  CC_TRANSFER_NO_HISTORY = 1,
  CC_TRANSFER_SUBMITTING = 2,
  CC_TRANSFER_WAITING_FOR_SGN_CONFIRMATION = 3,
  CC_TRANSFER_WAITING_FOR_FUND_RELEASE = 4,
  CC_TRANSFER_REQUESTING_REFUND = 5,
  CC_TRANSFER_CONFIRMING_YOUR_REFUND = 6,
  CC_ADD_NO_HISTORY = 7,
  CC_ADD_SUBMITTING = 8,
  CC_ADD_WAITING_FOR_SGN = 9,
  CC_WAITING_FOR_LP = 10,
  CC_WITHDRAW_SUBMITTING = 11,
  CC_WITHDRAW_WAITING_FOR_SGN = 12,
  CC_DROP_GAS_FAIL = 13,
  CC_DROP_GAS_SUCCESS = 14,
  CC_DROP_GAS_NO_RECORD = 15,
}
export enum WithdrawMethodType { 
  WD_METHOD_TYPE_UNDEFINED = 0,
  WD_METHOD_TYPE_ONE_RM = 1,
  WD_METHOD_TYPE_ALL_IN_ONE = 2,
  WD_METHOD_TYPE_STAKING_CLAIM = 3,
  WD_METHOD_TYPE_CONTRACT_LP = 4,
  WD_METHOD_TYPE_AGGREGATE_STAKING_CLAIM = 5,
}
export enum LpActionType { 
  LAT_UNKNOWN = 0,
  LAT_ADD = 1,
  LAT_REMOVE = 2,
  LAT_AGGREGATE_REMOVE = 3,
  LAT_STAKING_CLAIM = 4,
  LAT_CONTRACT_LP = 5,
  LAT_AGGREGATE_STAKING_CLAIM = 6,
}
export enum ClaimRewardHistoryType { 
  CRHT_UNKNOWN = 0,
  CRHT_LIQUIDITY = 1,
  CRHT_CANONICAL = 2,
}
export enum SignAgainType { 
  SAT_UNKNOWN = 0,
  SAT_LIQUIDITY = 1,
  SAT_CANONICAL = 2,
  SAT_REFUND = 3,
  SAT_TRANSFER_MSG = 4,
}
export enum ErrCode { 
  ERROR_CODE_UNDEFINED = 0,
  ERROR_CODE_COMMON = 500,
  ERROR_NO_TOKEN_ON_DST_CHAIN = 1001,
  ERROR_NO_TOKEN_ON_SRC_CHAIN = 1002,
  ERROR_INIT_WITHDRAW_FAILED = 1003,
  ERROR_CODE_NO_ENOUGH_TOKEN_ON_DST_CHAIN = 1004,
  ERROR_CODE_INBOUND_LIQUIDITY_LIMIT = 1005,
  ERROR_CODE_DB_ERR = 1006,
  ERROR_CODE_INVALID_TIME_PARAM = 1007,
  ERROR_CODE_TRANSFER_REF_ID_NOT_FOUND = 1008,
  ERROR_CODE_TRANSFER_DISABLED = 1009,
  ERROR_CODE_LIQ_RM_DISABLED = 1010,
  ERROR_CODE_LIQ_AGG_RM_SRC_DISABLED = 1011,
  ERROR_CODE_BAD_LIQ_SLIPPAGE = 1012,
}
export enum BridgeType { 
  BRIDGETYPE_UNKNOWN = 0,
  BRIDGETYPE_SEND_RELAY = 1,
  BRIDGETYPE_DEPOSIT_MINT = 2,
  BRIDGETYPE_BURN_WITHDRAW = 3,
  BRIDGETYPE_BURN_MINT = 4,
  BRIDGETYPE_RFQ = 5,
}
