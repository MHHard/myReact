import { SkipFirst } from "../constants/tuple";
import multicall from "../helpers/multicall";
import { useAppSelector } from "../redux/store";
import useBlockNumber from "./useBlockNumber";

// Create wrappers for hooks so consumers don't need to get latest block themselves
/* eslint-disable */
type SkipFirstTwoParams<T extends (...args: any) => any> = SkipFirst<
  Parameters<T>,
  2
>;

export function useMultipleContractSingleData(
  ...args: SkipFirstTwoParams<
    typeof multicall.hooks.useMultipleContractSingleData
  >
) {
  const { chainId, latestBlock } = useCallContext();
  return multicall.hooks.useMultipleContractSingleData(
    chainId,
    latestBlock,
    ...args
  );
}

export function useSingleCallResult(
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleCallResult>
) {
  const { chainId, latestBlock } = useCallContext();
  return multicall.hooks.useSingleCallResult(chainId, latestBlock, ...args);
}

export function useSingleContractMultipleData(
  ...args: SkipFirstTwoParams<
    typeof multicall.hooks.useSingleContractMultipleData
  >
) {
  const { chainId, latestBlock } = useCallContext();
  return multicall.hooks.useSingleContractMultipleData(
    chainId,
    latestBlock,
    ...args
  );
}

export function useSingleContractWithCallData(
  ...args: SkipFirstTwoParams<
    typeof multicall.hooks.useSingleContractWithCallData
  >
) {
  const { chainId, latestBlock } = useCallContext();
  return multicall.hooks.useSingleContractWithCallData(
    chainId,
    latestBlock,
    ...args
  );
}

function useCallContext() {
  const { transferInfo } = useAppSelector((state) => state);
  const { fromChain, toChain, tokenSource } = transferInfo;
  const cId = tokenSource === "from" ? fromChain?.chainId : toChain?.chainId;
  const latestBlock = useBlockNumber();
  return { chainId: cId, latestBlock };
}
