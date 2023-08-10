import { BigNumber } from "ethers";
import { readOnlyContract } from "../hooks/customReadyOnlyContractLoader";
import { CircleUsdcConfigResponse, EstimateAmtResponse } from "../proto/gateway/gateway_pb";
import { CircleBridgeProxy, CircleBridgeProxy__factory } from "../typechain/typechain";
import { TokenInfo } from "../constants/type";

export const estimateCircleUSDCTransfer = async (
  sourceChainId: number,
  circleProxyBridgeContractAddress: string,
  destinationChainId: number,
  amount: BigNumber,
  getNetworkById,
): Promise<EstimateAmtResponse> => {
  const circleBridgeProxy = (await readOnlyContract(
    sourceChainId,
    circleProxyBridgeContractAddress,
    CircleBridgeProxy__factory,
    getNetworkById,
  )) as CircleBridgeProxy | undefined;
  if (circleBridgeProxy) {
    const fees = await circleBridgeProxy.totalFee(amount, destinationChainId);

    const circleUSDCEstimateResponse = new EstimateAmtResponse();
    circleUSDCEstimateResponse.setBridgeRate(1);
    circleUSDCEstimateResponse.setEqValueTokenAmt(amount.toString());
    circleUSDCEstimateResponse.setBaseFee(fees[1].toString());
    circleUSDCEstimateResponse.setPercFee(fees[2].toString());
    circleUSDCEstimateResponse.setEstimatedReceiveAmt(amount.sub(fees[0]).toString());
    return circleUSDCEstimateResponse;
  }
  throw new Error("Failed to load Circle Bridge USDC");
};

export const shouldUseCircleUSDCBridge = (
  circleUSDCConfig: CircleUsdcConfigResponse.AsObject,
  sourceChainToken: TokenInfo | undefined,
  destinationChainToken: TokenInfo | undefined,
) => {
  if (sourceChainToken && destinationChainToken) {
    const circleUSDCTokenOnSourceChain = circleUSDCConfig.chaintokensList.find(tokenInfo => {
      return (
        tokenInfo.chainId === sourceChainToken.token.chainId && tokenInfo.tokenAddr === sourceChainToken.token.address
      );
    });
    const circleUSDCTokenOnDestinationChain = circleUSDCConfig.chaintokensList.find(tokenInfo => {
      return (
        tokenInfo.chainId === destinationChainToken.token.chainId &&
        tokenInfo.tokenAddr === destinationChainToken.token.address
      );
    });
    return circleUSDCTokenOnSourceChain !== undefined && circleUSDCTokenOnDestinationChain !== undefined;
  }

  return false;
};

export const findCircleBridgeProxyContractAddress = (
  circleUSDCConfig: CircleUsdcConfigResponse.AsObject,
  sourceChainId: number,
) => {
  return (
    circleUSDCConfig.chaintokensList.find(tokenInfo => {
      return tokenInfo.chainId === sourceChainId;
    })?.contractAddr ?? "Unknown Proxy Address"
  );
};
