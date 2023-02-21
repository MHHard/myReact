import axios from "axios";

import {
  GetTransferInfoRequest,
  GetTransferInfoResponse,
  GetTransferStatusRequest,
  GetTransferStatusResponse,
  GetTransferConfigsResponse,
} from "../constants/type";
import {
  WithdrawLiquidityRequest,
  WithdrawLiquidityResponse,
  GetTokenBoundRequest, 
  GetTokenBoundResponse,
  GetTransferOnChainKeyRequest,
  GetTransferOnChainKeyResponse,
} from "../proto/gateway/gateway_pb";
import { gatewayServiceClient } from "./grpcClients";

/* eslint-disable camelcase */

export const withdrawLiquidity = (
  reqParams: WithdrawLiquidityRequest
): Promise<WithdrawLiquidityResponse> => {
  return gatewayServiceClient.withdrawLiquidity(reqParams, null);
};

export const getTokenBound = (
  reqParams: GetTokenBoundRequest
): Promise<GetTokenBoundResponse> => {
  return gatewayServiceClient.getTokenBound(reqParams, null);
};

export const getTransferStatus = (
  params: GetTransferStatusRequest
): Promise<GetTransferStatusResponse> => {
  return axios
    .post(`${process.env.REACT_APP_SERVER_URL}/v1/getTransferStatus`, {
      ...params,
    })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.log("error=>", e);
    });
};

export const getTransferInfo = (
  reqParams: GetTransferInfoRequest
): Promise<GetTransferInfoResponse> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/v1/getTransfer`, {
      params: {
        ...reqParams,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.log("error=>", e);
    });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRefundParams = (reqParams: any): Promise<any> =>
  axios
    .get(
      `${process.env.REACT_APP_SERVER_URL}/sgn/v1/message/execution_context_by_src_transfer`,
      {
        params: {
          ...reqParams,
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.log("error=>", e);
    });

export const getTransferConfigs = (): Promise<GetTransferConfigsResponse> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/v1/getTransferConfigsForAll`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.log("error=>", e);
    });

export const getDestinationOnChainKey = (sourceChainTransferId: string): Promise<GetTransferOnChainKeyResponse> => {
  const request = new GetTransferOnChainKeyRequest()
  request.setSrcTransferId(sourceChainTransferId)
  return gatewayServiceClient.getTransferOnChainKey(request, null)
} 
    