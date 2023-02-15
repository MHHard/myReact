import * as jspb from 'google-protobuf'

import * as google_api_annotations_pb from '../../../google/api/annotations_pb';
import * as sdk_service_rfq_model_pb from '../../../sdk/service/rfq/model_pb';
import * as sdk_service_rfqmm_api_pb from '../../../sdk/service/rfqmm/api_pb';


export class PendingOrdersRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PendingOrdersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PendingOrdersRequest): PendingOrdersRequest.AsObject;
  static serializeBinaryToWriter(message: PendingOrdersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PendingOrdersRequest;
  static deserializeBinaryFromReader(message: PendingOrdersRequest, reader: jspb.BinaryReader): PendingOrdersRequest;
}

export namespace PendingOrdersRequest {
  export type AsObject = {
  }
}

export class PendingOrdersResponse extends jspb.Message {
  getOrdersList(): Array<sdk_service_rfq_model_pb.PendingOrder>;
  setOrdersList(value: Array<sdk_service_rfq_model_pb.PendingOrder>): PendingOrdersResponse;
  clearOrdersList(): PendingOrdersResponse;
  addOrders(value?: sdk_service_rfq_model_pb.PendingOrder, index?: number): sdk_service_rfq_model_pb.PendingOrder;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PendingOrdersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PendingOrdersResponse): PendingOrdersResponse.AsObject;
  static serializeBinaryToWriter(message: PendingOrdersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PendingOrdersResponse;
  static deserializeBinaryFromReader(message: PendingOrdersResponse, reader: jspb.BinaryReader): PendingOrdersResponse;
}

export namespace PendingOrdersResponse {
  export type AsObject = {
    ordersList: Array<sdk_service_rfq_model_pb.PendingOrder.AsObject>,
  }
}

export class OrderUpdates extends jspb.Message {
  getQuoteHash(): string;
  setQuoteHash(value: string): OrderUpdates;

  getOrderStatus(): sdk_service_rfq_model_pb.OrderStatus;
  setOrderStatus(value: sdk_service_rfq_model_pb.OrderStatus): OrderUpdates;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OrderUpdates.AsObject;
  static toObject(includeInstance: boolean, msg: OrderUpdates): OrderUpdates.AsObject;
  static serializeBinaryToWriter(message: OrderUpdates, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OrderUpdates;
  static deserializeBinaryFromReader(message: OrderUpdates, reader: jspb.BinaryReader): OrderUpdates;
}

export namespace OrderUpdates {
  export type AsObject = {
    quoteHash: string,
    orderStatus: sdk_service_rfq_model_pb.OrderStatus,
  }
}

export class UpdateOrdersRequest extends jspb.Message {
  getUpdatesList(): Array<OrderUpdates>;
  setUpdatesList(value: Array<OrderUpdates>): UpdateOrdersRequest;
  clearUpdatesList(): UpdateOrdersRequest;
  addUpdates(value?: OrderUpdates, index?: number): OrderUpdates;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateOrdersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateOrdersRequest): UpdateOrdersRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateOrdersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateOrdersRequest;
  static deserializeBinaryFromReader(message: UpdateOrdersRequest, reader: jspb.BinaryReader): UpdateOrdersRequest;
}

export namespace UpdateOrdersRequest {
  export type AsObject = {
    updatesList: Array<OrderUpdates.AsObject>,
  }
}

export class UpdateOrdersResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateOrdersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateOrdersResponse): UpdateOrdersResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateOrdersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateOrdersResponse;
  static deserializeBinaryFromReader(message: UpdateOrdersResponse, reader: jspb.BinaryReader): UpdateOrdersResponse;
}

export namespace UpdateOrdersResponse {
  export type AsObject = {
  }
}

export class UpdateConfigsRequest extends jspb.Message {
  getConfig(): sdk_service_rfqmm_api_pb.Config | undefined;
  setConfig(value?: sdk_service_rfqmm_api_pb.Config): UpdateConfigsRequest;
  hasConfig(): boolean;
  clearConfig(): UpdateConfigsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateConfigsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateConfigsRequest): UpdateConfigsRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateConfigsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateConfigsRequest;
  static deserializeBinaryFromReader(message: UpdateConfigsRequest, reader: jspb.BinaryReader): UpdateConfigsRequest;
}

export namespace UpdateConfigsRequest {
  export type AsObject = {
    config?: sdk_service_rfqmm_api_pb.Config.AsObject,
  }
}

export class UpdateConfigsResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateConfigsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateConfigsResponse): UpdateConfigsResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateConfigsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateConfigsResponse;
  static deserializeBinaryFromReader(message: UpdateConfigsResponse, reader: jspb.BinaryReader): UpdateConfigsResponse;
}

export namespace UpdateConfigsResponse {
  export type AsObject = {
  }
}

