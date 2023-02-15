import { JsonRpcProvider } from "@ethersproject/providers";
import { safeParseUnits } from "celer-web-utils/lib/format";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useMemo } from "react";
import { getNetworkById } from "../constants/network";
import { TransferPair } from "../constants/type";
import { validateTransferPair } from "../helpers/transferPairValidation";
import { ERC20, ERC20__factory } from "../typechain/typechain";
import { readOnlyContract } from "./customReadyOnlyContractLoader";

export interface WrapTokenCaps {
  totalLiquidity: BigNumber;
}

export function useIsWrapTokenTransferAtLimit(
  transferPair: TransferPair,
): { onWrapTokenLiquidityCallback: null | (() => Promise<WrapTokenCaps>) } {

  return useMemo(() => {
    if (!validateTransferPair(transferPair)) {
      return { onWrapTokenLiquidityCallback: null };
    }

    return {
      onWrapTokenLiquidityCallback: async () => {
        if (
          (transferPair.sourceChainInfo?.id === 12340002 && transferPair.destinationChainInfo?.id === 80001 && transferPair.sourceChainToken?.token.symbol === "FLOWUSDC") ||
          (transferPair.sourceChainInfo?.id === 12340001 && transferPair.destinationChainInfo?.id === 1 && transferPair.sourceChainToken?.token.symbol === "cfUSDC") ||
          (transferPair.sourceChainInfo?.id === 12340001 && transferPair.destinationChainInfo?.id === 1 && transferPair.sourceChainToken?.token.symbol === "celrWFLOW")
        ) {
          if ((transferPair.destinationCanonicalTokenAddress?.length ?? 0)> 0) {
            const rpcURL = getNetworkById(transferPair.destinationChainInfo?.id).rpcUrl;
            const provider = new JsonRpcProvider(rpcURL);
            const canonicalTokenContract = (await readOnlyContract(
              provider,
              transferPair.destinationCanonicalTokenAddress ?? "",
              ERC20__factory,
            )) as ERC20;

            const totalLiquidity = await canonicalTokenContract.balanceOf(transferPair.destinationToken?.token.address ?? "");
            const totalLiquidityWithSourceChainDecimal = safeParseUnits(
              formatUnits(totalLiquidity, transferPair.destinationToken?.token.decimal ?? 18),
              transferPair.sourceChainToken?.token.decimal ?? 18,
            );
            const wrapTokenCaps: WrapTokenCaps = {
              totalLiquidity: totalLiquidityWithSourceChainDecimal,
            };
            return wrapTokenCaps;
          }
        }
        return { totalLiquidity: BigNumber.from(0),  decimal: 18,  tokenSymbol: "", };
      },
    };
  }, [transferPair]);
}
