import { JsonRpcProvider } from "@ethersproject/providers";
import { formatUnits } from "ethers/lib/utils";
import { useMemo } from "react";
import { getNetworkById } from "../constants/network";
import { LPInfo } from "../constants/type";
import { dataClone } from "../helpers/dataClone";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { useAppSelector } from "../redux/store";
import { ERC20 } from "../typechain/events-typechain";
import { ERC20__factory } from "../typechain/typechain";
import { WrappedBridgeToken__factory } from "../typechain/typechain/factories/WrappedBridgeToken__factory";
import { WrappedBridgeToken } from "../typechain/typechain/WrappedBridgeToken";
import { readOnlyContract } from "./customReadyOnlyContractLoader";

export function useWrapTokenLpList(lpInfoList: LPInfo[]): {
  mergeWrapTokenLpListCallback: null | (() => Promise<LPInfo[]>);
} {
  const { transferInfo } = useAppSelector(state => state);
  const { transferConfig } = transferInfo;
  const pegConfigs = transferConfig.pegged_pair_configs;
  const { address } = useWeb3Context();

  return useMemo(() => {
    if (!lpInfoList || lpInfoList.length === 0) {
      return { mergeWrapTokenLpListCallback: null };
    }

    const originalLpList = dataClone(lpInfoList);
    return {
      mergeWrapTokenLpListCallback: async () => {
        const tokensOnFLow = originalLpList.filter(
          lpInfo =>
            (lpInfo.chain.id === 12340002 && lpInfo.token.token.symbol === "FLOWUSDC") ||
            (lpInfo.chain.id === 12340001 && lpInfo.token.token.symbol === "cfUSDC") ||
            (lpInfo.chain.id === 12340001 && lpInfo.token.token.symbol === "celrWFLOW"),
        );

        if (tokensOnFLow && tokensOnFLow.length) {
          await Promise.all(
            tokensOnFLow.map(async tokenOnFlow => {
              const config = pegConfigs.find(
                it =>
                  it.canonical_token_contract_addr &&
                  it.org_chain_id === tokenOnFlow.chain.id &&
                  tokenOnFlow.token.token.symbol === it.org_token.token.symbol,
              );

              if (tokenOnFlow && config) {
                try {
                  const wrapToken = config?.pegged_token.token;

                  const provider = new JsonRpcProvider(getNetworkById(config.pegged_chain_id).rpcUrl);
                  const wrapTokenContract = (await readOnlyContract(
                    provider,
                    wrapToken.address,
                    ERC20__factory,
                  )) as ERC20;
                  const totalLiquidity = await wrapTokenContract.totalSupply();

                  originalLpList.map(it => {
                    if (
                      it.chain.id === tokenOnFlow.chain.id &&
                      it.token.token.symbol === tokenOnFlow.token.token.symbol
                    ) {
                      /* eslint-disable camelcase */
                      it.total_liquidity_amt = totalLiquidity.toString();
                      it.total_liquidity = Number(formatUnits(totalLiquidity.toString(), wrapToken.decimal));
                      it.token.token.decimal = wrapToken.decimal;
                      it.diableAggregateRemove = true;
                      it.disableAddLiquidity = true;
                      it.isWrapTokenLiquidity = true;
                      return it;
                    }
                    return it;
                  });
                } catch (e) {
                  console.error(e);
                }
              }
            }),
          );
        }

        const tokensOnEVMChain = originalLpList.filter(
          lpInfo =>
            (lpInfo.chain.id === 80001 && lpInfo.token.token.symbol === "FLOWUSDC") ||
            (lpInfo.chain.id === 1 && lpInfo.token.token.symbol === "cfUSDC") ||
            (lpInfo.chain.id === 1 && lpInfo.token.token.symbol === "celrWFLOW"),
        );

        if (tokensOnEVMChain && tokensOnEVMChain.length) {
          await Promise.all(
            tokensOnEVMChain.map(async tokenOnEVMChain => {
              if (tokenOnEVMChain) {
                const pegConfig = pegConfigs.find(
                  it =>
                    it.canonical_token_contract_addr &&
                    it.pegged_chain_id === tokenOnEVMChain.chain.id &&
                    tokenOnEVMChain.token.token.symbol === it.pegged_token.token.symbol,
                );

                if (pegConfig && address) {
                  try {
                    const rpcURL = getNetworkById(tokenOnEVMChain.chain.id).rpcUrl;
                    const provider = new JsonRpcProvider(rpcURL);
                    const canonicalTokenContract = (await readOnlyContract(
                      provider,
                      pegConfig.canonical_token_contract_addr,
                      ERC20__factory,
                    )) as ERC20;

                    const wrapTokenContract = (await readOnlyContract(
                      provider,
                      pegConfig.pegged_token.token.address,
                      WrappedBridgeToken__factory,
                    )) as WrappedBridgeToken;
                    const userLiquidityAmt = await wrapTokenContract.liquidity(address);

                    const totalTokenBalance = await canonicalTokenContract.balanceOf(
                      pegConfig.pegged_token.token.address,
                    );
                    originalLpList.map(it => {
                      if (
                        it.chain.id === tokenOnEVMChain.chain.id &&
                        it.token.token.symbol === tokenOnEVMChain.token.token.symbol
                      ) {
                        /* eslint-disable camelcase */
                        it.total_liquidity_amt = totalTokenBalance.toString();
                        it.total_liquidity = Number(formatUnits(totalTokenBalance.toString(), tokenOnEVMChain.token.token.decimal));
                        it.liquidity_amt = userLiquidityAmt.toString();
                        it.liquidity = Number(formatUnits(userLiquidityAmt.toString(), tokenOnEVMChain.token.token.decimal));
                        it.diableAggregateRemove = true;
                        it.isWrapTokenLiquidity = true;
                        return it;
                      }
                      return it;
                    });
                  } catch (e) {
                    console.error(e);
                  }
                }
              }
            }),
          );
        }

        return originalLpList;
      },
    };
  }, [lpInfoList, pegConfigs, address]);
}
