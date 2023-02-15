import {
  ClaimGetBscCampaignRewardRequest,
  ClaimGetBscCampaignRewardResponse,
  GetBscCampaignInfoRequest,
  GetBscCampaignInfoResponse,
  InIncentiveCampaignBnbWhiteListRequest,
  InIncentiveCampaignBnbWhiteListResponse,
} from "../proto/gateway/gateway_pb";
import { gatewayServiceWithGrpcUrlClient } from "./grpcClients";

export const getBscCampaignInfo = (reqParams: GetBscCampaignInfoRequest): Promise<GetBscCampaignInfoResponse> => {
  return gatewayServiceWithGrpcUrlClient.getBscCampaignInfo(reqParams, null);
};

export const claimGetBscCampaignReward = (
  reqParams: ClaimGetBscCampaignRewardRequest,
): Promise<ClaimGetBscCampaignRewardResponse> => {
  return gatewayServiceWithGrpcUrlClient.claimGetBscCampaignReward(reqParams, null);
};

export const getBNBIncentiveCampaignBNBWhiteInfo = (
  reqParams: InIncentiveCampaignBnbWhiteListRequest,
): Promise<InIncentiveCampaignBnbWhiteListResponse> => {
  return gatewayServiceWithGrpcUrlClient.inIncentiveCampaignBnbWhiteList(reqParams, null);
};
