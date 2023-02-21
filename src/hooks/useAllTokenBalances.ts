import { formatUnits, isAddress } from "ethers/lib/utils";
import { Interface } from "@ethersproject/abi";
import { useMemo } from "react";
import JSBI from "jsbi";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { useMultipleContractSingleData } from "./multicall";
import { useAppSelector } from "../redux/store";
import { ERC20Interface } from "../typechain/ERC20";
import ERC20ABI from "../typechain/abi/ERC20.json";
import { Token } from "../proto/chainhop/common_pb";

export function useAllTokenBalances(): {
  [tokenAddress: string]: number | undefined;
} {
  const { address } = useWeb3Context();
  const { transferInfo } = useAppSelector((state) => state);
  const { srcTokenList, dstTokenList, tokenSource } = transferInfo;
  const tokenList = tokenSource === "from" ? srcTokenList : dstTokenList;
  const allTokensArray = useMemo(
    () => Object.values(tokenList ?? {}),
    [tokenList]
  );
  let balances;
  if (address && address.length > 0) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    balances = useTokenBalances(address, allTokensArray);
  }
  return balances;
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token.AsObject | undefined)[]
): { [tokenAddress: string]: number | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0];
}

const contractInterface = new Interface(ERC20ABI) as ERC20Interface;
const tokenBalancesGasRequirement = { gasRequired: 125_000 };

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token.AsObject | undefined)[]
): [{ [tokenAddress: string]: number | undefined }, boolean] {
  const validatedTokens: Token.AsObject[] = useMemo(
    () =>
      tokens?.filter(
        (t?: Token.AsObject): t is Token.AsObject =>
          isAddress(t?.address ?? "") !== false
      ) ?? [],
    [tokens]
  );
  const validatedTokenAddresses = useMemo(
    () => validatedTokens.map((vt) => vt.address),
    [validatedTokens]
  );
  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    contractInterface,
    "balanceOf",
    useMemo(() => [address], [address]),
    tokenBalancesGasRequirement
  );

  const anyLoading: boolean = useMemo(
    () => balances.some((callState) => callState.loading),
    [balances]
  );
  return useMemo(
    () => [
      address && validatedTokens.length > 0
        ? validatedTokens.reduce<{
            [tokenAddress: string]: number | undefined;
          }>((memo, token, i) => {
            const value = balances?.[i]?.result?.[0];
            const amount = value ? JSBI.BigInt(value.toString()) : undefined;
            if (amount) {
              memo[token.address] = Number(
                formatUnits(amount?.toString(), token.decimals)
              );
            }
            return memo;
          }, {})
        : {},
      anyLoading,
    ],
    [address, validatedTokens, anyLoading, balances]
  );
}
