/**
 * @fileoverview gRPC-Web generated client stub for chainhop
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as web_pb from './web_pb';


export class WebClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetConfigs = new grpcWeb.MethodDescriptor(
    '/chainhop.Web/GetConfigs',
    grpcWeb.MethodType.UNARY,
    web_pb.GetConfigsRequest,
    web_pb.GetConfigsResponse,
    (request: web_pb.GetConfigsRequest) => {
      return request.serializeBinary();
    },
    web_pb.GetConfigsResponse.deserializeBinary
  );

  getConfigs(
    request: web_pb.GetConfigsRequest,
    metadata: grpcWeb.Metadata | null): Promise<web_pb.GetConfigsResponse>;

  getConfigs(
    request: web_pb.GetConfigsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: web_pb.GetConfigsResponse) => void): grpcWeb.ClientReadableStream<web_pb.GetConfigsResponse>;

  getConfigs(
    request: web_pb.GetConfigsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: web_pb.GetConfigsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/chainhop.Web/GetConfigs',
        request,
        metadata || {},
        this.methodInfoGetConfigs,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/chainhop.Web/GetConfigs',
    request,
    metadata || {},
    this.methodInfoGetConfigs);
  }

  methodInfoGetTokenList = new grpcWeb.MethodDescriptor(
    '/chainhop.Web/GetTokenList',
    grpcWeb.MethodType.UNARY,
    web_pb.GetTokenListRequest,
    web_pb.GetTokenListResponse,
    (request: web_pb.GetTokenListRequest) => {
      return request.serializeBinary();
    },
    web_pb.GetTokenListResponse.deserializeBinary
  );

  getTokenList(
    request: web_pb.GetTokenListRequest,
    metadata: grpcWeb.Metadata | null): Promise<web_pb.GetTokenListResponse>;

  getTokenList(
    request: web_pb.GetTokenListRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: web_pb.GetTokenListResponse) => void): grpcWeb.ClientReadableStream<web_pb.GetTokenListResponse>;

  getTokenList(
    request: web_pb.GetTokenListRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: web_pb.GetTokenListResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/chainhop.Web/GetTokenList',
        request,
        metadata || {},
        this.methodInfoGetTokenList,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/chainhop.Web/GetTokenList',
    request,
    metadata || {},
    this.methodInfoGetTokenList);
  }

  methodInfoQuote = new grpcWeb.MethodDescriptor(
    '/chainhop.Web/Quote',
    grpcWeb.MethodType.UNARY,
    web_pb.QuoteRequest,
    web_pb.QuoteResponse,
    (request: web_pb.QuoteRequest) => {
      return request.serializeBinary();
    },
    web_pb.QuoteResponse.deserializeBinary
  );

  quote(
    request: web_pb.QuoteRequest,
    metadata: grpcWeb.Metadata | null): Promise<web_pb.QuoteResponse>;

  quote(
    request: web_pb.QuoteRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: web_pb.QuoteResponse) => void): grpcWeb.ClientReadableStream<web_pb.QuoteResponse>;

  quote(
    request: web_pb.QuoteRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: web_pb.QuoteResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/chainhop.Web/Quote',
        request,
        metadata || {},
        this.methodInfoQuote,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/chainhop.Web/Quote',
    request,
    metadata || {},
    this.methodInfoQuote);
  }

  methodInfoSwap = new grpcWeb.MethodDescriptor(
    '/chainhop.Web/Swap',
    grpcWeb.MethodType.UNARY,
    web_pb.SwapRequest,
    web_pb.SwapResponse,
    (request: web_pb.SwapRequest) => {
      return request.serializeBinary();
    },
    web_pb.SwapResponse.deserializeBinary
  );

  swap(
    request: web_pb.SwapRequest,
    metadata: grpcWeb.Metadata | null): Promise<web_pb.SwapResponse>;

  swap(
    request: web_pb.SwapRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: web_pb.SwapResponse) => void): grpcWeb.ClientReadableStream<web_pb.SwapResponse>;

  swap(
    request: web_pb.SwapRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: web_pb.SwapResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/chainhop.Web/Swap',
        request,
        metadata || {},
        this.methodInfoSwap,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/chainhop.Web/Swap',
    request,
    metadata || {},
    this.methodInfoSwap);
  }

  methodInfoGetHistory = new grpcWeb.MethodDescriptor(
    '/chainhop.Web/GetHistory',
    grpcWeb.MethodType.UNARY,
    web_pb.GetHistoryRequest,
    web_pb.GetHistoryResponse,
    (request: web_pb.GetHistoryRequest) => {
      return request.serializeBinary();
    },
    web_pb.GetHistoryResponse.deserializeBinary
  );

  getHistory(
    request: web_pb.GetHistoryRequest,
    metadata: grpcWeb.Metadata | null): Promise<web_pb.GetHistoryResponse>;

  getHistory(
    request: web_pb.GetHistoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: web_pb.GetHistoryResponse) => void): grpcWeb.ClientReadableStream<web_pb.GetHistoryResponse>;

  getHistory(
    request: web_pb.GetHistoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: web_pb.GetHistoryResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/chainhop.Web/GetHistory',
        request,
        metadata || {},
        this.methodInfoGetHistory,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/chainhop.Web/GetHistory',
    request,
    metadata || {},
    this.methodInfoGetHistory);
  }

  methodInfoGetStatus = new grpcWeb.MethodDescriptor(
    '/chainhop.Web/GetStatus',
    grpcWeb.MethodType.UNARY,
    web_pb.GetStatusRequest,
    web_pb.GetStatusResponse,
    (request: web_pb.GetStatusRequest) => {
      return request.serializeBinary();
    },
    web_pb.GetStatusResponse.deserializeBinary
  );

  getStatus(
    request: web_pb.GetStatusRequest,
    metadata: grpcWeb.Metadata | null): Promise<web_pb.GetStatusResponse>;

  getStatus(
    request: web_pb.GetStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: web_pb.GetStatusResponse) => void): grpcWeb.ClientReadableStream<web_pb.GetStatusResponse>;

  getStatus(
    request: web_pb.GetStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: web_pb.GetStatusResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/chainhop.Web/GetStatus',
        request,
        metadata || {},
        this.methodInfoGetStatus,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/chainhop.Web/GetStatus',
    request,
    metadata || {},
    this.methodInfoGetStatus);
  }

  methodInfoGetHistoryByTx = new grpcWeb.MethodDescriptor(
    '/chainhop.Web/GetHistoryByTx',
    grpcWeb.MethodType.UNARY,
    web_pb.GetHistoryByTxRequest,
    web_pb.GetHistoryByTxResponse,
    (request: web_pb.GetHistoryByTxRequest) => {
      return request.serializeBinary();
    },
    web_pb.GetHistoryByTxResponse.deserializeBinary
  );

  getHistoryByTx(
    request: web_pb.GetHistoryByTxRequest,
    metadata: grpcWeb.Metadata | null): Promise<web_pb.GetHistoryByTxResponse>;

  getHistoryByTx(
    request: web_pb.GetHistoryByTxRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: web_pb.GetHistoryByTxResponse) => void): grpcWeb.ClientReadableStream<web_pb.GetHistoryByTxResponse>;

  getHistoryByTx(
    request: web_pb.GetHistoryByTxRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: web_pb.GetHistoryByTxResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/chainhop.Web/GetHistoryByTx',
        request,
        metadata || {},
        this.methodInfoGetHistoryByTx,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/chainhop.Web/GetHistoryByTx',
    request,
    metadata || {},
    this.methodInfoGetHistoryByTx);
  }

  methodInfoMarkRefRelation = new grpcWeb.MethodDescriptor(
    '/chainhop.Web/MarkRefRelation',
    grpcWeb.MethodType.UNARY,
    web_pb.MarkRefRelationRequest,
    web_pb.MarkRefRelationResponse,
    (request: web_pb.MarkRefRelationRequest) => {
      return request.serializeBinary();
    },
    web_pb.MarkRefRelationResponse.deserializeBinary
  );

  markRefRelation(
    request: web_pb.MarkRefRelationRequest,
    metadata: grpcWeb.Metadata | null): Promise<web_pb.MarkRefRelationResponse>;

  markRefRelation(
    request: web_pb.MarkRefRelationRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: web_pb.MarkRefRelationResponse) => void): grpcWeb.ClientReadableStream<web_pb.MarkRefRelationResponse>;

  markRefRelation(
    request: web_pb.MarkRefRelationRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: web_pb.MarkRefRelationResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/chainhop.Web/MarkRefRelation',
        request,
        metadata || {},
        this.methodInfoMarkRefRelation,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/chainhop.Web/MarkRefRelation',
    request,
    metadata || {},
    this.methodInfoMarkRefRelation);
  }

  methodInfoAnalyticsData = new grpcWeb.MethodDescriptor(
    '/chainhop.Web/AnalyticsData',
    grpcWeb.MethodType.UNARY,
    web_pb.AnalyticsDataRequest,
    web_pb.AnalyticsDataResponse,
    (request: web_pb.AnalyticsDataRequest) => {
      return request.serializeBinary();
    },
    web_pb.AnalyticsDataResponse.deserializeBinary
  );

  analyticsData(
    request: web_pb.AnalyticsDataRequest,
    metadata: grpcWeb.Metadata | null): Promise<web_pb.AnalyticsDataResponse>;

  analyticsData(
    request: web_pb.AnalyticsDataRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: web_pb.AnalyticsDataResponse) => void): grpcWeb.ClientReadableStream<web_pb.AnalyticsDataResponse>;

  analyticsData(
    request: web_pb.AnalyticsDataRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: web_pb.AnalyticsDataResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/chainhop.Web/AnalyticsData',
        request,
        metadata || {},
        this.methodInfoAnalyticsData,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/chainhop.Web/AnalyticsData',
    request,
    metadata || {},
    this.methodInfoAnalyticsData);
  }

  methodInfoFixSwap = new grpcWeb.MethodDescriptor(
    '/chainhop.Web/FixSwap',
    grpcWeb.MethodType.UNARY,
    web_pb.FixSwapRequest,
    web_pb.FixSwapResponse,
    (request: web_pb.FixSwapRequest) => {
      return request.serializeBinary();
    },
    web_pb.FixSwapResponse.deserializeBinary
  );

  fixSwap(
    request: web_pb.FixSwapRequest,
    metadata: grpcWeb.Metadata | null): Promise<web_pb.FixSwapResponse>;

  fixSwap(
    request: web_pb.FixSwapRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: web_pb.FixSwapResponse) => void): grpcWeb.ClientReadableStream<web_pb.FixSwapResponse>;

  fixSwap(
    request: web_pb.FixSwapRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: web_pb.FixSwapResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/chainhop.Web/FixSwap',
        request,
        metadata || {},
        this.methodInfoFixSwap,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/chainhop.Web/FixSwap',
    request,
    metadata || {},
    this.methodInfoFixSwap);
  }

  methodInfoInternalGetHistory = new grpcWeb.MethodDescriptor(
    '/chainhop.Web/InternalGetHistory',
    grpcWeb.MethodType.UNARY,
    web_pb.InternalGetHistoryRequest,
    web_pb.InternalGetHistoryResponse,
    (request: web_pb.InternalGetHistoryRequest) => {
      return request.serializeBinary();
    },
    web_pb.InternalGetHistoryResponse.deserializeBinary
  );

  internalGetHistory(
    request: web_pb.InternalGetHistoryRequest,
    metadata: grpcWeb.Metadata | null): Promise<web_pb.InternalGetHistoryResponse>;

  internalGetHistory(
    request: web_pb.InternalGetHistoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: web_pb.InternalGetHistoryResponse) => void): grpcWeb.ClientReadableStream<web_pb.InternalGetHistoryResponse>;

  internalGetHistory(
    request: web_pb.InternalGetHistoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: web_pb.InternalGetHistoryResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/chainhop.Web/InternalGetHistory',
        request,
        metadata || {},
        this.methodInfoInternalGetHistory,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/chainhop.Web/InternalGetHistory',
    request,
    metadata || {},
    this.methodInfoInternalGetHistory);
  }

  methodInfoRfqQuote = new grpcWeb.MethodDescriptor(
    '/chainhop.Web/RfqQuote',
    grpcWeb.MethodType.UNARY,
    web_pb.RfqQuoteRequest,
    web_pb.RfqQuoteResponse,
    (request: web_pb.RfqQuoteRequest) => {
      return request.serializeBinary();
    },
    web_pb.RfqQuoteResponse.deserializeBinary
  );

  rfqQuote(
    request: web_pb.RfqQuoteRequest,
    metadata: grpcWeb.Metadata | null): Promise<web_pb.RfqQuoteResponse>;

  rfqQuote(
    request: web_pb.RfqQuoteRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: web_pb.RfqQuoteResponse) => void): grpcWeb.ClientReadableStream<web_pb.RfqQuoteResponse>;

  rfqQuote(
    request: web_pb.RfqQuoteRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: web_pb.RfqQuoteResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/chainhop.Web/RfqQuote',
        request,
        metadata || {},
        this.methodInfoRfqQuote,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/chainhop.Web/RfqQuote',
    request,
    metadata || {},
    this.methodInfoRfqQuote);
  }

  methodInfoRfqRefund = new grpcWeb.MethodDescriptor(
    '/chainhop.Web/RfqRefund',
    grpcWeb.MethodType.UNARY,
    web_pb.RfqRefundRequest,
    web_pb.RfqRefundResponse,
    (request: web_pb.RfqRefundRequest) => {
      return request.serializeBinary();
    },
    web_pb.RfqRefundResponse.deserializeBinary
  );

  rfqRefund(
    request: web_pb.RfqRefundRequest,
    metadata: grpcWeb.Metadata | null): Promise<web_pb.RfqRefundResponse>;

  rfqRefund(
    request: web_pb.RfqRefundRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: web_pb.RfqRefundResponse) => void): grpcWeb.ClientReadableStream<web_pb.RfqRefundResponse>;

  rfqRefund(
    request: web_pb.RfqRefundRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: web_pb.RfqRefundResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/chainhop.Web/RfqRefund',
        request,
        metadata || {},
        this.methodInfoRfqRefund,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/chainhop.Web/RfqRefund',
    request,
    metadata || {},
    this.methodInfoRfqRefund);
  }

  methodInfoRfqMarkAsSubmitting = new grpcWeb.MethodDescriptor(
    '/chainhop.Web/RfqMarkAsSubmitting',
    grpcWeb.MethodType.UNARY,
    web_pb.RfqMarkAsSubmittingRequest,
    web_pb.RfqMarkAsSubmittingResponse,
    (request: web_pb.RfqMarkAsSubmittingRequest) => {
      return request.serializeBinary();
    },
    web_pb.RfqMarkAsSubmittingResponse.deserializeBinary
  );

  rfqMarkAsSubmitting(
    request: web_pb.RfqMarkAsSubmittingRequest,
    metadata: grpcWeb.Metadata | null): Promise<web_pb.RfqMarkAsSubmittingResponse>;

  rfqMarkAsSubmitting(
    request: web_pb.RfqMarkAsSubmittingRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: web_pb.RfqMarkAsSubmittingResponse) => void): grpcWeb.ClientReadableStream<web_pb.RfqMarkAsSubmittingResponse>;

  rfqMarkAsSubmitting(
    request: web_pb.RfqMarkAsSubmittingRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: web_pb.RfqMarkAsSubmittingResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/chainhop.Web/RfqMarkAsSubmitting',
        request,
        metadata || {},
        this.methodInfoRfqMarkAsSubmitting,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/chainhop.Web/RfqMarkAsSubmitting',
    request,
    metadata || {},
    this.methodInfoRfqMarkAsSubmitting);
  }

}

