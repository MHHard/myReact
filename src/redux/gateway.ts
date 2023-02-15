import axios from "axios";
import {
  MarkTransferRequest,
  GetTransferStatusRequest,
  GetTransferStatusResponse,
  GetLPInfoListRequest,
  GetLPInfoListResponse,
  MarkLiquidityRequest,
  QueryLiquidityStatusRequest,
  QueryLiquidityStatusResponse,
  TransferHistoryRequest,
  TransferHistoryResponse,
  LPHistoryRequest,
  LPHistoryResponse,
  ClaimWithdrawRewardRequest,
  ClaimRewardDetailsRequest,
  ClaimRewardDetailsResponse,
  RewardingDataRequest,
  RewardingDataResponse,
  GetRetentionRewardsInfoRequest,
  GetRetentionRewardsInfoResponse,
  ClaimRetentionRewardsRequest,
  ClaimRetentionRewardsResponse,
  GetPercentageFeeRebateInfoRequest,
  GetPercentageFeeRebateInfoResponse,
  ClaimPercentageFeeRebateRequest,
  ClaimPercentageFeeRebateResponse,
  ERC721TokenUriMetadata,
  NFTHistoryRequest,
  NFTHistoryResponse,
  PingResponse,
  PriceOfTokens,
  PendingHistoryResponse,
  PingLPResponse,
  LPType
} from "../constants/type";
// import {
//   Web,
//   EstimateAmtRequest,
//   EstimateAmtResponse,
//   // WithdrawLiquidityRequest,
//   // WithdrawLiquidityResponse,
//   // EstimateWithdrawAmtRequest,
//   // EstimateWithdrawAmtResponse,
// } from "../proto-grpc/sgn/gateway/v1/gateway.pb";
import {
  EstimateWithdrawAmtRequest,
  EstimateWithdrawAmtResponse,
  GetTokenBoundRequest,
  GetTokenBoundResponse,
  GetTransferRelayInfoRequest,
  GetTransferRelayInfoResponse,
  SignAgainRequest,
  SignAgainResponse,
  WithdrawLiquidityRequest,
  WithdrawLiquidityResponse,
  MarkRefRelationRequest,
  MarkRefRelationResponse,
  GetSystemAnnouncementRequest,
  GetSystemAnnouncementResponse,
  GetTransferOnChainKeyRequest,
  GetTransferConfigsResponse as GetTransferConfigsResponseProto,
  GetTransferConfigsRequest,
  GetRfqConfigsRequest,
  GetRfqConfigsResponse,
  GetRiskSeverityLevelRequest,
  RfqMarkRequest,
  RfqMarkResponse,
} from "../proto/gateway/gateway_pb";
import { QueryChainSignersRequest, QueryChainSignersResponse } from "../proto/sgn/cbridge/v1/query_pb";
import { gatewayServiceClient, gatewayServiceWithGrpcUrlClient, queryServiceClient } from "./grpcClients";
import {
  GetRefundExecMsgCallDataRequest,
  GetRefundExecMsgCallDataResponse,
  PriceRequest,
  PriceResponse,
  QuoteRequest,
  QuoteResponse,
} from "../proto/sdk/service/rfq/user_pb";
/* eslint-disable camelcase */
export const getTransferConfigs = (reqParams: GetTransferConfigsRequest): Promise<GetTransferConfigsResponseProto> => {
  return gatewayServiceClient.getTransferConfigsForAll(reqParams, { "Cache-Control": "no-cache" });
};

export const getRfqConfig = (reqParams: GetRfqConfigsRequest): Promise<GetRfqConfigsResponse | undefined> => {
  return gatewayServiceWithGrpcUrlClient.getRfqConfigs(reqParams, null).catch(error => {
    console.debug("error", error);
    return undefined;
  });
};

export const pingUserAddress = (address: string): Promise<PingResponse> =>
  axios.get(`${process.env.REACT_APP_SERVER_URL}/v1/ping`, { params: { addr: address } }).then(res => {
    return res.data;
});

export const getPriceOfTokens = (): Promise<PriceOfTokens> => 
  axios.get(`https://cbridge-stat.s3.us-west-2.amazonaws.com/prod2/cbridge-price.json`).then(res => {
    return res.data;
}).catch(error => {
  console.error(error);
  return undefined;
});

// export const estimateAmt = (reqParams: EstimateAmtRequest): Promise<EstimateAmtResponse> => {
//   return Web.EstimateAmt(reqParams, preFix);
// };

export const estimateWithdrawAmt = (reqParams: EstimateWithdrawAmtRequest): Promise<EstimateWithdrawAmtResponse> => {
  return gatewayServiceWithGrpcUrlClient.estimateWithdrawAmt(reqParams, null);
};
export const getTokenBound = (reqParams: GetTokenBoundRequest): Promise<GetTokenBoundResponse> => {
  return gatewayServiceWithGrpcUrlClient.getTokenBound(reqParams, null);
};
export const markTransfer = (params: MarkTransferRequest) => {
  return axios
    .post(`${process.env.REACT_APP_SERVER_URL}/v1/markTransfer`, {
      ...params,
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });
};

export const getTransferStatus = (params: GetTransferStatusRequest): Promise<GetTransferStatusResponse> => {
  return axios
    .post(`${process.env.REACT_APP_SERVER_URL}/v1/getTransferStatus`, {
      ...params,
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });
};

export const getLPInfoList = (reqParams: GetLPInfoListRequest): Promise<GetLPInfoListResponse> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/v1/getLPInfoList`, {
      params: {
        ...reqParams,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });


// export const withdrawLiquidity = (params: WithdrawLiquidityRequest): Promise<WithdrawLiquidityResponse> =>
//   axios
//     .post(`${process.env.REACT_APP_SERVER_URL}/v1/withdrawLiquidity`, {
//       ...params,
//     })
//     .then(res => {
//       return res.data;
//     })
//     .catch(e => {
//       console.log("error=>", e);
//     });

export const withdrawLiquidity = (reqParams: WithdrawLiquidityRequest): Promise<WithdrawLiquidityResponse> => {
  return gatewayServiceWithGrpcUrlClient.withdrawLiquidity(reqParams, null);
};

export const markRefRelation = (request: MarkRefRelationRequest): Promise<MarkRefRelationResponse> => {
  return gatewayServiceWithGrpcUrlClient.markRefRelation(request, null);
};

export const markLiquidity = (params: MarkLiquidityRequest) =>
  axios
    .post(`${process.env.REACT_APP_SERVER_URL}/v1/markLiquidity`, {
      ...params,
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const queryLiquidityStatus = (reqParams: QueryLiquidityStatusRequest): Promise<QueryLiquidityStatusResponse> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/v1/queryLiquidityStatus`, {
      params: {
        ...reqParams,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const transferHistory = (reqParams: TransferHistoryRequest): Promise<TransferHistoryResponse> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/v1/transferHistory`, {
      params: {
        ...reqParams,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const lpHistory = (reqParams: LPHistoryRequest): Promise<LPHistoryResponse> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/v1/lpHistory`, {
      params: {
        ...reqParams,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const unlockFarmingReward = (params: ClaimWithdrawRewardRequest) =>
  axios
    .post(`${process.env.REACT_APP_SERVER_URL}/v1/unlockFarmingReward`, {
      ...params,
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const getFarmingRewardDetails = (reqParams: ClaimRewardDetailsRequest): Promise<ClaimRewardDetailsResponse> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/v1/getFarmingRewardDetails`, {
      params: {
        ...reqParams,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const rewardingData = (reqParams: RewardingDataRequest): Promise<RewardingDataResponse> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/v1/rewardingData`, {
      params: {
        ...reqParams,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const getRetentionRewardsInfo = (
  reqParams: GetRetentionRewardsInfoRequest,
): Promise<GetRetentionRewardsInfoResponse> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/v1/getRetentionRewardsInfo`, {
      params: {
        ...reqParams,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const claimRetentionRewards = (params: ClaimRetentionRewardsRequest): Promise<ClaimRetentionRewardsResponse> =>
  axios
    .post(`${process.env.REACT_APP_SERVER_URL}/v1/claimRetentionRewards`, {
      ...params,
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const getPercentageFeeRebateInfo = (
  reqParams: GetPercentageFeeRebateInfoRequest,
): Promise<GetPercentageFeeRebateInfoResponse> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/v1/getFeeRebateInfo`, {
      params: {
        ...reqParams,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const claimPercentageFeeRebate = (
  params: ClaimPercentageFeeRebateRequest,
): Promise<ClaimPercentageFeeRebateResponse> =>
  axios
    .post(`${process.env.REACT_APP_SERVER_URL}/v1/claimFeeRebate`, {
      ...params,
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

// eslint-disable-next-line
export const getNFTBridgeChainList = (): Promise<any> =>
  axios
    .get(`${process.env.REACT_APP_NFT_CONFIG_URL}`)
    .then(res => {
      console.debug({ res });
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const getTokenUriMetaDataJson = (tokenUri: string): Promise<ERC721TokenUriMetadata | undefined> =>
  axios
    .get(tokenUri)
    .then(res => {
      return res.data as ERC721TokenUriMetadata;
    })
    .catch(e => {
      console.log("error=>", e);
      return undefined;
    });

// eslint-disable-next-line
export const getNFTList = (nftAddress: string, chainId: number, userAddress: string): Promise<any> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/nftbr/own/${userAddress}/${chainId}/${nftAddress}`)
    .then(res => {
      return { addr: nftAddress, data: res.data };
    })
    .catch(e => {
      console.log("error=>", e);
    });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTransferLatency = (srcChainId: number, dstChainId: number): Promise<any> =>
  axios
    .get(
      `${process.env.REACT_APP_SERVER_URL}/v1/getLatest7DayTransferLatencyForQuery?src_chain_id=${srcChainId}&dst_chain_id=${dstChainId}`,
    )
    .then(res => {
      return { data: res.data };
    })
    .catch(e => {
      console.log("etTransferLatency error=>", e);
    });

export const nftHistory = (address: string, reqParams: NFTHistoryRequest): Promise<NFTHistoryResponse> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/nftbr/history/${address}`, {
      // headers: {
      //   "Access-Control-Allow-Origin": "*",
      //   "Content-Type": "application/json",
      // },
      params: {
        ...reqParams,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const getTransferRelayInfo = (reqParams: GetTransferRelayInfoRequest): Promise<GetTransferRelayInfoResponse> => {
  return gatewayServiceWithGrpcUrlClient.getTransferRelayInfo(reqParams, null);
};

export const signAgain = (reqParams: SignAgainRequest): Promise<SignAgainResponse> => {
  return gatewayServiceWithGrpcUrlClient.signAgain(reqParams, null);
};

export const getSystemAnnouncement = (
  reqParams: GetSystemAnnouncementRequest,
): Promise<GetSystemAnnouncementResponse> => {
  return gatewayServiceWithGrpcUrlClient.getSystemAnnouncement(reqParams, null);
};

export const getDestinationTransferId = (sourceChainTransferId: string): Promise<string> => {
  const request = new GetTransferOnChainKeyRequest();
  request.setSrcTransferId(sourceChainTransferId);
  return gatewayServiceWithGrpcUrlClient.getTransferOnChainKey(request, null).then(response => {
    return response.getDstTransferId();
  });
};
export const getUserIsBlocked = (usrAddr: string, chainId: number, disableTrm = false): Promise<boolean> => {
  const request = new GetRiskSeverityLevelRequest();
  request.setChainId(chainId);
  request.setUsrAddr(usrAddr);
  request.setDisableTrm(disableTrm);
  return gatewayServiceWithGrpcUrlClient.getRiskSeverityLevel(request, null).then(response => {
    console.debug("response", response);
    return response.getIsBlocked();
  });
};

export const getChainSigners = (reqParams: QueryChainSignersRequest): Promise<QueryChainSignersResponse> => {
  return queryServiceClient.queryChainSigners(reqParams, {
    "Access-Control-Allow-Origin": "*",
  });
};

export const getRfqPrice = (reqParams: PriceRequest): Promise<PriceResponse> => {
  return gatewayServiceWithGrpcUrlClient.rfqPrice(reqParams, null);
};

export const getRfqQuote = (reqParams: QuoteRequest): Promise<QuoteResponse> => {
  return gatewayServiceWithGrpcUrlClient.rfqQuote(reqParams, null);
};

export const getRfqRefundExecMsgCallData = (
  reqParams: GetRefundExecMsgCallDataRequest,
): Promise<GetRefundExecMsgCallDataResponse> => {
  return gatewayServiceWithGrpcUrlClient.rfqGetRefundExecMsgCallData(reqParams, null);
};

export const rfqMark = (reqParams: RfqMarkRequest): Promise<RfqMarkResponse> => {
  return gatewayServiceWithGrpcUrlClient.rfqMark(reqParams, null);
};

export const getPendingHistory = (addresses: string[]): Promise<PendingHistoryResponse> => {
  const request = { addr: addresses };
  return axios
    .get(`${process.env.REACT_APP_SERVER_URL}/v1/pendingHistory`, {
      params: {
        ...request,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });
};

export const pingLiquidityProviderIP = (
  liquidityOperationType: LPType,
  walletAddress: string
): Promise<PingLPResponse> => {

  return axios.get(`${process.env.REACT_APP_SERVER_URL}/v1/pingLp`, { 
    params: {  
      lp_type: liquidityOperationType,
      addr: walletAddress 
    }
  }).then(res => {
    return res.data;
  });
}
